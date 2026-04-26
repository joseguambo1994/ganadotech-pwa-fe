import { inject, Injectable } from '@angular/core';
import { SheepCounterSnapshot } from '../../domain/models/sheep-monitoring.models';
import { SheepMonitoringSourcePort } from '../../domain/ports/sheep-monitoring-source.port';
import { GenerateSheepMonitoringSnapshotUseCase } from '../use-cases/generate-sheep-monitoring-snapshot.use-case';

@Injectable({ providedIn: 'root' })
export class SheepMonitoringFacade {
  private readonly source = inject(SheepMonitoringSourcePort);
  private readonly generateSnapshot = inject(GenerateSheepMonitoringSnapshotUseCase);

  getVideoSource(): string {
    return this.source.getVideoSource();
  }

  getPosterSource(): string {
    return this.source.getPosterSource();
  }

  buildInitialSnapshot(): SheepCounterSnapshot {
    return this.generateSnapshot.execute(this.source.getInitialFrameContext());
  }

  buildSnapshot(currentTimeInSeconds: number, durationInSeconds: number): SheepCounterSnapshot {
    const frame = this.source.buildFrameContext(currentTimeInSeconds, durationInSeconds);
    return this.generateSnapshot.execute(frame);
  }
}
