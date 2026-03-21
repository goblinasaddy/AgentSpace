"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, MessageSquare, Terminal, Code, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AgentCard } from '@/components/agent-card';
import { cn } from '@/lib/utils';
import { AgentType } from '@/lib/types';
import { useAgents } from '@/context/agents-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = 'rating' | 'stars' | 'name';

export default function ExplorePage() {
    const { agents } = useAgents();
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeType, setActiveType] = useState<AgentType | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('rating');

    const categories = ['All', 'Coding', 'Career', 'Business', 'Analysis', 'Writing', 'Education', 'Lifestyle', 'Social', 'Legal'];

    const sortOptions: { label: string; value: SortOption }[] = [
        { label: 'Top Rated', value: 'rating' },
        { label: 'Most Stars', value: 'stars' },
        { label: 'Alphabetical', value: 'name' },
    ];

    const agentTypes: { label: string; value: AgentType; icon: any }[] = [
        { label: 'Chat Agents', value: 'chat', icon: MessageSquare },
        { label: 'Interactive (I/O)', value: 'input-output', icon: Terminal },
        { label: 'Reference Examples', value: 'example', icon: Code },
    ];

    const processedAgents = useMemo(() => {
        const priorityIds = ['resume-analyzer', 'code-debugger-pro', 'linkedin-poster', 'research-agent', 'legal-summarizer'];

        const filtered = agents.filter(agent => {
            const matchesCategory = activeCategory === 'All' || agent.category === activeCategory || agent.tags.includes(activeCategory);
            const matchesType = activeType === 'All' || agent.type === activeType;
            const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesType && matchesSearch;
        });

        return [...filtered].sort((a, b) => {
            const indexA = priorityIds.indexOf(a.id);
            const indexB = priorityIds.indexOf(b.id);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'stars':
                    return b.stars - a.stars;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    }, [agents, activeCategory, activeType, searchQuery, sortBy]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 space-y-6 shrink-0">
                    <div className="flex items-center gap-2 font-headline font-bold text-lg mb-4">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</h3>
                        <div className="flex flex-col gap-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                                        activeCategory === category
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {category}
                                    {activeCategory === category && <ChevronRight className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-muted" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent Types</h3>
                            {activeType !== 'All' && (
                                <button
                                    onClick={() => setActiveType('All')}
                                    className="text-[10px] text-primary hover:underline"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            {agentTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setActiveType(activeType === type.value ? 'All' : type.value)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                                        activeType === type.value
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <type.icon className="h-4 w-4" />
                                    <span>{type.label}</span>
                                    {activeType === type.value && <Check className="h-3.5 w-3.5 ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-muted" />

                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Automation', 'Social', 'Legal', 'Vercel', 'GPT-4'].map(tag => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="cursor-pointer hover:border-primary/50 text-[11px]"
                                    onClick={() => setSearchQuery(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="flex-1 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search agents, prompts..."
                                className="pl-10 h-11 bg-card border-muted focus-visible:ring-1 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-10 gap-2 min-w-[160px] justify-between">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-4 w-4" />
                                            <span>Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    {sortOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            className="flex items-center justify-between cursor-pointer"
                                        >
                                            {option.label}
                                            {sortBy === option.value && <Check className="h-4 w-4 text-primary" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="font-headline font-bold text-xl">
                            {activeCategory !== 'All' ? activeCategory : ''} {activeType !== 'All' ? agentTypes.find(t => t.value === activeType)?.label : ''} Agents
                            <span className="text-sm font-normal text-muted-foreground ml-2">({processedAgents.length} results)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {processedAgents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>

                    {processedAgents.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                <Search className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-2">No agents found</h3>
                            <p className="text-muted-foreground max-w-xs">We couldn't find any agents matching your current filters. Try resetting them.</p>
                            <Button
                                variant="link"
                                className="mt-4"
                                onClick={() => {
                                    setActiveCategory('All');
                                    setActiveType('All');
                                    setSearchQuery('');
                                    setSortBy('rating');
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
