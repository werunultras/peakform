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
    id: 'altini-crf-wearables-2016',
    title: 'Wearable heart-rate data predict fitness without lab tests',
    summary: 'In 51 adults, submaximal HR during daily activities detected by wearables predicted VO₂max with ~21% lower error than anthropometrics alone (lab + free-living, cross-validated).',
    sourceTitle: 'Altini et al., J Appl Physiol (2016)',
    sourceLink: 'https://doi.org/10.1152/japplphysiol.00519.2015',
    date: '2016-03-03',
    tags: ['wearables','cardiorespiratory']
  },
  // add more items here…
];