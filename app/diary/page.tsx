'use client';
import { useEffect, useMemo, useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
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
      <input type="range" min={1} max={5} step={1} value={v || 3} onChange={(e) => on(p, e.target.value)} className="w-full" />
    </div>
  );
}
function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border p-3 bg-white">
      <div className="text-xs text-neutral-600">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-xs text-neutral-500">{sub}</div>}
    </div>
  );
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

  const calorieDeltaData = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().slice(0, 10);
      const e = entries[key];
      const cals = e ? toNum(e.nutrition?.calories) : 0;
      const target = e ? toNum(e.nutrition?.calorieTarget) : 0;
      const delta = cals - target;
      return { date: key.slice(5), surplus: delta > 0 ? delta : 0, deficit: delta < 0 ? delta : 0 };
    });
    return days;
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
      r.calories || r.sweatLossL ? `  Calories: ${fmt(r.calories,'kcal')} · Est. sweat loss ~${fmt(r.sweatLossL,'L')}` : null,
      s.description || s.rounds ? `• Strength: ${s.description || '—'} ${s.rounds ? `(${s.rounds} rounds)` : ''}${s.weightLbs ? ` — ${s.weightLbs} lbs` : ''}${s.calories ? ` — ~${s.calories} kcal (est.)` : ''}` : null,
      '',
      'Nutrition',
      `• Calories: ${n.calories || '—'}`, `• Target: ${n.calorieTarget || '—'} kcal`,
      `• Macros: Carbs ${n.carbsG || '—'} g | Protein ${n.proteinG || '—'} g | Fat ${n.fatG || '—'} g | Fibre ${n.fibreG || '—'} g`,
      '',
      `Mindset — Mood ${m.mood || '—'}/5 · Stress ${m.stress || '—'}/5 · Sleep Q ${m.sleepQuality || '—'}/5`,
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
    const run = { distanceKm: map['DIST_KM'], durationMin: map['DURATION_MIN'], pace: map['PACE'], hrAvg: map['HR_AVG'], hrMax: map['HR_MAX'], cadence: map['CADENCE'], strideM: map['STRIDE_M'], elevUp: map['ELEV_UP'], elevDown: map['ELEV_DOWN'], calories: map['KCAL_RUN'], sweatLossL: map['SWEAT_LOSS_L'] };
    const strength = { description: map['STRENGTH_DESC'], rounds: map['STRENGTH_ROUNDS'], calories: map['STRENGTH_KCAL'], weightLbs: map['STRENGTH_WEIGHT_LBS'] };
    const nutrition = {calories: map['CALORIES'], carbsG: map['CARBS_G'], proteinG: map['PROTEIN_G'], fatG: map['FAT_G'], fibreG: map['FIBRE_G'], calorieTarget: map['CALORIE_TARGET'],};
    const mindset = { mood: map['MOOD'], stress: map['STRESS'], sleepQuality: map['SLEEP_QUALITY'], notes: map['NOTES'] };
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
              className="input h-10 w-full max-w-[160px] tabular-nums"
              type="text"
              inputMode="numeric"
              placeholder="MM/DD/YYYY"
              value={formatMDY(date)}
              onChange={(e) => setDate(toISOFromMDY(e.target.value))}
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
            </div>
          </div>

          {/* Signed in (3/12) */}
          <div className="md:col-span-3">
            <div className="label">Signed in as</div>
            <div className="text-sm text-neutral-600 h-10 flex items-center">{userEmail}</div>
          </div>
        </div>
      </div>


      <div className="card space-y-2">
        <h3 className="text-lg font-medium">Today — Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-8 gap-3 text-sm">
          <Stat label="Distance" value={fmtNum(toNum(entry.workout?.run?.distanceKm))} />
          <Stat label="Duration" value={fmtNum(toNum(entry.workout?.run?.durationMin))} />
          <Stat label="Pace" value={entry.workout?.run?.pace || '—'} />
          <Stat label="HR avg" value={fmtNum(toNum(entry.workout?.run?.hrAvg))} />
          <Stat label="Calories" value={fmtNum(totals.calories)} sub={`Target ${fmtNum(totals.dayTarget)}`} />
          <Stat label="Carbs (g)" value={fmtNum(totals.carbsG)} />
          <Stat label="Protein (g)" value={fmtNum(totals.proteinG)} />
          <Stat label="Fat (g)" value={fmtNum(totals.fatG)} />
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

      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">14-day trend — Distance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tickMargin={6} />
                <YAxis domain={[0, 'auto']} />
                <Tooltip />
                <Bar dataKey="distance" name="Distance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-2">
          <h3 className="text-lg font-medium">14-day trend — Calorie Δ</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={calorieDeltaData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tickMargin={6} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip formatter={(v) => [Math.round(Number(v)), 'kcal']} />
                <Bar dataKey="deficit" name="Deficit" fill="#ef4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="surplus" name="Surplus" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </ComposedChart>
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
        <h3 className="text-lg font-medium">Mindset</h3>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
