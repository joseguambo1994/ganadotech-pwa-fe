export type MonitoringSeverity = 'stable' | 'attention' | 'critical';
export type MetricTrend = 'up' | 'steady' | 'down';

export interface VideoFrameContext {
  currentTimeInSeconds: number;
  durationInSeconds: number;
  progressRatio: number;
  elapsedLabel: string;
  visibilityBaseline: number;
}

export interface MonitoringMetric {
  label: string;
  value: string;
  detail: string;
  severity: MonitoringSeverity;
  trend: MetricTrend;
}

export interface SheepAlert {
  id: string;
  title: string;
  detail: string;
  action: string;
  severity: MonitoringSeverity;
}

export interface PaddockInsight {
  zone: string;
  occupancy: string;
  vegetation: string;
  waterAccess: string;
  condition: MonitoringSeverity;
}

export interface SheepMonitoringSnapshot {
  herdLabel: string;
  streamLabel: string;
  streamHealth: string;
  lastUpdatedLabel: string;
  totalSheep: number;
  visibleSheep: number;
  activeSheep: number;
  restingSheep: number;
  metrics: MonitoringMetric[];
  alerts: SheepAlert[];
  paddocks: PaddockInsight[];
  recommendations: string[];
}
