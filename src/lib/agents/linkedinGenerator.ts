/**
 * @fileOverview Implementation of the LinkedIn Post Generator Agent logic.
 * Generates viral-style LinkedIn content using high-converting archetypes.
 */

export interface LinkedInGeneratorResult {
  post: string;
  hooks: string[];
  hashtags: string[];
}

const TEMPLATES = [
  {
    name: 'The Contrarian',
    generate: (topic: string) => `
🚀 Stop chasing the "safe" path in ${topic}.

Most people think success in ${topic} comes from following the rules.
But the truth? The rules were written by people who wanted to stay comfortable.

I spent years doing exactly what was expected. 
Result: Average performance. Average growth.

Then I changed one thing: I started breaking the conventions of ${topic}.

The result?
- 3x faster iterations.
- A network of high-performers.
- Real impact that people actually notice.

If you're still doing what everyone else is doing, you're not leading. You're just part of the crowd. 🚢
    `,
    hook: (topic: string) => `Why the "Best Practices" in ${topic} are actually holding you back. 🛑`,
  },
  {
    name: 'The Storyteller',
    generate: (topic: string) => `
I remember my first week working with ${topic}.

I was overwhelmed. I felt like an impostor.
I thought I had to know everything before I could contribute anything.

But a mentor told me something I'll never forget:
"Perfection is the enemy of progress. Just ship the messy version." 🛠️

So I did.
I made mistakes. I broke things. I learned.

Today, ${topic} is my competitive advantage. Not because I'm the smartest, but because I was willing to be the most persistent.

Don't wait for the "right" moment. It doesn't exist. Start with the messy version today. 👇
    `,
    hook: (topic: string) => `What I wish I knew about ${topic} 5 years ago. 💡`,
  },
  {
    name: 'The Value-Driven',
    generate: (topic: string) => `
3 Simple ways to dominate ${topic} in 2024:

1️⃣ Focus on Outcomes, not Outputs.
It's easy to look busy. It's hard to be effective. Measure what matters.

2️⃣ Build in Public.
Share your process, not just your results. People connect with the journey.

3️⃣ Master the Fundamentals.
Tools change. Principles don't. Deep work is still the ultimate superpower in ${topic}.

Which one are you focusing on this week? Let me know in the comments! 💬
    `,
    hook: (topic: string) => `Mastering ${topic} doesn't have to be complicated. 🚀`,
  }
];

export async function runLinkedInGenerator(input: string, apiKey?: string): Promise<LinkedInGeneratorResult> {
  // Simulate processing delay for "thinking" feel
  await new Promise(resolve => setTimeout(resolve, 2000));

  const topic = input.trim() || "Modern Tech";
  
  // Pick a random template to ensure variety
  const templateIndex = Math.floor(Math.random() * TEMPLATES.length);
  const selectedTemplate = TEMPLATES[templateIndex];
  
  const postBody = selectedTemplate.generate(topic);
  const postHook = selectedTemplate.hook(topic);
  const finalPost = `${postHook}\n${postBody}\n\n#${topic.replace(/\s+/g, '')} #Growth #Innovation #PersonalBranding #Strategy`;

  const hooks = TEMPLATES.map(t => t.hook(topic));

  const hashtags = [
    `#${topic.replace(/\s+/g, '')}`,
    "#GrowthMindset",
    "#Innovation",
    "#LinkedInTips",
    "#Leadership"
  ];

  if (apiKey) {
    hashtags.push("#AIGenerated");
  }

  return {
    post: finalPost,
    hooks,
    hashtags
  };
}
