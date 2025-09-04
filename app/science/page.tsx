'use client';

import { useState } from 'react';
import HeroBg from '@/components/HeroBg';
import ScienceCard from '@/components/ScienceCard';
import { findings } from '@/lib/science';

const PAGE_SIZE = 9; // 3 x 3 grid initially

export default function SciencePage() {
  // newest first by date (fallback to original order if missing date)
  const sorted = [...findings].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const [visible, setVisible] = useState(PAGE_SIZE);

  const show = sorted.slice(0, visible);
  const canLoadMore = visible < sorted.length;

  return (
    <HeroBg>
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {show.map(item => (
              <ScienceCard key={item.id} f={item} />
            ))}
          </div>

          {canLoadMore && (
            <div className="flex justify-center">
              <button
                className="btn bg-white text-black border-white hover:bg-white/90"
                onClick={() => setVisible(v => v + PAGE_SIZE)}
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </HeroBg>
  );
}