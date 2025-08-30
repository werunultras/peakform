```ts
'use client';
import { supabase } from './supabaseClient';
import type { Entry, Settings } from './types';

const todayISO = () => new Date().toISOString().slice(0,10);

export const emptyEntry = (date = todayISO()): Entry => ({
  date,
  workout: { run: {}, strength: {} },
  nutrition: {},
  mindset: { mood: '3', energy: '3', stress: '3', sleepQuality: '3' },
});

export const defaultSettings: Settings = {
  calorieTarget: 2600,
  macroTargets: { carbsG: 300, proteinG: 170, fatG: 70, fibreG: 30 },
};

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function pullCloud() {
  const user = await getUser();
  if (!user) return null;
  const { data: entries, error: e1 } = await supabase
    .from('entries')
    .select('date, content')
    .order('date');
  if (e1) throw e1;
  const { data: settings, error: e2 } = await supabase
    .from('settings')
    .select('content')
    .eq('user_id', user.id)
    .maybeSingle();
  if (e2) throw e2;
  return { entries: Object.fromEntries((entries||[]).map((r:any)=> [r.date, r.content])), settings: settings?.content ?? defaultSettings };
}

export async function pushEntry(date: string, entry: Entry) {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  await supabase.from('entries').upsert({ user_id: user.id, date, content: entry });
}

export async function pushSettings(settings: Settings) {
  const user = await getUser();
  if (!user) throw new Error('Not authenticated');
  await supabase.from('settings').upsert({ user_id: user.id, content: settings });
}
```ts
'use client';
import { supabase } from './supabaseClient';
import type { Entry, Settings } from './types';

const K = {
  data: 'peakform.entries.v1',
  settings: 'peakform.settings.v1',
};

const todayISO = () => new Date().toISOString().slice(0,10);

export const emptyEntry = (date = todayISO()): Entry => ({
  date,
  workout: { run: {}, strength: {} },
  nutrition: {},
  mindset: { mood: '3', energy: '3', stress: '3', sleepQuality: '3' },
});

export const defaultSettings: Settings = {
  calorieTarget: 2600,
  macroTargets: { carbsG: 300, proteinG: 170, fatG: 70, fibreG: 30 },
};

export function readLocalEntries(): Record<string, Entry> {
  try { return JSON.parse(localStorage.getItem(K.data) || '{}'); } catch { return {}; }
}
export function writeLocalEntries(e: Record<string, Entry>) {
  localStorage.setItem(K.data, JSON.stringify(e));
}
export function readLocalSettings(): Settings {
  try { return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(K.settings) || '{}')) }; } catch { return defaultSettings; }
}
export function writeLocalSettings(s: Settings) { localStorage.setItem(K.settings, JSON.stringify(s)); }

// --- Supabase helpers (optional if logged in) ---
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function pullCloud() {
  const user = await getUser();
  if (!user) return null;
  const { data: entries } = await supabase
    .from('entries')
    .select('date, content')
    .order('date');
  const { data: settings } = await supabase
    .from('settings')
    .select('content')
    .eq('user_id', user.id)
    .maybeSingle();
  return { entries: Object.fromEntries((entries||[]).map((r:any)=> [r.date, r.content])), settings: settings?.content };
}

export async function pushEntry(date: string, entry: Entry) {
  const user = await getUser();
  if (!user) return; // not logged in
  await supabase.from('entries').upsert({ user_id: user.id, date, content: entry });
}

export async function pushSettings(settings: Settings) {
  const user = await getUser();
  if (!user) return;
  await supabase.from('settings').upsert({ user_id: user.id, content: settings });
}
```
