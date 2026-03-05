'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MovieSearchProps {
    onSearch: (id: string) => void;
    isLoading: boolean;
}

export default function MovieSearch({ onSearch, isLoading }: MovieSearchProps) {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setError('Enter a title or IMDb ID');
            return;
        }

        onSearch(trimmedQuery);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="relative group flex items-center w-full">
                {/* Animated Glow Border Frame */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--gold-muted)] to-[var(--gold-bright)] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

                <div className="relative flex items-center w-full bg-[#09090b]/80 backdrop-blur-md rounded-full border border-zinc-800 focus-within:border-[var(--gold-bright)]/30 transition-colors p-1.5 shadow-2xl overflow-hidden">
                    <div className="pl-4 pr-3 text-zinc-500">
                        <Search className="w-5 h-5 text-[var(--gold-muted)]" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isLoading}
                        placeholder="Search by Title or IMDb ID (e.g., The Matrix or tt0133093)"
                        className="flex-1 bg-transparent border-none outline-none text-[var(--cream-main)] placeholder-zinc-700 text-lg py-3 px-1"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={twMerge(
                            "ml-2 flex items-center justify-center gap-2 bg-[var(--gold-bright)] text-zinc-950 rounded-full px-8 py-3.5 font-bold transition-all duration-300 hover:bg-[var(--cream-main)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                            "shadow-[0_0_20px_rgba(238,228,206,0.15)] uppercase tracking-widest text-xs"
                        )}
                    >
                        {isLoading ? 'Decrypting' : 'Analyze'}
                        {isLoading ? (
                            <div className="flex gap-1 ml-2">
                                <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-1 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        ) : (
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        )}
                    </button>
                </div>
            </form>

            {/* Error Message Space (absolute to not shift layout) */}
            <div className="absolute left-6 -bottom-6 text-sm text-red-400 font-medium">
                {error}
            </div>
        </div>
    );
}
