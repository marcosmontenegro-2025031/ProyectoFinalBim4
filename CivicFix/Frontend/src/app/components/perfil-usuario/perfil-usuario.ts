import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  mostrarSeguridad = false;

  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  mostrarPasswordActual = false;
  mostrarNuevaPassword = false;
  mostrarConfirmarPassword = false;

  constructor(private router: Router) {}

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