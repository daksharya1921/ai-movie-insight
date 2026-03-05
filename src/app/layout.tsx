import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Movie Insight Builder | AI Analysis',
    description: 'Deep audience sentiment analysis powered by Gemini AI.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                {children}
            </body>
        </html>
    );
}
