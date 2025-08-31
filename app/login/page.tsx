'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  document.body.classList.add('hero-bg');
  return () => document.body.classList.remove('hero-bg');
}, []);
  
  // If already logged in, send to /diary
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (data.user) router.replace('/diary');
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const redirectTo =
      typeof window !== 'undefined' ? `${window.location.origin}/diary` : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="card">
      <h2 className="mb-2 text-lg font-medium">Login</h2>
      <p className="mb-4 text-sm text-neutral-600">
        Use your email to receive a one-time login link.
      </p>

      {sent ? (
        <div className="rounded-xl border bg-neutral-50 p-4 text-sm">
          Check your inbox for the magic link.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit">
            Send link
          </button>
        </form>
      )}

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
