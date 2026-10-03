import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { ReporteService } from '../../services/reporte.service';
import { UnreadNotificationCountComponent } from '../../shared/unread-notification-count/unread-notification-count.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UnreadNotificationCountComponent
  ],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilComponent {

  usuario = {
    nombre: '',
    usuario: '',
    correo: '',
    telefono: '',
    direccion: '—',
    fechaRegistro: '—',
    rol: 'Ciudadano'
  };

  estadisticas = {
    reportes: 0,
    pendientes: 0,
    proceso: 0,
    resueltos: 0
  };

  editando = false;

  mostrarSeguridad = false;

  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  mostrarPasswordActual = false;
  mostrarNuevaPassword = false;
  mostrarConfirmarPassword = false;

  constructor(
    private router: Router,
    private session: SessionService,
    private reporteService: ReporteService
  ) {
    const usuarioSesion = this.session.obtenerUsuario<Record<string, unknown>>();
    if (usuarioSesion) {
      const nombre = String(usuarioSesion['nombre'] ?? usuarioSesion['nombres'] ?? '').trim();
      const apellido = String(usuarioSesion['apellido'] ?? usuarioSesion['apellidos'] ?? '').trim();
      this.usuario = {
        ...this.usuario,
        nombre: `${nombre} ${apellido}`.trim() || this.session.obtenerNombreUsuario(),
        usuario: String(usuarioSesion['usuario'] ?? usuarioSesion['nombre_usuario'] ?? ''),
        correo: String(usuarioSesion['correo'] ?? ''),
        telefono: String(usuarioSesion['telefono'] ?? ''),
        rol: this.session.obtenerEtiquetaRol()
      };
    }

    this.cargarResumenActividad();
  }

  private cargarResumenActividad(): void {
    this.reporteService.obtenerMisReportes().subscribe({
      next: reportes => {
        const estados = (Array.isArray(reportes) ? reportes : []).map(reporte =>
          (reporte.estado || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );

        this.estadisticas = {
          reportes: estados.length,
          pendientes: estados.filter(estado => ['pendiente', 'recibido', 'en revision'].includes(estado)).length,
          proceso: estados.filter(estado => ['asignado', 'en proceso'].includes(estado)).length,
          resueltos: estados.filter(estado => ['resuelto', 'resuelta'].includes(estado)).length
        };
      },
      error: error => {
        console.error('Error al cargar el resumen de actividad:', error);
      }
    });
  }

  activarEdicion(): void {
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.editando = false;
  }

  guardarCambios(): void {
    this.editando = false;
  }

  volverReportes(): void {
    this.router.navigate(['/mis-reportes']);
  }

  crearReporte(): void {
    this.router.navigate(['/crear-reporte']);
  }

  irNotificaciones(): void {
    this.router.navigate(['/notificaciones']);
  }

  abrirConfiguracionSeguridad(): void {
    this.mostrarSeguridad = true;
    this.editando = false;
  }

  cerrarConfiguracionSeguridad(): void {
    this.mostrarSeguridad = false;
    this.limpiarPassword();
  }

  limpiarPassword(): void {
    this.passwordActual = '';
    this.nuevaPassword = '';
    this.confirmarPassword = '';

    this.mostrarPasswordActual = false;
    this.mostrarNuevaPassword = false;
    this.mostrarConfirmarPassword = false;
  }

  actualizarPassword(): void {
    if (
      !this.passwordActual ||
      !this.nuevaPassword ||
      !this.confirmarPassword
    ) {
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      return;
    }

    this.limpiarPassword();
  }
}