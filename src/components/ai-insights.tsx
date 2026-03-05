'use client';

import { Sparkles, TrendingUp, MinusCircle, AlertTriangle, Fingerprint, Activity } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SentimentData {
    classification: string;
    summary: string;
}

export default function AiInsights({ sentiment }: { sentiment: SentimentData }) {
    const isPositive = sentiment.classification.toLowerCase() === 'positive';
    const isMixed = sentiment.classification.toLowerCase() === 'mixed';
    const isNegative = sentiment.classification.toLowerCase() === 'negative';

    let statusText = "Neutral Outcome";
    let accentColor = "text-[var(--gold-muted)]";
    let borderColor = "border-[var(--gold-muted)]/20";
    let Icon = Fingerprint;

    if (isPositive) {
        statusText = "Optimistic Reception";
        accentColor = "text-emerald-400";
        borderColor = "border-emerald-400/20";
        Icon = TrendingUp;
    } else if (isMixed) {
        statusText = "Ambivalent Signals";
        accentColor = "text-[var(--gold-bright)]";
        borderColor = "border-[var(--gold-bright)]/20";
        Icon = Activity;
    } else if (isNegative) {
        statusText = "Critical Resistance";
        accentColor = "text-red-400";
        borderColor = "border-red-400/20";
        Icon = AlertTriangle;
    }

    return (
        <div className="relative bg-zinc-950/40 border border-[var(--gold-muted)]/20 p-6 md:p-8 flex flex-col justify-between h-full group">
            {/* Top Bar Detail */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold-muted)]/20 to-transparent" />

            <div className="relative z-10 space-y-8">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold-muted)] font-mono block mb-1">Intelligence Report</span>
                        <h3 className="text-2xl font-serif text-[var(--cream-main)] italic">Audience Synthesis</h3>
                    </div>
                    <div className="w-10 h-10 border border-[var(--gold-muted)]/20 flex items-center justify-center bg-zinc-900/50">
                        <Sparkles className="w-4 h-4 text-[var(--gold-muted)]" />
                    </div>
                </div>

                {/* Verdict Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--gold-bright)] animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest text-[var(--gold-muted)] font-mono">Archive Classification</span>
                    </div>

                    <div className={twMerge(
                        "inline-flex items-center gap-4 px-6 py-3 border bg-black/40 backdrop-blur-sm",
                        borderColor
                    )}>
                        <Icon className={twMerge("w-5 h-5", accentColor)} />
                        <div>
                            <span className={twMerge("block text-sm font-bold uppercase tracking-[0.2em] leading-none mb-1", accentColor)}>
                                {sentiment.classification}
                            </span>
                            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-mono">
                                {statusText}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Narrative Summary */}
                <div className="space-y-4">
                    <div className="h-px w-full bg-gradient-to-r from-[var(--gold-muted)]/20 to-transparent" />
                    <p className="text-[var(--cream-main)]/80 italic text-xl leading-relaxed font-serif relative">
                        <span className="text-4xl absolute -top-4 -left-2 opacity-10 font-serif text-[var(--gold-bright)]">"</span>
                        {sentiment.summary}
                        <span className="text-4xl absolute -bottom-10 opacity-10 font-serif text-[var(--gold-bright)]">"</span>
                    </p>
                </div>
            </div>

            {/* Bottom Utility Detail */}
            <div className="mt-12 flex items-center justify-between pt-6 border-t border-[var(--gold-muted)]/10">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-[var(--gold-muted)] rounded-full" />
                    <span className="text-[8px] uppercase tracking-[0.5em] text-[var(--gold-muted)] font-mono">Secure Node / AI-G 1.5</span>
                </div>
                <div className="text-[8px] uppercase tracking-[0.3em] text-[var(--gold-muted)] font-mono opacity-30">
                    ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </div>
        </div>
    );
}
