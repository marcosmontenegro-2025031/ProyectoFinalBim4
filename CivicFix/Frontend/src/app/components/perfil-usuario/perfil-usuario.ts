<<<<<<< HEAD
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
=======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
>>>>>>> fix-jaquino-2025376
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
<<<<<<< HEAD
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
=======
    RouterModule
  ],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilComponent {

  usuario = {
    nombre: 'Juan Pérez',
    usuario: 'juanperez',
    correo: 'juan.perez@gmail.com',
    telefono: '5555-1234',
    direccion: 'Zona 10, Ciudad de Guatemala',
    fechaRegistro: '15 de enero de 2026',
    rol: 'Ciudadano'
  };

  estadisticas = {
    reportes: 8,
    pendientes: 2,
    proceso: 3,
    resueltos: 3
  };

  editando = false;

>>>>>>> fix-jaquino-2025376
  mostrarSeguridad = false;

  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  mostrarPasswordActual = false;
  mostrarNuevaPassword = false;
  mostrarConfirmarPassword = false;

<<<<<<< HEAD
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
=======
  constructor(private router: Router) {}
>>>>>>> fix-jaquino-2025376

  activarEdicion(): void {
    this.editando = true;
  }

  cancelarEdicion(): void {
<<<<<<< HEAD
    this.usuario = {
      ...this.usuarioOriginal
    };

=======
>>>>>>> fix-jaquino-2025376
    this.editando = false;
  }

  guardarCambios(): void {
<<<<<<< HEAD
    this.usuarioOriginal = {
      ...this.usuario
    };

    this.editando = false;
  }

  abrirConfiguracionSeguridad(): void {
    this.mostrarSeguridad = true;
    this.limpiarPassword();
=======
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
>>>>>>> fix-jaquino-2025376
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
<<<<<<< HEAD
    this.mostrarSeguridad = false;
=======
>>>>>>> fix-jaquino-2025376
  }
}