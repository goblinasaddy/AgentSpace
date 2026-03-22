# **App Name**: AgentSpace

## Core Features:

- Agent Creation & Publishing: Users can define agent metadata, prompt templates, and publish agents with customizable visibility. Includes an 'Auto Repo Builder' tool for generating agent configurations based on user input (mocked functionality).
- Agent Marketplace & Discovery: Browse and search through a catalog of AI agents, with filtering options by category, tags, and rating. Displays agent cards with essential information like name, description, tags, rating, and usage count.
- Agent Detail & Documentation: View comprehensive details for individual agents, including header information, 'Code' (mock agent.yaml), 'Demo', 'Issues', and 'Evaluation' tabs, plus a right panel with metadata.
- Agent Battle Mode: A core feature allowing users to select two agents and input a prompt to see and compare their side-by-side responses. This feature highlights the comparative abilities of different AI agents.
- User Profile Management: GitHub-style user profile page displaying personal information, pinned agents, and a contribution graph (mock).
- User Authentication: Secure user registration and login functionality provided by Firebase Authentication, allowing users to create and manage their own agents.
- Data Storage & Retrieval: Persistence of agent data, user profiles, and marketplace information using Google Cloud Firestore, including seed data for initial setup.

## Style Guidelines:

- Primary accent color: Vibrant bluish-purple (#8641EE) to convey innovation and digital sophistication against a dark backdrop.
- Background color: Deep charcoal with a subtle bluish-purple tint (#1B161F), creating a modern, minimalist, and comfortable dark mode environment.
- Secondary accent color: Lighter, cooler blue (#9BC5FF) for interactive elements, highlights, and subtle contrast, complementing the primary accent.
- Headlines and prominent text will use 'Space Grotesk' (sans-serif) for a modern, tech-inspired, and slightly angular feel.
- Body text and general content will use 'Inter' (sans-serif) for exceptional legibility and a clean, neutral, professional appearance across various screen sizes. Code snippets or agent configurations (e.g., agent.yaml) will use 'Source Code Pro' (monospace) for clarity.
- Utilize a consistent set of minimalist, outlined icons with rounded corners, emphasizing clarity and alignment with the modern, clean aesthetic (e.g., feather icons or similar libraries).
- Implement clean, spacious layouts with generous padding and margins. Key elements like agent cards should feature subtle rounded corners and slight, diffused shadows to provide depth without feeling heavy, ensuring a responsive design that adapts seamlessly to different devices.
- Incorporate subtle, swift transitions for page navigation, hovers, and state changes (e.g., button presses, card selections) to enhance the feeling of fluidity and responsiveness without distracting the user.