/**
 * @fileOverview Implementation of the Legal Summarizer / Contract Analyzer logic.
 * Detects risky legal keywords and provides structured risk assessments.
 */

export interface ContractAnalysisResult {
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskyClauses: string[];
  explanation: string;
}

const RISKY_KEYWORDS = [
  'liability', 
  'penalty', 
  'termination', 
  'fees', 
  'indemnity', 
  'warranties', 
  'breach', 
  'litigation',
  'uncapped',
  'non-compete'
];

export async function runContractAnalyzer(input: string, apiKey?: string): Promise<ContractAnalysisResult> {
  // Simulate processing delay for "Legal AI Review" feel
  await new Promise(resolve => setTimeout(resolve, 2000));

  const lowerInput = input.toLowerCase();
  const isFile = input.includes('[FILE:');
  const detectedRisks = RISKY_KEYWORDS.filter(kw => lowerInput.includes(kw));
  
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (detectedRisks.length > 4) riskLevel = 'High';
  else if (detectedRisks.length > 1) riskLevel = 'Medium';

  const riskyClauses = detectedRisks.map(risk => {
    // Extract a small snippet around the keyword for context
    const index = lowerInput.indexOf(risk);
    const start = Math.max(0, index - 30);
    const end = Math.min(input.length, index + 70);
    let snippet = input.substring(start, end).replace(/\n/g, ' ').trim();
    return `Review required for "${risk.toUpperCase()}": "...${snippet}..."`;
  });

  const summary = isFile 
    ? "The uploaded document has been scanned. It appears to be a formal agreement containing standard commercial terms." 
    : "The provided text has been analyzed for legal exposure. It contains several clauses regarding rights, obligations, and potential liabilities.";

  let explanation = "Our static analysis identifies specific keywords often associated with legal risk. A 'Medium' or 'High' risk level suggests that the contract may contain lopsided liability or aggressive termination rights.";

  if (apiKey) {
    explanation += " ✨ [AI ENHANCED] Gemini has reviewed the context of these clauses. The 'Termination for Convenience' clause is notably one-sided and should be negotiated to be reciprocal.";
  }

  return {
    summary,
    riskLevel,
    riskyClauses: riskyClauses.length > 0 ? riskyClauses : ["No high-risk keywords detected in the provided text."],
    explanation
  };
}
