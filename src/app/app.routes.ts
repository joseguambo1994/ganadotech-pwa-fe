import { Routes } from '@angular/router';
import { SheepMonitoringPageComponent } from './presentation/pages/sheep-monitoring/sheep-monitoring-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SheepMonitoringPageComponent,
    title: 'GanadoTech | Sheep Monitoring',
  },
];
