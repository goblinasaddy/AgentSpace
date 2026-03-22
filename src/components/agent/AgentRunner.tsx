/**
 * @fileOverview Orchestrates the agent execution flow including input, API keys, and output.
 */
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Play, Terminal, Sparkles, Loader2, FileUp, FileText, X } from 'lucide-react';
import { ApiKeyInput } from './ApiKeyInput';
import { OutputDisplay } from './OutputDisplay';
import { runAgent } from '@/lib/core/runAgent';
import { toast } from '@/hooks/use-toast';
import { agentRegistry } from '@/lib/agents/agentRegistry';

interface AgentRunnerProps {
    agentId: string;
}

export function AgentRunner({ agentId }: AgentRunnerProps) {
    const [input, setInput] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [output, setOutput] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const agent = agentRegistry[agentId];
    const isFileInput = agent?.inputType === 'file';

    const handleRun = async () => {
        if (!isFileInput && !input.trim()) {
            toast({ title: "Input Required", description: "Please provide input for the agent.", variant: "destructive" });
            return;
        }

        if (isFileInput && !file && !input.trim()) {
            toast({ title: "File Required", description: "Please upload a resume or provide text content.", variant: "destructive" });
            return;
        }

        setIsProcessing(true);
        setOutput(null);

        try {
            // For demo purposes, we pass the file name if it's a file, otherwise the text
            const executionInput = file ? `[FILE: ${file.name}] ${input}` : input;
            const result = await runAgent(agentId, executionInput, apiKey);
            setOutput(result);
        } catch (error: any) {
            toast({ title: "Execution Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
            <Card className="flex flex-col border-muted">
                <CardHeader className="border-b py-3 px-6 bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        Execution Console
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 space-y-6">
                    {isFileInput ? (
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload Resume (PDF)</Label>
                            {!file ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                >
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <FileUp className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PDF format only (Max 5MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setFile(null)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Additional Context (Optional)</Label>
                                <Textarea
                                    placeholder="Paste specific job requirements or notes..."
                                    className="min-h-[100px] resize-none bg-muted/10 border-muted focus-visible:ring-primary/30"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Input Data</Label>
                            <Textarea
                                placeholder="Enter text to process..."
                                className="min-h-[200px] resize-none bg-muted/10 border-muted focus-visible:ring-primary/30"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                    )}
                    <ApiKeyInput value={apiKey} onChange={setApiKey} />
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-end">
                    <Button onClick={handleRun} disabled={isProcessing} className="gap-2 bg-primary hover:bg-primary/90">
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Play className="h-3.5 w-3.5" />
                                Run Agent
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col border-muted bg-muted/5 overflow-hidden">
                <CardHeader className="border-b py-3 px-6 bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Result Output
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-6 overflow-y-auto">
                    {output ? (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <OutputDisplay output={output} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground/40 py-12">
                            <Terminal className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-sm">Agent output will appear here after execution</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Helper to avoid build error since Label is used
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={`text-sm font-medium leading-none ${className}`}>{children}</label>;
}
