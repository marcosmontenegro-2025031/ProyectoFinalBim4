import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { timeout } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';
import { SessionService } from '../../services/session.service';
import { EmpleadoMunicipal } from '../../models/empleadoMunicipal.model';

@Component({
  selector: 'app-perfil-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './perfil-empleado.html',
  styleUrl: './perfil-empleado.css'
})
export class PerfilEmpleadoComponent implements OnInit {
  private readonly empleadoService = inject(EmpleadoService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  empleado: EmpleadoMunicipal | null = null;
  idEmpleado = 0;
  cargando = true;
  editando = false;
  guardando = false;
  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.obtenerIdEmpleado();
  }

  obtenerIdEmpleado(): void {
    if (!this.empleadoService.obtenerToken()) {
      this.cargando = false;
      this.empleado = null;
      this.error = 'No hay sesión de empleado activa. Inicia sesión nuevamente.';
      this.cdr.markForCheck();
      return;
    }

    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';
    this.cdr.markForCheck();

    this.empleadoService.obtenerMiPerfil()
      .pipe(timeout({ first: 15000 }))
      .subscribe({
        next: (data) => {
          // Evita dejar el spinner visible si la API devuelve null o un objeto vacío.
          if (!data || typeof data !== 'object' || !data.id_empleado) {
            this.empleado = null;
            this.idEmpleado = 0;
            this.error = 'El servidor no devolvió un perfil válido.';
          } else {
            this.empleado = data;
            this.idEmpleado = data.id_empleado;
          }
          this.cargando = false;
          // En una aplicación zoneless, subscribe() no actualiza por sí solo
          // la plantilla cuando cambiamos propiedades normales del componente.
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al cargar perfil del empleado:', err);
          this.cargando = false;
          this.empleado = null;

          const detalle = typeof err.error?.message === 'string'
            ? err.error.message
            : typeof err.error?.mensaje === 'string' ? err.error.mensaje : '';

          if (err.name === 'TimeoutError') {
            this.error = 'La consulta tardó demasiado. Comprueba que el backend y la base de datos estén respondiendo.';
          } else if (err.status === 401) {
            this.error = 'La sesión expiró o no está autorizada. Inicia sesión nuevamente.';
          } else if (err.status === 403) {
            this.error = 'No tienes permiso para ver este perfil.';
          } else if (err.status === 0) {
            this.error = 'No hay conexión con el servidor.';
          } else if (err.status === 400) {
            this.error = `El servidor rechazó la consulta del perfil.${detalle ? ' ' + detalle : ''}`;
          } else {
            this.error = detalle || 'No se pudo cargar el perfil.';
          }
          this.cdr.markForCheck();
        }
      });
  }

  activarEdicion(): void {
    if (!this.empleado) return;
    this.editando = true;
    this.mensaje = '';
    this.error = '';
  }

  cancelarEdicion(): void {
    if (this.guardando) return;
    this.editando = false;
    this.mensaje = '';
    this.cargarPerfil();
  }

  guardarCambios(): void {
    if (!this.empleado || this.guardando) return;

    const { nombre, apellido, usuario, correo, telefono } = this.empleado;
    if (![nombre, apellido, usuario, correo].every(campo => String(campo ?? '').trim())) {
      this.error = 'Nombre, apellido, usuario y correo son obligatorios.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      this.error = 'El correo no es válido.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';
    this.cdr.markForCheck();

    // El perfil no puede modificar contraseña, cargo ni departamento.
    this.empleadoService.actualizarMiPerfil({ nombre, apellido, usuario, correo, telefono })
      .pipe(timeout({ first: 15000 }))
      .subscribe({
        next: (data) => {
          this.guardando = false;
          if (!data || typeof data !== 'object' || !data.id_empleado) {
            this.error = 'El servidor no devolvió el perfil actualizado.';
          } else {
            this.empleado = data;
            this.idEmpleado = data.id_empleado;
            this.session.actualizarDatosEmpleado(data);
            this.editando = false;
            this.mensaje = 'Perfil actualizado correctamente.';
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error al guardar perfil del empleado:', err);
          this.guardando = false;
          this.error = err.name === 'TimeoutError'
            ? 'El servidor tardó demasiado en guardar el perfil.'
            : err.error?.message || err.error?.mensaje ||
              (err.status === 401 ? 'Sesión vencida.' : 'No se pudo actualizar el perfil.');
          this.cdr.markForCheck();
        }
      });
  }

  volverHome(): void {
    this.router.navigate(['/empleado/home']);
  }
}
