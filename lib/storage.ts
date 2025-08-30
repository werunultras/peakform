'use client’;
import { supabase } from '@/lib/supabaseClient’;
import type { Entry, Settings } from '@/lib/types’;

const todayISO = () => new Date().toISOString().slice(0, 10);

export const emptyEntry = (date = todayISO()): Entry => ({
date,
workout: { run: {}, strength: {} },
nutrition: {},
mindset: { mood: '3’, energy: '3’, stress: '3’, sleepQuality: '3’ },
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
.from('entries’)
.select('date, content’)
.order('date’);
if (e1) throw e1;

const { data: settings, error: e2 } = await supabase
.from('settings’)
.select('content’)
.eq('user_id’, user.id)
.maybeSingle();
if (e2) throw e2;

return {
entries: Object.fromEntries((entries || []).map((r: any) => [r.date, r.content])),
settings: settings?.content ?? defaultSettings,
};
}

export async function pushEntry(date: string, entry: Entry) {
const user = await getUser();
if (!user) throw new Error('Not authenticated’);
await supabase.from('entries’).upsert({ user_id: user.id, date, content: entry });
}

export async function pushSettings(settings: Settings) {
const user = await getUser();
if (!user) throw new Error('Not authenticated’);
await supabase.from('settings’).upsert({ user_id: user.id, content: settings });
}
