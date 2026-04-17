// ─────────────────────────────────────────────
// Execution Engine — per-type agent execution
// ─────────────────────────────────────────────

import { Agent, ExecutionResult } from './types';

/**
 * Routes a job to the correct executor based on agent type.
 */
export async function executeAgent(
  agent: Agent,
  input: Record<string, any>
): Promise<ExecutionResult> {
  switch (agent.type) {
    case 'prompt':
      return executePromptAgent(agent, input);
    case 'tool':
      return executeToolAgent(agent, input);
    case 'system':
      return executeSystemAgent(agent, input);
    case 'external':
      return executeExternalAgent(agent, input);
    default:
      throw new Error(`Unknown agent type: ${(agent as any).type}`);
  }
}

// ─────────────────────────────────────────────
// PROMPT AGENTS — call LLM with prompt template
// ─────────────────────────────────────────────

async function executePromptAgent(
  agent: Agent,
  input: Record<string, any>
): Promise<ExecutionResult> {
  const logs: string[] = [];
  logs.push('Prompt agent execution started');

  const promptTemplate =
    agent.config?.promptTemplate || agent.config?.prompt_template || '';

  // Render template — substitute {{variable}} placeholders with input values
  let renderedPrompt = promptTemplate;
  for (const [key, value] of Object.entries(input)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    renderedPrompt = renderedPrompt.replace(regex, String(value));
  }
  logs.push(`Rendered prompt (${renderedPrompt.length} chars)`);

  // ── MVP: call Gemini if GEMINI_API_KEY is set, otherwise simulate ──
  const geminiKey = process.env.GEMINI_API_KEY;
  let response: string;

  if (geminiKey) {
    logs.push('Calling Gemini API…');
    try {
      response = await callGemini(renderedPrompt, geminiKey);
      logs.push('Gemini API response received');
    } catch (err: any) {
      logs.push(`Gemini API error: ${err.message}`);
      response = `[LLM Error] ${err.message}`;
    }
  } else {
    logs.push('GEMINI_API_KEY not set — using simulated LLM response');
    // Deterministic simulation so tests are reproducible
    await sleep(500);
    response = `[Simulated LLM Response]\n\nPrompt: "${renderedPrompt.substring(0, 200)}${renderedPrompt.length > 200 ? '…' : ''}"\n\nI've analyzed your request. Here is my response based on the prompt template for agent "${agent.name}".\n\nKey points:\n1. The input has been processed successfully.\n2. All template variables were resolved.\n3. This is a simulated response — set GEMINI_API_KEY for real LLM calls.`;
  }

  logs.push('Prompt agent execution completed');

  return {
    output: {
      response,
      rendered_prompt: renderedPrompt,
      model: geminiKey ? 'gemini-2.0-flash' : 'simulated',
    },
    logs,
  };
}

