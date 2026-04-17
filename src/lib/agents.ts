import { supabase } from './supabaseClient';

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
  config: any;
  runtime: string | null;
  entry_point: string | null;
  created_at: string;
}

export async function getAllAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
  return data as Agent[];
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching agent ${slug}:`, error);
    return null;
  }
  return data as Agent;
}

export async function createAgent(agentData: Partial<Agent>): Promise<Agent | null> {
  const { data, error } = await supabase
    .from('agents')
    .insert([agentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating agent:', error);
    return null;
  }
  return data as Agent;
}

export async function cloneAgent(agentId: string): Promise<Agent | null> {
  // First fetch the existing agent
  const { data: existingAgent, error: fetchError } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (fetchError || !existingAgent) {
    console.error(`Error fetching agent to clone ${agentId}:`, fetchError);
    return null;
  }

  // Remove id and created_at to create a new record
  const { id, created_at, slug, ...agentCopy } = existingAgent;
  const newSlug = `${slug}-copy-${Math.random().toString(36).substring(2, 8)}`;
  
  const { data: newAgent, error: createError } = await supabase
    .from('agents')
    .insert([{ ...agentCopy, slug: newSlug, name: `${existingAgent.name} (Copy)` }])
    .select()
    .single();

  if (createError) {
    console.error('Error cloning agent:', createError);
    return null;
  }
  
  return newAgent as Agent;
}
