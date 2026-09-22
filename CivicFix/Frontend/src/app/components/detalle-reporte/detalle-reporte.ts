import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-detalle-reporte',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './detalle-reporte.html',
  styleUrl: './detalle-reporte.css'
})
export class DetalleReporteComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  idReporte: number = 0;

  reporte = {
    id: 125,
    titulo: 'Bache en vía pública',
    tipo: 'Bache',
    prioridad: 'Alta',
    estado: 'En proceso',
    fecha: '21 Septiembre 2026',
    hora: '10:35 AM',
    direccion: 'Avenida Reforma, Zona 10',
    zona: 'Zona 10',
    descripcion: 'Se reporta un bache que dificulta el tránsito vehicular y puede representar un riesgo para los conductores.',
    imagen: 'assets/reportes/bache.jpg'
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
    }
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