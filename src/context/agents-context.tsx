"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent } from '@/lib/types';
import { MOCK_AGENTS } from '@/lib/data';

interface AgentsContextType {
  agents: Agent[];
  addAgent: (agent: Agent) => void;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);

  // Load custom agents from localStorage on mount
  useEffect(() => {
    const savedAgents = localStorage.getItem('agentspace_custom_agents');
    if (savedAgents) {
      try {
        const parsed = JSON.parse(savedAgents);
        // Merge mock agents with custom ones, avoiding duplicates by ID
        const customIds = new Set(parsed.map((a: Agent) => a.id));
        const filteredMocks = MOCK_AGENTS.filter(a => !customIds.has(a.id));
        setAgents([...filteredMocks, ...parsed]);
      } catch (e) {
        console.error("Failed to parse custom agents", e);
      }
    }
  }, []);

  const addAgent = (agent: Agent) => {
    setAgents(prev => {
      const updated = [...prev, agent];
      // Save only the custom agents to localStorage (excluding initial mocks)
      const customAgents = updated.filter(a => !MOCK_AGENTS.some(m => m.id === a.id));
      localStorage.setItem('agentspace_custom_agents', JSON.stringify(customAgents));
      return updated;
    });
  };

  return (
    <AgentsContext.Provider value={{ agents, addAgent }}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return context;
}
