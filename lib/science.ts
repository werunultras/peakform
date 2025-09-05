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
  {
    id: 'coyle-endurance-cyclists-1988',
    title: 'Determinants of endurance in well-trained cyclists',
    summary: 'This seminal study demonstrates that VO₂max, lactate threshold, and efficiency together predict endurance cycling performance in trained athletes, and quantifies their relative contributions.',
    sourceTitle: 'Coyle et al., J Appl Physiol (1988)',
    sourceLink: 'https://doi.org/10.1152/jappl.1988.64.6.2622',
    date: '1988-05-31',
    tags: ['cycling','physiology']
  },
  {
    id: 'joyner-coyle-champions-2007',
    title: 'Endurance exercise performance: the physiology of champions',
    summary: 'A comprehensive review synthesizing how VO₂max, lactate threshold, and efficiency interact to determine elite endurance performance, including discussion on genetic and psychological factors.',
    sourceTitle: 'Joyner & Coyle, J Appl Physiol (2007)',
    sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2375555/',
    date: '2007-12-31',
    tags: ['performance','physiology']
  },
  {
    id: 'midgley-vo2max-intervals-2006',
    title: 'Time at or near VO2max during continuous and intermittent running',
    summary: 'Demonstrates that interval training enables athletes to spend more time at maximal oxygen uptake, increasing aerobic power more than continuous running.',
    sourceTitle: 'Midgley & McNaughton, Sports Med (2006)',
    sourceLink: 'https://pubmed.ncbi.nlm.nih.gov/16869708/',
    date: '2006-07-01',
    tags: ['intervals','aerobic']
  },
  {
    id: 'seiler-tid-elite-athletes-2023',
    title: 'The proportional distribution of training by elite endurance athletes',
    summary: 'Presents real-world data showing elite athletes favor polarized intensity distribution in their training, which optimally improves performance across competition phases.',
    sourceTitle: 'Seiler et al., Sports Med (2023)',
    sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10641476/',
    date: '2023-10-26',
    tags: ['polarized-training','athlete-development']
  },
  {
    id: 'stoggl-sperlich-polarized-meta-2024',
    title: 'Comparison of Polarized Versus Other Types of Endurance Training Intensity Distribution',
    summary: 'A systematic review and meta-analysis revealing that polarized training produces greater endurance improvements than threshold or pyramidal models.',
    sourceTitle: 'Stöggl & Sperlich, J Sports Sci (2024)',
    sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11329428/',
    date: '2024-05-07',
    tags: ['polarized-training','training-distribution']
  },
  {
    id: 'burke-lowcarb-impair-economy-2017',
    title: 'Low carbohydrate high fat diet impairs exercise economy and negates performance benefits in elite endurance athletes',
    summary: 'Study overturns common keto paradigms, showing elite athletes lose exercise economy and performance benefits on LCHF diets compared to high-carb strategies.',
    sourceTitle: 'Burke et al., Med Sci Sports Exerc (2017)',
    sourceLink: 'https://journals.lww.com/acsm-msse/fulltext/2017/05000/low_carbohydrate,_high_fat_diet_impairs_exercise.7.aspx',
    date: '2017-05-01',
    tags: ['nutrition','performance']
  },
  {
    id: 'noakes-central-governor-2012',
    title: 'Fatigue is a Brain-Derived Emotion: Central Governor Model',
    summary: 'Theoretically unifies endurance limitation to the brain, suggesting "central governor" regulates exercise tolerance beyond just physiological limits.',
    sourceTitle: 'Noakes, Br J Sports Med (2012)',
    sourceLink: 'https://bjsm.bmj.com/content/46/1/1',
    date: '2012-01-01',
    tags: ['psychology','brain']
  },
  {
    id: 'hickson-detraining-1982',
    title: 'Time course of loss of adaptations after stopping endurance training',
    summary: 'Classic investigation into how quickly endurance adaptations are lost post-training cessation, emphasizing the need for sustained training.',
    sourceTitle: 'Hickson et al., J Appl Physiol (1982)',
    sourceLink: 'https://pubmed.ncbi.nlm.nih.gov/7075641/',
    date: '1982-03-01',
    tags: ['detraining','adaptation']
  },
  {
    id: 'aagaard-skeletal-muscle-endurance-2021',
    title: 'Under the Hood: Skeletal Muscle Determinants of Endurance Performance',
    summary: 'Synthesizes how muscle fiber oxidative capacity, size, and oxygen supply directly shape whole-body endurance, augmenting previous conceptual frameworks.',
    sourceTitle: 'Aagaard et al., Front Sports Act Living (2021)',
    sourceLink: 'https://www.frontiersin.org/articles/10.3389/fspor.2021.719434/pdf',
    date: '2021-08-03',
    tags: ['skeletal-muscle','performance']
  },
  {
    id: 'knechtle-long-term-development-2023',
    title: 'Long-Term Development of Training Characteristics and Performance-Determining Factors in Elite/International and World-Class Endurance Athletes',
    summary: 'A scoping review highlighting most elite athletes increase low-intensity volume over years, with VO₂max changes inconsistent but steady improvement in maximal test performance.',
    sourceTitle: 'Knechtle & Nikolaidis, Sports Med Open (2023)',
    sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10356634/',
    date: '2023-05-12',
    tags: ['long-term','elite-athlete']
  },
  {
    id: 'jones-physiological-resilience-2025',
    title: 'Physiological Resilience: What Is It and How Might It Be Trained?',
    summary: 'Introduces the concept of physiological resilience in endurance, showing how resilience to fatigue via strength/plyometric training could impact long-term success.',
    sourceTitle: 'Jones, Scand J Med Sci Sports (2025)',
    sourceLink: 'https://onlinelibrary.wiley.com/doi/10.1111/sms.70032',
    date: '2025-02-28',
    tags: ['resilience','training']
  },
  // add more items here…
];