'use client';

import { useState } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';

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
        const trimmed = query.trim();
        if (!trimmed) {
            setError('Enter a title or IMDb ID');
            return;
        }
        onSearch(trimmed);
    };

    return (
        <div className="w-full relative">
            <form onSubmit={handleSubmit} className="relative group flex items-center w-full">
                {/* Ambient glow */}
                <div
                    className="pointer-events-none absolute -inset-1 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(201,144,58,0.08) 0%, transparent 70%)' }}
                />

                {/* Main bar */}
                <div
                    className="relative flex items-center w-full overflow-hidden"
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border-hi)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(240,230,208,0.04)',
                    }}
                >
                    {/* Left icon */}
                    <div className="pl-5 pr-3 flex-shrink-0">
                        <Search
                            className="w-4 h-4 transition-colors duration-300"
                            style={{ color: isLoading ? 'var(--gold-hi)' : 'var(--gold-muted)' }}
                        />
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isLoading}
                        placeholder="Search by title or IMDb ID…"
                        className="search-input flex-1 py-4 text-base disabled:opacity-60"
                        style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem' }}
                    />

                    {/* Divider */}
                    <div className="w-px h-8 flex-shrink-0" style={{ background: 'var(--border-hi)' }} />

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2.5 px-6 py-4 font-bold text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        style={{
                            fontFamily: "'Space Mono', monospace",
                            color: 'var(--gold-text)',
                            background: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) (e.currentTarget as HTMLElement).style.background = 'rgba(201,144,58,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Analyzing</span>
                            </>
                        ) : (
                            <>
                                <span>Analyze</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && (
                <p
                    className="absolute left-0 mt-2 text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'var(--red)', top: '100%' }}
                >
                    ↳ {error}
                </p>
            )}
        </div>
    );
}
