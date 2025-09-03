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

    // initial session check
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });

    // keep header in sync with future logins/logouts
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
    // optional: clean up body classes used in diary/home
    document.body.classList.remove('hero-bg');
    document.body.classList.remove('app-bg');
    router.push('/'); // back to homepage
  }

  // If not logged in → show Login link; otherwise show Logout
  if (!email) {
    return <Link className="btn" href="/login">Login</Link>;
  }
  return (
    <button className="btn" onClick={handleLogout}>
      Logout
    </button>
  );
}