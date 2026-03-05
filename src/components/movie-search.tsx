'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MovieSearchProps {
    onSearch: (id: string) => void;
    isLoading: boolean;
}

export default function MovieSearch({ onSearch, isLoading }: MovieSearchProps) {
    const [imdbId, setImdbId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmedId = imdbId.trim();
        if (!trimmedId) {
            setError('Please enter an IMDb ID');
            return;
        }

        if (!/^tt\d{7,8}$/.test(trimmedId)) {
            setError('Invalid format. Must be like "tt0133093"');
            return;
        }

        onSearch(trimmedId);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="relative group flex items-center w-full">
                {/* Animated Glow Border Frame */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                <div className="relative flex items-center w-full bg-[#09090b]/80 backdrop-blur-md rounded-full border border-zinc-800 focus-within:border-blue-500/50 transition-colors p-1.5 shadow-2xl overflow-hidden">
                    <div className="pl-4 pr-3 text-zinc-500">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={imdbId}
                        onChange={(e) => setImdbId(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g., tt0133093 (The Matrix)"
                        className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-600 text-lg py-3 px-1"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={twMerge(
                            "ml-2 flex items-center justify-center gap-2 bg-zinc-100 text-zinc-900 rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                            "shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        )}
                    >
                        {isLoading ? 'Analyzing' : 'Search'}
                        {isLoading ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce ml-1 flex gap-1">
                                <span className="w-1 h-1 bg-zinc-900 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
                                <span className="w-1 h-1 bg-zinc-900 rounded-full animate-ping" style={{ animationDelay: '150ms' }} />
                                <span className="w-1 h-1 bg-zinc-900 rounded-full animate-ping" style={{ animationDelay: '300ms' }} />
                            </span>
                        ) : (
                            <ArrowRight className="w-4 h-4 ml-1" />
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
