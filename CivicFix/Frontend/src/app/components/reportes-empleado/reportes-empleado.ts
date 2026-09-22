import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { ReporteAdmin } from '../../models/reporte.model';

@Component({
  selector: 'app-reportes-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './reportes-empleado.html',
  styleUrl: './reportes-empleado.css'
})
export class ReportesEmpleadoComponent implements OnInit {

  private reporteService = inject(ReporteService);
  private router = inject(Router);

  reportes: ReporteAdmin[] = [];
  reportesFiltrados: ReporteAdmin[] = [];

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
      next: (data) => {

        this.reportes = data || [];

        this.aplicarFiltros();

        this.cargando = false;
      },

      error: (error) => {

        console.error('Error al cargar reportes:', error);

        this.error = 'No se pudieron cargar los reportes. Verifica que el backend esté funcionando.';

        this.cargando = false;

        this.reportes = [];
        this.reportesFiltrados = [];
      }
    });
  }

  aplicarFiltros(): void {

    const texto = this.textoBusqueda
      .toLowerCase()
      .trim();

    this.reportesFiltrados = this.reportes.filter(reporte => {

      const coincideTexto =
        !texto ||
        String(reporte.id_reporte).includes(texto) ||
        (reporte.titulo || '').toLowerCase().includes(texto) ||
        (reporte.descripcion || '').toLowerCase().includes(texto) ||
        (reporte.usuario || '').toLowerCase().includes(texto) ||
        (reporte.direccion || '').toLowerCase().includes(texto) ||
        (reporte.zona || '').toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        (reporte.estado || '').toLowerCase() ===
        this.filtroEstado.toLowerCase();

      const coincidePrioridad =
        this.filtroPrioridad === 'Todas' ||
        (reporte.prioridad || '').toLowerCase() ===
        this.filtroPrioridad.toLowerCase();

      return coincideTexto &&
        coincideEstado &&
        coincidePrioridad;
    });
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {

    this.textoBusqueda = '';
    this.filtroEstado = 'Todos';
    this.filtroPrioridad = 'Todas';

    this.aplicarFiltros();
  }

  contarEstado(estado: string): number {

    return this.reportes.filter(
      reporte =>
        (reporte.estado || '').toLowerCase() ===
        estado.toLowerCase()
    ).length;
  }

  contarPrioridad(prioridad: string): number {

    return this.reportes.filter(
      reporte =>
        (reporte.prioridad || '').toLowerCase() ===
        prioridad.toLowerCase()
    ).length;
  }

  obtenerClasePrioridad(prioridad: string): string {

    switch ((prioridad || '').toLowerCase()) {

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
        return 'prioridad-default';
    }
  }

  obtenerClaseEstado(estado: string): string {

    switch ((estado || '').toLowerCase()) {

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
        return 'estado-default';
    }
  }

  obtenerIconoTipo(tipo: string): string {

    const valor = (tipo || '').toLowerCase();

    if (valor.includes('agua')) {
      return 'fa-solid fa-droplet';
    }

    if (valor.includes('bache')) {
      return 'fa-solid fa-road';
    }

    if (
      valor.includes('luminaria') ||
      valor.includes('luz')
    ) {
      return 'fa-solid fa-lightbulb';
    }

    if (
      valor.includes('basura') ||
      valor.includes('desecho')
    ) {
      return 'fa-solid fa-trash';
    }

    if (
      valor.includes('señal') ||
      valor.includes('senal')
    ) {
      return 'fa-solid fa-road-sign';
    }

    return 'fa-solid fa-triangle-exclamation';
  }

  verDetalle(id: number): void {
    this.router.navigate(['/empleado/reportes', id]);
  }

  irInicio(): void {
    this.router.navigate(['/empleado/home']);
  }

  recargar(): void {
    this.cargarReportes();
  }
}