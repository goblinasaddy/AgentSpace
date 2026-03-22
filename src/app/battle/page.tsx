"use client";

import { useState, useMemo, useRef } from 'react';
import { Swords, Zap, RefreshCcw, MessageSquare, Bot, AlertCircle, Loader2, Search, Check, ChevronDown, User, FileUp, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { runAgent } from '@/lib/core/runAgent';
import { OutputDisplay } from '@/components/agent/OutputDisplay';
import { ApiKeyInput } from '@/components/agent/ApiKeyInput';
import { cn } from '@/lib/utils';
import { useAgents } from '@/context/agents-context';

export default function BattleModePage() {
    const { agents } = useAgents();
    const [prompt, setPrompt] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [agentAId, setAgentAId] = useState(agents[0]?.id || '');
    const [agentBId, setAgentBId] = useState(agents[2]?.id || agents[1]?.id || '');
    const [responseA, setResponseA] = useState<any>(null);
    const [responseB, setResponseB] = useState<any>(null);
    const [isFighting, setIsFighting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const agentA = agents.find(a => a.id === agentAId);
    const agentB = agents.find(a => a.id === agentBId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast({ title: "Invalid File", description: "Please upload a PDF document.", variant: "destructive" });
                return;
            }
            setFile(selectedFile);
        }
    };

    async function handleBattle() {
        if (!prompt && !file) {
            toast({ title: "Error", description: "Enter a prompt or upload a PDF for the agents to process.", variant: "destructive" });
            return;
        }

        if (agentAId === agentBId) {
            toast({ title: "Error", description: "Please select two different agents.", variant: "destructive" });
            return;
        }

        setIsFighting(true);
        setResponseA(null);
        setResponseB(null);

        const executionInput = file ? `[FILE: ${file.name}] ${prompt}` : prompt;

        try {
            const [resultA, resultB] = await Promise.all([
                runAgent(agentAId, executionInput, apiKey),
                runAgent(agentBId, executionInput, apiKey)
            ]);

            setResponseA(resultA);
            setResponseB(resultB);
        } catch (error) {
            toast({ title: "Error", description: "The battle failed due to an engine error.", variant: "destructive" });
        } finally {
            setIsFighting(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <Swords className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-headline font-bold">Agent Battle Mode</h1>
                <p className="text-muted-foreground max-w-2xl">Pit two agents against each other to compare their reasoning, style, and accuracy. The ultimate way to evaluate model performance.</p>
            </div>

            <Card className="mb-12 border-primary/20 shadow-lg bg-card/50">
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
                        <div className="md:col-span-5 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Agent A</label>
                            <SearchableAgentSelector
                                selectedAgentId={agentAId}
                                onSelect={setAgentAId}
                                placeholder="Search Agent A..."
                            />
                        </div>

                        <div className="md:col-span-1 flex justify-center pt-6">
                            <div className="h-10 w-10 rounded-full border border-primary/50 flex items-center justify-center font-headline font-bold text-primary italic">VS</div>
                        </div>

                        <div className="md:col-span-5 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Agent B</label>
                            <SearchableAgentSelector
                                selectedAgentId={agentBId}
                                onSelect={setAgentBId}
                                placeholder="Search Agent B..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">The Document (Optional)</Label>
                                {!file ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-muted rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                    >
                                        <FileUp className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                                        <p className="text-xs font-medium">Upload PDF for Battle</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm font-bold truncate">{file.name}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setFile(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">The Challenge Prompt</label>
                                <Textarea
                                    placeholder="Write a prompt that challenges both agents..."
                                    className="min-h-[120px] bg-muted/30 border-none text-lg resize-none p-4"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 self-end">
                            <ApiKeyInput value={apiKey} onChange={setApiKey} />
                            <Button
                                onClick={handleBattle}
                                className="w-full bg-primary hover:bg-primary/90 h-14 text-lg gap-2 shadow-xl shadow-primary/20"
                                disabled={isFighting}
                            >
                                {isFighting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Agents are Thinking...
                                    </>
                                ) : (
                                    <>
                                        Run Battle
                                        <Zap className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {(responseA || responseB || isFighting) && agentA && agentB && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <Card className="border-muted bg-card overflow-hidden flex flex-col h-[600px]">
                        <CardHeader className="bg-muted/50 border-b flex flex-row items-center justify-between space-y-0 py-4 px-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-sm font-bold">{agentA.name} Output</CardTitle>
                                    <span className="text-[10px] text-muted-foreground">Owner: {agentA.owner}</span>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase">{agentA.rating} Rating</Badge>
                        </CardHeader>
                        <CardContent className="p-6 overflow-y-auto flex-1">
                            {isFighting && !responseA ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[95%]" />
                                    <Skeleton className="h-4 w-[85%]" />
                                </div>
                            ) : (
                                <OutputDisplay output={responseA} />
                            )}
                        </CardContent>
                        <CardFooter className="bg-muted/20 border-t p-4 flex justify-between shrink-0">
                            <Button variant="ghost" size="sm" className="text-xs gap-2">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Give Feedback
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-muted bg-card overflow-hidden flex flex-col h-[600px]">
                        <CardHeader className="bg-muted/50 border-b flex flex-row items-center justify-between space-y-0 py-4 px-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-secondary" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-sm font-bold">{agentB.name} Output</CardTitle>
                                    <span className="text-[10px] text-muted-foreground">Owner: {agentB.owner}</span>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase">{agentB.rating} Rating</Badge>
                        </CardHeader>
                        <CardContent className="p-6 overflow-y-auto flex-1">
                            {isFighting && !responseB ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[95%]" />
                                    <Skeleton className="h-4 w-[85%]" />
                                </div>
                            ) : (
                                <OutputDisplay output={responseB} />
                            )}
                        </CardContent>
                        <CardFooter className="bg-muted/20 border-t p-4 flex justify-between shrink-0">
                            <Button variant="ghost" size="sm" className="text-xs gap-2">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Give Feedback
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {responseA && responseB && !isFighting && (
                <div className="mt-8 flex justify-center">
                    <Button variant="outline" className="gap-2 px-8 h-12 rounded-full border-primary/20 text-primary" onClick={() => { setResponseA(null); setResponseB(null); setFile(null); }}>
                        <RefreshCcw className="h-4 w-4" />
                        Reset Battle
                    </Button>
                </div>
            )}
        </div>
    );
}

function SearchableAgentSelector({ selectedAgentId, onSelect, placeholder }: { selectedAgentId: string; onSelect: (id: string) => void; placeholder?: string; }) {
    const { agents } = useAgents();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedAgent = agents.find(a => a.id === selectedAgentId);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const searchStr = `${agent.owner} / ${agent.name}`.toLowerCase();
            return searchStr.includes(search.toLowerCase());
        });
    }, [search, agents]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-12 justify-between bg-muted/30 border-none px-4 text-base font-normal group hover:bg-muted/50"
                >
                    {selectedAgent ? (
                        <div className="flex items-center gap-2 truncate">
                            <span className="text-muted-foreground shrink-0">{selectedAgent.owner} /</span>
                            <span className="font-bold truncate">{selectedAgent.name}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border-muted shadow-2xl" align="start">
                <div className="flex items-center border-b border-muted px-3 h-11">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-full w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-72">
                    <div className="p-1">
                        {filteredAgents.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">No agents found.</div>
                        ) : (
                            filteredAgents.map((agent) => (
                                <button
                                    key={agent.id}
                                    className={cn(
                                        "relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-primary/10 transition-colors group",
                                        selectedAgentId === agent.id && "bg-primary/20"
                                    )}
                                    onClick={() => {
                                        onSelect(agent.id);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-muted-foreground/10 group-hover:border-primary/30">
                                            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                        <div className="flex flex-col items-start truncate">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <span className="text-xs text-muted-foreground">{agent.owner} /</span>
                                                <span className="font-bold">{agent.name}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground/70 truncate w-full text-left">
                                                {agent.description}
                                            </span>
                                        </div>
                                        {selectedAgentId === agent.id && (
                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
