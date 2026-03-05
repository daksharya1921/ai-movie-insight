'use client';

import { motion } from 'framer-motion';
import { Star, Calendar, Users, Film, Clock, Presentation, Globe, Award, Play } from 'lucide-react';

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

export default function MovieCard({ data }: { data: MovieData }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-zinc-950/40 border border-[var(--gold-muted)]/20 p-6 md:p-8 overflow-hidden group"
        >
            {/* Corner Decorative Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--gold-muted)]/40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--gold-muted)]/40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--gold-muted)]/40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--gold-muted)]/40 pointer-events-none" />

            {/* Film Strip Side Detail (Decorative) */}
            <div className="absolute right-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--gold-muted)]/10 to-transparent hidden md:block" />

            <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                {/* Poster Box */}
                <div className="relative shrink-0 w-full lg:w-[320px] aspect-[2/3] group/poster">
                    <div className="absolute -inset-2 bg-[var(--gold-bright)]/5 blur-xl group-hover/poster:bg-[var(--gold-bright)]/10 transition-colors" />

                    <div className="relative w-full h-full border border-[var(--gold-muted)]/30 overflow-hidden shadow-2xl">
                        {data.poster ? (
                            <img
                                src={data.poster}
                                alt={data.title}
                                className="w-full h-full object-cover grayscale-[0.3] group-hover/poster:grayscale-0 group-hover/poster:scale-105 transition-all duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900">
                                <Film className="w-12 h-12 text-[var(--gold-muted)] opacity-30 mb-2" />
                                <span className="text-[var(--gold-muted)]/50 text-[10px] uppercase tracking-[0.2em]">Missing Archive</span>
                            </div>
                        )}

                        {/* Film Number Badge */}
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-[var(--gold-muted)]/30 px-3 py-1 text-[10px] uppercase tracking-widest font-mono text-[var(--gold-bright)]">
                            REF: {data.imdbRating}
                        </div>
                    </div>
                </div>

                {/* Information Section */}
                <div className="flex-1 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-[var(--gold-muted)]/30 to-transparent" />
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold-muted)] font-mono">Documented: {data.year}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-[var(--cream-main)] leading-none italic mb-4">
                            {data.title}
                        </h2>
                        <p className="text-[var(--gold-muted)]/80 font-mono text-xs uppercase tracking-widest">
                            Directed by {data.director}
                        </p>
                    </div>

                    {/* Stats Ribbon */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[var(--gold-muted)]/10">
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-muted)]/50">Classification</span>
                            <span className="text-[var(--cream-main)] text-sm font-medium italic">{data.rated || 'N/A'}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-muted)]/50">Duration</span>
                            <span className="text-[var(--cream-main)] text-sm font-medium italic">{data.runtime}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-muted)]/50">Genre</span>
                            <span className="text-[var(--cream-main)] text-sm font-medium italic">{data.genre}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[10px] uppercase tracking-widest text-[var(--gold-muted)]/50">Revenue</span>
                            <span className="text-[var(--cream-main)] text-sm font-medium italic">{data.boxOffice !== 'N/A' ? data.boxOffice : 'Classified'}</span>
                        </div>
                    </div>

                    {/* Narrative Plot */}
                    <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-[var(--gold-bright)] font-mono">Narrative Synopsis</h3>
                        <p className="text-[var(--cream-main)]/80 text-lg leading-relaxed font-serif italic">
                            {data.plot}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-6 pt-6">
                        <a
                            href={data.trailerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-3 bg-[var(--gold-muted)]/10 hover:bg-[var(--gold-muted)]/20 border border-[var(--gold-muted)]/30 px-6 py-3 transition-all"
                        >
                            <Play className="w-4 h-4 text-[var(--gold-bright)] fill-[var(--gold-bright)]" />
                            <span className="text-[var(--gold-bright)] uppercase tracking-widest text-xs font-bold">Watch Trailer</span>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </a>

                        <div className="flex items-center gap-3 text-[var(--gold-muted)]/60">
                            <Globe className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-widest">{data.language} / {data.country}</span>
                        </div>
                    </div>

                    {/* Cast Mini-list */}
                    <div className="bg-zinc-900/40 p-5 border-l-2 border-[var(--gold-muted)]/20">
                        <span className="text-[10px] uppercase tracking-widest text-[var(--gold-muted)]/40 block mb-3 font-mono">Key Performers</span>
                        <div className="text-[var(--cream-main)]/70 text-sm leading-loose italic">
                            {data.actors}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Archival Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-8xl font-serif text-white">"</span>
            </div>
        </motion.div>
    );
}
