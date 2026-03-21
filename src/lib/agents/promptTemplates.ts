/**
 * @fileOverview Defines prompt templates and formatting logic for different agent types.
 */

export const promptTemplates = {
  'resume-analyzer': {
    formatInput: (input: string) => `Analyze the following resume for ATS compatibility and provide a score out of 100: \n\n${input}`,
    structure: 'Score: [0-100]\n\nKeywords Found: [List]\n\nSuggestions: [Actionable items]'
  },
  'code-debugger-pro': {
    formatInput: (input: string) => `Identify bugs and suggest fixes for this code snippet: \n\n${input}`,
    structure: 'Fix: [Code]\n\nExplanation: [Reasoning]'
  },
  'linkedin-poster': {
    formatInput: (input: string) => `Transform this update into a viral LinkedIn post: \n\n${input}`,
    structure: 'Headline: [Catchy text]\n\nBody: [Engagement-focused content]\n\nHashtags: [#tag1, #tag2]'
  },
  'research-agent': {
    formatInput: (input: string) => `Conduct brief research on the following topic: \n\n${input}`,
    structure: 'Summary: [Overview]\n\nKey Facts: [Bullet points]\n\nConclusion: [Final thought]'
  },
  'legal-summarizer': {
    formatInput: (input: string) => `Summarize the key risks and clauses in this contract text: \n\n${input}`,
    structure: 'Risk Level: [Low/Med/High]\n\nKey Clauses: [Summary of terms]\n\nRed Flags: [Issues found]'
  }
};
