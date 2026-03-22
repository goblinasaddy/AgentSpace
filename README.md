<div align="center">
  <img src="./AgentSpace%20Logo.jpeg" width="100" height="100" alt="AgentSpace Logo">
  
  # 🌌 AgentSpace
  
  **The Space for Every AI Agent**
  
  *Discover, build, deploy, and battle custom AI agents in the world's largest marketplace and repository system for intelligent automation.*

  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Genkit](https://img.shields.io/badge/Genkit-Google_Gemini-FFCA28?style=for-the-badge&logo=google)](https://firebase.google.com/docs/genkit)
  [![Firebase](https://img.shields.io/badge/Firebase-11.9-F58220?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
</div>

---

## 🚀 Overview

AgentSpace is a modern, scalable, and modular AI agent marketplace and execution platform. Designed with a GitHub-like experience, it empowers developers and users to explore, create, and interact with autonomous AI agents. Whether you need a code debugger, a legal summarizer, or a creative writing assistant, AgentSpace provides the infrastructure to run, fork, and evaluate agents securely.

## ✨ Key Features

* 🛒 **Agent Marketplace:** Explore a rich directory of high-quality AI agents organized by categories (Coding, Business, Career, Legal, etc.). Filter by Top Rated or Most Stars.
* 🛠️ **Auto Repo Builder:** Don't want to write code? Generate comprehensive agent configurations, prompt templates, and `README` files entirely from natural language descriptions using Gemini AI.
* ⚔️ **Battle Mode:** Compare two agents side-by-side. Provide a single prompt and watch how different agents handle the specific task, evaluating their performance, speed, and accuracy in real-time.
* 🏃 **Secure Execution:** Run interactive, chat, and input-output agents directly from their repository pages with real inputs and structured outputs.
* 🐙 **GitHub-style Ecosystem:** Every agent has its own repository featuring Live Demos, READMEs, Issues, Pull Requests, `agent.yaml` Configs, and SDK usage examples.
* 👤 **Developer Profiles:** Showcase your created agents, track your contributions, and build a following in the AgentSpace ecosystem.

## 💻 Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **UI Library:** [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), Radix UI
* **AI Engine:** [Google Genkit](https://firebase.google.com/docs/genkit) powered by Google Gemini Models (`@genkit-ai/google-genai`)
* **Backend & Auth:** [Firebase v11](https://firebase.google.com/) (Firestore & Authentication)
* **Icons & Styling:** Lucide React, CSS Modules

## ⚙️ Getting Started

Follow these steps to set up AgentSpace locally on your machine.

### Prerequisites

* Node.js (v20 or higher)
* npm or yarn or pnpm
* A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/goblinasaddy/AgentSpace.git
   cd AgentSpace
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` or `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:9002](http://localhost:9002) (Port 9002 is configured via `package.json` turbopack) to see the application running.

## 📂 Project Structure

```
AgentSpace/
├── src/
│   ├── ai/            # Genkit flows and AI logic (Auto Repo Builder)
│   ├── app/           # Next.js App Router pages (/, /explore, /agent, /profile, /battle, /create)
│   ├── components/    # Reusable React components & shadcn/ui elements
│   ├── context/       # React Context providers (AgentsState)
│   ├── hooks/         # Custom React hooks (useToast)
│   └── lib/           # Utility functions, mocked data, types
├── docs/              # Project blueprints and documentation
├── public/            # Static assets
└── package.json       # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are completely welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <i>Built with ❤️ for the future of Autonomous Agents.</i>
</div>