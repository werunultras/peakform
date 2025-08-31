'use client';

import Link from 'next/link';
import { useEffect } from 'react';
// OPTIONAL: if you still want auto-redirect when already logged in, uncomment the next two lines
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  // Full-page background (canoe) for the home route
  useEffect(() => {
    document.body.classList.add('hero-bg');
    return () => document.body.classList.remove('hero-bg');
  }, []);

  // OPTIONAL: redirect signed-in users straight to /diary (safe, non-blocking)
  // const router = useRouter();
  // useEffect(() => {
  //   let mounted = true;
  //   supabase.auth.getUser().then(({ data }) => {
  //     if (!mounted) return;
  //     if (data.user) router.replace('/diary');
  //   }).catch(() => {});
  //   return () => { mounted = false; };
  // }, [router]);

  return (
    <main className="min-h-[80vh] flex items-center">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
          One log. Total clarity.
        </h1>
        <p className="mt-4 text-white/90 text-lg md:text-xl">
          PeakForm unites training, nutrition, and mindset in a single daily check-in.
        </p>

        <div className="mt-8 flex items-center justify-center">
        <Link
          href="/login"
          className="btn bg-white text-black border-white hover:bg-white/90 px-5 py-3 rounded-xl"
        >
          Get Started
        </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 text-left">
            <div className="text-white/80 text-sm mb-2">Body</div>
            <div className="text-white font-medium">Run + Strength</div>
            <div className="text-white/80 text-sm mt-1">Distance, HR, pace, routines</div>
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
  );
}
