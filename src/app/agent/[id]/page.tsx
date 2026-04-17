"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, GitFork, Play, Share2, Rocket, Clock, Shield, AlertCircle, FileCode, BookOpen, BarChart3, Code2, MessageSquare, Bot, Code, User, Send, CircleDot, GitPullRequest, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getAgentBySlug, Agent } from '@/lib/agents';
import { createJob, getJob, Job } from '@/lib/jobs';

export default function AgentDetailPage() {
    const params = useParams();
    const slug = params.id as string;
    
    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);

    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
    
    // Job status UI state
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobDetails, setJobDetails] = useState<Job | null>(null);
    const [runOutput, setRunOutput] = useState<string | null>(null);

    // Fetch Agent
    useEffect(() => {
        async function loadAgent() {
            setLoading(true);
            const data = await getAgentBySlug(slug);
            setAgent(data);
            setLoading(false);
        }
        if (slug) {
            loadAgent();
        }
    }, [slug]);

    // Polling Job
    useEffect(() => {
        if (!jobId) return;
        const interval = setInterval(async () => {
            const currentJob = await getJob(jobId);
            if (currentJob) {
                setJobDetails(currentJob);
                if (currentJob.status === 'completed' || currentJob.status === 'failed') {
                    setRunOutput(JSON.stringify(currentJob.output, null, 2));
                    clearInterval(interval);
                    setIsProcessing(false);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [jobId]);

    const handleRunAgent = async () => {
        if (!agent) return;
        setIsProcessing(true);
        setRunOutput(null);
        setJobId(null);
        setJobDetails(null);

        // All agent types create a job — the backend worker handles execution
        const job = await createJob(agent.id, { trigger: 'manual', type: agent.type });
        if (job) {
            setJobId(job.id);
            setJobDetails(job);
        } else {
            setRunOutput('Failed to create job. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleSendMessage = () => {
        if (!agent || !userInput.trim()) return;
        const newMessages = [...chatMessages, { role: 'user', text: userInput } as const];
        setChatMessages(newMessages);
        setUserInput('');
        setIsProcessing(true);

        setTimeout(() => {
            setChatMessages([...newMessages, { role: 'bot', text: `As the ${agent.name}, I've processed your request. How else can I help you today?` } as const]);
            setIsProcessing(false);
        }, 800);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!agent) {
        return <div className="min-h-screen flex items-center justify-center">Agent not found</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="bg-card/30 border-b pt-10 pb-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Avatar className="h-5 w-5 border border-muted-foreground/20">
                                    <AvatarFallback className="bg-muted">
                                        <User className="h-3 w-3 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <Link href={`/profile/${agent.owner_username}`} className="hover:underline hover:text-primary transition-colors">
                                    {agent.owner_username}
                                </Link>
                                <span className="mx-1">/</span>
                                <Link href={`/agent/${agent.id}`} className="font-bold text-foreground hover:underline cursor-pointer">
                                    {agent.name}
                                </Link>
                                <Badge variant="outline" className="ml-2 py-0 h-5 px-2 text-[10px] uppercase font-bold text-muted-foreground">Public</Badge>
                            </div>

                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-headline font-bold">{agent.name}</h1>
                                <Badge variant="secondary" className="bg-primary/20 text-primary border-none uppercase text-[10px] font-bold">
                                    {agent.type}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-lg max-w-3xl">{agent.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-muted-foreground/10">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold">0</span>
                                    <span className="text-muted-foreground">Stars</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-muted-foreground/10">
                                    <GitFork className="h-4 w-4" />
                                    <span className="font-bold">0</span>
                                    <span className="text-muted-foreground">Forks</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-muted-foreground/10">
                                    <Play className="h-4 w-4 text-primary" />
                                    <span className="font-bold">0</span>
                                    <span className="text-muted-foreground">Runs</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <GitFork className="h-4 w-4" />
                                Fork
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <Tabs defaultValue="demo" className="w-full">
                            <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-12 p-0 mb-6 gap-6 overflow-x-auto">
                                <TabsTrigger value="demo" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <Play className="h-4 w-4" />
                                    Live Demo
                                </TabsTrigger>
                                <TabsTrigger value="readme" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="run" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <Play className="h-4 w-4 text-green-500" />
                                    Run Agent
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="demo" className="mt-0 space-y-4">
                                {agent.type === 'prompt' && (
                                    <Card className="flex flex-col h-[500px] border-muted">
                                        <CardHeader className="border-b py-3 px-6 bg-muted/20">
                                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-primary" />
                                                Chat Interface
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <Bot className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 text-sm max-w-[80%]">
                                                    Hello! I'm the <strong>{agent.name}</strong>. How can I help you today?
                                                </div>
                                            </div>
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary/20' : 'bg-primary/20'}`}>
                                                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                                                    </div>
                                                    <div className={`rounded-2xl p-3 text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted/50 rounded-tl-none'}`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                            {isProcessing && (
                                                <div className="flex gap-3 animate-pulse">
                                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                        <Bot className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 text-sm">
                                                        Processing...
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="border-t p-4 bg-muted/10">
                                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full gap-2">
                                                <Input
                                                    placeholder="Type your message..."
                                                    value={userInput}
                                                    onChange={(e) => setUserInput(e.target.value)}
                                                    className="bg-background border-muted"
                                                />
                                                <Button type="submit" size="icon" disabled={isProcessing}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </CardFooter>
                                    </Card>
                                )}


                            </TabsContent>

                            <TabsContent value="readme" className="mt-0">
                                <Card className="border-none shadow-none bg-transparent">
                                    <CardContent className="p-6 prose prose-invert max-w-none bg-card border rounded-lg">
                                        <h3 className="font-headline font-bold text-2xl mb-4">Description</h3>
                                        <p>{agent.description}</p>
                                        
                                        <h3 className="font-headline font-bold text-2xl mb-4 mt-6">Execution Mode</h3>
                                        <p>{agent.execution_mode}</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="run" className="mt-0 space-y-4">
                                <Card className="border-muted">
                                    <CardHeader className="bg-muted/20 border-b">
                                        <CardTitle className="text-lg">Execution Interface</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <p className="text-muted-foreground">Type: <Badge variant="outline" className="uppercase text-[10px] ml-1">{agent.type}</Badge></p>
                                        <p className="text-muted-foreground text-sm">Execution is handled by the backend worker. Click Run to create a job.</p>
                                        <Button onClick={handleRunAgent} disabled={isProcessing} className="w-full h-12 text-lg">
                                            {isProcessing ? 'Processing…' : 'Run Agent'}
                                        </Button>

                                        {jobDetails && (
                                            <div className="mt-6 p-4 rounded-lg bg-muted/30 border space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-sm">Job Status</h4>
                                                    <Badge variant={
                                                        jobDetails.status === 'completed' ? 'default' :
                                                        jobDetails.status === 'failed' ? 'destructive' :
                                                        jobDetails.status === 'running' ? 'secondary' : 'outline'
                                                    }>{jobDetails.status}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-mono">ID: {jobDetails.id}</p>

                                                {/* Live logs from worker */}
                                                {Array.isArray(jobDetails.logs) && jobDetails.logs.length > 0 && (
                                                    <div className="mt-3">
                                                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Logs</h5>
                                                        <div className="bg-black/40 rounded border p-3 max-h-48 overflow-y-auto">
                                                            {jobDetails.logs.map((entry: string, i: number) => (
                                                                <p key={i} className="text-xs font-mono text-muted-foreground leading-relaxed">
                                                                    <span className="text-primary/60 mr-2">[{i + 1}]</span>{entry}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(runOutput || (jobDetails?.output && jobDetails.status === 'completed')) && (
                                            <div className="mt-6">
                                                <h4 className="font-bold mb-2">Output</h4>
                                                <pre className="p-4 bg-black/40 border rounded text-sm text-primary-foreground min-h-[100px] whitespace-pre-wrap">
                                                    {runOutput || JSON.stringify(jobDetails?.output, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {jobDetails?.status === 'failed' && jobDetails?.output && (
                                            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                                <h4 className="font-bold text-sm text-red-400 mb-1">Error</h4>
                                                <p className="text-sm text-red-300">{typeof jobDetails.output === 'object' ? (jobDetails.output as any).error : String(jobDetails.output)}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">About</h3>
                            <p className="text-sm leading-relaxed">{agent.description}</p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {(agent.tags || []).map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary-foreground border-none">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Stats</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Star className="h-4 w-4" />
                                        Stars
                                    </span>
                                    <span className="font-medium">0</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Play className="h-4 w-4" />
                                        Type
                                    </span>
                                    <span className="font-medium capitalize">{agent.type}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        Created At
                                    </span>
                                    <span className="font-medium">{new Date(agent.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Quality Score</h3>
                            <div className="text-3xl font-headline font-bold">10 <span className="text-sm text-muted-foreground font-normal">/ 10</span></div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `100%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Calculated based on run success rate and feedback.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