/**
 * Minimal Gemini REST API caller (no SDK required).
 */
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errorText}`);
  }

  const data: any = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    '[No response from Gemini]'
  );
}

// ─────────────────────────────────────────────
// TOOL AGENTS — built-in tool implementations
// ─────────────────────────────────────────────

async function executeToolAgent(
  agent: Agent,
  input: Record<string, any>
): Promise<ExecutionResult> {
  const logs: string[] = [];
  logs.push('Tool agent execution started');

  const toolName = agent.config?.tool_name || agent.slug || 'generic';
  logs.push(`Resolving tool: ${toolName}`);

  let output: Record<string, any>;

  switch (toolName) {
    case 'resume-analyzer':
      output = runResumeAnalyzer(input, logs);
      break;
    case 'code-explainer':
      output = runCodeExplainer(input, logs);
      break;
    case 'web-research':
      output = runWebResearch(input, logs);
      break;
    default:
      logs.push(`No specific tool handler for "${toolName}" — running generic tool`);
      output = runGenericTool(agent, input, logs);
  }

  logs.push('Tool agent execution completed');
  return { output, logs };
}

function runResumeAnalyzer(
  input: Record<string, any>,
  logs: string[]
): Record<string, any> {
  logs.push('Running Resume Analyzer');
  const resumeText: string = input.resume || input.text || '';
  const jobDescription: string = input.job_description || '';

  const keywords = [
    'python', 'javascript', 'typescript', 'react', 'node',
    'sql', 'aws', 'docker', 'kubernetes', 'machine learning',
    'api', 'rest', 'graphql', 'agile', 'ci/cd',
  ];

  const resumeLower = resumeText.toLowerCase();
  const matchedKeywords = keywords.filter((kw) => resumeLower.includes(kw));
  const score = Math.min(100, Math.round((matchedKeywords.length / keywords.length) * 100));

  logs.push(`Scanned ${resumeText.length} chars, matched ${matchedKeywords.length} keywords`);

  return {
    score,
    matched_keywords: matchedKeywords,
    total_keywords_checked: keywords.length,
    recommendation:
      score >= 70
        ? 'Strong match — proceed to interview.'
        : score >= 40
          ? 'Moderate match — review carefully.'
          : 'Weak match — consider other candidates.',
    summary: `Resume scored ${score}/100 with ${matchedKeywords.length} keyword matches.`,
  };
}

function runCodeExplainer(
  input: Record<string, any>,
  logs: string[]
): Record<string, any> {
  logs.push('Running Code Explainer');
  const code: string = input.code || input.text || '';
  const language = input.language || 'unknown';

  logs.push(`Analyzing ${code.length} chars of ${language} code`);

  // Basic static analysis
  const lineCount = code.split('\n').length;
  const hasFunction = /function\s|=>|def\s|fn\s/.test(code);
  const hasLoop = /for\s|while\s|\.forEach|\.map/.test(code);
  const hasConditional = /if\s|switch\s|match\s/.test(code);
  const hasImport = /import\s|require\(|from\s/.test(code);

  return {
    language,
    line_count: lineCount,
    analysis: {
      has_functions: hasFunction,
      has_loops: hasLoop,
      has_conditionals: hasConditional,
      has_imports: hasImport,
    },
    explanation: [
      `This is a ${lineCount}-line ${language} snippet.`,
      hasImport ? 'It imports external dependencies.' : '',
      hasFunction ? 'It defines one or more functions.' : '',
      hasLoop ? 'It contains iteration logic.' : '',
      hasConditional ? 'It has conditional branching.' : '',
    ].filter(Boolean).join(' '),
    summary: `${language} code: ${lineCount} lines, ${[hasFunction && 'functions', hasLoop && 'loops', hasConditional && 'conditionals'].filter(Boolean).join(', ') || 'simple structure'}.`,
  };
}

function runWebResearch(
  input: Record<string, any>,
  logs: string[]
): Record<string, any> {
  logs.push('Running Web Research (mock)');
  const query: string = input.query || input.topic || 'general research';

  logs.push(`Research query: "${query}"`);

  return {
    query,
    results: [
      {
        title: `Overview of ${query}`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        snippet: `A comprehensive overview covering the main aspects of ${query}, including recent developments and key findings.`,
      },
      {
        title: `Latest Research on ${query}`,
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
        snippet: `Academic papers and peer-reviewed research related to ${query}.`,
      },
      {
        title: `${query} — Industry Analysis`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Current industry trends and market analysis for ${query}.`,
      },
    ],
    summary: `Found 3 results for "${query}". This is a mock response — integrate a real search API for production use.`,
    note: 'Replace with real API (SerpAPI / Tavily / Bing) for production.',
  };
}

function runGenericTool(
  agent: Agent,
  input: Record<string, any>,
  logs: string[]
): Record<string, any> {
  logs.push(`Running generic tool for agent: ${agent.name}`);

  return {
    agent_name: agent.name,
    agent_slug: agent.slug,
    input_received: input,
    result: `Tool "${agent.name}" processed the input successfully.`,
    note: 'Implement a specific tool handler for richer output.',
  };
}

// ─────────────────────────────────────────────
// SYSTEM AGENTS — general-purpose execution
// ─────────────────────────────────────────────

async function executeSystemAgent(
  agent: Agent,
  input: Record<string, any>
): Promise<ExecutionResult> {
  const logs: string[] = [];
  logs.push('System agent execution started');

  // Simulate real processing
  await sleep(1000);

  const query = input.query || input.task || JSON.stringify(input);
  logs.push(`Processing task: ${typeof query === 'string' ? query.substring(0, 100) : 'complex input'}`);

  const result = {
    agent_name: agent.name,
    processed_input: input,
    result: `System agent "${agent.name}" successfully processed: ${query}`,
    execution_mode: agent.execution_mode,
    timestamp: new Date().toISOString(),
  };

  logs.push('System agent execution completed');
  return { output: result, logs };
}

// ─────────────────────────────────────────────
// EXTERNAL AGENTS — return README / instructions
// ─────────────────────────────────────────────

async function executeExternalAgent(
  agent: Agent,
  _input: Record<string, any>
): Promise<ExecutionResult> {
  const logs: string[] = [];
  logs.push('External agent — returning setup instructions');

  const readme = agent.config?.readme || agent.description || 'No README available.';

  return {
    output: {
      agent_name: agent.name,
      type: 'external',
      instructions: readme,
      message: `External agent "${agent.name}" cannot be executed directly. Follow the setup instructions to run it locally.`,
      setup_url: agent.config?.setup_url || null,
    },
    logs,
  };
}

// ─────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
