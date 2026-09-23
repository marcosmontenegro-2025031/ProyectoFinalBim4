import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { ReporteService } from '../../services/reporte.service';
import { EstadoService } from '../../services/estado.service';
import { Estado } from '../../models/estado.model';
import { ReporteAdmin } from '../../models/reporte.model';

@Component({
  selector: 'app-reportes-empleado',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './reportes-empleado.html',
  styleUrl: './reportes-empleado.css'
})
export class ReportesEmpleadoComponent implements OnInit {

  private reporteService = inject(ReporteService);
  private router = inject(Router);
  private estadosService = inject(EstadoService);
  estados: Estado[] = [];
  cambiandoId: number | null = null;
  mensajeEstado = '';
  cargarEstados(): void {
    this.estadosService.obtenerTodos().subscribe({next: data => this.estados = data,
      error: err => console.error('Error al cargar estados:', err)});
  }
  cambiarEstado(idReporte: number, idEstado: number): void {
    if (!Number.isInteger(idEstado) || idEstado < 1 || this.cambiandoId !== null) return;
    this.cambiandoId = idReporte;
    this.error = '';
    this.mensajeEstado = '';
    this.reporteService.actualizarEstado(idReporte, idEstado).subscribe({
      next: () => {this.cambiandoId = null;this.mensajeEstado = 'Estado actualizado correctamente.';this.cargarReportes();},
      error: err => {this.cambiandoId = null;this.error = err.error?.message || err.error?.mensaje || 'No se pudo actualizar el estado.';}
    });
  }


  reportes: ReporteAdmin[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.cargarEstados();
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.error = '';

    this.reporteService.obtenerMisAsignaciones().subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reportes asignados:', err);
        this.error = 'No se pudieron cargar las incidencias asignadas.';
        this.cargando = false;
      }
    });
  }

  verBitacora(idReporte: number): void {
    this.router.navigate(['/empleado/bitacora', idReporte]);
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'recibido':
      case 'pendiente':
        return 'estado-pendiente';

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

  obtenerIconoTipo(tipo: string): string {
    switch (tipo?.toLowerCase()) {
      case 'bache':
        return 'bi bi-signpost-2-fill';

      case 'agua':
        return 'bi bi-droplet-fill';

      case 'luminaria':
      case 'alumbrado':
        return 'bi bi-lightbulb-fill';

      case 'basura':
        return 'bi bi-trash-fill';

      case 'alcantarillado':
        return 'bi bi-water';

      case 'señalización':
      case 'senalizacion':
        return 'bi bi-signpost-fill';

      default:
        return 'bi bi-exclamation-circle-fill';
    }
  }

  volverHome(): void {
    this.router.navigate(['/empleado/home']);
  }
}
