import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { AgentsProvider } from '@/context/agents-context';

export const metadata: Metadata = {
  title: 'AgentSpace | The Ecosystem for AI Agents',
  description: 'Discover, build, and deploy custom AI agents in a GitHub-style marketplace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <AgentsProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AgentsProvider>
      </body>
    </html>
  );
}
