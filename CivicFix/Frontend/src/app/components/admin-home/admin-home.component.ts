<<<<<<< HEAD
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
=======
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
>>>>>>> fix-jaquino-2025376

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
<<<<<<< HEAD
    RouterLink
=======
    RouterLink,
    AdminSidebarComponent
>>>>>>> fix-jaquino-2025376
  ],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class DashboardComponent implements OnInit {

  private reporteService = inject(ReporteService);
<<<<<<< HEAD

  reportes: ReporteDashboard[] = [];
=======
  private cd = inject(ChangeDetectorRef);

  reportes: ReporteDashboard[] = [];

>>>>>>> fix-jaquino-2025376
  reportesRecientes: ReporteDashboard[] = [];

  cargando = false;

  totalReportes = 0;
  pendientes = 0;
  enProceso = 0;
  resueltos = 0;

  reportesPorMes: GraficaMes[] = [];
<<<<<<< HEAD
  reportesPorTipo: GraficaTipo[] = [];

  meses = [
=======

  reportesPorTipo: GraficaTipo[] = [];

  meses: string[] = [
>>>>>>> fix-jaquino-2025376
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

<<<<<<< HEAD
        this.reportesRecientes = this.reportes.slice(0, 5);

        this.cargando = false;
=======
        this.reportesRecientes = [...this.reportes]
          .sort((a, b) => {
            const fechaA = new Date(a.fecha_reporte).getTime();
            const fechaB = new Date(b.fecha_reporte).getTime();

            return fechaB - fechaA;
          })
          .slice(0, 5);

        this.cargando = false;
        this.cd.markForCheck();
>>>>>>> fix-jaquino-2025376
      },

      error: (error) => {
        console.error('Error al cargar dashboard:', error);
<<<<<<< HEAD
        this.cargando = false;
=======

        this.reportes = [];
        this.reportesRecientes = [];

        this.calcularEstadisticas();
        this.generarGraficaPorMes();
        this.generarGraficaPorTipo();

        this.cargando = false;
        this.cd.markForCheck();
>>>>>>> fix-jaquino-2025376
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalReportes = this.reportes.length;

    this.pendientes = this.reportes.filter(
      reporte =>
<<<<<<< HEAD
        this.normalizarEstado(reporte.estado) === 'pendiente'
=======
        ['recibido','en revision','asignado'].includes(this.normalizarEstado(reporte.estado))
>>>>>>> fix-jaquino-2025376
    ).length;

    this.enProceso = this.reportes.filter(
      reporte =>
        this.normalizarEstado(reporte.estado) === 'en proceso'
    ).length;

    this.resueltos = this.reportes.filter(
      reporte =>
        this.normalizarEstado(reporte.estado) === 'resuelto'
    ).length;
  }

  normalizarEstado(estado: string): string {
<<<<<<< HEAD
    return estado
      ?.toLowerCase()
=======
    return (estado || '')
      .toLowerCase()
>>>>>>> fix-jaquino-2025376
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  generarGraficaPorMes(): void {
<<<<<<< HEAD
    const cantidades = new Array(12).fill(0);
=======
    const cantidades: number[] = new Array(12).fill(0);
>>>>>>> fix-jaquino-2025376

    this.reportes.forEach(reporte => {
      const fecha = new Date(reporte.fecha_reporte);

      if (!isNaN(fecha.getTime())) {
        const mes = fecha.getMonth();
<<<<<<< HEAD
        cantidades[mes]++;
=======

        if (mes >= 0 && mes <= 11) {
          cantidades[mes]++;
        }
>>>>>>> fix-jaquino-2025376
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
<<<<<<< HEAD
      const tipo =
        reporte.tipo_incidencia || 'Sin categoría';
=======
      const tipo = reporte.tipo_incidencia || 'Sin categoría';
>>>>>>> fix-jaquino-2025376

      if (tipos[tipo]) {
        tipos[tipo]++;
      } else {
        tipos[tipo] = 1;
      }
    });

    const total = this.reportes.length;

<<<<<<< HEAD
    const colores = [
=======
    const colores: string[] = [
>>>>>>> fix-jaquino-2025376
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
<<<<<<< HEAD
          porcentaje:
            total > 0
              ? (cantidad / total) * 100
              : 0,
          color:
            colores[index % colores.length]
=======
          porcentaje: total > 0
            ? (cantidad / total) * 100
            : 0,
          color: colores[index % colores.length]
>>>>>>> fix-jaquino-2025376
        };
      });
  }

  obtenerClaseEstado(estado: string): string {
    switch (this.normalizarEstado(estado)) {
<<<<<<< HEAD
=======
      case 'recibido':
      case 'en revision':
      case 'asignado':
>>>>>>> fix-jaquino-2025376
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
<<<<<<< HEAD
=======
      case 'recibido':
      case 'en revision':
      case 'asignado':
>>>>>>> fix-jaquino-2025376
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

    if (this.reportesPorTipo.length === 1) {
      return this.reportesPorTipo[0].color;
    }

    let acumulado = 0;

    const segmentos = this.reportesPorTipo.map(tipo => {
      const inicio = acumulado;

      acumulado += tipo.porcentaje;

      return `${tipo.color} ${inicio}% ${acumulado}%`;
    });

    return `conic-gradient(${segmentos.join(', ')})`;
  }
<<<<<<< HEAD

  obtenerGradienteTipo(): string {
    if (this.reportesPorTipo.length === 0) {
      return '#e8eef5';
    }

    if (this.reportesPorTipo.length === 1) {
      return this.reportesPorTipo[0].color;
    }

    let acumulado = 0;

    const segmentos = this.reportesPorTipo.map(tipo => {
      const inicio = acumulado;

      acumulado += tipo.porcentaje;

      return `${tipo.color} ${inicio}% ${acumulado}%`;
    });

    return `conic-gradient(${segmentos.join(', ')})`;
  }
=======
>>>>>>> fix-jaquino-2025376
}