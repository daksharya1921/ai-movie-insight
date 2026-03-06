'use client';

import { motion } from 'framer-motion';
import { Film, Play, Globe, Star, Clock, Award, Users } from 'lucide-react';

interface MovieData {
    title: string;
    year: string;
    rated: string;
    runtime: string;
    genre: string;
    director: string;
    actors: string;
    plot: string;
    poster: string | null;
    imdbRating: string;
    imdbVotes: string;
    country: string;
    awards: string;
    language: string;
    boxOffice: string;
    trailerUrl: string;
}

function StatCell({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-2">
            <span
                className="block text-[9px] uppercase tracking-widest"
                style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-dim)' }}
            >
                {label}
            </span>
            <span
                className="block text-sm italic"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--cream)', fontWeight: 500 }}
            >
                {value || '—'}
            </span>
        </div>
    );
}

export default function MovieCard({ data }: { data: MovieData }) {
    const genreList = data.genre ? data.genre.split(', ') : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="panel relative overflow-hidden"
        >
            {/* Top accent */}
            <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(201,144,58,0.4), transparent)' }}
            />

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none" style={{ borderTop: '1px solid var(--border-hi)', borderLeft: '1px solid var(--border-hi)' }} />
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none" style={{ borderTop: '1px solid var(--border-hi)', borderRight: '1px solid var(--border-hi)' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none" style={{ borderBottom: '1px solid var(--border-hi)', borderLeft: '1px solid var(--border-hi)' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none" style={{ borderBottom: '1px solid var(--border-hi)', borderRight: '1px solid var(--border-hi)' }} />

            {/* Subtle background accent */}
            <div
                className="absolute top-0 right-0 w-96 h-96 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top right, rgba(201,144,58,0.04) 0%, transparent 60%)' }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row gap-8 md:gap-10 p-6 md:p-10">

                {/* ── Poster ── */}
                <div className="shrink-0 w-full lg:w-[260px]">
                    <div className="relative aspect-[2/3] group/poster">
                        {/* Glow behind poster */}
                        <div
                            className="absolute -inset-3 blur-2xl opacity-0 group-hover/poster:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{ background: 'rgba(201,144,58,0.08)' }}
                        />
                        <div
                            className="relative w-full h-full overflow-hidden"
                            style={{ border: '1px solid var(--border-hi)' }}
                        >
                            {data.poster && data.poster !== 'N/A' ? (
                                <img
                                    src={data.poster}
                                    alt={data.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover/poster:scale-105"
                                    style={{ filter: 'grayscale(0.25) contrast(1.05)' }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0) contrast(1.08)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0.25) contrast(1.05)'; }}
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                                    style={{ background: 'var(--surface)' }}
                                >
                                    <Film className="w-10 h-10 opacity-20" style={{ color: 'var(--gold-lo)' }} />
                                    <span
                                        className="text-[9px] uppercase tracking-[0.2em] opacity-30"
                                        style={{ fontFamily: "'Space Mono', monospace", color: 'var(--cream)' }}
                                    >
                                        Missing Poster
                                    </span>
                                </div>
                            )}

                            {/* Rating badge on poster */}
                            <div
                                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md"
                                style={{
                                    background: 'rgba(7,7,16,0.85)',
                                    border: '1px solid rgba(201,144,58,0.3)',
                                }}
                            >
                                <Star className="w-3 h-3 fill-current" style={{ color: 'var(--gold-hi)' }} />
                                <span
                                    className="text-xs font-bold"
                                    style={{ color: 'var(--gold-hi)', fontFamily: "'Space Mono', monospace" }}
                                >
                                    {data.imdbRating}
                                </span>
                                <span
                                    className="text-[9px]"
                                    style={{ color: 'var(--cream-30)', fontFamily: "'Space Mono', monospace" }}
                                >
                                    / 10
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Info ── */}
                <div className="flex-1 flex flex-col gap-7 min-w-0">

                    {/* Title row */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,144,58,0.3), transparent)' }} />
                            <span
                                className="text-[9px] uppercase tracking-[0.4em] flex-shrink-0"
                                style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-dim)' }}
                            >
                                {data.year}
                            </span>
                        </div>

                        <h2
                            className="leading-none italic mb-4"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                color: 'var(--cream)',
                                fontWeight: 700,
                            }}
                        >
                            {data.title}
                        </h2>

                        {/* Genre tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {genreList.map((g) => (
                                <span key={g} className="tag tag-muted">{g}</span>
                            ))}
                            {data.rated && data.rated !== 'N/A' && (
                                <span className="tag tag-gold">{data.rated}</span>
                            )}
                        </div>

                        <p
                            className="text-xs uppercase tracking-widest"
                            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-muted)' }}
                        >
                            Dir. {data.director}
                        </p>
                    </div>

                    {/* Stats ribbon */}
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5"
                        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
                    >
                        <StatCell label="Runtime" value={data.runtime} />
                        <StatCell label="IMDb Votes" value={data.imdbVotes !== 'N/A' ? Number(data.imdbVotes?.replace(/,/g, '')).toLocaleString() : '—'} />
                        <StatCell label="Country" value={data.country} />
                        <StatCell label="Box Office" value={data.boxOffice !== 'N/A' ? data.boxOffice : 'Classified'} />
                    </div>

                    {/* Synopsis */}
                    <div className="space-y-2">
                        <span
                            className="text-[9px] uppercase tracking-[0.3em]"
                            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-text)' }}
                        >
                            Narrative Synopsis
                        </span>
                        <p
                            className="italic leading-relaxed"
                            style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.1rem',
                                color: 'var(--cream-60)',
                            }}
                        >
                            {data.plot}
                        </p>
                    </div>

                    {/* Cast */}
                    {data.actors && (
                        <div
                            className="p-4"
                            style={{
                                background: 'var(--cream-06)',
                                borderLeft: '2px solid var(--border-hi)',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-3 h-3" style={{ color: 'var(--gold-dim)' }} />
                                <span
                                    className="text-[9px] uppercase tracking-widest"
                                    style={{ fontFamily: "'Space Mono', monospace", color: 'var(--gold-dim)' }}
                                >
                                    Key Performers
                                </span>
                            </div>
                            <p
                                className="italic text-sm leading-relaxed"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--cream-60)' }}
                            >
                                {data.actors}
                            </p>
                        </div>
                    )}

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                        {data.trailerUrl && (
                            <a
                                href={data.trailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-5 py-2.5 transition-all duration-300"
                                style={{
                                    border: '1px solid rgba(201,144,58,0.3)',
                                    background: 'rgba(201,144,58,0.07)',
                                    color: 'var(--gold-hi)',
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.65rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontWeight: 700,
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,144,58,0.14)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,144,58,0.07)'; }}
                            >
                                <Play className="w-3 h-3 fill-current" />
                                Watch Trailer
                            </a>
                        )}

                        {data.awards && data.awards !== 'N/A' && (
                            <div className="flex items-center gap-2" style={{ color: 'var(--cream-30)' }}>
                                <Award className="w-3.5 h-3.5" />
                                <span
                                    className="text-[10px] italic"
                                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem' }}
                                >
                                    {data.awards}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export type { MovieData };
