"use client";

import { useState } from 'react';
import { Sparkles, Globe, Lock, Plus, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateAgentConfiguration } from '@/ai/flows/generate-agent-configuration-flow';
import { toast } from '@/hooks/use-toast';
import { useAgents } from '@/context/agents-context';
import { Agent } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function CreateAgentPage() {
    const router = useRouter();
    const { addAgent } = useAgents();
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState('');
    const [repoName, setRepoName] = useState('');
    const [visibility, setVisibility] = useState('public');

    async function handleAutoGenerate() {
        if (!description) {
            toast({ title: "Error", description: "Please describe your agent first.", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateAgentConfiguration({ description });
            setPromptTemplate(result.promptTemplate);

            const nameMatch = result.agentConfig.match(/name: (.*)/);
            if (nameMatch) setRepoName(nameMatch[1].toLowerCase().replace(/\s+/g, '-'));

            toast({ title: "Success", description: "Agent configuration generated successfully!" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to generate configuration.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleCreate() {
        if (!repoName.trim()) {
            toast({
                title: "Repository Name Required",
                description: "Please provide a name for your agent repository.",
                variant: "destructive"
            });
            return;
        }

        setIsCreating(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newAgent: Agent = {
                id: repoName + '-' + Math.random().toString(36).substring(7),
                name: repoName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                owner: 'addy', // Hardcoded current user
                description: description || `AI Agent for ${repoName}`,
                tags: ['Custom', 'New'],
                type: 'input-output',
                rating: 0,
                runs: '0',
                stars: 0,
                forks: 0,
                issuesCount: 0,
                pullRequestsCount: 0,
                category: 'General',
                updatedAt: 'Just now',
                readme: `# ${repoName}\n\n${description || "No description provided."}`,
                promptTemplate: promptTemplate,
                configYaml: `name: ${repoName}\ntype: interactive`,
                metadataJson: `{"version": "1.0.0"}`,
                usageCode: `// Example usage\nconst response = await agent.run({ input: "your data" });`,
            };

            addAgent(newAgent);

            toast({
                title: "Repository Created!",
                description: `Successfully created ${newAgent.name}.`,
            });

            router.push(`/agent/${newAgent.id}`);
        } catch (error) {
            toast({
                title: "Creation Failed",
                description: "An error occurred while creating your repository.",
                variant: "destructive"
            });
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-headline font-bold">Create a New Agent</h1>
                <p className="text-muted-foreground">A repository contains all your agent code, prompt templates, and configuration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="owner">Owner</Label>
                                <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">AS</div>
                                    addy
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="repo-name">Repository name</Label>
                                <Input
                                    id="repo-name"
                                    placeholder="my-awesome-agent"
                                    value={repoName}
                                    onChange={(e) => setRepoName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <Input
                                id="description"
                                placeholder="Briefly describe what your agent does..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <Label>Visibility</Label>
                            <RadioGroup value={visibility} onValueChange={setVisibility} className="grid gap-4">
                                <div
                                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${visibility === 'public' ? 'bg-primary/5 border-primary/40' : 'hover:bg-muted/30'}`}
                                    onClick={() => setVisibility('public')}
                                >
                                    <RadioGroupItem value="public" id="public" className="mt-1" />
                                    <Label htmlFor="public" className="flex-1 cursor-pointer">
                                        <div className="flex items-center gap-2 font-bold mb-1">
                                            <Globe className="h-4 w-4" />
                                            Public
                                        </div>
                                        <p className="text-xs font-normal text-muted-foreground">Anyone on the internet can see this agent. You choose who can commit.</p>
                                    </Label>
                                </div>
                                <div
                                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${visibility === 'private' ? 'bg-primary/5 border-primary/40' : 'hover:bg-muted/30'}`}
                                    onClick={() => setVisibility('private')}
                                >
                                    <RadioGroupItem value="private" id="private" className="mt-1" />
                                    <Label htmlFor="private" className="flex-1 cursor-pointer">
                                        <div className="flex items-center gap-2 font-bold mb-1">
                                            <Lock className="h-4 w-4" />
                                            Private
                                        </div>
                                        <p className="text-xs font-normal text-muted-foreground">You choose who can see and commit to this agent.</p>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4 pt-4">
                            <Label htmlFor="prompt">Prompt Template</Label>
                            <Textarea
                                id="prompt"
                                placeholder="The master instructions for your agent..."
                                className="min-h-[200px] font-code"
                                value={promptTemplate}
                                onChange={(e) => setPromptTemplate(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground italic">Tip: Use {"{{variable}}"} syntax for dynamic inputs.</p>
                        </div>

                        <div className="pt-6">
                            <Button
                                size="lg"
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-8 gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Initializing...
                                    </>
                                ) : (
                                    "Create Repository"
                                )}
                            </Button>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Auto Repo Builder
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Describe what you want, and let AI build your agent's scaffolding.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai-desc" className="text-xs">Agent Purpose</Label>
                                <Textarea
                                    id="ai-desc"
                                    placeholder="e.g. An agent that critiques creative writing and suggests structural changes."
                                    className="bg-background text-xs min-h-[100px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleAutoGenerate}
                                className="w-full bg-primary hover:bg-primary/90 text-xs gap-2"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        Generate Configuration
                                        <Sparkles className="h-3 w-3" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-muted">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-500" />
                                Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs text-muted-foreground">
                            <div className="flex gap-2">
                                <Plus className="h-3 w-3 shrink-0 mt-0.5" />
                                <p>Include clear tags for better discoverability.</p>
                            </div>
                            <div className="flex gap-2">
                                <Plus className="h-3 w-3 shrink-0 mt-0.5" />
                                <p>Write a comprehensive README with usage examples.</p>
                            </div>
                            <div className="flex gap-2">
                                <Plus className="h-3 w-3 shrink-0 mt-0.5" />
                                <p>Test your prompt template in Battle Mode before publishing.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
