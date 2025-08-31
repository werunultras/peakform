'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

useEffect(() => {
  document.body.classList.add('hero-bg');
  return () => document.body.classList.remove('hero-bg');
}, []);

export default function Home() {
  const router = useRouter();

  // If already authenticated, go straight to the diary
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (data.user) router.replace('/diary');
    });
    return () => { mounted = false; };
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/background.jpg')", // your canoe image in /public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen bg-black/45">

        <main className="flex-1 flex items-center">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">One log. Total clarity.</h1>
            <p className="mt-4 text-white/90 text-lg md:text-xl">
              PeakForm unites training, nutrition, and mindset in a single daily check-in.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/login" className="btn bg-white text-black border-white hover:bg-white/90 px-5 py-3 rounded-xl">
                Get Started
              </Link>
              <Link href="/login" className="btn text-white border-white hover:bg-white/10 px-5 py-3 rounded-xl">
                See example entry
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 text-left">
                <div className="text-white/80 text-sm mb-2">Body</div>
                <div className="text-white font-medium">Run + Strength</div>
                <div className="text-white/80 text-sm mt-1">Distance, HR, pace, rounds</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 text-left">
                <div className="text-white/80 text-sm mb-2">Fuel</div>
                <div className="text-white font-medium">Calories + Macros</div>
                <div className="text-white/80 text-sm mt-1">Target vs actual, at a glance</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 text-left">
                <div className="text-white/80 text-sm mb-2">Mind</div>
                <div className="text-white font-medium">Mood + Stress + Sleep</div>
                <div className="text-white/80 text-sm mt-1">Stay consistent with one prompt</div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mx-auto max-w-6xl px-6 py-6 text-white/70 text-sm">
          Built on Next.js + Supabase
        </footer>
      </div>
    </div>
  );
}
