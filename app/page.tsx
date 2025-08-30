'use client';
import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { emptyEntry, defaultSettings, pushEntry, pushSettings, pullCloud, getUser } from '@/lib/storage';
import type { Entry, Settings } from '@/lib/types';

const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtNum = (v: number) => (Number.isFinite(v) ? new Intl.NumberFormat().format(v) : '—');
const toNum = (v: any) => {
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export default function Page() {
  const [date, setDate] = useState<string>(todayISO());
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setUserEmail(user?.email ?? null);
        if (!user) return;
        const cloud = await pullCloud();
        if (cloud) {
          setEntries(cloud.entries);
          setSettings(cloud.settings);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const entry = useMemo<Entry>(() => entries[date] ?? emptyEntry(date), [entries, date]);

  function update(path: string, value: any) {
    setEntries((prev) => {
      const cur = prev[date] ?? emptyEntry(date);
      const next: Entry = structuredClone(cur);
      const keys = path.split('.');
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
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

  const totals = useMemo(() => {
    const n = entry.nutrition;
    const cals = toNum(n.calories);
    const deficit = settings.calorieTarget ? settings.calorieTarget - cals : 0;
    const balance = deficit === 0 ? 'balance' : deficit > 0 ? 'deficit' : 'surplus';
    return {
      calories: cals,
      carbsG: toNum(n.carbsG),
      proteinG: toNum(n.proteinG),
      fatG: toNum(n.fatG),
      fibreG: toNum(n.fibreG),
      deficit,
      balance,
    };
  }, [entry, settings]);

  const chartData = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const key = d.toISOString().slice(0, 10);
      const e = entries[key];
      const cal = e ? toNum(e.nutrition?.calories) : 0;
      const mood = e ? toNum(e.mindset?.mood) : 0;
      return { date: key.slice(5), calories: cal, mood };
    });
    return days;
  }, [entries]);

  const endOfDayPrompt = useMemo(() => {
    const r = entry.workout.run;
    const s = entry.workout.strength;
    const n = entry.nutrition;
    const m = entry.mindset;
    const fmt = (v: any, sfx = '') => (v ? `${v} ${sfx}` : '—');

    const lines = [
      'Training — Today',
      r.distanceKm || r.durationMin || r.pace
        ? `• Run: ${fmt(r.distanceKm, 'km')} · ${fmt(r.durationMin, 'min')} · ${fmt(r.pace, 'pace')}`
        : null,
      r.hrAvg || r.hrMax ? `  HR: ${fmt(r.hrAvg, 'avg')} / ${fmt(r.hrMax, 'max')}` : null,
      r.cadence || r.strideM ? `  Cadence/Stride: ${fmt(r.cadence, 'spm')} · ${fmt(r.strideM, 'm')}` : null,
      r.elevUp || r.elevDown ? `  Elevation: +${fmt(r.elevUp, 'm')} / −${fmt(r.elevDown, 'm')}` : null,
      r.calories || r.sweatLossL
        ? `  Calories: ${fmt(r.calories, 'kcal')} · Est. sweat loss ~${fmt(r.sweatLossL, 'L')}`
        : null,
      s.description || s.rounds
        ? `• Strength: ${s.description || '—'} ${s.rounds ? `(${s.rounds} rounds)` : ''} ${
            s.calories ? `— ~${s.calories} kcal (est.)` : ''
          }`
        : null,
      '',
      'Nutrition',
      `• Calories: ${n.calories || '—'}`,
      `• Macros: Carbs ${n.carbsG || '—'} g | Protein ${n.proteinG || '—'} g | Fat ${n.fatG || '—'} g | Fibre ${n.fibreG || '—'} g`,
      '',
      `Mindset — Mood ${m.mood || '—'}/5 · Energy ${m.energy || '—'}/5 · Stress ${m.stress || '—'}/5 · Sleep ${m.sleepHrs || '—'}h (Q${m.sleepQuality || '—'}/5)`,
    ].filter(Boolean);

    return (lines as string[]).join('\n');
  }, [entry]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(endOfDayPrompt);
      alert('Prompt copied');
    } catch {}
  }

  if (loading) return <div className="card">Loading…</div>;
  if (!userEmail)
    return (
      <div className="card space-y-3">
        <h2 className="text-lg font-medium">Sign in required</h2>
        <p className="text-sm text-neutral-600">
          PeakForm uses Supabase only. Please <a className="underline" href="/login">log in with a magic link</a> to start logging.
        </p>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    );

  const n = entry.nutrition;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <div className="label">Date</div>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <div className="label">Daily calorie target</div>
            <input
              className="input"
              type="number"
              value={settings.calorieTarget}
              onChange={(e) => saveSettings({ calorieTarget: Number(e.target.value || 0) })}
            />
          </div>
          <div className="text-sm self-center text-neutral-600">Signed in as {userEmail}</div>
          <div />
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Run</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {num('Distance (km)', 'workout.run.distanceKm', entry.workout.run.distanceKm, update)}
          {num('Duration (min)', 'workout.run.durationMin', entry.workout.run.durationMin, update)}
          {text('Pace (e.g. 5:30/km)', 'workout.run.pace', entry.workout.run.pace, update)}
          {num('HR avg', 'workout.run.hrAvg', entry.workout.run.hrAvg, update)}
          {num('HR max', 'workout.run.hrMax', entry.workout.run.hrMax, update)}
          {num('Cadence (spm)', 'workout.run.cadence', entry.workout.run.cadence, update)}
          {num('Stride (m)', 'workout.run.strideM', entry.workout.run.strideM, update)}
          {num('Elev + (m)', 'workout.run.elevUp', entry.workout.run.elevUp, update)}
          {num('Elev − (m)', 'workout.run.elevDown', entry.workout.run.elevDown, update)}
          {num('Calories (kcal)', 'workout.run.calories', entry.workout.run.calories, update)}
          {num('Sweat loss (L)', 'workout.run.sweatLossL', entry.workout.run.sweatLossL, update)}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Strength</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {text('Description', 'workout.strength.description', entry.workout.strength.description, update)}
          {num('Rounds', 'workout.strength.rounds', entry.workout.strength.rounds, update)}
          {num('Calories (est.)', 'workout.strength.calories', entry.workout.strength.calories, update)}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Nutrition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {num('Calories', 'nutrition.calories', n.calories, update)}
          {num('Carbs (g)', 'nutrition.carbsG', n.carbsG, update)}
          {num('Protein (g)', 'nutrition.proteinG', n.proteinG, update)}
          {num('Fat (g)', 'nutrition.fatG', n.fatG, update)}
          {num('Fibre (g)', 'nutrition.fibreG', n.fibreG, update)}
        </div>
        <div className="text-sm text-neutral-600">
          Targets — Carbs {settings.macroTargets.carbsG}g · Protein {settings.macroTargets.proteinG}g · Fat {settings.macroTargets.fatG}g · Fibre {settings.macroTargets.fibreG}g
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="text-lg font-medium">Mindset</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {range('Mood (1–5)', 'mindset.mood', entry.mindset.mood, update)}
          {range('Energy (1–5)', 'mindset.energy', entry.mindset.energy, update)}
          {range('Stress (1–5)', 'mindset.stress', entry.mindset.stress, update)}
          {num('Sleep (hrs)', 'mindset.sleepHrs', entry.mindset.sleepHrs, update)}
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

      <div className="grid-2">
        <div className="card space-y-2">
          <h3 className="text-lg font-medium">Today — Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat label="Calories" value={fmtNum(totals.calories)} sub={`Target ${fmtNum(settings.calorieTarget)}`} />
            <Stat label="Carbs (g)" value={fmtNum(totals.carbsG)} sub={`Target ${settings.macroTargets.carbsG}`} />
            <Stat label="Protein (g)" value={fmtNum(totals.proteinG)} sub={`Target ${settings.macroTargets.proteinG}`} />
            <Stat label="Fat (g)" value={fmtNum(totals.fatG)} sub={`Target ${settings.macroTargets.fatG}`} />
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

        <div className="card space-y-2">
          <h3 className="text-lg font-medium">14-day trend — Calories & Mood</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="date" tickMargin={6} />
                <YAxis yAxisId="left" domain={[0, 'auto']} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <ReferenceLine yAxisId="left" y={settings.calorieTarget} strokeDasharray="4 4" />
                <Line yAxisId="left" type="monotone" dataKey="calories" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="mood" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
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

function label(s: string) {
  return <div className="label">{s}</div>;
}
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
function range(l: string
