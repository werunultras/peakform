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
  {
  id: 'harris-creatine-loading-1992',
  title: 'Elevation of creatine in human muscle via oral creatine supplementation',
  summary: 'This landmark study established that oral creatine supplementation rapidly increases muscle creatine and phosphocreatine, laying the foundation for creatine’s ergogenic applications in sport.',
  sourceTitle: 'Harris et al., Clin Sci (1992)',
  sourceLink: 'https://doi.org/10.1042/cs0830367',
  date: '1992-07-01',
  tags: ['ergogenic','muscle']
  },
  {
  id: 'kreider-issn-position-2017',
  title: 'International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine',
  summary: 'The ISSN’s position stand synthesizes decades of research, confirming creatine’s efficacy, safety, and broad benefits for athletic performance and recovery.',
  sourceTitle: 'Kreider et al., J Int Soc Sports Nutr (2017)',
  sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5469049/',
  date: '2017-06-12',
  tags: ['safety','performance']
  },
  {
  id: 'persky-brazeau-creatine-2001',
  title: 'Clinical pharmacology of creatine supplementation',
  summary: 'This review critically analyzed creatine’s pharmacokinetics, tissue distribution, and proposed mechanisms, providing foundational context for dosing and supplementation strategies.',
  sourceTitle: 'Persky & Brazeau, Sports Med (2001)',
  sourceLink: 'https://pubmed.ncbi.nlm.nih.gov/11219499/',
  date: '2001-02-01',
  tags: ['pharmacology','mechanisms']
  },
  {
  id: 'tarnopolsky-neurology-creatine-2000',
  title: 'Creatine monohydrate enhances physical performance in muscular dystrophy patients',
  summary: 'Creatine supplementation improved strength and functional capacity in patients with neuromuscular disease, suggesting clinical value beyond sport.',
  sourceTitle: 'Tarnopolsky et al., Neurology (2000)',
  sourceLink: 'https://pubmed.ncbi.nlm.nih.gov/10680805/',
  date: '2000-02-01',
  tags: ['clinical','strength']
  },
  {
  id: 'rawson-volek-creatine-2003',
  title: 'Effects of creatine supplementation and resistance training on muscle strength and hypertrophy',
  summary: 'This meta-analysis provided strong evidence that creatine, combined with training, significantly enhances muscle mass and strength compared to placebo.',
  sourceTitle: 'Rawson & Volek, Med Sci Sports Exerc (2003)',
  sourceLink: 'https://pubmed.ncbi.nlm.nih.gov/12594046/',
  date: '2003-02-01',
  tags: ['strength','hypertrophy']
  },
  {
  id: 'rae-cognition-creatine-2003',
  title: 'Oral creatine monohydrate supplementation improves brain performance: a double–blind, placebo–controlled, cross–over trial',
  summary: 'This trial showed creatine supplementation improves cognitive function and working memory, pioneering research on non-muscular effects.',
  sourceTitle: 'Rae et al., Proc R Soc Lond B Biol Sci (2003)',
  sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1691485/',
  date: '2003-10-21',
  tags: ['cognition','brain']
  },
  {
  id: 'candow-creatine-strength-metaanalysis-2024',
  title: 'Effects of Creatine Supplementation and Resistance Training on Muscle Strength Gains in Adults <50 Years of Age: A Systematic Review and Meta-Analysis',
  summary: 'Meta-analysis demonstrated significant strength gains in adults <50 years supplementing with creatine during resistance training, with high-dose regimens yielding maximal increases.',
  sourceTitle: 'Candow et al., Nutrients (2024)',
  sourceLink: 'https://www.mdpi.com/2072-6643/16/21/3665',
  date: '2024-10-27',
  tags: ['strength','training']
  },
  {
  id: 'kreider-forms-efficacy-safety-2003',
  title: 'Analysis of the efficacy, safety, and regulatory status of novel forms of creatine',
  summary: 'Comparative analysis confirmed creatine monohydrate as the most effective, safest, and best-studied form, supporting global regulatory approval and guiding supplement choice.',
  sourceTitle: 'Kreider et al., J Sports Sci Med (2003)',
  sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3080578/',
  date: '2011-03-21',
  tags: ['efficacy','regulation']
  },
  {
  id: 'sale-creatine-females-2024',
  title: 'Does Creatine Supplementation Enhance Performance in Active Females? A Systematic Review',
  summary: 'Systematic review showed limited but growing evidence for creatine’s performance benefits in active females, with call for improved study design and reporting.',
  sourceTitle: 'Sale et al., Nutrients (2024)',
  sourceLink: 'https://www.mdpi.com/2072-6643/17/2/238',
  date: '2024-12-31',
  tags: ['female','performance']
  },
  {
  id: 'smith-creatine-muscle-growth-2022',
  title: 'Creatine Supplementation for Muscle Growth: A Scoping Review of Randomized Clinical Trials from 2012 to 2021',
  summary: 'Scoping review of RCTs confirmed positive effects of creatine on muscle growth across diverse populations, with efficacy varying by age and baseline activity.',
  sourceTitle: 'Smith et al., Nutrients (2022)',
  sourceLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8949037/',
  date: '2022-02-28',
  tags: ['muscle-growth','RCT']
  },
  {
  id: 'schedel-creatine-mechanism-2023',
  title: 'Creatine as a Compound and Supplement: Metabolism, Mechanism of Action, Effects, and Adverse Effects - A Review',
  summary: 'Comprehensive review presents current knowledge of creatine’s mechanisms, ergogenic and medical uses, and highlights neuroprotective, metabolic, and radioprotective properties.',
  sourceTitle: 'Schedel et al., Nutrients (2023)',
  sourceLink: 'https://apcz.umk.pl/QS/article/view/60164',
  date: '2025-05-04',
  tags: ['mechanism','medical']
  },
  // add more items here…
];