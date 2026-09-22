import { Routes } from '@angular/router';

import { ReporteComponent } from './components/reporte/reporte.component';
import { MisReportesComponent } from './components/mis-reportes/mis-reportes.component';
import { DetalleReporteComponent } from './components/detalle-reporte/detalle-reporte';
import { MapaComponent } from './components/mapa/mapa.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { PerfilComponent } from './components/perfil-usuario/perfil-usuario';

import { LoginUsuario } from './components/login-usuario/login-usuario.component';
import { RegisterUsuario } from './components/register-usuario/register-usuario.component';
import { EmpleadoLogin } from './components/empleado-login/empleado-login.component';
import { EmpleadoRegister } from './components/empleado-register/empleado-register.component';

import { HomeEmpleadoComponent } from './components/home-empleado/home-empleado';
import { Asignaciones } from './components/asignaciones/asignaciones';
import { Bitacora } from './components/bitacora/bitacora';
import { Evidencias } from './components/evidencias/evidencias';
import { Fotografias } from './components/fotografias/fotografias';

import { FormularioRedireccional } from './components/formulario-redireccional/formulario-redireccional.component';
import { DashboardComponent } from './components/admin-home/admin-home.component';
import { UsuarioHome } from './components/usuario-home/usuario-home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'reportes/nuevo', pathMatch: 'full' },
  { path: 'login', component: LoginUsuario },
  { path: 'register', component: RegisterUsuario },
  { path: 'empleado-login', component: EmpleadoLogin },
  { path: 'empleado/register', component: EmpleadoRegister },
  { path: 'reportes/nuevo', component: ReporteComponent },
  { path: 'mis-reportes', component: MisReportesComponent },
  { path: 'detalle-reporte/:id', component: DetalleReporteComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'empleado/home', component: HomeEmpleadoComponent },
  {
    path: 'empleado/reportes',
    loadComponent: () =>
      import('./components/reportes-empleado/reportes-empleado')
        .then(m => m.ReportesEmpleadoComponent)
  },
  { path: 'empleado/asignaciones', component: Asignaciones },
  { path: 'empleado/bitacora', component: Bitacora },
  { path: 'empleado/evidencias', component: Evidencias },
  { path: 'empleado/fotografias', component: Fotografias },
  { path: 'asignaciones', component: Asignaciones },
  { path: 'bitacora', component: Bitacora },
  { path: 'evidencias', component: Evidencias },
  { path: 'fotografias', component: Fotografias },
  { path: 'formulario', component: FormularioRedireccional },
  { path: 'home-admin', component: DashboardComponent },
  { path: 'home-usuario', component: UsuarioHome },
  { path: '**', redirectTo: 'reportes/nuevo' }
];
