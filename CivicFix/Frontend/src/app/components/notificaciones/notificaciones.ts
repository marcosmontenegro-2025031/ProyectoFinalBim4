import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  fecha: string;
  hora: string;
  leida: boolean;
  idReporte?: number;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {

  filtroActual = 'Todas';

  notificaciones: Notificacion[] = [
    {
      id: 1,
      titulo: 'Reporte recibido',
      mensaje: 'Tu reporte de incidencia ha sido recibido correctamente y está siendo revisado.',
      tipo: 'reporte',
      fecha: '16 Sep 2026',
      hora: '10:32 AM',
      leida: false,
      idReporte: 1
    },
    {
      id: 2,
      titulo: 'Reporte en proceso',
      mensaje: 'Tu reporte ha sido asignado al departamento municipal correspondiente.',
      tipo: 'proceso',
      fecha: '15 Sep 2026',
      hora: '03:45 PM',
      leida: false,
      idReporte: 2
    },
    {
      id: 3,
      titulo: 'Reporte resuelto',
      mensaje: 'La incidencia que reportaste ha sido marcada como resuelta.',
      tipo: 'resuelto',
      fecha: '14 Sep 2026',
      hora: '11:20 AM',
      leida: true,
      idReporte: 3
    },
    {
      id: 4,
      titulo: 'Actualización de reporte',
      mensaje: 'Se ha actualizado el estado de uno de tus reportes.',
      tipo: 'actualizacion',
      fecha: '13 Sep 2026',
      hora: '09:15 AM',
      leida: true,
      idReporte: 4
    }
  ];

  get notificacionesFiltradas(): Notificacion[] {
    if (this.filtroActual === 'No leídas') {
      return this.notificaciones.filter(notificacion => !notificacion.leida);
    }

    if (this.filtroActual === 'Leídas') {
      return this.notificaciones.filter(notificacion => notificacion.leida);
    }

    return this.notificaciones;
  }

  get cantidadNoLeidas(): number {
    return this.notificaciones.filter(notificacion => !notificacion.leida).length;
  }

  get cantidadLeidas(): number {
    return this.notificaciones.filter(notificacion => notificacion.leida).length;
  }

  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
  }

  marcarComoLeida(notificacion: Notificacion): void {
    notificacion.leida = true;
  }

  marcarComoNoLeida(notificacion: Notificacion): void {
    notificacion.leida = false;
  }

  marcarTodasComoLeidas(): void {
    this.notificaciones.forEach(notificacion => {
      notificacion.leida = true;
    });
  }

  eliminarNotificacion(id: number): void {
    this.notificaciones = this.notificaciones.filter(
      notificacion => notificacion.id !== id
    );
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

  verReporte(notificacion: Notificacion): void {
    if (notificacion.idReporte) {
      notificacion.leida = true;
      console.log('Ver reporte:', notificacion.idReporte);
    }
  }

  volverAlInicio(): void {
    window.location.href = '/reportes';
  }
}