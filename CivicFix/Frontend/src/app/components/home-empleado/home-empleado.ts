import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, Inject, PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { SessionService } from '../../services/session.service';
import { ReporteAdmin } from '../../models/reporte.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './home-empleado.html',
  styleUrl: './home-empleado.css'
})
export class HomeEmpleadoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('miniMapContainer') miniMapContainer!: ElementRef<HTMLDivElement>;

  private map: any = null;
  private leaflet: any = null;
  private markers: any[] = [];

  empleado = {
    nombre: 'Empleado',
    cargo: 'Empleado Municipal'
  };

  incidencias: ReporteAdmin[] = [];
  cargando = false;
  error = '';

  constructor(
    private reporteService: ReporteService,
    private sessionService: SessionService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    const usuario = this.sessionService.obtenerUsuario<any>();

    if (usuario) {
      this.empleado.nombre = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim() || 'Empleado';
      this.empleado.cargo = usuario.rol || usuario.cargo || 'Empleado Municipal';
    }

    this.cargarIncidencias();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.inicializarMapa(), 100);
  }

  cargarIncidencias(): void {
    this.cargando = true;
    this.error = '';

    this.reporteService.obtenerMisAsignaciones().subscribe({
      next: (data) => {
        this.incidencias = data || [];
        this.cargando = false;
        this.actualizarMarcadores();
      },
      error: (err) => {
        console.error('Error al cargar las incidencias asignadas:', err);
        this.error = 'No se pudieron cargar tus incidencias asignadas.';
        this.incidencias = [];
        this.cargando = false;
      }
    });
  }

  recargar(): void {
    this.cargarIncidencias();
  }

  get estadisticas() {
    return {
      asignadas: this.incidencias.length,
      proceso: this.contarEstado('En proceso'),
      resueltas: this.contarEstado('Resuelto')
    };
  }

  contarEstado(estado: string): number {
    return this.incidencias.filter(
      i => (i.estado || '').toLowerCase() === estado.toLowerCase()
    ).length;
  }

  contarPrioridad(prioridad: string): number {
    return this.incidencias.filter(
      i => (i.prioridad || '').toLowerCase() === prioridad.toLowerCase()
    ).length;
  }

  contarTipo(palabraClave: string): number {
    return this.incidencias.filter(
      i => (i.tipo_incidencia || '').toLowerCase().includes(palabraClave)
    ).length;
  }

  obtenerIconoTipo(tipo: string): string {
    const valor = (tipo || '').toLowerCase();
    if (valor.includes('agua')) return 'fa-solid fa-droplet';
    if (valor.includes('bache')) return 'fa-solid fa-road';
    if (valor.includes('luminaria') || valor.includes('luz')) return 'fa-solid fa-lightbulb';
    if (valor.includes('basura')) return 'fa-solid fa-trash';
    if (valor.includes('señal') || valor.includes('senal')) return 'fa-solid fa-road-sign';
    return 'fa-solid fa-triangle-exclamation';
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch ((prioridad || '').toLowerCase()) {
      case 'crítica':
      case 'critica': return 'prioridad-critica';
      case 'alta': return 'prioridad-alta';
      case 'media': return 'prioridad-media';
      case 'baja': return 'prioridad-baja';
      default: return '';
    }
  }

  obtenerClaseEstado(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'asignado': return 'estado-asignado';
      case 'en proceso': return 'estado-proceso';
      case 'resuelto': return 'estado-resuelto';
      default: return '';
    }
  }

  verIncidencia(id: number): void {
    console.log('Incidencia seleccionada:', id);
  }

  // ---------- MINI MAPA (Leaflet) ----------

  async inicializarMapa(): Promise<void> {
    if (!this.miniMapContainer?.nativeElement) return;

    try {
      const L = await import('leaflet');
      this.leaflet = L;

      const container = this.miniMapContainer.nativeElement;

      this.map = L.map(container, {
        center: [14.6349, -90.5069],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      setTimeout(() => this.map?.invalidateSize(true), 300);

      this.actualizarMarcadores();

    } catch (error) {
      console.error('Error al cargar el mini-mapa:', error);
    }
  }

  actualizarMarcadores(): void {
    if (!this.map || !this.leaflet) return;

    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const puntos = this.incidencias.filter(i =>
      i.latitud !== null && i.latitud !== undefined &&
      i.longitud !== null && i.longitud !== undefined
    );

    puntos.forEach(incidencia => {
      const color = this.obtenerColorMarcador(incidencia.prioridad);

      const icon = this.leaflet.divIcon({
        className: 'mini-marker-wrapper',
        html: `<div class="mini-marker ${color}"><i class="${this.obtenerIconoTipo(incidencia.tipo_incidencia)}"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });

      const marker = this.leaflet.marker(
        [Number(incidencia.latitud), Number(incidencia.longitud)],
        { icon }
      );

      marker.bindPopup(`
        <strong>${incidencia.titulo}</strong><br>
        ${incidencia.direccion || ''}<br>
        <span>${incidencia.estado} · ${incidencia.prioridad}</span>
      `);

      marker.addTo(this.map);
      this.markers.push(marker);
    });

    if (puntos.length) {
      const bounds = this.leaflet.latLngBounds(
        puntos.map(p => [Number(p.latitud), Number(p.longitud)])
      );
      this.map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }

  obtenerColorMarcador(prioridad: string): string {
    switch ((prioridad || '').toLowerCase()) {
      case 'alta':
      case 'crítica':
      case 'critica':
        return 'marker-high';
      case 'media':
        return 'marker-medium';
      case 'baja':
        return 'marker-low';
      default:
        return 'marker-medium';
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }
}