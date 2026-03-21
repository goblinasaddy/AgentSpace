/**
 * @fileOverview Central registry for all AI agents and their execution logic.
 */
import { runResumeAnalyzer } from './resumeAnalyzer';
import { runCodeDebugger } from './codeDebugger';
import { runLinkedInGenerator } from './linkedinGenerator';
import { runResearchAgent } from './researchAgent';
import { runContractAnalyzer } from './contractAnalyzer';

export interface AgentRegistryEntry {
  id: string;
  name: string;
  description: string;
  inputType: 'text' | 'file';
  run: (input: string, apiKey: string) => Promise<any>;
}

export const agentRegistry: Record<string, AgentRegistryEntry> = {
  'resume-analyzer': {
    id: 'resume-analyzer',
    name: 'Resume Analyzer',
    description: 'Analyze resumes and generate ATS score with suggestions',
    inputType: 'file',
    run: (input, apiKey) => runResumeAnalyzer(input, apiKey),
  },
  'code-debugger': {
    id: 'code-debugger',
    name: 'Code Debugger',
    description: 'Identifies bugs and suggests fixes with detailed explanations',
    inputType: 'text',
    run: (input, apiKey) => runCodeDebugger(input, apiKey),
  },
  'code-debugger-pro': {
    id: 'code-debugger-pro',
    name: 'Code Debugger Pro',
    description: 'Advanced Logic Fixer',
    inputType: 'text',
    run: (input, apiKey) => runCodeDebugger(input, apiKey),
  },
  'linkedin-poster': {
    id: 'linkedin-poster',
    name: 'LinkedIn Poster',
    description: 'Engagement Growth Tool',
    inputType: 'text',
    run: (input, apiKey) => runLinkedInGenerator(input, apiKey),
  },
  'research-agent': {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Deep multi-step reasoning and structured analysis engine',
    inputType: 'text',
    run: (input, apiKey) => runResearchAgent(input, apiKey),
  },
  'legal-summarizer': {
    id: 'legal-summarizer',
    name: 'Legal Summarizer',
    description: 'Contract Risk Analysis',
    inputType: 'file',
    run: (input, apiKey) => runContractAnalyzer(input, apiKey),
  }
};
