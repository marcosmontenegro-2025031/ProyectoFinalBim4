import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';

interface ReporteDashboard {
  id_reporte: number;
  titulo: string;
  descripcion: string;
  fecha_reporte: string | Date;
  usuario: string;
  tipo_incidencia: string;
  direccion?: string;
  zona?: string;
  latitud?: number;
  longitud?: number;
  estado: string;
  prioridad: string;
  ruta_fotografia?: string;
}

interface GraficaMes {
  nombre: string;
  cantidad: number;
  porcentaje: number;
}

interface GraficaTipo {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private reporteService = inject(ReporteService);

  reportes: ReporteDashboard[] = [];

  reportesRecientes: ReporteDashboard[] = [];

  cargando = false;

  totalReportes = 0;
  pendientes = 0;
  enProceso = 0;
  resueltos = 0;

  reportesPorMes: GraficaMes[] = [];

  reportesPorTipo: GraficaTipo[] = [];

  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {

    this.cargando = true;

    this.reporteService.obtenerTodosLosReportes().subscribe({

      next: (reportes) => {

        this.reportes = reportes as ReporteDashboard[];

        this.calcularEstadisticas();

        this.generarGraficaPorMes();

        this.generarGraficaPorTipo();

        this.reportesRecientes = this.reportes.slice(0, 5);

        this.cargando = false;
      },

      error: (error) => {

        console.error('Error al cargar dashboard:', error);

        this.cargando = false;
      }

    });
  }

  calcularEstadisticas(): void {

    this.totalReportes = this.reportes.length;

    this.pendientes = this.reportes.filter(
      reporte => this.normalizarEstado(reporte.estado) === 'pendiente'
    ).length;

    this.enProceso = this.reportes.filter(
      reporte => this.normalizarEstado(reporte.estado) === 'en proceso'
    ).length;

    this.resueltos = this.reportes.filter(
      reporte => this.normalizarEstado(reporte.estado) === 'resuelto'
    ).length;
  }

  normalizarEstado(estado: string): string {

    return estado
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  generarGraficaPorMes(): void {

    const cantidades = new Array(12).fill(0);

    this.reportes.forEach(reporte => {

      const fecha = new Date(reporte.fecha_reporte);

      if (!isNaN(fecha.getTime())) {

        const mes = fecha.getMonth();

        cantidades[mes]++;
      }

    });

    const mayorCantidad = Math.max(...cantidades, 1);

    this.reportesPorMes = this.meses.map((nombre, index) => {

      const cantidad = cantidades[index];

      return {
        nombre,
        cantidad,
        porcentaje: (cantidad / mayorCantidad) * 100
      };

    });
  }

  generarGraficaPorTipo(): void {

    const tipos: { [key: string]: number } = {};

    this.reportes.forEach(reporte => {

      const tipo = reporte.tipo_incidencia || 'Sin categoría';

      if (tipos[tipo]) {
        tipos[tipo]++;
      } else {
        tipos[tipo] = 1;
      }

    });

    const total = this.reportes.length;

    const colores = [
      '#0874dc',
      '#16a085',
      '#f39c12',
      '#e74c3c',
      '#8e44ad',
      '#00a8cc',
      '#2c3e50',
      '#27ae60'
    ];

    this.reportesPorTipo = Object.entries(tipos)
      .sort((a, b) => b[1] - a[1])
      .map(([nombre, cantidad], index) => {

        return {
          nombre,
          cantidad,
          porcentaje: total > 0
            ? (cantidad / total) * 100
            : 0,
          color: colores[index % colores.length]
        };

      });
  }

  obtenerClaseEstado(estado: string): string {

    switch (this.normalizarEstado(estado)) {

      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
        return 'estado-resuelto';

      default:
        return 'estado-default';
    }
  }

  obtenerIconoEstado(estado: string): string {

    switch (this.normalizarEstado(estado)) {

      case 'pendiente':
        return 'bi-clock';

      case 'en proceso':
        return 'bi-arrow-repeat';

      case 'resuelto':
        return 'bi-check-circle';

      default:
        return 'bi-question-circle';
    }
  }

  obtenerPorcentajeTipo(tipo: GraficaTipo): number {
    return tipo.porcentaje;
  }

  obtenerGradienteCircular(): string {

    if (this.reportesPorTipo.length === 0) {
      return '#e8eef5';
    }

    let acumulado = 0;

    const segmentos = this.reportesPorTipo.map(tipo => {

      const inicio = acumulado;

      acumulado += tipo.porcentaje;

      return `${tipo.color} ${inicio}% ${acumulado}%`;

    });

    return `conic-gradient(${segmentos.join(', ')})`;
  }
}
