'use client';
import { useEffect, useMemo, useState } from 'react';
import { ComposedChart, AreaChart, Area, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Legend } from 'recharts';
import { emptyEntry, defaultSettings, pushEntry, pushSettings, pullCloud, getUser } from '@/lib/storage';
import type { Entry, Settings } from '@/lib/types';

// ---------- UI helpers (top-level so they are in scope) ----------
function label(s: string) { return <div className="label">{s}</div>; }
function num(l: string, p: string, v: any, on: (p: string, v: any) => void) {
  return (
    <div>
      {label(l)}
      <input className="input" type="number" value={v || ''} onChange={(e) => on(p, e.target.value)} />
    </div>
  );
}
function text(l: string, p: string, v: any, on: (p: string, v: any) => void) {
  return (
    <div>
      {label(l)}
      <input className="input" value={v || ''} onChange={(e) => on(p, e.target.value)} />
    </div>
  );
}
function range(l: string, p: string, v: any, on: (p: string, v: any) => void) {
  return (
    <div className="select-none">
      {label(`${l} ${(v || '—') as string}/5`)}
      <input type="range" min={1} max={5} step={1} value={v || 3} onChange={(e) => on(p, e.target.value)} className="w-full range-orange" />
    </div>
  );
}
function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border p-3 bg-white flex flex-col min-h-[96px]">
      <div className="text-xs text-neutral-600">{label}</div>
      <div className="flex-1 flex items-center">
        <div className="text-xl font-semibold tabular-nums">{value}</div>
      </div>
      {sub && <div className="text-xs text-neutral-500">{sub}</div>}
    </div>
  );
}
function rpeColor(v: any) {
  const n = Number(v);
  if (n >= 9) return 'bg-red-500';
  if (n >= 7) return 'bg-yellow-500';
  return 'bg-blue-500'; // 1–6
}

