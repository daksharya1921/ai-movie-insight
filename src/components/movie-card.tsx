'use client';

import { motion } from 'framer-motion';
import { Star, Calendar, Users, Film } from 'lucide-react';
import Image from 'next/image';

interface MovieData {
    title: string;
    poster: string | null;
    cast: string;
    year: string;
    rating: string;
    plot: string;
}

export default function MovieCard({ data }: { data: MovieData }) {
    return (
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-zinc-800/50 flex flex-col md:flex-row h-full group">

            {/* Poster Image Section */}
            <div className="relative w-full md:w-[300px] aspect-[2/3] shrink-0 bg-zinc-900 overflow-hidden">
                {data.poster ? (
                    <img
                        src={data.poster}
                        alt={`${data.title} Poster`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900/50">
                        <Film className="w-16 h-16 mb-4 opacity-50" />
                        <span className="text-sm font-medium uppercase tracking-widest">No Poster</span>
                    </div>
                )}

                {/* Gradient Overlay for image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#09090b]"></div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 flex flex-col flex-1 relative z-10 -mt-12 md:mt-0">

                {/* Title & Meta Info */}
                <div className="mb-6">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                        {data.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full border border-yellow-500/20">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span>{data.rating} / 10</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-zinc-800/50 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700/50">
                            <Calendar className="w-4 h-4" />
                            <span>{data.year}</span>
                        </div>
                    </div>
                </div>

                {/* Plot */}
                <div className="mb-8 flex-1">
                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-semibold">Synopsis</h3>
                    <p className="text-zinc-300 leading-relaxed text-lg">
                        {data.plot}
                    </p>
                </div>

                {/* Cast */}
                <div className="pt-6 border-t border-zinc-800/50">
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 mb-3 font-semibold">
                        <Users className="w-4 h-4" /> Leading Cast
                    </h3>
                    <p className="text-zinc-200">
                        {data.cast}
                    </p>
                </div>

            </div>
        </div>
    );
}
