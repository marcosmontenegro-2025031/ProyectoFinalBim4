import { Routes } from '@angular/router';

import { MisReportesComponent } from './components/mis-reportes/mis-reportes.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { MapaComponent } from './components/mapa/mapa.component';

import { NotificacionesComponent } from './components/notificaciones/notificaciones';

export const routes: Routes = [
  { path: 'reportes/nuevo', component: ReporteComponent },
  { path: 'reportes/mis-reportes', component: MisReportesComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: '', redirectTo: 'reportes/nuevo', pathMatch: 'full' },
  { path: '**', redirectTo: 'reportes/nuevo' }
];