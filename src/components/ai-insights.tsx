'use client';

import { Sparkles, TrendingUp, MinusCircle, AlertTriangle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SentimentData {
    classification: string;
    summary: string;
}

export default function AiInsights({ sentiment }: { sentiment: SentimentData }) {
    const isPositive = sentiment.classification.toLowerCase() === 'positive';
    const isMixed = sentiment.classification.toLowerCase() === 'mixed';
    const isNegative = sentiment.classification.toLowerCase() === 'negative';

    // Determine styling based on sentiment classification
    let themeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    let glowColor = 'from-blue-500/0 via-blue-500/10 to-transparent';
    let Icon = Sparkles;

    if (isPositive) {
        themeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        glowColor = 'from-emerald-500/0 via-emerald-500/15 to-transparent';
        Icon = TrendingUp;
    } else if (isMixed) {
        themeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        glowColor = 'from-yellow-500/0 via-yellow-500/15 to-transparent';
        Icon = MinusCircle;
    } else if (isNegative) {
        themeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
        glowColor = 'from-red-500/0 via-red-500/15 to-transparent';
        Icon = AlertTriangle;
    }

    return (
        <div className="relative glass-card rounded-3xl p-8 overflow-hidden h-full flex flex-col justify-center border border-zinc-800/60 shadow-2xl">

            {/* Dynamic Background Glow based on sentiment */}
            <div className={twMerge("absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t pointer-events-none", glowColor)}></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 border-b border-zinc-800/80 pb-6">
                    <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800/50 shadow-inner">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">AI Analysis</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">Audience Sentiment</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Classification Badge */}
                    <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3">Overall Verdict</div>
                        <div className={twMerge("inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm tracking-wide shadow-lg", themeColor)}>
                            <Icon className="w-5 h-5" />
                            {sentiment.classification.toUpperCase()}
                        </div>
                    </div>

                    {/* AI Summary Text */}
                    <div className="pt-2">
                        <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3 lg:mt-6">Summary Insights</div>
                        <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/60 shadow-inner">
                            <p className="text-zinc-300 leading-relaxed italic text-lg decoration-zinc-800/50">
                                "{sentiment.summary}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
