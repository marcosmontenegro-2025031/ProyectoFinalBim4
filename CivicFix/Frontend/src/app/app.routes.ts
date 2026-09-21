import { Routes } from '@angular/router';
import { ReporteComponent } from './components/reporte/reporte.component';
import { MisReportesComponent } from './components/mis-reportes/mis-reportes.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { HomeComponent } from './components/home-usuario/home-usuario';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home-usuario/home-usuario').then(
        m => m.HomeComponent
      )
  },
  {
    path: 'crear-reporte',
    loadComponent: () =>
      import('./components/reporte/reporte.component').then(
        m => m.ReporteComponent
      )
  },
  {
    path: 'mis-reportes',
    loadComponent: () =>
      import('./components/mis-reportes/mis-reportes.component').then(
        m => m.MisReportesComponent
      )
  },
  {
    path: 'notificaciones',
    loadComponent: () =>
      import('./components/notificaciones/notificaciones').then(
        m => m.NotificacionesComponent
      )
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

