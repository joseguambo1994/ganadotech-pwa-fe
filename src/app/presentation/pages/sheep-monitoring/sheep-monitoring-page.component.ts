import { Component, computed, inject, signal } from '@angular/core';
import { SheepMonitoringFacade } from '../../../application/services/sheep-monitoring.facade';
import {
  MonitoringMetric,
  PaddockInsight,
  SheepAlert,
  SheepMonitoringSnapshot,
} from '../../../domain/models/sheep-monitoring.models';

@Component({
  selector: 'app-sheep-monitoring-page',
  templateUrl: './sheep-monitoring-page.component.html',
  styleUrl: './sheep-monitoring-page.component.css',
})
export class SheepMonitoringPageComponent {
  private readonly monitoringFacade = inject(SheepMonitoringFacade);

  protected readonly snapshot = signal<SheepMonitoringSnapshot>(
    this.monitoringFacade.buildInitialSnapshot(),
  );
  protected readonly videoSource = this.monitoringFacade.getVideoSource();
  protected readonly posterSource = this.monitoringFacade.getPosterSource();
  protected readonly isPlaying = signal(false);
  protected readonly playbackLabel = computed(() =>
    this.isPlaying() ? 'Simulation running' : 'Simulation paused',
  );
  protected readonly visibleRatio = computed(() =>
    Math.round((this.snapshot().visibleSheep / this.snapshot().totalSheep) * 100),
  );

  protected handleMetadata(video: HTMLVideoElement): void {
    this.refreshSnapshot(video);
  }

  protected handleTimeUpdate(video: HTMLVideoElement): void {
    this.refreshSnapshot(video);
  }

  protected handlePlay(): void {
    this.isPlaying.set(true);
  }

  protected handlePause(): void {
    this.isPlaying.set(false);
  }

  protected togglePlayback(video: HTMLVideoElement): void {
    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  }

  protected restart(video: HTMLVideoElement): void {
    video.currentTime = 0;
    this.refreshSnapshot(video);
  }

  protected trackMetric(_: number, metric: MonitoringMetric): string {
    return metric.label;
  }

  protected trackAlert(_: number, alert: SheepAlert): string {
    return alert.id;
  }

  protected trackPaddock(_: number, paddock: PaddockInsight): string {
    return paddock.zone;
  }

  private refreshSnapshot(video: HTMLVideoElement): void {
    this.snapshot.set(this.monitoringFacade.buildSnapshot(video.currentTime, video.duration));
  }
}
