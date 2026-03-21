/**
 * @fileOverview Central execution engine for running agents.
 */
import { agentRegistry } from '../agents/agentRegistry';

export async function runAgent(agentId: string, input: string, apiKey: string) {
  const agent = agentRegistry[agentId];
  
  if (!agent) {
    // Fallback for agents not yet fully integrated into registry
    console.warn(`Agent ${agentId} not found in registry. Using generic simulation.`);
    await new Promise(r => setTimeout(r, 1000));
    return `Simulated response for ${agentId}:\n\nYour input "${input.substring(0, 30)}..." has been processed successfully.`;
  }

  try {
    const result = await agent.run(input, apiKey);
    return result;
  } catch (error) {
    console.error(`Error running agent ${agentId}:`, error);
    throw new Error(`Failed to execute ${agent.name}. Please try again.`);
  }
}
