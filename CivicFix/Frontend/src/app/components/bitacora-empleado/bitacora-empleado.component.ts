import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReporteService } from '../../services/reporte.service';
import { BitacoraCambioEstadoService } from '../../services/bitacoraCambioEstado.service';
import { ReporteAdmin } from '../../models/reporte.model';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css'
})
export class Bitacora implements OnInit {

  private reporteService = inject(ReporteService);
  private bitacoraService = inject(BitacoraCambioEstadoService);

  reportes: ReporteAdmin[] = [];

  reporteSeleccionado: ReporteAdmin | null = null;

  estadoSeleccionado = '';
  comentario = '';

  cargando = true;
  guardando = false;

  mensaje = '';
  error = '';

  estados = [
    {
      id: 1,
      nombre: 'Recibido'
    },
    {
      id: 2,
      nombre: 'Asignado'
    },
    {
      id: 3,
      nombre: 'En proceso'
    },
    {
      id: 4,
      nombre: 'Resuelto'
    },
    {
      id: 5,
      nombre: 'Rechazado'
    }
  ];

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {

    this.cargando = true;
    this.error = '';

    this.reporteService.obtenerMisAsignaciones().subscribe({

      next: (reportes) => {

        this.reportes = reportes;

        this.cargando = false;

      },

      error: (error) => {

        console.error('Error al cargar reportes:', error);

        this.error =
          'No se pudieron cargar las incidencias asignadas.';

        this.cargando = false;

      }

    });
  }

  seleccionarReporte(reporte: ReporteAdmin): void {

    this.reporteSeleccionado = reporte;

    this.estadoSeleccionado = '';
    this.comentario = '';

    this.mensaje = '';
    this.error = '';
  }

  cancelar(): void {

    this.reporteSeleccionado = null;

    this.estadoSeleccionado = '';
    this.comentario = '';

    this.mensaje = '';
    this.error = '';
  }

  obtenerIdEstado(nombre: string): number {

    const estado = this.estados.find(
      item => item.nombre.toLowerCase() === nombre.toLowerCase()
    );

    return estado?.id ?? 0;
  }

  cambiarEstado(): void {

    if (!this.reporteSeleccionado) {
      this.error = 'Selecciona una incidencia.';
      return;
    }

    if (!this.estadoSeleccionado) {
      this.error = 'Selecciona el nuevo estado.';
      return;
    }

    const nuevoEstadoId =
      Number(this.estadoSeleccionado);

    const estadoAnteriorId =
      this.obtenerIdEstado(
        this.reporteSeleccionado.estado
      );

    if (nuevoEstadoId === estadoAnteriorId) {

      this.error =
        'El nuevo estado debe ser diferente al estado actual.';

      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    const idReporte =
      this.reporteSeleccionado.id_reporte;

    this.reporteService
      .actualizarEstado(
        idReporte,
        nuevoEstadoId
      )
      .subscribe({

        next: () => {

          this.registrarBitacora(
            idReporte,
            estadoAnteriorId,
            nuevoEstadoId
          );

        },

        error: (error) => {

          console.error(
            'Error al actualizar estado:',
            error
          );

          this.guardando = false;

          this.error =
            error?.error?.error ||
            'No se pudo actualizar el estado de la incidencia.';

        }

      });
  }

  private registrarBitacora(
    idReporte: number,
    estadoAnterior: number,
    estadoNuevo: number
  ): void {

    this.bitacoraService.registrar({

      fk_id_reporte: idReporte,

      fk_id_estado_anterior:
        estadoAnterior || undefined,

      fk_id_estado_nuevo:
        estadoNuevo,

      comentario:
        this.comentario || 'Cambio de estado realizado por el empleado.'

    }).subscribe({

      next: () => {

        this.guardando = false;

        this.mensaje =
          'Estado actualizado y cambio registrado correctamente.';

        this.reporteSeleccionado = null;

        this.estadoSeleccionado = '';
        this.comentario = '';

        this.cargarReportes();

      },

      error: (error) => {

        console.error(
          'Estado actualizado, pero no se pudo registrar la bitácora:',
          error
        );

        this.guardando = false;

        this.error =
          'El estado se actualizó, pero no se pudo registrar la bitácora.';

        this.cargarReportes();

      }

    });
  }

  obtenerClaseEstado(estado: string): string {

    switch (estado?.toLowerCase()) {

      case 'recibido':
        return 'estado-recibido';

      case 'asignado':
        return 'estado-asignado';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
        return 'estado-resuelto';

      case 'rechazado':
        return 'estado-rechazado';

      default:
        return '';

    }
  }

  obtenerClasePrioridad(prioridad: string): string {

    switch (prioridad?.toLowerCase()) {

      case 'crítica':
      case 'critica':
        return 'prioridad-critica';

      case 'alta':
        return 'prioridad-alta';

      case 'media':
        return 'prioridad-media';

      case 'baja':
        return 'prioridad-baja';

      default:
        return '';

    }
  }
}