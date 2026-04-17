// ─────────────────────────────────────────────
// AgentSpace Worker — Main Entry Point
// ─────────────────────────────────────────────
// A standalone Node.js process that continuously polls the Supabase
// `jobs` table for queued work, executes agents, and writes results
// back to the database.
//
// Usage:
//   npm run worker
//   (or: npx ts-node --project worker/tsconfig.json worker/index.ts)
// ─────────────────────────────────────────────

import { supabase } from './supabase';
import { executeAgent } from './executor';
import { Agent, Job } from './types';

// ─── Configuration ───────────────────────────

const POLL_INTERVAL_MS = 3000;       // How often to check for new jobs
const BATCH_SIZE = 5;                // Max jobs to claim per poll cycle
const MAX_EXECUTION_TIME_MS = 30000; // 30s timeout per job
const MAX_RETRIES = 2;               // Retry failed jobs up to N times

// ─── State ───────────────────────────────────

let isShuttingDown = false;
let activeJobs = 0;

// ─── Logging ─────────────────────────────────

function log(message: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${message}`);
}

function logError(message: string, err?: any): void {
  const ts = new Date().toISOString();
  console.error(`[${ts}] ❌ ${message}`, err?.message || err || '');
}

// ─── Job Acquisition (with optimistic locking) ──

/**
 * Claims a batch of queued jobs via atomic UPDATE … WHERE status='queued'.
 * This prevents two worker instances from picking the same job.
 */
async function claimJobs(): Promise<Job[]> {
  // Step 1: peek at queued jobs
  const { data: candidates, error: peekError } = await supabase
    .from('jobs')
    .select('id')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE);

  if (peekError || !candidates || candidates.length === 0) {
    return [];
  }

  const ids = candidates.map((j: any) => j.id);

  // Step 2: atomically claim only the ones still queued (optimistic lock)
  const { data: claimed, error: claimError } = await supabase
    .from('jobs')
    .update({ status: 'running' })
    .in('id', ids)
    .eq('status', 'queued')        // <— critical: only if still queued
    .select('*');

  if (claimError) {
    logError('Failed to claim jobs', claimError);
    return [];
  }

  return (claimed || []) as Job[];
}

// ─── Fetch Agent ─────────────────────────────

async function fetchAgent(agentId: string): Promise<Agent | null> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error) {
    logError(`Failed to fetch agent ${agentId}`, error);
    return null;
  }
  return data as Agent;
}

// ─── Job Update Helpers ──────────────────────

async function markCompleted(
  jobId: string,
  output: Record<string, any>,
  jobLogs: string[]
): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'completed',
      output,
      logs: jobLogs,
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);

  if (error) logError(`Failed to mark job ${jobId} completed`, error);
}

async function markFailed(
  jobId: string,
  errorMessage: string,
  jobLogs: string[]
): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update({
      status: 'failed',
      output: { error: errorMessage },
      logs: [...jobLogs, `FAILED: ${errorMessage}`],
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId);

  if (error) logError(`Failed to mark job ${jobId} as failed`, error);
}

async function requeueJob(jobId: string): Promise<void> {
  const { error } = await supabase
    .from('jobs')
    .update({ status: 'queued' })
    .eq('id', jobId);

  if (error) logError(`Failed to requeue job ${jobId}`, error);
}

// ─── Process a Single Job ────────────────────

async function processJob(job: Job): Promise<void> {
  const jobLogs: string[] = [];
  const startTime = Date.now();

  jobLogs.push(`Job ${job.id} started at ${new Date().toISOString()}`);

  try {
    // 1. Load the agent
    jobLogs.push('Loading agent…');
    const agent = await fetchAgent(job.agent_id);

    if (!agent) {
      await markFailed(job.id, `Agent ${job.agent_id} not found`, jobLogs);
      return;
    }

    jobLogs.push(`Agent loaded: "${agent.name}" (type: ${agent.type})`);

    // 2. Execute with timeout
    jobLogs.push('Starting execution…');

    const result = await Promise.race([
      executeAgent(agent, job.input || {}),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Execution timed out')),
          MAX_EXECUTION_TIME_MS
        )
      ),
    ]);

    const elapsed = Date.now() - startTime;
    jobLogs.push(...result.logs);
    jobLogs.push(`Execution completed in ${elapsed}ms`);

    // 3. Write result
    await markCompleted(job.id, result.output, jobLogs);
    log(`✅ Job ${job.id} completed (${elapsed}ms) — agent: ${agent.name}`);
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    jobLogs.push(`Error after ${elapsed}ms: ${err.message}`);
    logError(`Job ${job.id} failed`, err);
    await markFailed(job.id, err.message, jobLogs);
  }
}

// ─── Main Poll Loop ──────────────────────────

async function pollOnce(): Promise<void> {
  if (isShuttingDown) return;

  try {
    const jobs = await claimJobs();

    if (jobs.length > 0) {
      log(`📋 Claimed ${jobs.length} job(s)`);
      activeJobs += jobs.length;

      // Process jobs concurrently (bounded by BATCH_SIZE)
      await Promise.allSettled(
        jobs.map(async (job) => {
          try {
            await processJob(job);
          } finally {
            activeJobs--;
          }
        })
      );
    }
  } catch (err: any) {
    logError('Poll cycle error', err);
  }
}

async function startPolling(): Promise<void> {
  log('🚀 AgentSpace Worker started');
  log(`   Poll interval : ${POLL_INTERVAL_MS}ms`);
  log(`   Batch size    : ${BATCH_SIZE}`);
  log(`   Timeout       : ${MAX_EXECUTION_TIME_MS}ms`);
  log(`   Max retries   : ${MAX_RETRIES}`);
  log('   Waiting for jobs…\n');

  while (!isShuttingDown) {
    await pollOnce();
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  // Wait for in-flight jobs to finish
  while (activeJobs > 0) {
    log(`⏳ Waiting for ${activeJobs} active job(s) to finish…`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  log('🛑 Worker shut down gracefully.');
  process.exit(0);
}

// ─── Graceful Shutdown ───────────────────────

function handleShutdown(signal: string): void {
  log(`\n⚠️  Received ${signal} — shutting down…`);
  isShuttingDown = true;
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// ─── Boot ────────────────────────────────────

startPolling().catch((err) => {
  logError('Fatal error', err);
  process.exit(1);
});
