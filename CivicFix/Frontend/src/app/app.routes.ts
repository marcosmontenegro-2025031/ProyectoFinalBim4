import { Routes } from '@angular/router';

import { MisReportesComponent } from './components/mis-reportes/mis-reportes.component';
import { ReporteComponent } from './components/reporte/reporte.component';

export const routes: Routes = [

  {
    path: 'reportes',
    component: MisReportesComponent
  },

  {
    path: 'reportes/nuevo',
    component: ReporteComponent
  },

  {
    path: '',
    redirectTo: 'reportes',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'reportes'
  }

];