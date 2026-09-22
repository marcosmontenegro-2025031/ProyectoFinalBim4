import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { ReporteAdmin } from '../../models/reporte.model';

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './reportes-admin.component.html',
  styleUrl: './reportes-admin.component.css'
})
export class ReportesAdminComponent implements OnInit {

  private reporteService = inject(ReporteService);

  reportes: ReporteAdmin[] = [];
  cargando = false;
  error = '';

  textoBusqueda = '';
  filtroEstado = 'Todos';
  filtroPrioridad = 'Todas';

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.error = '';

    this.reporteService.obtenerTodosLosReportes().subscribe({
      next: (reportes) => {
        this.reportes = reportes;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar reportes:', error);
        this.error = 'No se pudieron cargar los reportes.';
        this.cargando = false;
      }
    });
  }

  get reportesFiltrados(): ReporteAdmin[] {
    return this.reportes.filter(reporte => {

      const texto = this.textoBusqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        reporte.titulo?.toLowerCase().includes(texto) ||
        reporte.descripcion?.toLowerCase().includes(texto) ||
        reporte.usuario?.toLowerCase().includes(texto) ||
        reporte.tipo?.toLowerCase().includes(texto) ||
        reporte.direccion?.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        this.normalizar(reporte.estado) === this.normalizar(this.filtroEstado);

      const coincidePrioridad =
        this.filtroPrioridad === 'Todas' ||
        this.normalizar(reporte.prioridad) === this.normalizar(this.filtroPrioridad);

      return coincideBusqueda &&
             coincideEstado &&
             coincidePrioridad;
    });
  }

  get totalReportes(): number {
    return this.reportes.length;
  }

  get pendientes(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.estado) === 'pendiente'
    ).length;
  }

  get enProceso(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.estado) === 'en proceso'
    ).length;
  }

  get resueltos(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.estado) === 'resuelto'
    ).length;
  }

  get criticos(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.prioridad) === 'crítica'
    ).length;
  }

  normalizar(valor: string | undefined): string {
    return (valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  obtenerClaseEstado(estado: string): string {
    switch (this.normalizar(estado)) {
      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
        return 'estado-resuelto';

      case 'cancelado':
        return 'estado-cancelado';

      default:
        return 'estado-default';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch (this.normalizar(estado)) {
      case 'pendiente':
        return 'bi-clock';

      case 'en proceso':
        return 'bi-arrow-repeat';

      case 'resuelto':
        return 'bi-check-circle';

      case 'cancelado':
        return 'bi-x-circle';

      default:
        return 'bi-question-circle';
    }
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (this.normalizar(prioridad)) {
      case 'critica':
        return 'prioridad-critica';

      case 'alta':
        return 'prioridad-alta';

      case 'media':
        return 'prioridad-media';

      case 'baja':
        return 'prioridad-baja';

      default:
        return 'prioridad-default';
    }
  }

  verDetalle(reporte: ReporteAdmin): void {
    alert(`Detalle del reporte #${reporte.id}\n\n${reporte.titulo}`);
  }

  actualizarEstado(reporte: ReporteAdmin): void {
    alert(`Actualizar estado del reporte #${reporte.id}`);
  }
}