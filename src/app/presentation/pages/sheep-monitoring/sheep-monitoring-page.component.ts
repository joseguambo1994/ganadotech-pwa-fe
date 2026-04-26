import { Component, computed, inject, signal } from '@angular/core';
import { SheepMonitoringFacade } from '../../../application/services/sheep-monitoring.facade';
import { SheepCounterItem, SheepCounterSnapshot } from '../../../domain/models/sheep-monitoring.models';

@Component({
  selector: 'app-sheep-monitoring-page',
  templateUrl: './sheep-monitoring-page.component.html',
  styleUrl: './sheep-monitoring-page.component.css',
})
export class SheepMonitoringPageComponent {
  private readonly monitoringFacade = inject(SheepMonitoringFacade);

  protected readonly snapshot = signal<SheepCounterSnapshot>(
    this.monitoringFacade.buildInitialSnapshot(),
  );
  protected readonly videoSource = this.monitoringFacade.getVideoSource();
  protected readonly posterSource = this.monitoringFacade.getPosterSource();
  protected readonly detectedSheepLabel = computed(() => `${this.snapshot().detectedSheep} detectadas`);

  protected handleMetadata(video: HTMLVideoElement): void {
    this.refreshSnapshot(video);
  }

  protected handleTimeUpdate(video: HTMLVideoElement): void {
    this.refreshSnapshot(video);
  }

  protected trackCounter(_: number, counter: SheepCounterItem): string {
    return counter.id;
  }

  private refreshSnapshot(video: HTMLVideoElement): void {
    this.snapshot.set(this.monitoringFacade.buildSnapshot(video.currentTime, video.duration));
  }
}
