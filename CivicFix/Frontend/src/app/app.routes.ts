import { Routes } from '@angular/router';
import { Asignaciones } from './components/asignaciones/asignaciones';
import { Bitacora } from './components/bitacora/bitacora';
import { Evidencias } from './components/evidencias/evidencias';
import { Fotografias } from './components/fotografias/fotografias';
import { Notificaciones } from './components/notificaciones/notificaciones';
import { AdminComponent } from './components/admin/admin.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { ReporteComponent } from './components/reporte/reporte.component';

export const routes: Routes = [
    { path: 'asignaciones', component: Asignaciones },
    { path: 'bitacora', component: Bitacora },
    { path: 'evidencias', component: Evidencias },
    { path: 'fotografias', component: Fotografias },
    { path: 'notificaciones', component: Notificaciones },
    { path: '', redirectTo: 'reportes', pathMatch: 'full' },
    { path: 'reportes', component: ReporteComponent, title: 'CivicFix - Crear Reporte' },
    { path: 'mapa', component: MapaComponent, title: 'CivicFix - Mapa Interactivo' },
    { path: 'admin', component: AdminComponent, title: 'CivicFix - Panel Municipal' },
    { path: '**', redirectTo: 'reportes' }
];
