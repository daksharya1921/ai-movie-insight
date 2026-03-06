'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Activity, AlertTriangle, Fingerprint, Zap } from 'lucide-react';

interface SentimentData {
    classification: string;
    summary: string;
}

const classMap: Record<string, {
    label: string;
    icon: React.ElementType;
    color: string;
    glow: string;
    bg: string;
    border: string;
}> = {
    positive: {
        label: 'Optimistic Reception',
        icon: TrendingUp,
        color: 'var(--green)',
        glow: 'rgba(76,175,130,0.12)',
        bg: 'rgba(76,175,130,0.07)',
        border: 'rgba(76,175,130,0.25)',
    },
    mixed: {
        label: 'Ambivalent Signals',
        icon: Activity,
        color: 'var(--gold-hi)',
        glow: 'rgba(232,180,90,0.12)',
        bg: 'rgba(232,180,90,0.07)',
        border: 'rgba(232,180,90,0.25)',
    },
    negative: {
        label: 'Critical Resistance',
        icon: AlertTriangle,
        color: 'var(--red)',
        glow: 'rgba(192,80,64,0.12)',
        bg: 'rgba(192,80,64,0.07)',
        border: 'rgba(192,80,64,0.25)',
    },
    neutral: {
        label: 'Neutral Outcome',
        icon: Fingerprint,
        color: 'var(--gold-text)',
        glow: 'rgba(212,160,74,0.12)',
        bg: 'rgba(212,160,74,0.07)',
        border: 'rgba(212,160,74,0.25)',
    },
};

export default function AiInsights({ sentiment }: { sentiment: SentimentData }) {
    const key = sentiment.classification.toLowerCase() as keyof typeof classMap;
    const cfg = classMap[key] ?? classMap.neutral;
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="panel relative flex flex-col h-full overflow-hidden"
        >
            {/* Top accent line */}
            <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}50, transparent)` }}
            />

            {/* Ambient glow in the verdict color */}
            <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
                style={{ background: cfg.glow }}
            />

            <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6 h-full">

                {/* ── Header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <span className="lbl mb-1">Intelligence Report</span>
                        <h3
                            className="text-2xl italic leading-snug"
                            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)' }}
                        >
                            Audience Synthesis
                        </h3>
                    </div>
                    <div
                        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                        style={{ border: '1px solid var(--border-hi)', background: 'var(--cream-06)' }}
                    >
                        <Sparkles className="w-4 h-4" style={{ color: 'var(--gold-text)' }} />
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px" style={{ background: 'var(--border)' }} />

                {/* ── Verdict Badge ── */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
                        />
                        <span className="lbl" style={{ color: 'var(--gold-dim)' }}>Archive Classification</span>
                    </div>

                    <div
                        className="inline-flex items-center gap-3 px-5 py-3"
                        style={{
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                        }}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                        <div>
                            <span
                                className="block text-sm font-bold uppercase tracking-widest leading-none mb-0.5"
                                style={{ color: cfg.color, fontFamily: "'Space Mono', monospace" }}
                            >
                                {sentiment.classification}
                            </span>
                            <span
                                className="block text-[9px] uppercase tracking-widest"
                                style={{ color: 'var(--cream-30)', fontFamily: "'Space Mono', monospace" }}
                            >
                                {cfg.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px" style={{ background: 'var(--border)' }} />

                {/* ── Summary ── */}
                <div className="flex-1 space-y-3">
                    <span className="lbl">Narrative Analysis</span>
                    <div
                        className="relative p-5"
                        style={{
                            background: 'var(--cream-06)',
                            borderLeft: `2px solid ${cfg.border}`,
                        }}
                    >
                        {/* Decorative quote */}
                        <span
                            className="absolute -top-3 left-4 text-5xl leading-none select-none pointer-events-none"
                            style={{ color: cfg.color, opacity: 0.15, fontFamily: "'Playfair Display', serif" }}
                        >
                            "
                        </span>
                        <p
                            className="italic leading-relaxed relative z-10"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.05rem',
                                color: 'var(--cream-60)',
                            }}
                        >
                            {sentiment.summary}
                        </p>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid var(--border)' }}
                >
                    <div className="flex items-center gap-2">
                        <Zap className="w-2.5 h-2.5" style={{ color: 'var(--gold-dim)' }} />
                        <span
                            className="text-[8px] uppercase tracking-widest"
                            style={{ color: 'var(--cream-30)', fontFamily: "'Space Mono', monospace" }}
                        >
                            Gemini AI · IMDb Clusters
                        </span>
                    </div>
                    <span
                        className="text-[8px] uppercase tracking-widest opacity-30"
                        style={{ color: 'var(--cream-30)', fontFamily: "'Space Mono', monospace" }}
                    >
                        ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export type { SentimentData };
