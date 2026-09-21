import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class NotificacionesComponent implements OnInit {

  private notificacionService = inject(NotificacionService);

  filtroActual = 'Todas';

  notificaciones: Notificacion[] = [];

  cargando = false;

  error = false;

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    this.cargando = true;
    this.error = false;

    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (notificaciones) => {
        this.notificaciones = notificaciones;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar notificaciones:', error);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  get notificacionesFiltradas(): Notificacion[] {

    if (this.filtroActual === 'No leídas') {
      return this.notificaciones.filter(
        notificacion => !notificacion.leida
      );
    }

    if (this.filtroActual === 'Leídas') {
      return this.notificaciones.filter(
        notificacion => notificacion.leida
      );
    }

    return this.notificaciones;
  }

  get cantidadNoLeidas(): number {
    return this.notificaciones.filter(
      notificacion => !notificacion.leida
    ).length;
  }

  get cantidadLeidas(): number {
    return this.notificaciones.filter(
      notificacion => notificacion.leida
    ).length;
  }

  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
  }

  marcarComoLeida(notificacion: Notificacion): void {

    if (notificacion.leida) {
      return;
    }

    this.notificacionService
      .marcarComoLeida(notificacion.id_notificacion)
      .subscribe({
        next: () => {
          notificacion.leida = true;
        },
        error: (error) => {
          console.error(
            'Error al marcar la notificación como leída:',
            error
          );
        }
      });
  }

  marcarComoNoLeida(notificacion: Notificacion): void {
    notificacion.leida = false;
  }

  marcarTodasComoLeidas(): void {

    if (this.cantidadNoLeidas === 0) {
      return;
    }

    this.notificacionService
      .marcarTodasComoLeidas()
      .subscribe({
        next: () => {
          this.notificaciones.forEach(notificacion => {
            notificacion.leida = true;
          });
        },
        error: (error) => {
          console.error(
            'Error al marcar todas las notificaciones como leídas:',
            error
          );
        }
      });
  }

  eliminarNotificacion(idNotificacion: number): void {

    this.notificacionService
      .eliminarNotificacion(idNotificacion)
      .subscribe({
        next: () => {
          this.notificaciones =
            this.notificaciones.filter(
              notificacion =>
                notificacion.id_notificacion !== idNotificacion
            );
        },
        error: (error) => {
          console.error(
            'Error al eliminar la notificación:',
            error
          );
        }
      });
  }

  obtenerIconoTipo(tipo: string): string {

    switch (tipo) {

      case 'reporte':
        return 'bi bi-file-earmark-check';

      case 'proceso':
        return 'bi bi-arrow-repeat';

      case 'resuelto':
        return 'bi bi-check-circle';

      case 'actualizacion':
        return 'bi bi-info-circle';

      default:
        return 'bi bi-bell';
    }
  }

  obtenerClaseTipo(tipo: string): string {

    switch (tipo) {

      case 'reporte':
        return 'notification-report';

      case 'proceso':
        return 'notification-process';

      case 'resuelto':
        return 'notification-resolved';

      case 'actualizacion':
        return 'notification-update';

      default:
        return 'notification-default';
    }
  }

  obtenerFecha(fecha: string | Date): string {

    const fechaConvertida = new Date(fecha);

    if (isNaN(fechaConvertida.getTime())) {
      return String(fecha);
    }

    return fechaConvertida.toLocaleDateString(
      'es-GT',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  obtenerHora(fecha: string | Date): string {

    const fechaConvertida = new Date(fecha);

    if (isNaN(fechaConvertida.getTime())) {
      return '';
    }

    return fechaConvertida.toLocaleTimeString(
      'es-GT',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  verReporte(notificacion: Notificacion): void {

    if (!notificacion.id_reporte) {
      return;
    }

    this.marcarComoLeida(notificacion);

    console.log(
      'Ver reporte:',
      notificacion.id_reporte
    );
  }

  volverAlInicio(): void {
    window.location.href = '/reportes';
  }
}
