import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { SessionService } from '../../services/session.service';
import { environment } from '../../../environments/environment';
import { UnreadNotificationCountComponent } from '../../shared/unread-notification-count/unread-notification-count.component';

@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    UnreadNotificationCountComponent
  ],
  templateUrl: './detalle-reporte.html',
  styleUrl: './detalle-reporte.css'
})
export class DetalleReporteComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reporteService = inject(ReporteService);
  private session = inject(SessionService);

  get nombreUsuario(): string { return this.session.obtenerNombreUsuario(); }
  get rolUsuario(): string { return this.session.obtenerEtiquetaRol(); }

  idReporte: number = 0;

  reporte = {
    id: 0,
    titulo: '',
    tipo: '',
    prioridad: '',
    estado: '',
    fecha: '',
    hora: '',
    direccion: '',
    zona: '',
    descripcion: '',
    imagen: null as string | null
  };

  historial = [
    {
      estado: 'Reporte creado',
      fecha: '21 Septiembre 2026',
      hora: '10:35 AM',
      descripcion: 'El reporte fue registrado correctamente.'
    },
    {
      estado: 'Analizado por IA',
      fecha: '21 Septiembre 2026',
      hora: '10:36 AM',
      descripcion: 'La inteligencia artificial clasificó la incidencia y determinó su prioridad.'
    },
    {
      estado: 'Asignado',
      fecha: '21 Septiembre 2026',
      hora: '11:10 AM',
      descripcion: 'El reporte fue asignado al departamento correspondiente.'
    },
    {
      estado: 'En proceso',
      fecha: '21 Septiembre 2026',
      hora: '02:20 PM',
      descripcion: 'El personal municipal inició la atención del reporte.'
    }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idReporte = Number(id);
      this.reporte.id = this.idReporte;
      const reportes$ = this.session.obtenerRol() === 'ciudadano'
        ? this.reporteService.obtenerMisReportes()
        : this.reporteService.obtenerTodosLosReportes();

      reportes$.subscribe({
        next: reportes => {
          const reporte = reportes.find(
            (item: any) => Number(item.id_reporte) === this.idReporte
          );

          if (!reporte) return;

          const fecha = new Date(reporte.fecha_reporte);
          this.reporte = {
            id: Number(reporte.id_reporte),
            titulo: reporte.titulo || 'Incidencia urbana',
            tipo: reporte.tipo_incidencia || 'Incidencia',
            prioridad: reporte.prioridad || 'Baja',
            estado: reporte.estado || 'Pendiente',
            fecha: fecha.toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' }),
            hora: fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
            direccion: reporte.direccion || '',
            zona: reporte.zona || '',
            descripcion: reporte.descripcion || '',
            imagen: reporte.ruta_fotografia
              ? new URL(reporte.ruta_fotografia, environment.apiUrl).toString()
              : null
          };
        },
        error: error => console.error('Error al cargar el detalle del reporte:', error)
      });
    }
  }

  ocultarImagen(): void {
    this.reporte.imagen = null;
  }

  volver(): void {
    this.router.navigate(['/mis-reportes']);
  }

  irMapa(): void {
    this.router.navigate(['/mapa']);
  }

  esMisReportesActivo(): boolean {
    const url = this.router.url;

    return url === '/mis-reportes' || url.startsWith('/detalle-reporte/');
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

      case 'baja':
        return 'prioridad-baja';

      default:
        return '';
    }
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'estado-pendiente';

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

  obtenerIconoTipo(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'bache':
        return 'bi bi-signpost-2-fill';

      case 'agua':
        return 'bi bi-droplet-fill';

      case 'luminaria':
        return 'bi bi-lightbulb-fill';

      case 'basura':
        return 'bi bi-trash-fill';

      default:
        return 'bi bi-exclamation-circle-fill';
    }
  }
}