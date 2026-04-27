import { Component, HostListener, inject, signal } from '@angular/core';
import { SheepMonitoringFacade } from '../../../application/services/sheep-monitoring.facade';
import { SheepCounterItem, SheepCounterSnapshot } from '../../../domain/models/sheep-monitoring.models';

@Component({
  selector: 'app-sheep-monitoring-page',
  templateUrl: './sheep-monitoring-page.component.html',
  styleUrl: './sheep-monitoring-page.component.css',
})
export class SheepMonitoringPageComponent {
  private readonly monitoringFacade = inject(SheepMonitoringFacade);
  private monitoringVideo?: HTMLVideoElement;
  private hasLoadedInitially = false;

  protected readonly snapshot = signal<SheepCounterSnapshot>(
    this.monitoringFacade.buildInitialSnapshot(),
  );
  protected readonly videoSource = this.monitoringFacade.getVideoSource();
  protected readonly isVideoLoading = signal(true);

  protected handleMetadata(video: HTMLVideoElement): void {
    this.monitoringVideo = video;
    this.startLoopedPlayback(video);
    this.refreshSnapshot(video);
  }

  protected handleCanPlay(video: HTMLVideoElement): void {
    this.monitoringVideo = video;
    if (!this.hasLoadedInitially) {
      this.hasLoadedInitially = true;
      this.isVideoLoading.set(false);
    }
    this.startLoopedPlayback(video);
    this.refreshSnapshot(video);
  }

  protected handleTimeUpdate(video: HTMLVideoElement): void {
    this.refreshSnapshot(video);
  }

  protected trackCounter(_: number, counter: SheepCounterItem): string {
    return counter.id;
  }

  @HostListener('document:visibilitychange')
  protected handleVisibilityChange(): void {
    if (document.visibilityState === 'visible' && this.monitoringVideo) {
      this.startLoopedPlayback(this.monitoringVideo);
    }
  }

  private startLoopedPlayback(video: HTMLVideoElement): void {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    void video.play().catch(() => undefined);
  }

  private refreshSnapshot(video: HTMLVideoElement): void {
    this.snapshot.set(this.monitoringFacade.buildSnapshot(video.currentTime, video.duration));
  }
}
