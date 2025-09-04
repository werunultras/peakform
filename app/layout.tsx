import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import HeaderAuth from '@/components/HeaderAuth';

export const metadata: Metadata = {
  title: 'PeakForm',
  description: 'High-performance training diary',
};

export const metadata: Metadata = {
  title: 'PeakForm',
  description: 'High-performance training diary',
  icons: {
    icon: '/public/favicon.ico', // or /favicon.png if you keep it as PNG
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-5xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              <Link href="/">PeakForm</Link>
            </h1>
            <nav className="flex items-center gap-3 text-sm">
              <Link className="btn" href="/science">Science</Link>
              <Link className="btn" href="/diary">Diary</Link>
              {/* Swaps Login ↔ Logout dynamically */}
              <HeaderAuth />
            </nav>
          </header>
          {children}
          <footer className="mt-8 text-xs text-white text-center space-y-1">
            <div>Built on Next.js + Supabase. Sign in to use PeakForm.</div>
            <div>Photo by Matteo Catanese on Unsplash</div>
            <div>
              <Link href="/privacy" className="underline hover:text-gray-300">
                Privacy Policy
              </Link>
            </div>
            <div>
              <Link href="/terms" className="underline hover:text-gray-300">
                Terms of Service
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
