"use client";

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Search, Terminal, Github } from 'lucide-react';
import { Button } from '@/components/ui/badge';
import { AgentCard } from '@/components/agent-card';
import { useAgents } from '@/context/agents-context';

const CactusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22v-9" />
        <path d="M8 13v-5a4 4 0 1 1 8 0v4" />
        <path d="M8 13h0a4 4 0 0 0-4-4v1a4 4 0 0 0 4 4Z" />
        <path d="M16 11h0a4 4 0 0 1 4 4v-1a4 4 0 0 1-4-4Z" />
    </svg>
);

export default function Home() {
    const { agents } = useAgents();
    const trendingAgents = agents.slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 hero-gradient">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8">
                        < Zap className="h-4 w-4" />
                        <span>Now in Beta: The future of autonomous agents</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight mb-6">
                        The Space for Every <br />
                        <span className="gradient-text">AI Agent</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Discover, build, and deploy custom AI agents. The world's largest marketplace and repository system for intelligent automation.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 rounded-full" asChild>
                            <Link href="/explore">
                                Explore Marketplace
                                <Search className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base border-muted rounded-full" asChild>
                            <Link href="/create">
                                Create Your Agent
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 blur-[120px] opacity-20 bg-primary h-[300px] w-[300px] rounded-full" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 -z-10 blur-[120px] opacity-20 bg-secondary h-[300px] w-[300px] rounded-full" />
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-headline font-bold text-foreground">{agents.length}+</div>
                            <div className="text-sm text-muted-foreground">Agents Published</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-headline font-bold text-foreground">100%</div>
                            <div className="text-sm text-muted-foreground">Contributions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-headline font-bold text-foreground">Active</div>
                            <div className="text-sm text-muted-foreground">Ecosystem</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Agents */}
            <section className="py-24 container mx-auto px-4">
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-headline font-bold">Trending Agents</h2>
                        <p className="text-muted-foreground">The most popular agents in the community this week.</p>
                    </div>
                    <Button variant="link" className="text-primary font-semibold" asChild>
                        <Link href="/explore">View all marketplace</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingAgents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-muted/10 border-t">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-headline font-bold mb-4">Everything you need to build agents</h2>
                        <p className="text-muted-foreground">Powerful tools designed to make agent development as easy as pushing code to GitHub.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-card border border-muted-foreground/10 flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <Terminal className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-3">Auto Repo Builder</h3>
                            <p className="text-sm text-muted-foreground">Generate agent configuration, prompt templates, and README files from natural language descriptions.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-card border border-muted-foreground/10 flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-3">Battle Mode</h3>
                            <p className="text-sm text-muted-foreground">Compare performance side-by-side. See which agent handles your specific prompts better with live evaluations.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-card border border-muted-foreground/10 flex flex-col items-center text-center">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-3">Secure Execution</h3>
                            <p className="text-sm text-muted-foreground">Enterprise-grade sandboxing for agent runs. We handle the infrastructure so you can focus on the logic.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t mt-auto">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-primary border border-border/50">
                                <CactusIcon className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-headline font-bold">AgentSpace</span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
                            <Link href="#" className="hover:text-primary transition-colors">API Reference</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </div>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-8">
                        © {new Date().getFullYear()} AgentSpace. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
