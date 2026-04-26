export interface VideoFrameContext {
  currentTimeInSeconds: number;
  durationInSeconds: number;
  progressRatio: number;
  elapsedLabel: string;
}

export type SheepCounterId = 'male' | 'female' | 'newborn' | 'inHeat' | 'sick';
export type SheepCounterTone = 'blue' | 'pink' | 'amber' | 'green' | 'red';

export interface SheepCounterItem {
  id: SheepCounterId;
  label: string;
  value: number;
  tone: SheepCounterTone;
}

export interface SheepCounterSnapshot {
  title: string;
  subtitle: string;
  videoLabel: string;
  lastUpdatedLabel: string;
  detectedSheep: number;
  counters: SheepCounterItem[];
}
