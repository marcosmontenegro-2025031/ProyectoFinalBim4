import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { SessionService } from '../../services/session.service';

interface UsuarioPerfil {
  id_usuario: number;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: string;
  fechaRegistro: string;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './perfil-usuario.html',
  styleUrls: ['./perfil-usuario.css']
})
export class PerfilUsuarioComponent implements OnInit {

  usuario: UsuarioPerfil = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: 'ciudadano',
    fechaRegistro: ''
  };

  usuarioOriginal: UsuarioPerfil = {
    id_usuario: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: 'ciudadano',
    fechaRegistro: ''
  };

  editando = false;
  mostrarSeguridad = false;

  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  mostrarPasswordActual = false;
  mostrarNuevaPassword = false;
  mostrarConfirmarPassword = false;

  estadisticas = {
    reportes: 0,
    pendientes: 0,
    proceso: 0,
    resueltos: 0
  };

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    const usuarioSesion = this.sessionService.obtenerUsuario<any>();

    if (!usuarioSesion) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = {
      id_usuario: Number(
        usuarioSesion.id_usuario ??
        usuarioSesion.id ??
        0
      ),
      nombre: usuarioSesion.nombre ?? '',
      apellido: usuarioSesion.apellido ?? '',
      usuario: usuarioSesion.usuario ?? '',
      correo: usuarioSesion.correo ?? '',
      telefono: usuarioSesion.telefono ?? '',
      direccion: usuarioSesion.direccion ?? '',
      rol: usuarioSesion.rol ?? 'ciudadano',
      fechaRegistro: this.formatearFechaRegistro(
        usuarioSesion.fechaRegistro ??
        usuarioSesion.fecha_registro ??
        usuarioSesion.createdAt ??
        usuarioSesion.created_at
      )
    };

    this.usuarioOriginal = {
      ...this.usuario
    };
  }

  private formatearFechaRegistro(fecha: any): string {
    if (!fecha) {
      return 'No disponible';
    }

    const fechaConvertida = new Date(fecha);

    if (isNaN(fechaConvertida.getTime())) {
      return String(fecha);
    }

    return fechaConvertida.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  obtenerNombreCompleto(): string {
    return `${this.usuario.nombre} ${this.usuario.apellido}`.trim();
  }

  obtenerRolTexto(): string {
    switch (this.usuario.rol?.toLowerCase()) {
      case 'ciudadano':
        return 'Ciudadano';

      case 'empleado':
        return 'Empleado';

      case 'administrador':
      case 'admin':
        return 'Administrador';

      default:
        return this.usuario.rol || 'Ciudadano';
    }
  }

  volverReportes(): void {
    this.router.navigate(['/reportes/mis-reportes']);
  }

  crearReporte(): void {
    this.router.navigate(['/reportes/nuevo']);
  }

  irNotificaciones(): void {
    this.router.navigate(['/notificaciones']);
  }

  activarEdicion(): void {
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.usuario = {
      ...this.usuarioOriginal
    };

    this.editando = false;
  }

  guardarCambios(): void {
    this.usuarioOriginal = {
      ...this.usuario
    };

    this.editando = false;
  }

  abrirConfiguracionSeguridad(): void {
    this.mostrarSeguridad = true;
    this.limpiarPassword();
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
    this.mostrarSeguridad = false;
  }
}