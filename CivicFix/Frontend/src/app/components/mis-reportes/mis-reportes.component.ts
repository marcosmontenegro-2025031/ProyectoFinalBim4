import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: string;
  estado: string;
  fecha: string;
  direccion: string;
  zona: string;
  referencia: string;
}

@Component({
  selector: 'app-mis-reportes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './mis-reportes.component.html',
  styleUrl: './mis-reportes.component.css'
})
export class MisReportesComponent {

  filtroActual = 'Todos';

  reportes: Reporte[] = [
    {
      id: 1,
      titulo: 'Bache en calle principal',
      descripcion: 'Hay un bache grande que afecta la circulación de vehículos.',
      tipo: 'Bache',
      prioridad: 'Alta',
      estado: 'Pendiente',
      fecha: '16 Sep 2026',
      direccion: '2da. avenida, Zona 1, Guatemala',
      zona: 'Zona 1',
      referencia: 'Cerca de la esquina'
    },
    {
      id: 2,
      titulo: 'Luminaria dañada',
      descripcion: 'La lámpara de la calle no funciona durante la noche.',
      tipo: 'Luminaria Dañada',
      prioridad: 'Media',
      estado: 'En Proceso',
      fecha: '14 Sep 2026',
      direccion: '6ta. avenida, Zona 4, Guatemala',
      zona: 'Zona 4',
      referencia: 'Frente al parque'
    },
    {
      id: 3,
      titulo: 'Fuga de agua',
      descripcion: 'Se observa una fuga de agua en la vía pública.',
      tipo: 'Fuga de Agua',
      prioridad: 'Crítica',
      estado: 'Resuelto',
      fecha: '10 Sep 2026',
      direccion: '10a. calle, Zona 1, Guatemala',
      zona: 'Zona 1',
      referencia: 'Frente al edificio municipal'
    },
    {
      id: 4,
      titulo: 'Bache en avenida',
      descripcion: 'Bache ubicado en uno de los carriles de circulación.',
      tipo: 'Bache',
      prioridad: 'Baja',
      estado: 'Pendiente',
      fecha: '8 Sep 2026',
      direccion: '3ra. avenida, Zona 3, Guatemala',
      zona: 'Zona 3',
      referencia: 'Cerca de la parada de bus'
    }
  ];

  constructor(private router: Router) {}

  get reportesFiltrados(): Reporte[] {
    return this.reportes.filter(reporte => {
      return (
        this.filtroActual === 'Todos' ||
        reporte.estado === this.filtroActual
      );
    });
  }

  cantidadPorEstado(estado: string): number {
    return this.reportes.filter(
      reporte => reporte.estado === estado
    ).length;
  }

  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
  }

  nuevoReporte(): void {
    this.router.navigate(['/reportes/nuevo']);
  }

  verDetalle(reporte: Reporte): void {
    this.router.navigate(['/reportes/mis-reportes', reporte.id]);
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad.toLowerCase()) {
      case 'crítica':
      case 'critica':
        return 'prioridad-critica';

      case 'alta':
        return 'prioridad-alta';

      case 'media':
        return 'prioridad-media';

      default:
        return 'prioridad-baja';
    }
  }

  obtenerColorPrioridad(prioridad: string): string {
    const prioridadNormalizada = prioridad.toLowerCase();

    if (
      prioridadNormalizada.includes('crít') ||
      prioridadNormalizada.includes('crit')
    ) {
      return '#C62828';
    }

    if (prioridadNormalizada.includes('alt')) {
      return '#EF6C00';
    }

    if (prioridadNormalizada.includes('med')) {
      return '#F9A825';
    }

    return '#2E7D32';
  }

  obtenerIconoPrioridad(prioridad: string): string {
    const prioridadNormalizada = prioridad.toLowerCase();

    if (
      prioridadNormalizada.includes('crít') ||
      prioridadNormalizada.includes('crit')
    ) {
      return 'bi-exclamation-octagon-fill';
    }

    if (prioridadNormalizada.includes('alt')) {
      return 'bi-exclamation-circle-fill';
    }

    if (prioridadNormalizada.includes('med')) {
      return 'bi-dash-circle-fill';
    }

    return 'bi-check-circle-fill';
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
        return 'estado-resuelto';

      default:
        return '';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bi-clock';

      case 'en proceso':
        return 'bi-arrow-repeat';

      case 'resuelto':
        return 'bi-check-circle';

      default:
        return 'bi-clock';
    }
  }

  obtenerIconoTipo(tipo: string): string {
    const tipoNormalizado = tipo.toLowerCase();

    if (tipoNormalizado.includes('agua')) {
      return 'bi-droplet-fill';
    }

    if (tipoNormalizado.includes('luminaria')) {
      return 'bi-lightbulb-fill';
    }

    if (tipoNormalizado.includes('bache')) {
      return 'bi-cone-striped';
    }

    return 'bi-exclamation-triangle-fill';
  }
}