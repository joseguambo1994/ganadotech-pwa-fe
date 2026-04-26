import { VideoFrameContext } from '../models/sheep-monitoring.models';

export abstract class SheepMonitoringSourcePort {
  abstract getVideoSource(): string;
  abstract getPosterSource(): string;
  abstract getInitialFrameContext(): VideoFrameContext;
  abstract buildFrameContext(
    currentTimeInSeconds: number,
    durationInSeconds: number,
  ): VideoFrameContext;
}
