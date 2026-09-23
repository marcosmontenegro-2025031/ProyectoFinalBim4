import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
 
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
 
import { RouterModule, Router } from '@angular/router';
 
import { ReporteService } from '../../services/reporte.service';
 
import { SessionService } from '../../services/session.service';
 
import { ReporteAdmin } from '../../models/reporte.model';
 
@Component({
  selector: 'app-home-empleado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home-empleado.html',
  styleUrl: './home-empleado.css'
})
 
export class HomeEmpleadoComponent implements OnInit, AfterViewInit, OnDestroy {
 
  @ViewChild('miniMapContainer')
  miniMapContainer!: ElementRef<HTMLDivElement>;
 
  private map: any = null;
 
  private leaflet: any = null;
 
  private markers: any[] = [];
 
  private destruido = false;
 
  private inicializandoMapa = false;
 
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
    private router: Router,
 
    @Inject(PLATFORM_ID)
    private platformId: object
  ) {}
 
  // ==========================================
  // INICIALIZACIÓN DEL COMPONENTE
  // ==========================================
 
  ngOnInit(): void {
 
    const usuario = this.sessionService.obtenerUsuario<any>();
 
    if (usuario) {
 
      this.empleado.nombre = (
        `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`
      ).trim() || 'Empleado';
 
      this.empleado.cargo =
        usuario.cargo ||
        usuario.rol ||
        'Empleado Municipal';
 
    }
 
    this.cargarIncidencias();
 
  }
 
  ngAfterViewInit(): void {
 
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
 
    setTimeout(() => {
 
      if (!this.destruido) {
        this.inicializarMapa();
      }
 
    }, 100);
 
  }
 
  // ==========================================
  // OBTENER INCIDENCIAS ASIGNADAS
  // ==========================================
 
  cargarIncidencias(): void {
 
    if (this.cargando) {
      return;
    }
 
    this.cargando = true;
 
    this.error = '';
 
    this.reporteService.obtenerMisAsignaciones().subscribe({
 
      next: (data) => {
 
        if (this.destruido) {
          return;
        }
 
        this.incidencias = Array.isArray(data)
          ? data
          : [];
 
        this.cargando = false;
 
        this.actualizarMarcadores();
 
      },
 
      error: (err) => {
 
        if (this.destruido) {
          return;
        }
 
        console.error(
          'Error al cargar las incidencias asignadas:',
          err
        );
 
        this.incidencias = [];
 
        this.cargando = false;
 
        switch (err.status) {
 
          case 0:
 
            this.error =
              'No se pudo establecer conexión con el servidor.';
 
            break;
 
          case 400:
 
            this.error =
              'La solicitud de incidencias fue rechazada por el servidor.';
 
            break;
 
          case 401:
 
            this.error =
              'Tu sesión no está autorizada. Inicia sesión nuevamente.';
 
            break;
 
          case 403:
 
            this.error =
              'No tienes permisos para consultar las incidencias.';
 
            break;
 
          case 404:
 
            this.error =
              'No se encontró el servicio de incidencias.';
 
            break;
 
          case 500:
 
            this.error =
              'Ocurrió un error interno del servidor.';
 
            break;
 
          default:
 
            this.error =
              'No se pudieron cargar tus incidencias asignadas.';
 
            break;
 
        }
 
        this.actualizarMarcadores();
 
      }
 
    });
 
  }
 
  // ==========================================
  // RECARGAR INCIDENCIAS
  // ==========================================
 
  recargar(): void {
 
    this.cargarIncidencias();
 
  }
 
  // ==========================================
  // ESTADÍSTICAS
  // ==========================================
 
  get estadisticas() {
 
    return {
 
      asignadas: this.incidencias.length,
 
      proceso: this.contarEstado('En proceso'),
 
      resueltas: this.contarEstado('Resuelto')
 
    };
 
  }
 
  // ==========================================
  // CONTAR INCIDENCIAS POR ESTADO
  // ==========================================
 
  contarEstado(estado: string): number {
 
    return this.incidencias.filter(incidencia =>
 
      String(incidencia.estado ?? '')
        .trim()
        .toLowerCase() === estado.toLowerCase()
 
    ).length;
 
  }
 
  // ==========================================
  // CONTAR INCIDENCIAS POR PRIORIDAD
  // ==========================================
 
  contarPrioridad(prioridad: string): number {
 
    return this.incidencias.filter(incidencia =>
 
      String(incidencia.prioridad ?? '')
        .trim()
        .toLowerCase() === prioridad.toLowerCase()
 
    ).length;
 
  }
 
  // ==========================================
  // CONTAR INCIDENCIAS POR TIPO
  // ==========================================
 
  contarTipo(palabraClave: string): number {
 
    return this.incidencias.filter(incidencia =>
 
      String(incidencia.tipo_incidencia ?? '')
        .toLowerCase()
        .includes(palabraClave.toLowerCase())
 
    ).length;
 
  }
 
  // ==========================================
  // ICONOS DE INCIDENCIAS
  // ==========================================
 
  obtenerIconoTipo(tipo: string): string {
 
    const valor = String(tipo ?? '').toLowerCase();
 
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
 
    if (valor.includes('basura')) {
 
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
 
  // ==========================================
  // CLASES CSS DE PRIORIDAD
  // ==========================================
 
  obtenerClasePrioridad(prioridad: string): string {
 
    switch (String(prioridad ?? '').toLowerCase()) {
 
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
 
  // ==========================================
  // CLASES CSS DE ESTADO
  // ==========================================
 
  obtenerClaseEstado(estado: string): string {
 
    switch (String(estado ?? '').toLowerCase()) {
 
      case 'asignado':
 
        return 'estado-asignado';
 
      case 'en proceso':
 
        return 'estado-proceso';
 
      case 'resuelto':
 
        return 'estado-resuelto';
 
      default:
 
        return '';
 
    }
 
  }
 
  // ==========================================
  // SELECCIONAR INCIDENCIA
  // ==========================================
 
  verIncidencia(id: number): void {
    this.router.navigate(['/empleado/bitacora', id]);
  }

  // ==========================================
  // INICIALIZAR MAPA LEAFLET
  // ==========================================
 
  async inicializarMapa(): Promise<void> {
 
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
 
    if (this.destruido) {
      return;
    }
 
    if (this.map || this.inicializandoMapa) {
      return;
    }
 
    if (!this.miniMapContainer?.nativeElement) {
      return;
    }
 
    this.inicializandoMapa = true;
 
    try {
 
      const L = await import('leaflet');
 
      if (this.destruido) {
        return;
      }
 
      if (!this.miniMapContainer?.nativeElement) {
        return;
      }
 
      this.leaflet = L;
 
      const container = this.miniMapContainer.nativeElement;
 
      this.map = L.map(container, {
 
        center: [14.6349, -90.5069],
 
        zoom: 12,
 
        zoomControl: false,
 
        attributionControl: true
 
      });
 
      L.tileLayer(
 
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
 
        {
 
          maxZoom: 19,
 
          attribution: '&copy; OpenStreetMap contributors'
 
        }
 
      ).addTo(this.map);
 
      setTimeout(() => {
 
        if (!this.destruido && this.map) {
 
          this.map.invalidateSize(true);
 
        }
 
      }, 300);
 
      this.actualizarMarcadores();
 
    } catch (error) {
 
      console.error(
        'Error al inicializar el mapa:',
        error
      );
 
    } finally {
 
      this.inicializandoMapa = false;
 
    }
 
  }
 
  // ==========================================
  // ACTUALIZAR MARCADORES DEL MAPA
  // ==========================================
 
  actualizarMarcadores(): void {
 
    if (this.destruido) {
      return;
    }
 
    if (!this.map || !this.leaflet) {
      return;
    }
 
    // Eliminar marcadores anteriores
 
    this.markers.forEach(marker => {
 
      this.map.removeLayer(marker);
 
    });
 
    this.markers = [];
 
    // Obtener incidencias con coordenadas válidas
 
    const puntos = this.incidencias.filter(incidencia => {
 
      if (
        incidencia.latitud == null ||
        incidencia.longitud == null
      ) {
 
        return false;
 
      }
 
      if (
        String(incidencia.latitud).trim() === '' ||
        String(incidencia.longitud).trim() === ''
      ) {
 
        return false;
 
      }
 
      const latitud = Number(incidencia.latitud);
 
      const longitud = Number(incidencia.longitud);
 
      return (
 
        Number.isFinite(latitud) &&
 
        Number.isFinite(longitud) &&
 
        Math.abs(latitud) <= 90 &&
 
        Math.abs(longitud) <= 180
 
      );
 
    });
 
    // Crear marcadores
 
    puntos.forEach(incidencia => {
 
      const color = this.obtenerColorMarcador(
        incidencia.prioridad
      );
 
      const icono = this.obtenerIconoTipo(
        incidencia.tipo_incidencia
      );
 
      const icon = this.leaflet.divIcon({
 
        className: 'mini-marker-wrapper',
 
        html: `
<div class="mini-marker ${color}">
<i class="${icono}"></i>
</div>
        `,
 
        iconSize: [30, 30],
 
        iconAnchor: [15, 15],
 
        popupAnchor: [0, -15]
 
      });
 
      const marker = this.leaflet.marker(
 
        [
 
          Number(incidencia.latitud),
 
          Number(incidencia.longitud)
 
        ],
 
        {
 
          icon: icon
 
        }
 
      );
 
      // Información del marcador
 
      const titulo = this.escaparHtml(
        incidencia.titulo
      );
 
      const direccion = this.escaparHtml(
        incidencia.direccion
      );
 
      const estado = this.escaparHtml(
        incidencia.estado
      );
 
      const prioridad = this.escaparHtml(
        incidencia.prioridad
      );
 
      marker.bindPopup(`
 
        <strong>${titulo}</strong>
 
        <br>
 
        ${direccion}
 
        <br>
 
        <span>
 
          ${estado} · ${prioridad}
 
        </span>
 
      `);
 
      marker.addTo(this.map);
 
      this.markers.push(marker);
 
    });
 
    // Centrar mapa en las incidencias
 
    if (puntos.length > 0) {
 
      const bounds = this.leaflet.latLngBounds(
 
        puntos.map(incidencia => [
 
          Number(incidencia.latitud),
 
          Number(incidencia.longitud)
 
        ])
 
      );
 
      this.map.fitBounds(bounds, {
 
        padding: [30, 30],
 
        maxZoom: 15
 
      });
 
    }
 
  }
 
  // ==========================================
  // COLORES DE LOS MARCADORES
  // ==========================================
 
  obtenerColorMarcador(prioridad: string): string {
 
    switch (String(prioridad ?? '').toLowerCase()) {
 
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
 
  // ==========================================
  // ESCAPAR CONTENIDO HTML
  // ==========================================
 
  private escaparHtml(valor: unknown): string {
 
    const entidades: Record<string, string> = {
 
      '&': '&amp;',
 
      '<': '&lt;',
 
      '>': '&gt;',
 
      '"': '&quot;',
 
      "'": '&#39;'
 
    };
 
    return String(valor ?? '').replace(
 
      /[&<>"']/g,
 
      caracter => entidades[caracter]
 
    );
 
  }
 
  // ==========================================
  // DESTRUIR COMPONENTE
  // ==========================================
 
  ngOnDestroy(): void {
 
    this.destruido = true;
 
    if (this.map) {
 
      this.map.remove();
 
      this.map = null;
 
    }
 
    this.markers = [];
 
    this.leaflet = null;
 
  }
 
}