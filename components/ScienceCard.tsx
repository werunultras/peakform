'use client';
import type { Finding } from '@/lib/science';

export default function ScienceCard({ f }: { f: Finding }) {
  return (
    <article className="rounded-xl bg-white/70 backdrop-blur border border-white/20 p-4 h-full flex flex-col">
      <h3 className="font-semibold text-neutral-900">{f.title}</h3>
      <p className="text-sm text-neutral-700 mt-2">{f.summary}</p>

      {(f.sourceTitle || f.sourceLink || f.date) && (
        <div className="mt-3 text-xs text-neutral-600">
          {f.sourceTitle ? f.sourceTitle : null}
          {f.sourceLink ? (
            <>
              {' '}
              — <a className="underline text-[#fc4c02]" href={f.sourceLink} target="_blank" rel="noreferrer">link</a>
            </>
          ) : null}
          {f.date ? <div className="mt-1">{new Date(f.date).toLocaleDateString()}</div> : null}
        </div>
      )}

      {f.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {f.tags.map(tag => (
            <span key={tag} className="rounded-full bg-orange-50 text-[11px] text-[#fc4c02] px-2 py-0.5 border border-orange-100">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}