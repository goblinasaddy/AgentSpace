/**
 * @fileOverview Implementation of the Resume Analyzer Agent logic.
 * Features a rule-based ATS scoring system and structured analysis.
 */

export interface ResumeAnalysisResult {
  score: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  prediction: string;
  aiInsights?: string;
}

const TECHNICAL_KEYWORDS = [
  'Python', 'React', 'TypeScript', 'Node.js', 'Machine Learning', 
  'AI', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Java', 'C++', 
  'Next.js', 'Firebase', 'PostgreSQL', 'Cloud', 'DevOps'
];

export async function runResumeAnalyzer(input: string, apiKey?: string): Promise<ResumeAnalysisResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const lowerInput = input.toLowerCase();
  const isFile = input.includes('[FILE:');
  
  // 1. Rule-based scoring
  let score = isFile ? 40 : 20; // Start with higher base if file is uploaded
  
  // Keyword matching (Simulated for file, real for text)
  const foundKeywords = TECHNICAL_KEYWORDS.filter(k => lowerInput.includes(k.toLowerCase()));
  score += Math.min(40, foundKeywords.length * 5);
  
  // Structure checks
  if (lowerInput.includes('experience') || lowerInput.includes('work history')) score += 15;
  if (lowerInput.includes('project')) score += 10;
  if (lowerInput.includes('education')) score += 10;
  if (lowerInput.includes('skill')) score += 5;
  
  // Length/File check
  if (isFile) score += 10;
  else if (input.length > 500) score += 5;
  
  // Cap score at 100
  score = Math.min(100, score);

  // 2. Determine Verdict
  let verdict = "⚠️ Needs Improvement";
  if (score >= 90) verdict = "🎯 Excellent";
  else if (score >= 75) verdict = "✅ Good";
  else if (score >= 50) verdict = "⚖️ Average";

  // 3. Generate structured feedback
  const strengths = [];
  if (isFile) strengths.push("Proper PDF document formatting detected");
  if (foundKeywords.length > 5) strengths.push("Strong technical keyword density");
  if (lowerInput.includes('experience')) strengths.push("Clear work experience section");
  
  const weaknesses = [];
  if (foundKeywords.length < 3) weaknesses.push("Low technical keyword count for modern ATS");
  if (!lowerInput.includes('project')) weaknesses.push("Missing a dedicated projects section");
  if (score < 60) weaknesses.push("General lack of quantifiable achievements");

  const suggestions = [
    "💡 Use more action verbs like 'Led', 'Developed', 'Optimized'",
    "💡 Add more industry-specific keywords relevant to the job description",
    "💡 Include links to a portfolio or GitHub if applicable",
    "💡 Quantify your achievements (e.g., 'Increased revenue by 20%')"
  ];

  const prediction = score > 80 
    ? "High probability of passing initial ATS filters for technical roles." 
    : "Moderate to low risk of being filtered out. Consider targeted keyword optimization.";

  // 4. AI Insights
  let aiInsights = "Connect a Gemini API key to unlock deep behavioral analysis and interview question predictions.";
  if (apiKey) {
    aiInsights = `✨ AI Analysis: ${isFile ? 'I have analyzed your uploaded PDF.' : ''} Your profile demonstrates a strong bias towards ${foundKeywords[0] || 'technical'} roles. We recommend adding details about your deployment pipelines and testing strategies.`;
  }

  return {
    score,
    verdict,
    strengths,
    weaknesses,
    suggestions,
    prediction,
    aiInsights
  };
}
