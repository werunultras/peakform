import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'PeakForm', description: 'High-performance training diary', icons: {icon: '/favicon.svg'}, };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-5xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">PeakForm</h1>
            <nav className="flex items-center gap-3 text-sm">
              <Link className="btn" href="/">Diary</Link>
              <Link className="btn" href="/login">Login</Link>
            </nav>
          </header>
          {children}
          <footer className="mt-8 text-xs text-neutral-500">Built on Next.js + Supabase. Sign in to use PeakForm.</footer>
        </div>
      </body>
    </html>
  );
}
