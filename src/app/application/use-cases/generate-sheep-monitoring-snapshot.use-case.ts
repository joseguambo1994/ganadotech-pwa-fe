import { Injectable } from '@angular/core';
import {
  MonitoringMetric,
  MonitoringSeverity,
  PaddockInsight,
  SheepAlert,
  SheepMonitoringSnapshot,
  VideoFrameContext,
} from '../../domain/models/sheep-monitoring.models';

@Injectable({ providedIn: 'root' })
export class GenerateSheepMonitoringSnapshotUseCase {
  private readonly herdSize = 48;

  execute(frame: VideoFrameContext): SheepMonitoringSnapshot {
    const rhythm = frame.progressRatio * Math.PI * 2;
    const activityScore = this.normalize(0.62 + Math.sin(rhythm + 0.85) * 0.18);
    const fenceRiskScore = this.normalize(0.36 + Math.cos(rhythm * 1.7) * 0.22);
    const hydrationScore = this.normalize(0.74 + Math.sin(rhythm * 0.8 - 0.6) * 0.16);
    const thermalComfortScore = this.normalize(0.7 + Math.cos(rhythm * 1.2 - 0.4) * 0.2);
    const signalScore = this.normalize(0.88 + Math.sin(rhythm * 0.55) * 0.08);

    const visibleSheep = Math.round(this.herdSize * frame.visibilityBaseline);
    const activeSheep = Math.round(visibleSheep * activityScore);
    const restingSheep = Math.max(visibleSheep - activeSheep, 0);
    const fenceWatchSheep = Math.round(this.herdSize * fenceRiskScore * 0.32);

    const metrics = [
      this.createMetric(
        'Herd visibility',
        `${Math.round((visibleSheep / this.herdSize) * 100)}%`,
        `${visibleSheep} of ${this.herdSize} sheep remain in frame coverage`,
        this.toSeverity(visibleSheep / this.herdSize, 0.64, 0.5),
        'steady',
      ),
      this.createMetric(
        'Grazing activity',
        `${Math.round(activityScore * 100)}%`,
        `${activeSheep} sheep are moving through the pasture corridor`,
        this.toSeverity(activityScore, 0.58, 0.42),
        activityScore > 0.68 ? 'up' : activityScore < 0.45 ? 'down' : 'steady',
      ),
      this.createMetric(
        'Fence proximity',
        `${fenceWatchSheep} sheep`,
        'Animals nearing the southern edge fence line',
        fenceWatchSheep <= 4 ? 'stable' : fenceWatchSheep <= 7 ? 'attention' : 'critical',
        fenceWatchSheep >= 7 ? 'up' : 'steady',
      ),
      this.createMetric(
        'Hydration confidence',
        `${Math.round(hydrationScore * 100)}%`,
        'Projected drinking pattern from movement density around trough access',
        this.toSeverity(hydrationScore, 0.62, 0.48),
        hydrationScore > 0.75 ? 'up' : hydrationScore < 0.55 ? 'down' : 'steady',
      ),
      this.createMetric(
        'Thermal comfort',
        `${Math.round(thermalComfortScore * 100)}%`,
        'Comfort proxy inferred from cluster spacing and grazing pace',
        this.toSeverity(thermalComfortScore, 0.6, 0.44),
        thermalComfortScore > 0.72 ? 'up' : thermalComfortScore < 0.54 ? 'down' : 'steady',
      ),
      this.createMetric(
        'Edge connectivity',
        `${Math.round(signalScore * 100)}%`,
        'Upload readiness for the next sensor sync batch',
        signalScore > 0.76 ? 'stable' : signalScore > 0.58 ? 'attention' : 'critical',
        signalScore > 0.84 ? 'up' : 'steady',
      ),
    ];

    const alerts = this.buildAlerts({
      visibleSheep,
      activeSheep,
      fenceWatchSheep,
      hydrationScore,
      thermalComfortScore,
    });

    return {
      herdLabel: 'Sheep Monitoring Simulation',
      streamLabel: 'GanadoTech pasture demo',
      streamHealth: signalScore > 0.78 ? 'Stable uplink' : 'Edge sync degraded',
      lastUpdatedLabel: `Frame ${frame.elapsedLabel}`,
      totalSheep: this.herdSize,
      visibleSheep,
      activeSheep,
      restingSheep,
      metrics,
      alerts,
      paddocks: this.buildPaddocks(activityScore, hydrationScore, thermalComfortScore),
      recommendations: this.buildRecommendations(alerts),
    };
  }

