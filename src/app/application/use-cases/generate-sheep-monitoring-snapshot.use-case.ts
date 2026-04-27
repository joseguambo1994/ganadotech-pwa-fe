import { Injectable } from '@angular/core';
import {
  SheepCounterId,
  SheepCounterItem,
  SheepCounterSnapshot,
  VideoFrameContext,
} from '../../domain/models/sheep-monitoring.models';

@Injectable({ providedIn: 'root' })
export class GenerateSheepMonitoringSnapshotUseCase {
  private readonly scenarios: Record<SheepCounterId, number>[] = [
    { male: 1, female: 6, newborn: 2, inHeat: 4, sick: 2, forSale: 3 },
    { male: 1, female: 5, newborn: 2, inHeat: 3, sick: 1, forSale: 2 },
    { male: 2, female: 6, newborn: 1, inHeat: 4, sick: 2, forSale: 4 },
    { male: 1, female: 6, newborn: 2, inHeat: 5, sick: 2, forSale: 3 },
  ];

  execute(frame: VideoFrameContext): SheepCounterSnapshot {
    const scenarioIndex = Math.min(
      Math.floor(frame.progressRatio * this.scenarios.length),
      this.scenarios.length - 1,
    );
    const scenario = this.scenarios[Math.max(scenarioIndex, 0)];
    const counters = this.buildCounters(scenario);
    const detectedSheep = scenario.male + scenario.female + scenario.newborn;

    return {
      title: 'Monitoreo',
      lastUpdatedLabel: `Frame ${frame.elapsedLabel}`,
      detectedSheep,
      counters,
    };
  }

  private buildCounters(scenario: Record<SheepCounterId, number>): SheepCounterItem[] {
    return [
      {
        id: 'male',
        label: 'Machos',
        value: scenario.male,
        tone: 'blue',
      },
      {
        id: 'female',
        label: 'Hembras',
        value: scenario.female,
        tone: 'pink',
      },
      {
        id: 'newborn',
        label: 'Nuevas crias',
        value: scenario.newborn,
        tone: 'amber',
      },
      {
        id: 'inHeat',
        label: 'En celo',
        value: scenario.inHeat,
        tone: 'green',
      },
      {
        id: 'sick',
        label: 'Enfermos',
        value: scenario.sick,
        tone: 'red',
      },
      {
        id: 'forSale',
        label: 'Para venta',
        value: scenario.forSale,
        tone: 'brown',
      },
    ];
  }
}
