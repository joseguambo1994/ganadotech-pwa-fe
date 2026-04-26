import { Injectable } from '@angular/core';
import { SheepMonitoringSourcePort } from '../../domain/ports/sheep-monitoring-source.port';
import { VideoFrameContext } from '../../domain/models/sheep-monitoring.models';

@Injectable()
export class DemoVideoMonitoringSource extends SheepMonitoringSourcePort {
  private readonly defaultDurationInSeconds = 164;

  override getVideoSource(): string {
    return '/ganadotech.mp4';
  }

  override getPosterSource(): string {
    return '/ganadotech.png';
  }

  override getInitialFrameContext(): VideoFrameContext {
    return this.buildFrameContext(0, this.defaultDurationInSeconds);
  }

  override buildFrameContext(
    currentTimeInSeconds: number,
    durationInSeconds: number,
  ): VideoFrameContext {
    const safeDuration = durationInSeconds > 0 ? durationInSeconds : this.defaultDurationInSeconds;
    const safeCurrentTime = Math.max(0, Math.min(currentTimeInSeconds, safeDuration));
    const progressRatio = safeDuration === 0 ? 0 : safeCurrentTime / safeDuration;

    return {
      currentTimeInSeconds: safeCurrentTime,
      durationInSeconds: safeDuration,
      progressRatio,
      elapsedLabel: this.formatClock(safeCurrentTime),
    };
  }

  private formatClock(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