  private buildAlerts(data: {
    visibleSheep: number;
    activeSheep: number;
    fenceWatchSheep: number;
    hydrationScore: number;
    thermalComfortScore: number;
  }): SheepAlert[] {
    const alerts: SheepAlert[] = [];

    if (data.fenceWatchSheep >= 7) {
      alerts.push({
        id: 'fence-risk',
        title: 'Fence congestion detected',
        detail: `${data.fenceWatchSheep} sheep are clustering near the southern fence corridor.`,
        action: 'Dispatch a perimeter check and rebalance the flock with feed or shade.',
        severity: 'critical',
      });
    } else {
      alerts.push({
        id: 'fence-watch',
        title: 'Perimeter movement under control',
        detail: `${data.fenceWatchSheep} sheep are close to the boundary zone.`,
        action: 'Keep passive watch on the southern paddock edge.',
        severity: data.fenceWatchSheep >= 5 ? 'attention' : 'stable',
      });
    }

    if (data.hydrationScore < 0.58) {
      alerts.push({
        id: 'water-check',
        title: 'Water access confidence falling',
        detail: 'Movement around the trough lane suggests the flock may need a water check.',
        action: 'Inspect the primary trough and verify flow before the next rotation.',
        severity: data.hydrationScore < 0.48 ? 'critical' : 'attention',
      });
    }

    if (data.thermalComfortScore < 0.56) {
      alerts.push({
        id: 'heat-comfort',
        title: 'Thermal comfort drift',
        detail: 'Cluster density and movement pace indicate rising comfort pressure.',
        action: 'Open the shaded paddock route or shorten the current grazing window.',
        severity: data.thermalComfortScore < 0.46 ? 'critical' : 'attention',
      });
    }

    if (data.visibleSheep < 31) {
      alerts.push({
        id: 'visibility-gap',
        title: 'Coverage gap in the camera view',
        detail: 'Several sheep moved outside the visible lane of the simulated feed.',
        action: 'Reposition the camera or widen the monitoring zone before field rollout.',
        severity: 'attention',
      });
    }

    if (alerts.length === 1 && alerts[0].severity === 'stable') {
      alerts.push({
        id: 'grazing-rhythm',
        title: 'Grazing rhythm looks healthy',
        detail: `${data.activeSheep} sheep remain active while the rest maintain a stable resting pattern.`,
        action: 'Keep the current rotation and monitor the next hydration cycle.',
        severity: 'stable',
      });
    }

    return alerts;
  }

  private buildPaddocks(
    activityScore: number,
    hydrationScore: number,
    thermalComfortScore: number,
  ): PaddockInsight[] {
    return [
      {
        zone: 'North grazing lane',
        occupancy: `${Math.round(activityScore * 22)} sheep moving`,
        vegetation: 'Dense cover with steady bite rate',
        waterAccess: hydrationScore > 0.66 ? 'Trough lane flowing well' : 'Queue forming at trough lane',
        condition: activityScore > 0.6 ? 'stable' : 'attention',
      },
      {
        zone: 'Central shade pocket',
        occupancy: `${Math.round((1 - activityScore) * 14 + 6)} sheep resting`,
        vegetation: 'Short grass with shade retention',
        waterAccess: 'Low-demand resting zone',
        condition: thermalComfortScore > 0.58 ? 'stable' : 'attention',
      },
      {
        zone: 'South fence corridor',
        occupancy: `${Math.round((1 - hydrationScore) * 8 + 3)} sheep lingering`,
        vegetation: 'Patchy regrowth near boundary',
        waterAccess: 'Requires manual walkthrough during alerts',
        condition: hydrationScore > 0.54 ? 'attention' : 'critical',
      },
    ];
  }

  private buildRecommendations(alerts: SheepAlert[]): string[] {
    const criticalAlert = alerts.find((alert) => alert.severity === 'critical');
    if (criticalAlert) {
      return [
        criticalAlert.action,
        'Validate camera placement before integrating live inference hardware.',
        'Log this segment as a reference clip for paddock anomaly review.',
      ];
    }

    const attentionAlert = alerts.find((alert) => alert.severity === 'attention');
    if (attentionAlert) {
      return [
        attentionAlert.action,
        'Review trough coverage against the next grazing rotation window.',
        'Keep edge connectivity above 75% before sensor rollout.',
      ];
    }

    return [
      'Maintain the current route rotation and continue passive monitoring.',
      'Use this demo feed to validate dashboard thresholds with field staff.',
      'Prepare the next step: replace the simulated clip with the live paddock stream.',
    ];
  }

  private createMetric(
    label: string,
    value: string,
    detail: string,
    severity: MonitoringSeverity,
    trend: MonitoringMetric['trend'],
  ): MonitoringMetric {
    return { label, value, detail, severity, trend };
  }

  private toSeverity(value: number, stableThreshold: number, attentionThreshold: number): MonitoringSeverity {
    if (value >= stableThreshold) {
      return 'stable';
    }

    if (value >= attentionThreshold) {
      return 'attention';
    }

    return 'critical';
  }

  private normalize(value: number): number {
    return Math.min(Math.max(value, 0), 1);
  }
}
