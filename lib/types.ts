export type Run = {
  distanceKm?: string; durationMin?: string; pace?: string;
  hrAvg?: string; hrMax?: string; cadence?: string; strideM?: string;
  elevUp?: string; elevDown?: string; calories?: string; sweatLossL?: string; rpe?: string;
};
export type Strength = { description?: string; weightLbs?: string; rounds?: string; calories?: string };
export type Nutrition = { calorieTarget?: string; calories?: string; carbsG?: string; proteinG?: string; fatG?: string; fibreG?: string };
export type Mindset = { mood?: string; stress?: string; sleepQuality?: string; sleepHrs?: string; rhr?: string; hrv?: string; notes?: string; };

export type Entry = {
  date: string;
  workout: { run: Run; strength: Strength };
  nutrition: Nutrition;
  mindset: Mindset;
};

export type Settings = {
  calorieTarget: number;
  macroTargets: { carbsG: number; proteinG: number; fatG: number; fibreG: number };
};
