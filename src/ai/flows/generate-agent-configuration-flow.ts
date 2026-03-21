'use server';
/**
 * @fileOverview A Genkit flow for generating an initial prompt template and configuration for an AI agent
 * based on a natural language description.
 *
 * - generateAgentConfiguration - A function that handles the agent configuration generation process.
 * - GenerateAgentConfigurationInput - The input type for the generateAgentConfiguration function.
 * - GenerateAgentConfigurationOutput - The return type for the generateAgentConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAgentConfigurationInputSchema = z.object({
  description: z
    .string()
    .describe("A natural language description of the agent's purpose and functionality."),
});
export type GenerateAgentConfigurationInput = z.infer<
  typeof GenerateAgentConfigurationInputSchema
>;

const GenerateAgentConfigurationOutputSchema = z.object({
  promptTemplate: z.string().describe('The generated prompt template for the agent.'),
  agentConfig: z
    .string()
    .describe('The generated basic configuration for the agent in YAML format.'),
});
export type GenerateAgentConfigurationOutput = z.infer<
  typeof GenerateAgentConfigurationOutputSchema
>;

export async function generateAgentConfiguration(
  input: GenerateAgentConfigurationInput
): Promise<GenerateAgentConfigurationOutput> {
  return generateAgentConfigurationFlow(input);
}

const generateAgentConfigurationPrompt = ai.definePrompt({
  name: 'generateAgentConfigurationPrompt',
  input: {schema: GenerateAgentConfigurationInputSchema},
  output: {schema: GenerateAgentConfigurationOutputSchema},
  prompt: `You are an AI assistant specialized in creating AI agents. Your task is to generate a basic prompt template and a configuration in YAML format for a new AI agent based on a natural language description.

Here is the description of the agent:
Description: {{{description}}}

---

Based on the description, please provide:
1. A concise and effective prompt template that can be used as the agent's primary instruction set.
2. A basic agent configuration in YAML format. The YAML should include a 'name', 'description', and 'tags' field based on the agent's purpose.

For example:

If the description is: "An agent that helps debug Python code by suggesting fixes."

{
  "promptTemplate": "You are an expert Python debugger. Analyze the provided Python code and error messages, then suggest clear and concise fixes. Focus on common issues like syntax errors, logical errors, and performance bottlenecks.\n\nCode:\n\"\"\"{{code}}\"\"\"\n\nError:\n\"\"\"{{error}}\"\"\"\n\nSuggested Fixes and Explanation:",
  "agentConfig": "name: Python Debugger\ndescription: An agent that helps debug Python code by suggesting fixes.\ntags:\n  - Coding\n  - Debugging\n  - Python\n"
}

Now, generate the promptTemplate and agentConfig for the given description.`,
});

const generateAgentConfigurationFlow = ai.defineFlow(
  {
    name: 'generateAgentConfigurationFlow',
    inputSchema: GenerateAgentConfigurationInputSchema,
    outputSchema: GenerateAgentConfigurationOutputSchema,
  },
  async input => {
    const {output} = await generateAgentConfigurationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate agent configuration.');
    }
    return output;
  }
);
