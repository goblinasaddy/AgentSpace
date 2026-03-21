/**
 * @fileOverview Component for rendering structured agent outputs.
 */
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Lightbulb, Target, Sparkles, Code, AlertCircle, CheckCircle, Copy, Check, BookOpen, BarChart, Globe, Zap, ListChecks, ShieldAlert, ShieldCheck, Gavel, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OutputDisplayProps {
    output: any;
}

export function OutputDisplay({ output }: OutputDisplayProps) {
    const [copied, setCopied] = useState(false);

    if (!output) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({ title: "Copied!", description: "Content copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    if (typeof output === 'string') {
        return (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap leading-relaxed opacity-90">
                {output}
            </div>
        );
    }

    // Helper to get matching icon for keys
    const getIconForKey = (key: string) => {
        const k = key.toLowerCase();
        if (k.includes('score')) return <Target className="h-4 w-4 text-primary" />;
        if (k.includes('strength')) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        if (k.includes('weakness') || k.includes('error')) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        if (k.includes('suggestion') || k.includes('improvement')) return <Lightbulb className="h-4 w-4 text-primary" />;
        if (k.includes('insight') || k.includes('ai') || k.includes('explanation')) return <Sparkles className="h-4 w-4 text-purple-400" />;
        if (k.includes('code')) return <Code className="h-4 w-4 text-blue-400" />;
        if (k.includes('post')) return <Sparkles className="h-4 w-4 text-orange-400" />;
        if (k.includes('hook')) return <Target className="h-4 w-4 text-red-400" />;
        if (k.includes('hashtag')) return <span className="text-primary font-bold">#</span>;

        // Research Agent specific icons
        if (k.includes('overview') || k.includes('summary')) return <Search className="h-4 w-4 text-blue-400" />;
        if (k.includes('keyinsights')) return <Zap className="h-4 w-4 text-yellow-400" />;
        if (k.includes('detailedanalysis')) return <BarChart className="h-4 w-4 text-green-400" />;
        if (k.includes('realworldapplications')) return <Globe className="h-4 w-4 text-indigo-400" />;
        if (k.includes('futuretrends')) return <Sparkles className="h-4 w-4 text-purple-400" />;
        if (k.includes('conclusion')) return <ListChecks className="h-4 w-4 text-pink-400" />;

        // Legal icons
        if (k.includes('risklevel')) return <Gavel className="h-4 w-4 text-primary" />;
        if (k.includes('riskyclauses')) return <ShieldAlert className="h-4 w-4 text-yellow-500" />;

        return null;
    };

    const isHighRisk = output.riskLevel === 'High';
    const isMedRisk = output.riskLevel === 'Medium';
    const riskColor = isHighRisk ? 'text-destructive' : isMedRisk ? 'text-yellow-500' : 'text-green-500';
    const riskBg = isHighRisk ? 'bg-destructive/10' : isMedRisk ? 'bg-yellow-500/10' : 'bg-green-500/10';
    const riskBorder = isHighRisk ? 'border-destructive/30' : isMedRisk ? 'border-yellow-500/30' : 'border-green-500/30';

    return (
        <div className="space-y-6">
            {/* Special highlight for Error Count or Risk Level */}
            {'errorCount' in output && (
                <div className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${output.errorCount > 0
                        ? 'bg-destructive/10 border-destructive/30 text-destructive'
                        : 'bg-green-500/10 border-green-500/30 text-green-500'
                    }`}>
                    {output.errorCount > 0 ? (
                        <AlertCircle className="h-5 w-5" />
                    ) : (
                        <CheckCircle className="h-5 w-5" />
                    )}
                    <span className="font-bold">Errors Detected: {output.errorCount}</span>
                </div>
            )}

            {output.riskLevel && (
                <div className={`flex flex-col gap-3 p-4 rounded-xl border ${riskBg} ${riskBorder}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isHighRisk ? <ShieldAlert className={`h-5 w-5 ${riskColor}`} /> : <ShieldCheck className={`h-5 w-5 ${riskColor}`} />}
                            <span className={`font-bold uppercase tracking-wider ${riskColor}`}>Risk Assessment: {output.riskLevel}</span>
                        </div>
                        {isHighRisk && <Badge variant="destructive" className="animate-pulse">Action Required</Badge>}
                    </div>
                    {isHighRisk && (
                        <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                            <AlertCircle className="h-3.5 w-3.5" />
                            High Risk Clause Detected - Legal counsel recommended.
                        </div>
                    )}
                </div>
            )}

            {Object.entries(output).map(([key, value]) => {
                // Skip metadata keys used for specialized UI components above
                if (key === 'errorCount' || key === 'riskLevel') return null;

                const isCode = key.toLowerCase().includes('code');
                const isPost = key.toLowerCase() === 'post';
                const isDetailed = key.toLowerCase().includes('analysis') || key.toLowerCase() === 'overview' || key.toLowerCase() === 'explanation' || key.toLowerCase() === 'summary';

                return (
                    <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                {getIconForKey(key)}
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            {isPost && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-2 text-xs"
                                    onClick={() => handleCopy(String(value))}
                                >
                                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copied ? "Copied" : "Copy Post"}
                                </Button>
                            )}
                        </div>

                        <div className={`rounded-lg p-4 border border-muted-foreground/10 ${key.toLowerCase().includes('score') ? 'bg-primary/5' :
                                isCode ? 'bg-black/40 border-primary/20 shadow-inner' :
                                    isPost ? 'bg-card border-primary/10 shadow-lg' :
                                        isDetailed ? 'bg-card/50 border-muted/50' : 'bg-muted/20'
                            }`}>
                            {Array.isArray(value) ? (
                                <ul className="space-y-2">
                                    {value.map((item, i) => (
                                        <li key={i} className="text-sm flex items-start gap-3">
                                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${isHighRisk && key === 'riskyClauses' ? 'bg-destructive' : 'bg-primary'}`} />
                                            <span className="leading-relaxed text-foreground/90">{String(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : typeof value === 'number' ? (
                                <div className="flex items-baseline gap-2">
                                    <div className="text-5xl font-headline font-bold text-primary">
                                        {value}
                                    </div>
                                    <div className="text-xl text-muted-foreground">/ 100</div>
                                </div>
                            ) : isCode ? (
                                <pre className="overflow-x-auto text-xs font-code leading-relaxed text-blue-300">
                                    <code>{String(value)}</code>
                                </pre>
                            ) : (
                                <div className={`text-sm leading-relaxed whitespace-pre-wrap text-foreground/80 prose prose-invert prose-sm max-w-none ${key.toLowerCase() === 'verdict' || isPost || key.toLowerCase() === 'summary' ? 'font-medium text-foreground' : ''
                                    } ${isPost ? 'text-base' : ''}`}>
                                    {key.toLowerCase() === 'detailedanalysis' ? (
                                        // Simple replacement for basic markdown-like subheadings in the string
                                        <div dangerouslySetInnerHTML={{
                                            __html: String(value)
                                                .replace(/### (.*)/g, '<h5 class="text-primary font-bold mt-4 mb-2">$1</h5>')
                                                .replace(/\n/g, '<br/>')
                                        }} />
                                    ) : (
                                        String(value)
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
