import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ReporteAdmin } from '../../models/reporte.model';

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
export class MisReportesComponent {

  textoBusqueda: string = '';
  filtroActual: string = 'Todos';

  reportes: ReporteVista[] = [
    {
      id: 1,
      titulo: 'Bache en la calle',
      descripcion: 'Bache que dificulta el tránsito de vehículos.',
      tipo: 'Calles',
      zona: 'Zona 1',
      ubicacion: 'Zona 1, Ciudad de Guatemala',
      prioridad: 'Alta',
      estado: 'Pendiente',
      fecha: '16/09/2026',
      icono: 'fa-solid fa-road'
    },
    {
      id: 2,
      titulo: 'Lámpara dañada',
      descripcion: 'Lámpara de alumbrado público que no funciona.',
      tipo: 'Alumbrado',
      zona: 'Zona 10',
      ubicacion: 'Zona 10, Ciudad de Guatemala',
      prioridad: 'Media',
      estado: 'En proceso',
      fecha: '15/09/2026',
      icono: 'fa-solid fa-lightbulb'
    },
    {
      id: 3,
      titulo: 'Basura acumulada',
      descripcion: 'Acumulación de basura en el sector.',
      tipo: 'Limpieza',
      zona: 'Zona 5',
      ubicacion: 'Zona 5, Ciudad de Guatemala',
      prioridad: 'Baja',
      estado: 'Resuelto',
      fecha: '12/09/2026',
      icono: 'fa-solid fa-trash'
    }
  ];

  constructor(
    private router: Router
  ) {}

  /**
   * Filtrar reportes por búsqueda y estado
   */
  get reportesFiltrados(): ReporteVista[] {

    const texto = this.textoBusqueda
      .toLowerCase()
      .trim();

    return this.reportes.filter((reporte) => {

      const coincideBusqueda =
        !texto ||
        reporte.titulo.toLowerCase().includes(texto) ||
        reporte.descripcion.toLowerCase().includes(texto) ||
        reporte.tipo.toLowerCase().includes(texto) ||
        reporte.zona.toLowerCase().includes(texto) ||
        reporte.ubicacion.toLowerCase().includes(texto) ||
        reporte.estado.toLowerCase().includes(texto) ||
        reporte.prioridad.toLowerCase().includes(texto);

      const coincideFiltro =
        this.filtroActual === 'Todos' ||
        reporte.estado === this.filtroActual;

      return coincideBusqueda && coincideFiltro;
    });
  }

  /**
   * Cambiar filtro
   */
  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
  }

  /**
   * Obtener cantidad por estado
   */
  cantidadPorEstado(estado: string): number {

    return this.reportes.filter(
      reporte => reporte.estado === estado
    ).length;
  }

  /**
   * Clase CSS para prioridad
   */
  obtenerClasePrioridad(prioridad: string): string {

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
  obtenerClaseEstado(estado: string): string {

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
   * Ir a Crear Reporte
   */
  nuevoReporte(): void {
    this.router.navigate(['/reportes/nuevo']);
  }

  /**
   * Ver detalle
   */
  verDetalle(reporte: ReporteVista): void {
    console.log('Reporte seleccionado:', reporte);
  }
}