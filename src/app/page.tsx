'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import MovieSearch from '@/components/movie-search';
import MovieCard from '@/components/movie-card';
import AiInsights from '@/components/ai-insights';

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
        <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header Section */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lbl"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
                    >
                        <Sparkles style={{ width: 10, height: 10 }} />
                        Archival Intelligence
                    </motion.div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 900,
                        lineHeight: 1,
                        color: 'var(--cream)',
                        marginBottom: '1rem'
                    }}>
                        Movie Insight Builder
                    </h1>
                    <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.25rem',
                        color: 'var(--cream-dim)',
                        maxWidth: 600,
                        margin: '0 auto 3rem',
                        fontStyle: 'italic'
                    }}>
                        Deep-parsing audience sentiment and cinematic metadata through the lens of modern AI.
                    </p>

                    {/* Search Bar Container */}
                    <div style={{ maxWidth: 500, margin: '0 auto' }}>
                        <MovieSearch onSearch={handleSearch} isLoading={loading} />
                    </div>
                </header>

                {/* Content Area */}
                <div style={{ position: 'relative', minHeight: 400 }}>
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem', color: 'var(--gold-dim)' }}
                            >
                                <Loader2 style={{ width: 32, height: 32, animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
                                <span className="lbl">Analyzing Archives…</span>
                            </motion.div>
                        )}

                        {error && !loading && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    maxWidth: 400, margin: '4rem auto',
                                    padding: '2rem', border: '1px solid rgba(192,52,28,0.2)',
                                    background: 'rgba(192,52,28,0.05)', textAlign: 'center'
                                }}
                            >
                                <AlertCircle style={{ width: 24, height: 24, color: '#c0341c', margin: '0 auto 1rem' }} />
                                <p className="lbl" style={{ color: '#c0341c', marginBottom: '0.5rem' }}>Fetch Failed</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--cream-dim)' }}>{error}</p>
                            </motion.div>
                        )}

                        {movieData && !loading && !error && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                    gap: '2rem',
                                    alignItems: 'start'
                                }}
                            >
                                <div style={{ gridColumn: 'span 2' }}>
                                    <MovieCard data={movieData} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <AiInsights sentiment={movieData.aiInsights || { classification: 'Mixed', summary: 'Insights currently unavailable.' }} />

                                    {/* Additional decorative panel */}
                                    <span className="text-[10px] uppercase tracking-[0.4em] font-mono mb-2 block">Archive System v4.0</span>
                                    <h1 className="text-5xl md:text-8xl font-serif text-[var(--cream-main)] italic leading-none mb-6">
                                        The Cinema <br /> <span className="text-[var(--gold-bright)]">Archive</span>
                                    </h1>
                                    <p className="text-[var(--gold-muted)]/60 max-w-xl text-xs md:text-sm uppercase tracking-[0.2em] leading-relaxed mb-10 font-mono">
                                        Uncover deep audience sentiments, cinematic details, and AI-curated insights from the global film database.
                                    </p></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <footer style={{ marginTop: '8rem', textAlign: 'center', opacity: 0.3 }}>
                    <div className="rule" style={{ marginBottom: '2rem' }} />
                    <span className="lbl">© 2026 Movie Insight Builder</span>
                </footer>

            </div>
        </main>
    );
}
