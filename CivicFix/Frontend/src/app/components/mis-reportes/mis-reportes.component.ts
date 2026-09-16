import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ReporteService } from '../../services/reporte.service';

interface ReporteVista {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  zona: string;
  ubicacion: string;
  prioridad: string;
  estado: string;
  fecha: string;
  icono: string;
}

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mis-reportes.component.html',
  styleUrl: './mis-reportes.component.css'
})
export class MisReportesComponent implements OnInit {

  private reporteService = inject(ReporteService);
  private router = inject(Router);

  textoBusqueda: string = '';
  filtroActual: string = 'Todos';

  reportes: ReporteVista[] = [];

  cargando: boolean = false;
  error: string = '';

  ngOnInit(): void {
    this.cargarReportes();
  }

  /**
   * Obtener reportes reales desde la base de datos
   */
  cargarReportes(): void {

    this.cargando = true;
    this.error = '';

    this.reporteService.obtenerTodosLosReportes().subscribe({

      next: (data: any[]) => {

        console.log('Reportes recibidos desde API:', data);

        this.reportes = data.map(
          reporte => this.convertirReporte(reporte)
        );

        this.cargando = false;
      },

      error: (error) => {

        console.error(
          'Error al obtener los reportes:',
          error
        );

        this.error =
          'No se pudieron cargar los reportes.';

        this.cargando = false;
      }

    });
  }

  /**
   * Convertir los datos de PostgreSQL
   * al formato utilizado por el HTML
   */
  private convertirReporte(reporte: any): ReporteVista {

    return {

      id: reporte.id_reporte,

      titulo: reporte.titulo,

      descripcion: reporte.descripcion,

      tipo: reporte.tipo_incidencia,

      zona: reporte.zona,

      ubicacion: reporte.direccion,

      prioridad: reporte.prioridad,

      estado: reporte.estado,

      fecha: this.formatearFecha(
        reporte.fecha_reporte
      ),

      icono: this.obtenerIcono(
        reporte.tipo_incidencia
      )

    };
  }

  /**
   * Formatear fecha
   */
  private formatearFecha(
    fecha: string | Date
  ): string {

    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
      return String(fecha);
    }

    return fechaObj.toLocaleDateString(
      'es-GT',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  }

  /**
   * Filtrar reportes
   */
  get reportesFiltrados(): ReporteVista[] {

    const texto = this.textoBusqueda
      .toLowerCase()
      .trim();

    return this.reportes.filter(
      reporte => {

        const coincideBusqueda =
          !texto ||
          reporte.titulo
            .toLowerCase()
            .includes(texto) ||

          reporte.descripcion
            .toLowerCase()
            .includes(texto) ||

          reporte.tipo
            .toLowerCase()
            .includes(texto) ||

          reporte.zona
            .toLowerCase()
            .includes(texto) ||

          reporte.ubicacion
            .toLowerCase()
            .includes(texto) ||

          reporte.estado
            .toLowerCase()
            .includes(texto) ||

          reporte.prioridad
            .toLowerCase()
            .includes(texto);

        const coincideFiltro =
          this.filtroActual === 'Todos' ||
          reporte.estado === this.filtroActual;

        return coincideBusqueda && coincideFiltro;
      }
    );
  }

  /**
   * Cambiar filtro
   */
  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
  }

  /**
   * Cantidad de reportes por estado
   */
  cantidadPorEstado(estado: string): number {

    return this.reportes.filter(
      reporte => reporte.estado === estado
    ).length;
  }

  /**
   * Clase CSS para prioridad
   */
  obtenerClasePrioridad(
    prioridad: string
  ): string {

    switch (prioridad) {

      case 'Alta':
        return 'prioridad-alta';

      case 'Media':
        return 'prioridad-media';

      case 'Baja':
        return 'prioridad-baja';

      default:
        return '';
    }
  }

  /**
   * Clase CSS para estado
   */
  obtenerClaseEstado(
    estado: string
  ): string {

    switch (estado) {

      case 'Pendiente':
        return 'estado-pendiente';

      case 'En proceso':
        return 'estado-proceso';

      case 'Resuelto':
        return 'estado-resuelto';

      default:
        return '';
    }
  }

  /**
   * Crear nuevo reporte
   */
  nuevoReporte(): void {

    this.router.navigate([
      '/reportes/nuevo'
    ]);
  }

  /**
   * Ver detalle del reporte
   */
  verDetalle(
    reporte: ReporteVista
  ): void {

    console.log(
      'Reporte seleccionado:',
      reporte
    );
  }

  /**
   * Obtener icono según el tipo de incidencia
   */
  private obtenerIcono(
    tipo: string
  ): string {

    const tipoNormalizado =
      tipo.toLowerCase();

    if (
      tipoNormalizado.includes('calle') ||
      tipoNormalizado.includes('bache')
    ) {
      return 'fa-solid fa-road';
    }

    if (
      tipoNormalizado.includes('alumbrado') ||
      tipoNormalizado.includes('luz')
    ) {
      return 'fa-solid fa-lightbulb';
    }

    if (
      tipoNormalizado.includes('basura') ||
      tipoNormalizado.includes('limpieza')
    ) {
      return 'fa-solid fa-trash';
    }

    if (
      tipoNormalizado.includes('agua')
    ) {
      return 'fa-solid fa-droplet';
    }

    if (
      tipoNormalizado.includes('seguridad')
    ) {
      return 'fa-solid fa-shield-halved';
    }

    return 'fa-solid fa-file-circle-exclamation';
  }
}