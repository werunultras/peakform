const endOfDayPrompt = useMemo(() => {
  const r = entry.workout.run;
  const s = entry.workout.strength;
  const n = entry.nutrition;
  const m = entry.mindset;
  const fmt = (v: any, sfx = '') => (v ? `${v} ${sfx}` : '—');

  return [
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
    '', // blank line
    'Nutrition',
    `• Calories: ${n.calories || '—'}`,
    `• Macros: Carbs ${n.carbsG || '—'} g | Protein ${n.proteinG || '—'} g | Fat ${n.fatG || '—'} g | Fibre ${
      n.fibreG || '—'
    } g`,
    '', // blank line
    `Mindset — Mood ${m.mood || '—'}/5 · Energy ${m.energy || '—'}/5 · Stress ${m.stress || '—'}/5 · Sleep ${
      m.sleepHrs || '—'
    }h (Q${m.sleepQuality || '—'}/5)`,
  ]
    .filter(Boolean)
    .join('\n');
}, [entry]);
