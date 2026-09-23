import { Routes } from '@angular/router';

import { ReporteComponent } from './components/reporte/reporte.component';
import { MisReportesComponent } from './components/mis-reportes/mis-reportes.component';
import { DetalleReporteComponent } from './components/detalle-reporte/detalle-reporte';
import { MapaComponent } from './components/mapa/mapa.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario';

import { LoginUsuario } from './components/login-usuario/login-usuario.component';
import { RegisterUsuario } from './components/register-usuario/register-usuario.component';

import { EmpleadoLogin } from './components/empleado-login/empleado-login.component';
import { EmpleadoRegister } from './components/empleado-register/empleado-register.component';

import { HomeEmpleadoComponent } from './components/home-empleado/home-empleado';
import { Asignaciones } from './components/asignaciones/asignaciones';
import { Bitacora } from './components/bitacora/bitacora';
import { Evidencias } from './components/evidencias/evidencias';
import { Fotografias } from './components/fotografias/fotografias';
import { ReportesEmpleadoComponent } from './components/reportes-empleado/reportes-empleado';

import { FormularioRedireccional } from './components/formulario-redireccional/formulario-redireccional.component';
import { DashboardComponent } from './components/admin-home/admin-home.component';
import { UsuarioHome } from './components/usuario-home/usuario-home.component';

import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginUsuario
  },

  {
    path: 'register',
    component: RegisterUsuario
  },

  {
    path: 'empleado-login',
    component: EmpleadoLogin
  },

  {
    path: 'empleado/register',
    component: EmpleadoRegister
  },

  {
    path: 'home-usuario',
    component: UsuarioHome,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'reportes/nuevo',
    component: ReporteComponent,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'reportes/mis-reportes',
    component: MisReportesComponent,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'mis-reportes',
    redirectTo: 'reportes/mis-reportes',
    pathMatch: 'full'
  },

  {
    path: 'detalle-reporte/:id',
    component: DetalleReporteComponent,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'mapa',
    component: MapaComponent,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'notificaciones',
    component: NotificacionesComponent,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'perfil',
    component: PerfilUsuarioComponent,
    canActivate: [
      roleGuard(['ciudadano'])
    ]
  },

  {
    path: 'empleado/home',
    component: HomeEmpleadoComponent,
    canActivate: [
      roleGuard(['empleado', 'administrador'])
    ]
  },

  {
    path: 'empleado/reportes',
    component: ReportesEmpleadoComponent,
    canActivate: [
      roleGuard(['empleado', 'administrador'])
    ]
  },

  {
    path: 'empleado/asignaciones',
    component: Asignaciones,
    canActivate: [
      roleGuard(['empleado', 'administrador'])
    ]
  },

  {
    path: 'empleado/bitacora',
    component: Bitacora,
    canActivate: [
      roleGuard(['empleado', 'administrador'])
    ]
  },

  {
    path: 'empleado/evidencias',
    component: Evidencias,
    canActivate: [
      roleGuard(['empleado', 'administrador'])
    ]
  },

  {
    path: 'empleado/fotografias',
    component: Fotografias,
    canActivate: [
      roleGuard(['empleado', 'administrador'])
    ]
  },

  {
    path: 'formulario',
    component: FormularioRedireccional
  },

  {
    path: 'home-admin',
    component: DashboardComponent,
    canActivate: [
      roleGuard(['administrador'])
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];