function rangeRPE(label: string, path: string, value: any, on: (p: string, v: any) => void) {
  const cls = rpeColor(value);
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="label m-0">{label}</div>
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${cls}`} aria-hidden />
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value || 1}
        onChange={(e) => on(path, e.target.value)}
        className="w-full range-orange"
      />
    </div>
  );
}
function normHHMM(s: string) {
  if (!s) return '';
  const m = String(s).trim().match(/^(\d{1,2})(?::(\d{1,2}))?$/);
  if (!m) return s; // leave as typed if it doesn't match basic hh or hh:mm
  let hh = Math.max(0, Math.min(23, parseInt(m[1] ?? '0', 10)));
  let mm = Math.max(0, Math.min(59, parseInt(m[2] ?? '0', 10)));
  const HH = String(hh).padStart(2, '0');
  const MM = String(mm).padStart(2, '0');
  return `${HH}:${MM}`;
}

function hhmm(l: string, p: string, v: any, on: (p: string, v: any) => void) {
  return (
    <div>
      {label(l)}
      <input
        className="input"
        placeholder="hh:mm"
        value={v || ''}
        onChange={(e) => on(p, e.target.value)}
        onBlur={(e) => on(p, normHHMM(e.target.value))}
      />
    </div>
  );
}
// Convert hh:mm (string or number) to decimal hours
function hhmmToHours(v: any): number {
  if (v == null) return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2}):(\d{1,2})$/);
  if (m) {
    const hh = Math.max(0, Math.min(23, parseInt(m[1], 10)));
    const mm = Math.max(0, Math.min(59, parseInt(m[2], 10)));
    return hh + mm / 60;
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
// ---------- TXT Template Download Helper ----------
function buildTxtTemplate(dateISO: string) {
  return [
    '# PeakForm TXT Import Template',
    '# Lines starting with # are ignored',
    '',
    `DATE=${dateISO}`,
    '',
    '# Workout: Run',
    'DIST_KM=',
    'DURATION_MIN=',
    'PACE=',
    'HR_AVG=',
    'HR_MAX=',
    'CADENCE=',
    'STRIDE_M=',
    'ELEV_UP=',
    'ELEV_DOWN=',
    'KCAL_RUN=',
    'SWEAT_LOSS_L=',
    'RPE=',
    '',
    '# Workout: Strength',
    'STRENGTH_DESC=',
    'STRENGTH_ROUNDS=',
    'STRENGTH_WEIGHT_LBS=',
    'STRENGTH_KCAL=',
    '',
    '# Nutrition',
    'CALORIES=',
    'CARBS_G=',
    'PROTEIN_G=',
    'FAT_G=',
    'FIBRE_G=',
    'CALORIE_TARGET=',
    '',
    '# Recovery',
    'SLEEP_HRS=',
    'RHR=',
    'HRV=',
    '',
    '# Mindset',
    'MOOD=',
    'STRESS=',
    'SLEEP_QUALITY=',
    'NOTES=',
    '',
  ].join('\n');
}

function downloadTemplate() {
  const today = todayISO();
  const content = buildTxtTemplate(today);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `peakform-template-${today}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- utils ----------
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtNum = (v: number) => (Number.isFinite(v) ? new Intl.NumberFormat().format(v) : '—');
const toNum = (v: any) => { const n = Number(String(v ?? '').replace(/[^0-9.-]/g, '')); return Number.isFinite(n) ? n : 0; };
// Format YYYY-MM-DD -> MM/DD/YYYY
const formatMDY = (iso: string) => {
  if (!iso || iso.length < 10) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`; // MM/DD/YYYY
};
// Parse MM/DD/YY or MM/DD/YYYY -> YYYY-MM-DD (fallback to today if invalid)
const toISOFromMDY = (s: string) => {
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return todayISO();
  let [_, mm, dd, yy] = m;
  if (yy.length === 2) yy = `20${yy}`; // assume 20xx for 2-digit year
  const mmNum = Math.min(Math.max(parseInt(mm, 10), 1), 12);
  const ddNum = Math.min(Math.max(parseInt(dd, 10), 1), 31);
  const d = new Date(Number(yy), mmNum - 1, ddNum);
  const iso = d.toISOString().slice(0, 10);
  return iso;
};

export default function Page() {
  const [date, setDate] = useState<string>(todayISO());
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  document.body.classList.add('hero-bg');
  return () => document.body.classList.remove('hero-bg');
}, []);
  
  // Load user + cloud data
  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setUserEmail(user?.email ?? null);
        if (!user) return;
        const cloud = await pullCloud();
        if (cloud) { setEntries(cloud.entries); setSettings(cloud.settings); }
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const entry = useMemo<Entry>(() => entries[date] ?? emptyEntry(date), [entries, date]);

  function update(path: string, value: any) {
    setEntries(prev => {
      const cur = prev[date] ?? emptyEntry(date);
      const next: Entry = structuredClone(cur);
      const keys = path.split('.');
      let obj: any = next; for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys.at(-1)!] = value;
      const out = { ...prev, [date]: next };
      void pushEntry(date, next);
      return out;
    });
  }

  function saveSettings(patch: Partial<Settings>) {
    const next = { ...settings, ...patch } as Settings;
    setSettings(next);
    void pushSettings(next);
  }

  function handleClearDay() {
    if (!confirm("Clear today's data and reset calorie target to 0?")) return;
    const cleared: Entry = {
      date,
      workout: { run: {}, strength: {} },
      nutrition: {},
      mindset: { mood: '3', stress: '3', sleepQuality: '3', notes: '' },
    };
    cleared.nutrition.calorieTarget = '0';
    setEntries(prev => ({ ...prev, [date]: cleared }));
    void pushEntry(date, cleared);
  }

  const totals = useMemo(() => {
    const n = entry.nutrition;
    const cals = toNum(n.calories);
    // day-specific target; fall back to global only if not set on the day
    const dayTarget = toNum(n.calorieTarget) || (settings.calorieTarget ? Number(settings.calorieTarget) : 0);
    const deficit = dayTarget ? (dayTarget - cals) : 0;
    const balance = deficit === 0 ? 'balance' : (deficit > 0 ? 'deficit' : 'surplus');
    return {
      calories: cals,
      carbsG: toNum(n.carbsG),
      proteinG: toNum(n.proteinG),
      fatG: toNum(n.fatG),
      fibreG: toNum(n.fibreG),
      deficit,
      balance,
      dayTarget,
    };
  }, [entry, settings]);

  const streak = useMemo(() => {
    let days = 0; const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      const e = entries[key];
      const kcal = e ? toNum(e.nutrition?.calories) : 0;
      if (kcal > 0) { days += 1; d.setDate(d.getDate() - 1); }
      else break;
    }
    return days;
  }, [entries]);

  const chartData = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().slice(0, 10);
      const e = entries[key];
      const cal = e ? toNum(e.nutrition?.calories) : 0;
      const dist = e ? toNum(e.workout?.run?.distanceKm) : 0;
      return { date: key.slice(5), calories: cal, distance: dist };
    });
    return days;
  }, [entries]);

  const caloriesVsTargetData = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().slice(0, 10);
      const e = entries[key];
      const calories = e ? toNum(e.nutrition?.calories) : 0;
      const target = e ? toNum(e.nutrition?.calorieTarget) : 0;
      return { date: key.slice(5), calories, target };
    });
    return days;
  }, [entries]);

  // Rolling 7-day distance (km)
  const rolling7DistanceData = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      // sum distance for today and previous 6 days
      let sum = 0;
      for (let k = 0; k < 7; k++) {
        const dd = new Date(d);
        dd.setDate(dd.getDate() - k);
        const key = dd.toISOString().slice(0, 10);
        const e = entries[key];
        sum += e ? toNum(e.workout?.run?.distanceKm) : 0;
      }
      return { date: d.toISOString().slice(5, 10), rolling7: sum };
    });
    return days;
  }, [entries]);

  // Training load: rolling 7-day vs 28-day distance (last 28 days)
  const rolling7and28Data = useMemo(() => {
    const days = [...Array(28)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      const key = d.toISOString().slice(0, 10);
      // rolling 7
      let sum7 = 0;
      for (let k = 0; k < 7; k++) {
        const dd = new Date(d); dd.setDate(d.getDate() - k);
        const kk = dd.toISOString().slice(0, 10);
        const e = entries[kk];
        sum7 += e ? toNum(e.workout?.run?.distanceKm) : 0;
      }
      // rolling 28
      let sum28 = 0;
      for (let k = 0; k < 28; k++) {
        const dd = new Date(d); dd.setDate(d.getDate() - k);
        const kk = dd.toISOString().slice(0, 10);
        const e = entries[kk];
        sum28 += e ? toNum(e.workout?.run?.distanceKm) : 0;
      }
      return { date: key.slice(5), r7: sum7, r28: sum28 };
    });
    return days;
  }, [entries]);

  // Weekly distance totals and % change (last 8 weeks, Monday-anchored)
  const weeklyLoad = useMemo(() => {
    const today = new Date();
    const offsetToMonday = (today.getDay() + 6) % 7; // 0 if Monday
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - offsetToMonday);

    const weeks: { label: string; km: number; pct?: number; risk?: boolean }[] = [];
    for (let w = 7; w >= 0; w--) {
      const start = new Date(mondayThisWeek);
      start.setDate(mondayThisWeek.getDate() - 7 * w);
      const end = new Date(start); end.setDate(start.getDate() + 6);
      let km = 0;
      for (let d = 0; d < 7; d++) {
        const dd = new Date(start); dd.setDate(start.getDate() + d);
        const key = dd.toISOString().slice(0,10);
        const e = entries[key];
        km += e ? toNum(e.workout?.run?.distanceKm) : 0;
      }
      weeks.push({ label: `${start.toISOString().slice(5,10)}`, km });
    }
    // compute % change vs previous week for the last bar
    for (let i = 1; i < weeks.length; i++) {
      const prev = weeks[i-1].km;
      const curr = weeks[i].km;
      const pct = prev > 0 ? ((curr - prev) / prev) * 100 : undefined;
      weeks[i].pct = pct;
      weeks[i].risk = typeof pct === 'number' ? pct > 10 : false; // >10% increase flag
    }
    return weeks;
  }, [entries]);

  // Macro composition (100% stacked by calories)
  const macrosPctData = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().slice(0, 10);
      const e = entries[key];
      const carbsG   = e ? toNum(e.nutrition?.carbsG)   : 0;
      const proteinG = e ? toNum(e.nutrition?.proteinG) : 0;
      const fatG     = e ? toNum(e.nutrition?.fatG)     : 0;
      const cC = carbsG * 4, cP = proteinG * 4, cF = fatG * 9;
      const total = cC + cP + cF;
      const carbsPct   = total ? (cC / total) * 100 : 0;
      const proteinPct = total ? (cP / total) * 100 : 0;
      const fatPct     = total ? (cF / total) * 100 : 0;
      return {
        date: d.toISOString().slice(5, 10),
        carbsPct,
        proteinPct,
        fatPct,
        carbsG,
        proteinG,
        fatG,
      };
    });
    return days;
  }, [entries]);

  // Sleep: rolling 7-day average & balance (banking/debt) over last 28 days
  const sleepRollAndBalance = useMemo(() => {
    const target = 7.5; // hours
    const out: { date: string; roll7: number; balance: number }[] = [];
    let balance = 0;
    for (let i = 0; i < 28; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (27 - i));
      const iso = d.toISOString().slice(0, 10);
      // hours for this day
      const e = entries[iso];
      const hrs = e ? hhmmToHours(e.mindset?.sleepHrs) : 0;

      // 7-day average including today
      let sum = 0, cnt = 0;
      for (let k = 0; k < 7; k++) {
        const dd = new Date(d);
        dd.setDate(d.getDate() - k);
        const key = dd.toISOString().slice(0, 10);
        const ee = entries[key];
        const hv = ee ? hhmmToHours(ee.mindset?.sleepHrs) : 0;
        if (hv > 0) { sum += hv; cnt++; }
      }
      const roll7 = cnt ? sum / cnt : 0;

      // balance update (banking decays fast, debt decays slower)
      const delta = hrs - target;
      if (delta >= 0) {
        balance = balance * 0.6 + Math.min(delta, 1.5);
      } else {
        balance = balance * 0.9 + delta;
      }

      out.push({ date: iso.slice(5), roll7, balance });
    }
    return out;
  }, [entries]);

  // Polarization by run counts — weekly 100% stacked over last 10 weeks (Mon-anchored)
  const polarizationWeekly = useMemo(() => {
    const weeks: {
      weekLabel: string;
      easyPct: number; moderatePct: number; hardPct: number;
      easy: number; moderate: number; hard: number; total: number;
    }[] = [];

    const today = new Date();
    const offsetToMonday = (today.getDay() + 6) % 7; // 0 if Monday
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - offsetToMonday);

    // build 10 weeks, oldest -> newest
    for (let w = 9; w >= 0; w--) {
      const start = new Date(mondayThisWeek);
      start.setDate(mondayThisWeek.getDate() - 7 * w);
      const end = new Date(start); end.setDate(start.getDate() + 6);

      let easy = 0, moderate = 0, hard = 0, total = 0;

      for (let d = 0; d < 7; d++) {
        const dt = new Date(start); dt.setDate(start.getDate() + d);
        const key = dt.toISOString().slice(0,10);
        const e = entries[key];
        if (!e) continue;
        const runMin = e.workout?.run?.durationMin;
        const runDist = e.workout?.run?.distanceKm;
        const rpe = Number(e.workout?.run?.rpe || 0);
        const hasRun = (toNum(runMin) > 0 || toNum(runDist) > 0);
        if (hasRun && rpe > 0) {
          total += 1;
          if (rpe >= 9) hard += 1;
          else if (rpe >= 7) moderate += 1;
          else easy += 1;
        }
      }

      const easyPct = total ? (easy / total) * 100 : 0;
      const moderatePct = total ? (moderate / total) * 100 : 0;
      const hardPct = total ? (hard / total) * 100 : 0;
      const label = `${start.toISOString().slice(5,10)}`; // MM-DD of week start
      weeks.push({ weekLabel: label, easyPct, moderatePct, hardPct, easy, moderate, hard, total });
    }

    return weeks;
  }, [entries]);

  // Calendar weeks (Mon–Sun) for last 4 weeks, color-coded by nutrition/training
  const calendarWeeks = useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0=Sun..6=Sat
    const offsetToMonday = (day + 6) % 7; // 0 if Monday
    const start = new Date(today);
    // Start from Monday 3 weeks ago (4 weeks including current)
    start.setDate(today.getDate() - offsetToMonday - 7 * 3);

    const weeks: { iso: string; dayNum: number; status: 'none' | 'nut' | 'train' }[][] = [];
    for (let w = 0; w < 4; w++) {
      const days: { iso: string; dayNum: number; status: 'none' | 'nut' | 'train' }[] = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start);
        dt.setDate(start.getDate() + w * 7 + d);
        const iso = dt.toISOString().slice(0, 10);
        const e = entries[iso];
        const kcal = e ? toNum(e.nutrition?.calories) : 0;
        const runDist = e ? toNum(e.workout?.run?.distanceKm) : 0;
        const strengthRounds = e ? toNum(e.workout?.strength?.rounds) : 0;
        let status: 'none' | 'nut' | 'train' = 'none';
        if (kcal > 0 && (runDist > 0 || strengthRounds > 0)) status = 'train';
        else if (kcal > 0) status = 'nut';
        days.push({ iso, dayNum: dt.getDate(), status });
      }
      weeks.push(days);
    }
    return weeks;
  }, [entries]);

  const endOfDayPrompt = useMemo(() => {
    const r = entry.workout.run; const s = entry.workout.strength; const n = entry.nutrition; const m = entry.mindset;
    const fmt = (v: any, sfx = '') => (v ? `${v} ${sfx}` : '—');
    const lines = [
      'Training — Today',
      r.distanceKm || r.durationMin || r.pace ? `• Run: ${fmt(r.distanceKm,'km')} · ${fmt(r.durationMin,'min')} · ${fmt(r.pace,'pace')}` : null,
      r.hrAvg || r.hrMax ? `  HR: ${fmt(r.hrAvg,'avg')} / ${fmt(r.hrMax,'max')}` : null,
      r.cadence || r.strideM ? `  Cadence/Stride: ${fmt(r.cadence,'spm')} · ${fmt(r.strideM,'m')}` : null,
      r.elevUp || r.elevDown ? `  Elevation: +${fmt(r.elevUp,'m')} / −${fmt(r.elevDown,'m')}` : null,
      r.calories || r.sweatLossL || r.rpe ? `  Calories: ${fmt(r.calories,'kcal')} · Est. sweat loss ~${fmt(r.sweatLossL,'L')} · RPE ${r.rpe || '—'}/10` : null,
      s.description || s.rounds ? `• Strength: ${s.description || '—'} ${s.rounds ? `(${s.rounds} rounds)` : ''}${s.weightLbs ? ` — ${s.weightLbs} lbs` : ''}${s.calories ? ` — ~${s.calories} kcal (est.)` : ''}` : null,
      '',
      'Nutrition',
      `• Calories: ${n.calories || '—'}`, `• Target: ${n.calorieTarget || '—'} kcal`,
      `• Macros: Carbs ${n.carbsG || '—'} g | Protein ${n.proteinG || '—'} g | Fat ${n.fatG || '—'} g | Fibre ${n.fibreG || '—'} g`,
      '',
      'Recovery',
      `• Sleep ${m.sleepHrs || '—'} (Q ${m.sleepQuality || '—'}/5) · RHR ${m.rhr || '—'} bpm · HRV ${m.hrv || '—'} ms`,
      '',
      `Mindset — Mood ${m.mood || '—'}/5 · Stress ${m.stress || '—'}/5`,
    ].filter(Boolean);
    return (lines as string[]).join('\n');
  }, [entry]);

  async function copyPrompt() { try { await navigator.clipboard.writeText(endOfDayPrompt); alert('Prompt copied'); } catch {} }

  useEffect(() => {
  if (userEmail) {
    document.body.classList.add('peakform-bg');
    return () => document.body.classList.remove('peakform-bg');
  } else {
    document.body.classList.remove('peakform-bg');
  }
}, [userEmail]);
  
  // ---------- TXT import (inside component) ----------
  function parseDiaryTxt(txt: string): { date: string; entry: Entry; calorieTarget?: number } {
    const lines = txt.split(/\r?\n/);
    const map: Record<string, string> = {};
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim().toUpperCase();
      const v = line.slice(eq + 1).trim();
      map[k] = v;
    }
    const parsedDate = map['DATE'] || todayISO();
    const run = { distanceKm: map['DIST_KM'], durationMin: map['DURATION_MIN'], pace: map['PACE'], hrAvg: map['HR_AVG'], hrMax: map['HR_MAX'], cadence: map['CADENCE'], strideM: map['STRIDE_M'], elevUp: map['ELEV_UP'], elevDown: map['ELEV_DOWN'], calories: map['KCAL_RUN'], sweatLossL: map['SWEAT_LOSS_L'], rpe: map['RPE'] };
    const strength = { description: map['STRENGTH_DESC'], rounds: map['STRENGTH_ROUNDS'], calories: map['STRENGTH_KCAL'], weightLbs: map['STRENGTH_WEIGHT_LBS'] };
    const nutrition = {calories: map['CALORIES'], carbsG: map['CARBS_G'], proteinG: map['PROTEIN_G'], fatG: map['FAT_G'], fibreG: map['FIBRE_G'], calorieTarget: map['CALORIE_TARGET'],};
    const mindset = { 
      mood: map['MOOD'], 
      stress: map['STRESS'], 
      sleepQuality: map['SLEEP_QUALITY'], 
      sleepHrs: map['SLEEP_HRS'], 
      rhr: map['RHR'], 
      hrv: map['HRV'], 
      notes: map['NOTES'] 
    };
    const entry: Entry = { date: parsedDate, workout: { run, strength }, nutrition, mindset };
    const calorieTarget = map['CALORIE_TARGET'] ? Number(map['CALORIE_TARGET']) : undefined;
    return { date: parsedDate, entry, calorieTarget };
  }

  async function handleImportTxt(file: File) {
    const isTxt = /\.txt$/i.test(file.name);
    if (!isTxt) { alert('Please select a .txt file'); return; }
    const txt = await file.text();
    const { date: d, entry: imported, calorieTarget } = parseDiaryTxt(txt);
    setEntries(prev => ({ ...prev, [d]: { ...(prev[d] ?? emptyEntry(d)), ...imported } }));
    await pushEntry(d, imported);
    alert(`Imported diary for ${d}`);
  }

  // ---------- Guards ----------
  if (loading) return <div className="card">Loading…</div>;
  if (!userEmail) return (
    <div className="card space-y-3">
      <h2 className="text-lg font-medium">Sign in required</h2>
      <p className="text-sm text-neutral-600">PeakForm uses Supabase only. Please <a className="underline" href="/login">log in with a magic link</a> to start logging.</p>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );

  const n = entry.nutrition;

  // ---------- View ----------
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Date (2/12) */}
          <div className="md:col-span-2">
            <div className="label">Date</div>
            <input
              className="input h-10 w-full max-w-[180px] tabular-nums"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Actions (Today, Streak, Clear Day, Import) — consistent gap */}
          <div className="md:col-span-7">
            <div className="label">Streak</div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="h-10 rounded-xl border px-3 flex items-center justify-center text-sm font-semibold bg-white shadow-sm tabular-nums leading-none">{streak} {streak===1?'day':'days'}</div>
              <button type="button" className="btn h-10 whitespace-nowrap px-3 inline-flex items-center bg-white shadow-sm" onClick={() => setDate(todayISO())}>Today</button>
              <button type="button" className="btn h-10 whitespace-nowrap px-3 inline-flex items-center bg-white shadow-sm" onClick={handleClearDay}>Clear Day</button>
              <label className="btn h-10 whitespace-nowrap px-3 cursor-pointer inline-flex items-center bg-white shadow-sm">Import .txt file
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleImportTxt(f);
                    e.currentTarget.value = '';
                  }}
                />
              </label>
              <button
                type="button"
                title="Download template"
                className="btn h-10 w-10 inline-flex items-center justify-center bg-white shadow-sm"
                onClick={downloadTemplate}
              >
                ↓
              </button>
            </div>
          </div>

          {/* Signed in (3/12) */}
          <div className="md:col-span-3">
            <div className="label">Signed in as</div>
            <div className="text-sm text-neutral-600 h-10 flex items-center">{userEmail}</div>
          </div>
        </div>
      </div>


      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Today — Summary</h3>
          {/* Row 1: training stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat label="Distance" value={fmtNum(toNum(entry.workout?.run?.distanceKm))} />
            <Stat label="Duration" value={fmtNum(toNum(entry.workout?.run?.durationMin))} />
            <Stat label="Pace" value={entry.workout?.run?.pace || '—'} />
            <Stat label="HR avg" value={fmtNum(toNum(entry.workout?.run?.hrAvg))} />
          </div>
          {/* Row 2: nutrition stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat label="Calories" value={fmtNum(totals.calories)} sub={`Target ${fmtNum(totals.dayTarget)}`} />
            <Stat label="Carbs (g)" value={fmtNum(totals.carbsG)} sub="5–6g/kg" />
            <Stat label="Protein (g)" value={fmtNum(totals.proteinG)} sub="1.4–1.8g/kg" />
            <Stat label="Fat (g)" value={fmtNum(totals.fatG)} sub="0.5–1g/kg" />
          </div>
          <div className="text-sm">
            Status: <span className="font-medium capitalize">{totals.balance}</span>{' '}
            {totals.deficit > 0
              ? `(${fmtNum(totals.deficit)} kcal below target)`
              : totals.deficit < 0
              ? `(${fmtNum(Math.abs(totals.deficit))} kcal above target)`
              : '(on target)'}
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-medium">Calendar</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-neutral-600">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>
          <div className="space-y-2">
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-2">
                {week.map((day) => (
                  <div key={day.iso} className="flex items-center justify-center">
                    <div
                      className={
                        'w-8 h-8 rounded-full border flex items-center justify-center ' +
                        (day.status === 'train'
                          ? 'text-white border-black'
                          : day.status === 'nut'
                          ? 'text-white border-black'
                          : 'border-black')
                      }
                      style={day.status === 'train'
                        ? { backgroundColor: '#fc4c02', borderColor: '#000' }
                        : day.status === 'nut'
                        ? { backgroundColor: '#ff955c', borderColor: '#000' }
                        : undefined}
                      title={day.iso}
                    >
                      <span className="text-[11px] leading-none">{day.dayNum}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="pt-3 flex items-center justify-center gap-6 text-xs text-neutral-600">
            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#ff955c' }}></span>Nutrition only</span>
            <span className="inline-flex items-center"><span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: '#fc4c02' }}></span>Nutrition + training</span>
          </div>
        </div>
      </div>

      {/* Row 1: Distance + Rolling 7-day */}
      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">14-day trend — Distance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tickMargin={6} tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 14 }} />
                <Tooltip />
                <Bar dataKey="distance" name="Distance" fill="#fc4c02" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Rolling 7-day Distance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rolling7DistanceData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tickMargin={6} tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(v) => [Math.round(Number(v)), 'km']} />
                <Bar dataKey="rolling7" name="Rolling 7-day" fill="#fc4c02" radius={[6,6,0,0]} barSize={18} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Polarization + Training Load */}
      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Polarization (10 weeks — by RPE count)</h3>
          <div className="text-sm">
            {(() => {
              const last = polarizationWeekly[polarizationWeekly.length - 1];
              const easyPct = last ? Math.round(last.easyPct) : 0;
              const runsInfo = last ? `(${last.easy}/${last.total} runs)` : '';
              const ok = easyPct >= 80;
              return (
                <span>
                  Last week Easy ≤6: <span className="font-semibold">{easyPct}%</span> {runsInfo}
                  <span className={'ml-3 inline-block rounded-full px-2 py-0.5 text-xs ' + (ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                    {ok ? 'Polarized ✓' : 'Not polarized'}
                  </span>
                </span>
              );
            })()}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={polarizationWeekly} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="weekLabel" tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(v, n, { payload }) => {
                  return [`${Math.round(Number(v))}%`, n as string];
                }} />
                <Bar stackId="rpe" dataKey="easyPct"     name="Easy (1–6)"  fill="#ffd1bd" />
                <Bar stackId="rpe" dataKey="moderatePct" name="Mod (7–8)"   fill="#ff955c" />
                <Bar stackId="rpe" dataKey="hardPct"     name="Hard (9–10)" fill="#d63b00" radius={[6,6,0,0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Training Load — 7d vs 28d & weekly change</h3>
          <div className="text-sm">
            {(() => {
              const last = weeklyLoad[weeklyLoad.length - 1];
              const pct = last?.pct;
              const risk = last?.risk;
              return (
                <span>
                  This week vs last: {typeof pct === 'number' ? `${pct > 0 ? '+' : ''}${Math.round(pct)}%` : '—'}{' '}
                  <span className={'ml-2 inline-block rounded-full px-2 py-0.5 text-xs ' + (risk ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                    {risk ? 'Risk >10%' : 'OK'}
                  </span>
                </span>
              );
            })()}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rolling7and28Data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(v, n) => [Math.round(Number(v)), n as string]} />
                {/* Put chronic (28d) underneath so acute sits on top */}
                <Area type="monotone" dataKey="r28" name="Rolling 28d" stroke="#ff955c" fill="#ff955c" fillOpacity={0.25} strokeWidth={2} />
                <Area type="monotone" dataKey="r7"  name="Rolling 7d"  stroke="#fc4c02" fill="#fc4c02" fillOpacity={0.35} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Calories vs Target + Macro Composition */}
      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">14-day trend — Calories vs Target</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={caloriesVsTargetData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }} barCategoryGap="25%">
                <XAxis dataKey="date" tickMargin={6} tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(v) => [Math.round(Number(v)), 'kcal']} />
                <Bar dataKey="calories" name="Calories" fill="#fc4c02" radius={[6, 6, 0, 0]} barSize={18} />
                <Bar dataKey="target"   name="Target"   fill="#ffd1bd" radius={[6, 6, 0, 0]} barSize={18} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Macro Composition</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={macrosPctData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tickMargin={6} tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 14 }} />
                <Tooltip
                  formatter={(value: any, name: any, { payload }: any) => {
                    const m = String(name).toLowerCase();
                    const grams = m.includes('carb') ? payload.carbsG : m.includes('protein') ? payload.proteinG : m.includes('fat') ? payload.fatG : null;
                    return [`${Math.round(Number(value))}%${grams != null ? ` (${grams}g)` : ''}`, name];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar stackId="macros" dataKey="carbsPct"   name="Carbs"   fill="#fc4c02" />
                <Bar stackId="macros" dataKey="proteinPct" name="Protein" fill="#ff955c" />
                <Bar stackId="macros" dataKey="fatPct"     name="Fat"     fill="#d63b00" radius={[6,6,0,0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Sleep — Rolling avg and Balance */}
      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Rolling 7-day Sleep — avg vs target band</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepRollAndBalance} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(v) => [typeof v === 'number' ? v.toFixed(2) : v, 'h']} />
                {/* Target band 7.0–8.0 h */}
                <ReferenceArea y1={7} y2={8} fill="#94a3b8" fillOpacity={0.15} />
                <Area type="monotone" dataKey="roll7" name="7d avg" stroke="#fc4c02" fill="#fc4c02" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Sleep Balance (banking/debt)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepRollAndBalance} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis domain={[ 'auto', 'auto' ]} tick={{ fontSize: 14 }} />
                <Tooltip formatter={(v) => [ (Number(v) >= 0 ? '+' : '') + Number(v).toFixed(2), 'h' ]} />
                <ReferenceLine y={0} stroke="#111" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="balance" name="Balance (h)" stroke="#fc4c02" fill="#fc4c02" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Run</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {num('Distance (km)','workout.run.distanceKm',entry.workout.run.distanceKm,update)}
          {num('Duration (min)','workout.run.durationMin',entry.workout.run.durationMin,update)}
          {text('Pace (e.g. 5:30/km)','workout.run.pace',entry.workout.run.pace,update)}
          {num('HR avg','workout.run.hrAvg',entry.workout.run.hrAvg,update)}
          {num('HR max','workout.run.hrMax',entry.workout.run.hrMax,update)}
          {num('Cadence (spm)','workout.run.cadence',entry.workout.run.cadence,update)}
          {num('Stride (m)','workout.run.strideM',entry.workout.run.strideM,update)}
          {num('Elev + (m)','workout.run.elevUp',entry.workout.run.elevUp,update)}
          {num('Elev − (m)','workout.run.elevDown',entry.workout.run.elevDown,update)}
          {num('Calories (kcal)','workout.run.calories',entry.workout.run.calories,update)}
          {num('Sweat loss (L)','workout.run.sweatLossL',entry.workout.run.sweatLossL,update)}
          {rangeRPE('RPE (1–10)','workout.run.rpe', entry.workout.run.rpe, update)}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Strength</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {text('Description','workout.strength.description',entry.workout.strength.description,update)}
          {num('Weight (lbs)','workout.strength.weightLbs',entry.workout.strength.weightLbs,update)}
          {num('Rounds','workout.strength.rounds',entry.workout.strength.rounds,update)}
          {num('Calories (est.)','workout.strength.calories',entry.workout.strength.calories,update)}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Nutrition</h3>
        <div className="grid grid-cols-2 gap-3">
          {num('Daily calorie target','nutrition.calorieTarget',n.calorieTarget,update)}
          {num('Calories','nutrition.calories',n.calories,update)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {num('Carbs (g)','nutrition.carbsG',n.carbsG,update)}
          {num('Protein (g)','nutrition.proteinG',n.proteinG,update)}
          {num('Fat (g)','nutrition.fatG',n.fatG,update)}
          {num('Fibre (g)','nutrition.fibreG',n.fibreG,update)}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Recovery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hhmm('Sleep (hh:mm)', 'mindset.sleepHrs', entry.mindset.sleepHrs, update)}
          {num('Resting HR (bpm)', 'mindset.rhr', (entry.mindset as any).rhr, update)}
          {num('HRV (ms)', 'mindset.hrv', (entry.mindset as any).hrv, update)}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Mindset</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {range('Mood (1–5)', 'mindset.mood', entry.mindset.mood, update)}
          {range('Stress (1–5)', 'mindset.stress', entry.mindset.stress, update)}
          {range('Sleep Quality (1–5)', 'mindset.sleepQuality', entry.mindset.sleepQuality, update)}
        </div>
        <div>
          <div className="label">Notes</div>
          <textarea
            className="input h-28"
            value={entry.mindset.notes || ''}
            onChange={(e) => update('mindset.notes', e.target.value)}
            placeholder="Reflections, soreness, stressors, wins…"
          />
        </div>
      </div>


      <div className="card space-y-2">
        <h3 className="text-lg font-medium">End-of-day prompt</h3>
        <textarea className="input h-40" readOnly value={endOfDayPrompt} />
        <div className="flex justify-end">
          <button className="btn" onClick={copyPrompt}>Copy</button>
        </div>
      </div>
    </div>
  );
}
