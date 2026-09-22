import { Routes } from '@angular/router';

import { ReporteComponent } from './components/reporte/reporte.component';
import { MisReportesComponent } from './components/mis-reportes/mis-reportes.component';
import { DetalleReporteComponent } from './components/detalle-reporte/detalle-reporte';
import { MapaComponent } from './components/mapa/mapa.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { PerfilComponent } from './components/perfil-usuario/perfil-usuario';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'reportes/nuevo',
    pathMatch: 'full'
  },
  {
    path: 'reportes/nuevo',
    component: ReporteComponent
  },
  {
    path: 'mis-reportes',
    component: MisReportesComponent
  },
  {
    path: 'detalle-reporte/:id',
    component: DetalleReporteComponent
  },
  {
    path: 'mapa',
    component: MapaComponent
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: '**',
    redirectTo: 'reportes/nuevo'
  }
];