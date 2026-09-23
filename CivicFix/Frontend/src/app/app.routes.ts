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
import { BitacoraCambioEstadoComponent } from './components/bitacora/bitacora.component';
import { Evidencias } from './components/evidencias/evidencias';
import { Fotografias } from './components/fotografias/fotografias';

import { FormularioRedireccional } from './components/formulario-redireccional/formulario-redireccional.component';
import { DashboardComponent } from './components/admin-home/admin-home.component';
import { UsuarioHome } from './components/usuario-home/usuario-home.component';
import { roleGuard } from './guards/role.guard';
import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin';
import { EmpleadosAdminComponent } from './components/empleados-admin/empleados-admin';
import { DepartamentosAdminComponent } from './components/departamentos-admin/departamentos-admin';
import { ServiciosAdminComponent } from './components/servicios-admin/servicios-admin';
import { TiposIncidenciaAdminComponent } from './components/tipos-incidencia-admin/tipos-incidencia-admin';
import { PrioridadesAdminComponent } from './components/prioridades-admin/prioridades-admin';
import { EstadosAdminComponent } from './components/estados-admin/estados-admin';
import { ReportesAdminComponent } from './components/reportes-admin/reportes-admin';
import { AsignacionesAdminComponent } from './components/asignaciones-admin/asignaciones-admin';
import { BitacoraAdminComponent } from './components/bitacora-admin/bitacora-admin';
import { NotificacionesEmpleadoComponent } from './components/notificaciones-empleado/notificaciones-empleado';
import { PerfilEmpleadoComponent } from './components/perfil-empleado/perfil-empleado.component';

export const routes: Routes = [
  { path: '', redirectTo: 'formulario', pathMatch: 'full' },
  { path: 'login', component: LoginUsuario },
  { path: 'register', component: RegisterUsuario },
  { path: 'empleado-login', component: EmpleadoLogin },
  { path: 'empleado/register', component: EmpleadoRegister },
  { path: 'reportes/nuevo', component: ReporteComponent, canActivate: [roleGuard(['ciudadano'])] },
  { path: 'crear-reporte', redirectTo: 'reportes/nuevo', pathMatch: 'full' },
  { path: 'reportes', redirectTo: 'mis-reportes', pathMatch: 'full' },
  { path: 'reportes/mis-reportes', redirectTo: 'mis-reportes', pathMatch: 'full' },
  { path: 'reportes/mis-reportes/:id', redirectTo: 'detalle-reporte/:id', pathMatch: 'full' },
  { path: 'mis-reportes', component: MisReportesComponent, canActivate: [roleGuard(['ciudadano'])] },
  { path: 'detalle-reporte/:id', component: DetalleReporteComponent, canActivate: [roleGuard(['ciudadano', 'empleado', 'administrador'])] },
  { path: 'mapa', component: MapaComponent, canActivate: [roleGuard(['ciudadano', 'empleado', 'administrador'])] },
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [roleGuard(['ciudadano', 'empleado', 'administrador'])] },
  { path: 'perfil', component: PerfilComponent, canActivate: [roleGuard(['ciudadano'])] },
  { path: 'empleado/home', component: HomeEmpleadoComponent, canActivate: [roleGuard(['empleado'])] },
  { path: 'empleado/incidencias', redirectTo: 'empleado/reportes', pathMatch: 'full' },
  { path: 'empleado/mapa', component: MapaComponent, canActivate: [roleGuard(['empleado', 'administrador'])] },
  { path: 'empleado/notificaciones', component: NotificacionesEmpleadoComponent, canActivate: [roleGuard(['empleado', 'administrador'])] },
  { path: 'home-empleado', redirectTo: 'empleado/home' },
  { path: 'empleado/perfil', component: PerfilEmpleadoComponent, canActivate: [roleGuard(['empleado', 'administrador'])] },
  { path: 'empleado/reportes/:id', redirectTo: 'detalle-reporte/:id', pathMatch: 'full' },
  {
    path: 'empleado/reportes',
    canActivate: [roleGuard(['empleado'])],
    loadComponent: () =>
      import('./components/reportes-empleado/reportes-empleado.component')
        .then(m => m.ReportesEmpleadoComponent)
  },
  { path: 'empleado/asignaciones', component: Asignaciones, canActivate: [roleGuard(['empleado'])] },
  { path: 'empleado/bitacora/:idReporte', component: BitacoraCambioEstadoComponent, canActivate: [roleGuard(['empleado', 'administrador'])] },
  { path: 'empleado/evidencias', component: Evidencias, canActivate: [roleGuard(['empleado'])] },
  { path: 'empleado/fotografias', component: Fotografias, canActivate: [roleGuard(['empleado'])] },
  { path: 'asignaciones', component: Asignaciones, canActivate: [roleGuard(['administrador'])] },
  { path: 'evidencias', component: Evidencias, canActivate: [roleGuard(['administrador'])] },
  { path: 'fotografias', component: Fotografias, canActivate: [roleGuard(['administrador'])] },
  { path: 'formulario', component: FormularioRedireccional },
  { path: 'home-admin', component: DashboardComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/usuarios', component: UsuariosAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/empleados', component: EmpleadosAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/departamentos', component: DepartamentosAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/servicios', component: ServiciosAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/tipos-incidencia', component: TiposIncidenciaAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/prioridades', component: PrioridadesAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/estados', component: EstadosAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/reportes', component: ReportesAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/asignaciones', component: AsignacionesAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'admin/bitacora', component: BitacoraAdminComponent, canActivate: [roleGuard(['administrador'])] },
  { path: 'home-usuario', component: UsuarioHome, canActivate: [roleGuard(['ciudadano'])] },
  { path: '**', redirectTo: 'formulario' }
];
