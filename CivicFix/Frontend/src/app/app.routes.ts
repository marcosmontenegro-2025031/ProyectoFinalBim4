import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Asignaciones } from './components/asignaciones/asignaciones';
import { Bitacora } from './components/bitacora/bitacora';
import { Evidencias } from './components/evidencias/evidencias';
import { Fotografias } from './components/fotografias/fotografias';
import { Notificaciones } from './components/notificaciones/notificaciones';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'asignaciones', component: Asignaciones },
    { path: 'bitacora', component: Bitacora },
    { path: 'evidencias', component: Evidencias },
    { path: 'fotografias', component: Fotografias },
    { path: 'notificaciones', component: Notificaciones }
];
