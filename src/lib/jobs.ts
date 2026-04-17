import { supabase } from './supabaseClient';

export interface Job {
  id: string;
  agent_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  input: any;
  output: any | null;
  logs: any;
  created_at: string;
  completed_at: string | null;
}

export async function createJob(agentId: string, input: any): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .insert([{ agent_id: agentId, input, status: 'queued' }])
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    return null;
  }
  return data as Job;
}

export async function getJob(jobId: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    console.error(`Error fetching job ${jobId}:`, error);
    return null;
  }
  return data as Job;
}

export async function updateJob(
  jobId: string, 
  status: 'queued' | 'running' | 'completed' | 'failed', 
  output: any = null,
  logs: any = null
): Promise<Job | null> {
  const updateData: any = { status };
  
  if (output !== null) updateData.output = output;
  if (logs !== null) updateData.logs = logs;
  if (status === 'completed' || status === 'failed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(updateData)
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating job ${jobId}:`, error);
    return null;
  }
  return data as Job;
}
