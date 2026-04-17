-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_username TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('prompt', 'tool', 'system', 'external')) NOT NULL,
  execution_mode TEXT CHECK (execution_mode IN ('realtime', 'async', 'local')) NOT NULL,
  tags TEXT[],
  config JSONB DEFAULT '{}'::jsonb,
  runtime TEXT,
  entry_point TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('queued', 'running', 'completed', 'failed')) NOT NULL DEFAULT 'queued',
  input JSONB DEFAULT '{}'::jsonb,
  output JSONB,
  logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);
