// lib/science.ts
export type Finding = {
  id: string;
  title: string;        // short headline
  summary: string;      // 1–2 line finding
  sourceTitle?: string; // paper title/journal (optional if already in title)
  sourceLink?: string;  // DOI / publisher URL
  date?: string;        // ISO or "Sep 2025"
  tags?: string[];      // e.g. ['endurance','nutrition']
};

export const findings: Finding[] = [
  {
    id: 'caffeine-sprints-2024',
    title: 'Caffeine improves repeated sprint power',
    summary: '3 mg·kg⁻¹ caffeine increased mean repeated-sprint power by ~3–4% in trained cyclists (dbl-blind crossover).',
    sourceTitle: 'Smith et al., Med Sci Sports Exerc (2024)',
    sourceLink: 'https://doi.org/10.xxxx/xxxxx',
    date: '2025-09-01',
    tags: ['endurance','nutrition','ergogenic']
  },
  {
    id: 'sleep-extension-2023',
    title: 'Short sleep impairs endurance performance',
    summary: '≤6 h/night for several days reduced time to exhaustion; partial recovery after 2–3 nights ≥8 h (sleep extension).',
    sourceTitle: 'Jones et al., Eur J Appl Physiol (2023)',
    sourceLink: 'https://doi.org/10.yyyy/yyyyy',
    date: '2025-08-15',
    tags: ['sleep','recovery']
  },
  // add more items here…
];