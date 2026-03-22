"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Mail, MapPin, Link as LinkIcon, Twitter, Users, Star, BookOpen, GitBranch, GitPullRequest, CircleDot, Clock, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_USER } from '@/lib/data';
import { AgentCard } from '@/components/agent-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAgents } from '@/context/agents-context';

export default function ProfilePage() {
    const params = useParams();
    const { agents } = useAgents();
    const user = params.username === MOCK_USER.username ? MOCK_USER : MOCK_USER;

    // Filter agents owned by this user
    const userAgents = agents.filter(a => a.owner === user.username);
    const pinnedAgents = userAgents.slice(0, 4);

    const [contributionDays, setContributionDays] = useState<{ level: number, date: Date }[]>([]);

    useEffect(() => {
        const days = Array.from({ length: 371 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (370 - i));
            return {
                level: Math.floor(Math.random() * 5),
                date
            };
        });
        setContributionDays(days);
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const contributions = {
        pullRequests: [
            { id: 'pr1', title: 'Optimize prompt processing engine', status: 'merged', repo: 'debug-master/code-debugger-pro', date: '3 days ago' },
            { id: 'pr2', title: 'Add support for Python 3.12 syntax', status: 'open', repo: 'addy/coding-assistant', date: '1 week ago' },
            { id: 'pr3', title: 'Fix hydration mismatch in dashboard', status: 'merged', repo: 'addy/coding-assistant', date: '2 weeks ago' },
        ],
        issues: [
            { id: 'iss1', title: 'Memory leak in long-running sessions', status: 'open', repo: 'debug-master/code-debugger-pro', date: '4 days ago' },
            { id: 'iss2', title: 'Incorrect type inference for async functions', status: 'closed', repo: 'addy/coding-assistant', date: '1 month ago' },
        ],
        contributedRepos: [
            { name: 'code-debugger-pro', owner: 'debug-master', role: 'Maintainer' },
            { name: 'resume-analyzer', owner: 'hr-guru', role: 'Contributor' },
            { name: 'startup-idea-engine', owner: 'venture-capital', role: 'Contributor' },
        ]
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-72 space-y-6 shrink-0">
                    <div className="space-y-4">
                        <Avatar className="h-64 w-64 border-2 border-muted-foreground/10 rounded-2xl mx-auto lg:mx-0 flex items-center justify-center bg-muted">
                            <AvatarFallback className="bg-transparent">
                                <User className="h-32 w-32 text-muted-foreground/40" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-headline font-bold">{user.name}</h1>
                            <p className="text-muted-foreground text-lg">{user.username}</p>
                        </div>
                        <p className="text-sm leading-relaxed">{user.bio}</p>
                        <Button className="w-full h-9 bg-muted hover:bg-muted/80 text-foreground border border-muted-foreground/20">Edit profile</Button>

                        <div className="flex items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                                <Users className="h-4 w-4" />
                                <span>{user.followers}</span>
                                <span className="text-muted-foreground font-normal">followers</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                                <span>{user.following}</span>
                                <span className="text-muted-foreground font-normal">following</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {user.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                <a href={user.website} className="text-foreground hover:text-primary transition-colors">{user.website}</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                <a href={`https://twitter.com/${user.twitter}`} className="text-foreground hover:text-primary transition-colors">{user.twitter}</a>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 space-y-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-12 p-0 mb-6 gap-6 overflow-x-auto">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                <BookOpen className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="repositories" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                <GitBranch className="h-4 w-4" />
                                Repositories
                                <span className="ml-1 bg-muted px-1.5 rounded-full text-[10px] font-bold">{userAgents.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="contributions" id="contributions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                <GitPullRequest className="h-4 w-4" />
                                Contributions
                            </TabsTrigger>
                            <TabsTrigger value="stars" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2 gap-2">
                                <Star className="h-4 w-4" />
                                Stars
                                <span className="ml-1 bg-muted px-1.5 rounded-full text-[10px] font-bold">482</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-0 space-y-8">
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium">Pinned agents</h3>
                                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Customize your pins</Button>
                                </div>
                                {pinnedAgents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pinnedAgents.map((agent) => (
                                            <AgentCard key={agent.id} agent={agent} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center border border-dashed rounded-lg bg-muted/20">
                                        <p className="text-sm text-muted-foreground">No agents pinned yet.</p>
                                    </div>
                                )}
                            </section>

                            <section>
                                <h3 className="text-sm font-medium mb-4">Agent Contribution Graph</h3>
                                <Card className="bg-card/50 border-muted overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-2 overflow-x-auto pb-2">
                                            <div className="flex gap-2 min-w-max">
                                                <div className="flex flex-col justify-around text-[9px] text-muted-foreground pt-4 pb-1 pr-1">
                                                    <span className="h-2.5">Mon</span>
                                                    <span className="h-2.5">Wed</span>
                                                    <span className="h-2.5">Fri</span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex text-[9px] text-muted-foreground justify-between w-full pr-4">
                                                        {months.map(m => <span key={m} className="w-full text-left">{m}</span>)}
                                                    </div>

                                                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                                                        {contributionDays.length > 0 ? (
                                                            contributionDays.map((day, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`h-2.5 w-2.5 rounded-sm shrink-0 transition-colors ${day.level === 0 ? 'bg-muted' :
                                                                            day.level === 1 ? 'bg-primary/20' :
                                                                                day.level === 2 ? 'bg-primary/40' :
                                                                                    day.level === 3 ? 'bg-primary/60' :
                                                                                        'bg-primary'
                                                                        }`}
                                                                    title={`${day.date.toDateString()}: ${day.level} contributions`}
                                                                />
                                                            ))
                                                        ) : (
                                                            Array.from({ length: 371 }).map((_, i) => (
                                                                <div key={i} className="h-2.5 w-2.5 rounded-sm bg-muted shrink-0" />
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
                                            <div>Learn how we count contributions</div>
                                            <div className="flex items-center gap-1.5">
                                                Less
                                                <div className="h-2.5 w-2.5 bg-muted rounded-sm" />
                                                <div className="h-2.5 w-2.5 bg-primary/20 rounded-sm" />
                                                <div className="h-2.5 w-2.5 bg-primary/40 rounded-sm" />
                                                <div className="h-2.5 w-2.5 bg-primary/60 rounded-sm" />
                                                <div className="h-2.5 w-2.5 bg-primary rounded-sm" />
                                                More
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                        </TabsContent>

                        <TabsContent value="repositories" className="mt-0">
                            <div className="space-y-4">
                                {userAgents.length > 0 ? (
                                    userAgents.map((agent) => (
                                        <Card key={agent.id} className="bg-transparent shadow-none border-b border-muted rounded-none last:border-0 hover:bg-muted/10 transition-colors">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h4 className="font-headline font-bold text-lg text-primary hover:underline cursor-pointer">{agent.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] uppercase">Public</Badge>
                                                </div>
                                                <div className="flex items-center gap-6 text-xs text-muted-foreground mt-4">
                                                    <div className="flex items-center gap-1">
                                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                                        {agent.category}
                                                    </div>
                                                    <div className="flex items-center gap-1 hover:text-primary cursor-pointer">
                                                        <Star className="h-3.5 w-3.5" />
                                                        {agent.stars}
                                                    </div>
                                                    <div className="flex items-center gap-1 hover:text-primary cursor-pointer">
                                                        <GitBranch className="h-3.5 w-3.5" />
                                                        {agent.forks}
                                                    </div>
                                                    <div>Updated {agent.updatedAt}</div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <h3 className="text-lg font-headline font-bold mb-2">No repositories found</h3>
                                        <p className="text-muted-foreground">This user hasn't created any agents yet.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="contributions" className="mt-0 space-y-8">
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <GitPullRequest className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-headline font-bold">Pull Requests</h3>
                                </div>
                                <div className="grid gap-3">
                                    {contributions.pullRequests.map((pr) => (
                                        <Card key={pr.id} className="bg-card/30 border-muted hover:bg-muted/10 transition-colors">
                                            <CardContent className="p-4 flex items-start gap-3">
                                                {pr.status === 'merged' ? (
                                                    <GitPullRequest className="h-4 w-4 text-purple-500 mt-1" />
                                                ) : (
                                                    <GitPullRequest className="h-4 w-4 text-green-500 mt-1" />
                                                )}
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-bold hover:text-primary cursor-pointer">{pr.title}</h4>
                                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                                        <span className="font-medium">{pr.repo}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {pr.date}
                                                        </span>
                                                        <Badge variant="outline" className={`py-0 h-4 text-[9px] uppercase ${pr.status === 'merged' ? 'border-purple-500/30 text-purple-500' : 'border-green-500/30 text-green-500'}`}>
                                                            {pr.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CircleDot className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-headline font-bold">Opened Issues</h3>
                                </div>
                                <div className="grid gap-3">
                                    {contributions.issues.map((issue) => (
                                        <Card key={issue.id} className="bg-card/30 border-muted hover:bg-muted/10 transition-colors">
                                            <CardContent className="p-4 flex items-start gap-3">
                                                <CircleDot className={`h-4 w-4 mt-1 ${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'}`} />
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-bold hover:text-primary cursor-pointer">{issue.title}</h4>
                                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                                        <span className="font-medium">{issue.repo}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {issue.date}
                                                        </span>
                                                        <Badge variant="outline" className={`py-0 h-4 text-[9px] uppercase ${issue.status === 'open' ? 'border-green-500/30 text-green-500' : 'border-purple-500/30 text-purple-500'}`}>
                                                            {issue.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <GitBranch className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-headline font-bold">Contributed Repositories</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {contributions.contributedRepos.map((repo) => (
                                        <Card key={repo.name} className="bg-card/30 border-muted overflow-hidden">
                                            <div className="p-4 pb-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-headline font-bold text-primary hover:underline cursor-pointer">
                                                        {repo.owner} / {repo.name}
                                                    </div>
                                                    <Badge variant="secondary" className="text-[9px] uppercase bg-primary/10 text-primary-foreground">{repo.role}</Badge>
                                                </div>
                                            </div>
                                            <div className="p-4 pt-0">
                                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3" />
                                                        {Math.floor(Math.random() * 500)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <GitBranch className="h-3 w-3" />
                                                        {Math.floor(Math.random() * 50)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
