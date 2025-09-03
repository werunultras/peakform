'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function HeaderAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    // Initial session check
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });
    // Keep header in sync with future logins/logouts
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    // Optional: clean any body classes used by pages
    document.body.classList.remove('hero-bg');
    document.body.classList.remove('app-bg');
    router.push('/');
  }

  if (!email) {
    return <Link className="btn" href="/login">Login</Link>;
  }
  return (
    <button className="btn" onClick={handleLogout}>Logout</button>
  );
}
