'use client';
import { useEffect } from 'react';

export default function HeroBg({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('hero-bg');
    return () => {
      document.body.classList.remove('hero-bg');
    };
  }, []);

  return <>{children}</>;
}