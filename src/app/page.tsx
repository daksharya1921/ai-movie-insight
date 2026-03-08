'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle, Film } from 'lucide-react';
import MovieSearch from '@/components/movie-search';
import MovieCard from '@/components/movie-card';
import AiInsights from '@/components/ai-insights';

/* ── Animated scan line dots ── */
function ScanDots() {
    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                        background: 'var(--gold-dim)',
                        animation: `pulse-gold 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [movieData, setMovieData] = useState<any | null>(null);

    const handleSearch = async (query: string) => {
        setLoading(true);
        setError(null);
        setMovieData(null);

        try {
            const res = await fetch(`/api/movie?query=${encodeURIComponent(query)}`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Archive retrieval failed');
            }
            const data = await res.json();
            setMovieData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)' }}>

            {/* ── Subtle grid background ── */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(201,144,58,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,144,58,0.025) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
                }}
            />

            {/* ── Radial hero glow ── */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(201,144,58,0.06) 0%, transparent 70%)',
                }}
            />

            <div
                className="relative z-10"
                style={{ maxWidth: 1160, margin: '0 auto', padding: '5rem 1.5rem 6rem' }}
            >

                {/* ══════════════════  HEADER  ══════════════════ */}
                <header style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <div
                            className="w-8 h-px"
                            style={{ background: 'linear-gradient(90deg, transparent, var(--gold-lo))' }}
                        />
                        <Sparkles className="w-3 h-3" style={{ color: 'var(--gold-text)' }} />
                        <span
                            className="text-[10px] uppercase tracking-[0.4em]"
                            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-text)' }}
                        >
                            Archival Intelligence
                        </span>
                        <Sparkles className="w-3 h-3" style={{ color: 'var(--gold-text)' }} />
                        <div
                            className="w-8 h-px"
                            style={{ background: 'linear-gradient(90deg, var(--gold-lo), transparent)' }}
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                            fontWeight: 900,
                            lineHeight: 1.05,
                            color: 'var(--cream)',
                            marginBottom: '1.25rem',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Movie Insight{' '}
                        <em style={{ color: 'var(--gold-text)', fontStyle: 'italic' }}>Builder</em>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '1.2rem',
                            color: 'var(--cream-30)',
                            maxWidth: 520,
                            margin: '0 auto 3rem',
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                        }}
                    >
                        Deep-parsing audience sentiment and cinematic metadata through the lens of modern AI.
                    </motion.p>

                    {/* Search bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ maxWidth: 560, margin: '0 auto' }}
                    >
                        <MovieSearch onSearch={handleSearch} isLoading={loading} />
                    </motion.div>
                </header>

                {/* ══════════════════  CONTENT  ══════════════════ */}
                <div style={{ minHeight: 380 }}>
                    <AnimatePresence mode="wait">

                        {/* Loading */}
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center gap-6"
                                style={{ paddingTop: '6rem' }}
                            >
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 flex items-center justify-center"
                                        style={{ border: '1px solid var(--border-hi)' }}
                                    >
                                        <Film className="w-6 h-6" style={{ color: 'var(--gold-dim)' }} />
                                    </div>
                                    <div
                                        className="absolute -inset-2 border border-dashed opacity-30"
                                        style={{ borderColor: 'var(--gold-lo)', animation: 'spin 8s linear infinite' }}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <ScanDots />
                                    <span
                                        className="text-[10px] uppercase tracking-[0.4em]"
                                        style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-dim)' }}
                                    >
                                        Analyzing Archives…
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* Error */}
                        {error && !loading && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="panel"
                                style={{
                                    maxWidth: 460,
                                    margin: '4rem auto',
                                    padding: '2.5rem',
                                    textAlign: 'center',
                                    borderColor: 'rgba(192,80,64,0.25)',
                                }}
                            >
                                <div
                                    className="w-12 h-12 flex items-center justify-center mx-auto mb-5"
                                    style={{ border: '1px solid rgba(192,80,64,0.3)', background: 'rgba(192,80,64,0.07)' }}
                                >
                                    <AlertCircle className="w-5 h-5" style={{ color: 'var(--red)' }} />
                                </div>
                                <p
                                    className="text-[9px] uppercase tracking-widest mb-2"
                                    style={{ fontFamily: "'Space Mono', monospace", color: 'var(--red)' }}
                                >
                                    Retrieval Failed
                                </p>
                                <p
                                    className="italic"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--cream-60)' }}
                                >
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        {/* Results */}
                        {movieData && !loading && !error && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-6"
                            >
                                {/* Movie card – full width */}
                                <MovieCard data={movieData} />

                                {/* AI Insights – can span full width */}
                                <AiInsights
                                    sentiment={movieData.aiInsights || {
                                        classification: 'Mixed',
                                        summary: 'Insights are currently unavailable for this title.',
                                    }}
                                />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* ══════════════════  FOOTER  ══════════════════ */}
                <footer style={{ marginTop: '8rem', textAlign: 'center' }}>
                    <div className="h-px" style={{ background: 'var(--border)', marginBottom: '2rem' }} />
                    <div className="flex items-center justify-center gap-3">
                        <Sparkles className="w-3 h-3" style={{ color: 'var(--gold-dim)', opacity: 0.5 }} />
                        <span
                            className="text-[9px] uppercase tracking-[0.4em] opacity-30"
                            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--cream)' }}
                        >
                            © 2026 Movie Insight Builder · Hugging Face AI
                        </span>
                        <Sparkles className="w-3 h-3" style={{ color: 'var(--gold-dim)', opacity: 0.5 }} />
                    </div>
                </footer>
            </div>
        </main>
    );
}
