// ─────────────────────────────────────────────
// Shared types used across the worker modules
// ─────────────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  slug: string;
  owner_username: string;
  full_name: string;
  description: string | null;
  type: 'prompt' | 'tool' | 'system' | 'external';
  execution_mode: 'realtime' | 'async' | 'local';
  tags: string[] | null;
  config: Record<string, any>;
  runtime: string | null;
  entry_point: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  agent_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  input: Record<string, any>;
  output: Record<string, any> | null;
  logs: string[];
  created_at: string;
  completed_at: string | null;
}

export interface ExecutionResult {
  output: Record<string, any>;
  logs: string[];
}
