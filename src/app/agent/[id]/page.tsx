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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AgentRunner } from '@/components/agent/AgentRunner';
import { useAgents } from '@/context/agents-context';

export default function AgentDetailPage() {
    const params = useParams();
    const { agents } = useAgents();
    const agent = agents.find(a => a.id === params.id) || agents[0];

    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);

    const handleSendMessage = () => {
        if (!userInput.trim()) return;
        const newMessages = [...chatMessages, { role: 'user', text: userInput } as const];
        setChatMessages(newMessages);
        setUserInput('');
        setIsProcessing(true);

        setTimeout(() => {
            setChatMessages([...newMessages, { role: 'bot', text: `As the ${agent.name}, I've processed your request. How else can I help you today?` } as const]);
            setIsProcessing(false);
        }, 800);
    };

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
                                <Link href={`/profile/${agent.owner}`} className="hover:underline hover:text-primary transition-colors">
                                    {agent.owner}
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
                                    <span className="font-bold">{agent.stars}</span>
                                    <span className="text-muted-foreground">Stars</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-muted-foreground/10">
                                    <GitFork className="h-4 w-4" />
                                    <span className="font-bold">{agent.forks}</span>
                                    <span className="text-muted-foreground">Forks</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-muted-foreground/10">
                                    <Play className="h-4 w-4 text-primary" />
                                    <span className="font-bold">{agent.runs}</span>
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
                                    README
                                </TabsTrigger>
                                <TabsTrigger value="issues" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <CircleDot className="h-4 w-4" />
                                    Issues
                                    {agent.issues && agent.issues.length > 0 && (
                                        <Badge variant="secondary" className="ml-1 bg-muted px-1.5 h-4 text-[10px]">{agent.issues.filter(i => i.status === 'open').length}</Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="pulls" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <GitPullRequest className="h-4 w-4" />
                                    Pull Requests
                                    {agent.pullRequests && agent.pullRequests.length > 0 && (
                                        <Badge variant="secondary" className="ml-1 bg-muted px-1.5 h-4 text-[10px]">{agent.pullRequests.filter(p => p.status === 'open').length}</Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="code" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <FileCode className="h-4 w-4" />
                                    Config
                                </TabsTrigger>
                                <TabsTrigger value="usage" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                    <Code2 className="h-4 w-4" />
                                    SDK
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="demo" className="mt-0 space-y-4">
                                {agent.type === 'chat' && (
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

                                {(agent.type === 'input-output' || agent.type === 'example') && (
                                    <AgentRunner agentId={agent.id} />
                                )}
                            </TabsContent>

                            <TabsContent value="readme" className="mt-0">
                                <Card className="border-none shadow-none bg-transparent">
                                    <CardContent className="p-6 prose prose-invert max-w-none bg-card border rounded-lg">
                                        <div dangerouslySetInnerHTML={{ __html: agent.readme.replace(/#/g, '<h3 class="font-headline font-bold text-2xl mb-4">').replace(/\n/g, '<br/>') }} />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="issues" className="mt-0">
                                <div className="border rounded-lg bg-card overflow-hidden">
                                    <div className="bg-muted px-6 py-4 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-sm font-bold">
                                                <CircleDot className="h-4 w-4 text-green-500" />
                                                {agent.issues?.filter(i => i.status === 'open').length || 0} Open
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {agent.issues?.filter(i => i.status === 'closed').length || 0} Closed
                                            </div>
                                        </div>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold h-8">New Issue</Button>
                                    </div>
                                    <div className="divide-y">
                                        {agent.issues && agent.issues.length > 0 ? (
                                            agent.issues.map((issue) => (
                                                <div key={issue.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-3">
                                                    <CircleDot className={`h-4 w-4 mt-1 shrink-0 ${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold hover:text-primary cursor-pointer mb-1 truncate">{issue.title}</h4>
                                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                            <span>#{issue.id}</span>
                                                            <span>opened {issue.createdAt} by</span>
                                                            <span className="font-medium hover:text-primary cursor-pointer">{issue.author}</span>
                                                        </div>
                                                    </div>
                                                    {issue.commentsCount > 0 && (
                                                        <div className="flex items-center gap-1 text-muted-foreground text-xs shrink-0">
                                                            <MessageCircle className="h-3 w-3" />
                                                            {issue.commentsCount}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center flex flex-col items-center gap-2">
                                                <CircleDot className="h-10 w-10 text-muted-foreground opacity-20" />
                                                <h3 className="font-bold text-lg">No issues found</h3>
                                                <p className="text-sm text-muted-foreground max-w-xs">There are no open or closed issues for this repository. Contributions are welcome!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="pulls" className="mt-0">
                                <div className="border rounded-lg bg-card overflow-hidden">
                                    <div className="bg-muted px-6 py-4 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-sm font-bold">
                                                <GitPullRequest className="h-4 w-4 text-green-500" />
                                                {agent.pullRequests?.filter(p => p.status === 'open').length || 0} Open
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {agent.pullRequests?.filter(p => p.status !== 'open').length || 0} Closed
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="font-bold h-8">New Pull Request</Button>
                                    </div>
                                    <div className="divide-y">
                                        {agent.pullRequests && agent.pullRequests.length > 0 ? (
                                            agent.pullRequests.map((pr) => (
                                                <div key={pr.id} className="p-4 hover:bg-muted/30 transition-colors flex items-start gap-3">
                                                    <GitPullRequest className={`h-4 w-4 mt-1 shrink-0 ${pr.status === 'open' ? 'text-green-500' : pr.status === 'merged' ? 'text-purple-500' : 'text-red-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold hover:text-primary cursor-pointer mb-1 truncate">{pr.title}</h4>
                                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                            <span>#{pr.id}</span>
                                                            <span>opened {pr.createdAt} by</span>
                                                            <span className="font-medium hover:text-primary cursor-pointer">{pr.author}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center flex flex-col items-center gap-2">
                                                <GitPullRequest className="h-10 w-10 text-muted-foreground opacity-20" />
                                                <h3 className="font-bold text-lg">No pull requests found</h3>
                                                <p className="text-sm text-muted-foreground max-w-xs">There are no open pull requests for this repository. Start contributing today!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="code" className="mt-0 space-y-4">
                                <div className="rounded-lg border bg-card overflow-hidden">
                                    <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <FileCode className="h-4 w-4" />
                                            agent.yaml
                                        </div>
                                    </div>
                                    <pre className="p-4 text-sm font-code overflow-x-auto text-primary-foreground/80 leading-relaxed">
                                        {agent.configYaml}
                                    </pre>
                                </div>

                                <div className="rounded-lg border bg-card overflow-hidden">
                                    <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <FileCode className="h-4 w-4" />
                                            metadata.json
                                        </div>
                                    </div>
                                    <pre className="p-4 text-sm font-code overflow-x-auto text-primary-foreground/80 leading-relaxed">
                                        {agent.metadataJson}
                                    </pre>
                                </div>
                            </TabsContent>

                            <TabsContent value="usage" className="mt-0 space-y-4">
                                <Card className="bg-card border overflow-hidden">
                                    <CardHeader className="bg-muted px-4 py-3 border-b">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                                <Code2 className="h-4 w-4 text-primary" />
                                                SDK Usage
                                            </CardTitle>
                                            <Badge variant="outline" className="text-[10px] uppercase">TypeScript</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <pre className="p-6 text-sm font-code overflow-x-auto bg-black/40 text-primary-foreground/90 leading-relaxed">
                                            {agent.usageCode}
                                        </pre>
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
                                {agent.tags.map(tag => (
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
                                    <span className="font-medium">{agent.stars}</span>
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
                                        Updated
                                    </span>
                                    <span className="font-medium">{agent.updatedAt}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Quality Score</h3>
                            <div className="text-3xl font-headline font-bold">{agent.rating} <span className="text-sm text-muted-foreground font-normal">/ 10</span></div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${agent.rating * 10}%` }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Calculated based on run success rate and feedback.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
