'use client';
import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string| null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } });
    if (error) setError(error.message); else setSent(true);
  }

  return (
    <div className="card">
      <h2 className="mb-2 text-lg font-medium">Login</h2>
      <p className="mb-4 text-sm text-neutral-600">Use your email to receive a one‑time login link. Free and passwordless.</p>
      {sent ? (
        <div className="rounded-xl border bg-neutral-50 p-4 text-sm">Check your inbox for the magic link.</div>
      ) : (
        <form onSubmit={onSubmit} className="flex gap-2">
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e)=> setEmail(e.target.value)} required />
          <button className="btn btn-primary" type="submit">Send link</button>
        </form>
      )}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
