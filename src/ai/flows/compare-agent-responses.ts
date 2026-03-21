'use server';
/**
 * @fileOverview This file implements a Genkit flow for comparing responses from two AI agents.
 * It defines the input and output schemas for comparing agent responses and a Genkit flow
 * that simulates two distinct agent responses to a given user prompt.
 *
 * - compareAgentResponses - A function that initiates the comparison of two agent responses.
 * - CompareAgentResponsesInput - The input type for the compareAgentResponses function.
 * - CompareAgentResponsesOutput - The return type for the compareAgentResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareAgentResponsesInputSchema = z.object({
  prompt: z.string().describe('The common input prompt to be given to both agents.'),
  agentAId: z.string().describe('The identifier for Agent A.'),
  agentBId: z.string().describe('The identifier for Agent B.'),
  agentAName: z.string().optional().describe('The display name for Agent A.'),
  agentBName: z.string().optional().describe('The display name for Agent B.'),
});
export type CompareAgentResponsesInput = z.infer<typeof CompareAgentResponsesInputSchema>;

const CompareAgentResponsesOutputSchema = z.object({
  responseA: z.string().describe('The generated response from Agent A.'),
  responseB: z.string().describe('The generated response from Agent B.'),
});
export type CompareAgentResponsesOutput = z.infer<typeof CompareAgentResponsesOutputSchema>;

export async function compareAgentResponses(
  input: CompareAgentResponsesInput
): Promise<CompareAgentResponsesOutput> {
  return compareAgentResponsesFlow(input);
}

const compareAgentsPrompt = ai.definePrompt({
  name: 'compareAgentsPrompt',
  input: {schema: CompareAgentResponsesInputSchema},
  output: {schema: CompareAgentResponsesOutputSchema},
  prompt: `You are an AI assistant designed to simulate the responses of two different AI agents for a given prompt.\nYour task is to generate a distinct response for Agent A (identified as "{{{agentAId}}}" ${'{{#if agentAName}}'}and optionally named "{{{agentAName}}}"${'/if'}}) and Agent B (identified as "{{{agentBId}}}" ${'{{#if agentBName}}'}and optionally named "{{{agentBName}}}"${'/if'}}) to the user's prompt.\n\nIf agent names are provided, try to tailor the response style based on what you might expect from an agent with that name. For example, a "Coding Assistant" might provide code examples, while a "Resume Analyzer" might offer feedback on a resume.\n\nUser's Prompt: "{{{prompt}}}"\n\nPlease provide the responses in a JSON object with two fields: 'responseA' for Agent A's response and 'responseB' for Agent B's response.\nEnsure the responses are distinct and reflect how two different agents might answer the same query, even if you are just simulating.\n\nExample of expected output:\n{\n  "responseA": "This is Agent A's simulated response to the prompt.",\n  "responseB": "This is Agent B's simulated response to the prompt, offering a different perspective or approach."\n}\n`,
});

const compareAgentResponsesFlow = ai.defineFlow(
  {
    name: 'compareAgentResponsesFlow',
    inputSchema: CompareAgentResponsesInputSchema,
    outputSchema: CompareAgentResponsesOutputSchema,
  },
  async input => {
    const {output} = await compareAgentsPrompt(input);
    if (!output) {
        throw new Error('Failed to get a response from the prompt.');
    }
    return output;
  }
);
