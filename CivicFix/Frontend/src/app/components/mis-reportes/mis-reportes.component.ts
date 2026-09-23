import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
<<<<<<< HEAD
=======
import { ReporteService } from '../../services/reporte.service';
>>>>>>> fix-jaquino-2025376

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

<<<<<<< HEAD
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
=======
  reportes: Reporte[] = [];
  cargando = false;
  error = '';

  constructor(private router: Router, private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.error = '';
    this.reporteService.obtenerMisReportes().subscribe({
      next: (data: any[]) => {
        this.reportes = (data || []).map((r: any) => ({
          id: Number(r.id_reporte),
          titulo: r.titulo || 'Incidencia urbana',
          descripcion: r.descripcion || '',
          tipo: r.tipo_incidencia || 'Incidencia',
          prioridad: r.prioridad || 'Baja',
          estado: this.normalizarEstado(r.estado),
          fecha: this.formatearFecha(r.fecha_reporte),
          direccion: r.direccion || '',
          zona: r.zona || '',
          referencia: r.referencia || ''
        }));
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar mis reportes:', error);
        this.reportes = [];
        this.error = 'No se pudieron cargar tus reportes.';
        this.cargando = false;
      }
    });
  }

  private normalizarEstado(estado: string | undefined): string {
    const valor = (estado || 'Pendiente').trim().toLowerCase();
    if (valor === 'recibido') return 'Pendiente';
    if (valor === 'en revisión' || valor === 'en revision') return 'Pendiente';
    if (valor === 'asignado') return 'En Proceso';
    if (valor === 'resuelto') return 'Resuelto';
    if (valor === 'rechazado') return 'Rechazado';
    return estado || 'Pendiente';
  }

  private formatearFecha(fecha: string | Date): string {
    const valor = new Date(fecha);
    if (Number.isNaN(valor.getTime())) return String(fecha || '');
    return valor.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
  }
>>>>>>> fix-jaquino-2025376

  get reportesFiltrados(): Reporte[] {
    return this.reportes.filter(reporte => {
      return (
        this.filtroActual === 'Todos' ||
<<<<<<< HEAD
        reporte.estado === this.filtroActual
=======
        reporte.estado.toLowerCase() === this.filtroActual.toLowerCase()
>>>>>>> fix-jaquino-2025376
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