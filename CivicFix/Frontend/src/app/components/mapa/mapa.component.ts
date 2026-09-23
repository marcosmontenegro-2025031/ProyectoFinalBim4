import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import { RouterLink, Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

import {
  ReporteService
} from '../../services/reporte.service';

import {
  PuntoMapa
} from '../../models/reporte.model';

interface ReporteMapa {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  categoria: string;
  ubicacion: string;
  fecha: string;
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer')
  mapContainer!: ElementRef<HTMLDivElement>;

  private map: any = null;
  private leaflet: any = null;
  private markers: any[] = [];

  textoBusqueda = '';

  filtroEstado = 'Todos';
  filtroPrioridad = 'Todas';

  cargandoReportes = false;
  errorReportes = '';

  get esEmpleado(): boolean { return this.session.obtenerRol() === 'empleado' || this.session.obtenerRol() === 'administrador'; }
  get rutaInicio(): string { return this.esEmpleado ? '/empleado/home' : '/home-usuario'; }
  get rutaReportes(): string { return this.esEmpleado ? '/empleado/reportes' : '/mis-reportes'; }
  get rutaMapa(): string { return this.esEmpleado ? '/empleado/mapa' : '/mapa'; }
  get rutaNotificaciones(): string { return this.esEmpleado ? '/empleado/notificaciones' : '/notificaciones'; }
  get rutaPerfil(): string { return this.esEmpleado ? '/empleado/perfil' : '/perfil'; }
  reportes: ReporteMapa[] = [];

  reportesFiltrados: ReporteMapa[] = [];

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: object,

    private reporteService: ReporteService,
    private session: SessionService,
    private router: Router
  ) {}

  async ngAfterViewInit(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(async () => {
      await this.inicializarMapa();
    }, 100);
  }

  async inicializarMapa(): Promise<void> {

    if (!this.mapContainer?.nativeElement) {

      console.error(
        'No se encontró el contenedor del mapa'
      );

      return;
    }

    try {

      const L = await import('leaflet');

      this.leaflet = L;

      const container =
        this.mapContainer.nativeElement;

      if (
        container.offsetWidth === 0 ||
        container.offsetHeight === 0
      ) {

        console.error(
          'El contenedor del mapa no tiene dimensiones:',
          container.offsetWidth,
          container.offsetHeight
        );

        setTimeout(() => {
          this.inicializarMapa();
        }, 500);

        return;
      }

      this.map = L.map(
        container,
        {
          center: [
            14.6349,
            -90.5069
          ],
          zoom: 13,
          zoomControl: false,
          attributionControl: true
        }
      );

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; OpenStreetMap contributors'
        }
      ).addTo(this.map);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

      setTimeout(() => {

        if (this.map) {

          this.map.invalidateSize(true);

        }

      }, 300);

      await this.cargarReportes();

      this.actualizarMarcadores();

      setTimeout(() => {

        if (this.map) {

          this.map.invalidateSize(true);

          this.map.setView(
            [
              14.6349,
              -90.5069
            ],
            13
          );

        }

      }, 500);

      window.addEventListener(
        'verReporteCivicFix',
        this.manejarVerReporte
      );

    } catch (error) {

      console.error(
        'Error al cargar Leaflet:',
        error
      );

      this.errorReportes =
        'No se pudo cargar el mapa.';

    }
  }

  cargarReportes(): Promise<void> {

    return new Promise((resolve) => {

      this.cargandoReportes = true;
      this.errorReportes = '';

      (this.esEmpleado ? this.reporteService.obtenerMisAsignaciones() : this.reporteService.obtenerPuntosMapa())
        .subscribe({

          next: (puntos: PuntoMapa[]) => {

            console.log(
              'Puntos recibidos desde backend:',
              puntos
            );

            this.reportes =
              puntos
                .filter(punto =>
                  punto.latitud !== null &&
                  punto.latitud !== undefined &&
                  punto.longitud !== null &&
                  punto.longitud !== undefined
                )
                .map(punto => ({

                  id: Number(
                    punto.id_reporte
                  ),

                  titulo:
                    punto.titulo,

                  descripcion:
                    punto.descripcion,

                  estado:
                    punto.estado,

                  prioridad:
                    punto.prioridad,

                  categoria:
                    (punto as any).categoria || (punto as any).tipo_incidencia ||
                    'Incidencia',

                  ubicacion:
                    punto.zona
                      ? `${punto.zona} - ${punto.direccion}`
                      : punto.direccion,

                  fecha:
                    this.formatearFecha(
                      (punto as any).fecha_reporte
                    ),

                  latitud:
                    Number(
                      punto.latitud
                    ),

                  longitud:
                    Number(
                      punto.longitud
                    )

                }))
                .filter(punto =>
                  Number.isFinite(
                    punto.latitud
                  ) &&
                  Number.isFinite(
                    punto.longitud
                  )
                );

            this.reportesFiltrados = [
              ...this.reportes
            ];

            this.cargandoReportes = false;

            console.log(
              'Reportes preparados para el mapa:',
              this.reportes
            );

            resolve();

          },

          error: (error) => {

            console.error(
              'Error al obtener reportes del mapa:',
              error
            );

            this.cargandoReportes = false;

            this.errorReportes =
              'No se pudieron cargar las incidencias.';

            this.reportes = [];

            this.reportesFiltrados = [];

            resolve();

          }

        });

    });
  }

  formatearFecha(
    fecha: string | Date | undefined
  ): string {

    if (!fecha) {
      return '';
    }

    const fechaObjeto =
      new Date(fecha);

    if (
      Number.isNaN(
        fechaObjeto.getTime()
      )
    ) {

      return String(fecha);

    }

    return fechaObjeto.toLocaleDateString(
      'es-GT',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  }

  manejarVerReporte = (
    event: Event
  ): void => {

    const customEvent =
      event as CustomEvent;

    const id =
      Number(
        customEvent.detail
      );

    const reporte =
      this.reportes.find(
        reporte =>
          reporte.id === id
      );

    if (reporte) {

      this.verDetalle(
        reporte
      );

    }
  };

  buscarReportes(): void {

    this.aplicarFiltros();

  }

  limpiarBusqueda(): void {

    this.textoBusqueda = '';

    this.aplicarFiltros();

  }

  cambiarFiltro(): void {

    this.aplicarFiltros();

  }

  private aplicarFiltros(): void {

    const busqueda =
      this.textoBusqueda
        .trim()
        .toLowerCase();

    const estadoFiltro =
      this.filtroEstado
        .trim()
        .toLowerCase();

    const prioridadFiltro =
      this.filtroPrioridad
        .trim()
        .toLowerCase();

    this.reportesFiltrados =
      this.reportes.filter(
        reporte => {

          const coincideEstado =
            estadoFiltro === 'todos' ||
            reporte.estado
              .trim()
              .toLowerCase() ===
            estadoFiltro;

          const coincidePrioridad =
            prioridadFiltro === 'todas' ||
            reporte.prioridad
              .trim()
              .toLowerCase() ===
            prioridadFiltro;

          const textoReporte = `
            ${this.escaparHtml(reporte.titulo)}
            ${this.escaparHtml(reporte.descripcion)}
            ${this.escaparHtml(reporte.categoria)}
            ${this.escaparHtml(reporte.ubicacion)}
            ${this.escaparHtml(reporte.estado)}
            ${this.escaparHtml(reporte.prioridad)}
          `.toLowerCase();

          const coincideBusqueda =
            !busqueda ||
            textoReporte.includes(
              busqueda
            );

          return (
            coincideEstado &&
            coincidePrioridad &&
            coincideBusqueda
          );

        }
      );

    this.actualizarMarcadores();

  }

  actualizarMarcadores(): void {

    if (
      !this.map ||
      !this.leaflet
    ) {

      return;

    }

    this.markers.forEach(
      marker => {

        this.map.removeLayer(
          marker
        );

      }
    );

    this.markers = [];

    this.reportesFiltrados.forEach(
      reporte => {

        const marker =
          this.crearMarker(
            reporte
          );

        if (marker) {

          marker.addTo(
            this.map
          );

          this.markers.push(
            marker
          );

        }

      }
    );
  }

  crearMarker(
    reporte: ReporteMapa
  ): any {

    if (!this.leaflet) {

      return null;

    }

    const color =
      this.obtenerColorPrioridad(
        reporte.prioridad
      );

    const icon =
      this.leaflet.divIcon({

        className:
          'civicfix-marker-wrapper',

        html: `
          <div class="civicfix-marker ${color}">
            <div class="marker-pulse"></div>

            <div class="marker-circle">
              <i class="${this.obtenerIconoCategoria(
                reporte.categoria
              )}"></i>
            </div>

            <div class="marker-pointer"></div>
          </div>
        `,

        iconSize: [
          46,
          58
        ],

        iconAnchor: [
          23,
          58
        ],

        popupAnchor: [
          0,
          -55
        ]

      });

    const marker =
      this.leaflet.marker(
        [
          reporte.latitud,
          reporte.longitud
        ],
        {
          icon
        }
      );

    marker.bindPopup(
      this.crearPopup(
        reporte
      ),
      {
        maxWidth: 350,
        minWidth: 280,
        className:
          'civicfix-popup-container'
      }
    );

    return marker;
  }

  private escaparHtml(texto: unknown): string {
    const dic: Record<string, string> = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
    return String(texto ?? '').replace(/[&<>"']/g, c => dic[c]);
  }

  crearPopup(reporte: ReporteMapa): string {

    const prioridadClass =
      this.obtenerClasePrioridad(
        reporte.prioridad
      );

    const estadoClass =
      this.obtenerClaseEstado(
        reporte.estado
      );

    return `
      <div class="civicfix-popup">

        <div class="popup-header">

          <div class="popup-category">

            <i class="${this.obtenerIconoCategoria(
              reporte.categoria
            )}"></i>

            ${this.escaparHtml(reporte.categoria)}

          </div>

          <span class="popup-id">
            REP-${reporte.id
              .toString()
              .padStart(4, '0')}
          </span>

        </div>

        <h3 class="popup-title">
          ${this.escaparHtml(reporte.titulo)}
        </h3>

        <p class="popup-description">
          ${this.escaparHtml(reporte.descripcion)}
        </p>

        <div class="popup-location">

          <i class="bi bi-geo-alt-fill"></i>

          <span>
            ${this.escaparHtml(reporte.ubicacion)}
          </span>

        </div>

        <div class="popup-info">

          <span class="popup-badge ${estadoClass}">
            ${this.escaparHtml(reporte.estado)}
          </span>

          <span class="popup-badge ${prioridadClass}">
            Prioridad ${this.escaparHtml(reporte.prioridad)}
          </span>

        </div>

        <div class="popup-footer">

          <span>

            <i class="bi bi-calendar3"></i>

            ${this.escaparHtml(reporte.fecha)}

          </span>

          <button
            type="button"
            onclick="
              window.dispatchEvent(
                new CustomEvent(
                  'verReporteCivicFix',
                  {
                    detail: ${reporte.id}
                  }
                )
              )
            "
          >

            Ver reporte

            <i class="bi bi-arrow-right"></i>

          </button>

        </div>

      </div>
    `;
  }

  centrarReporte(
    reporte: ReporteMapa
  ): void {

    if (!this.map) {

      return;

    }

    this.map.flyTo(
      [
        reporte.latitud,
        reporte.longitud
      ],
      16,
      {
        animate: true,
        duration: 0.8
      }
    );

    const marker =
      this.markers.find(
        marker => {

          const position =
            marker.getLatLng();

          return (
            Math.abs(
              position.lat -
              reporte.latitud
            ) < 0.00001 &&
            Math.abs(
              position.lng -
              reporte.longitud
            ) < 0.00001
          );

        }
      );

    if (marker) {

      setTimeout(() => {

        marker.openPopup();

      }, 800);

    }
  }

  centrarMapa(): void {

    if (!this.map) {

      return;

    }

    this.map.flyTo(
      [
        14.6349,
        -90.5069
      ],
      13,
      {
        animate: true,
        duration: 0.8
      }
    );

    setTimeout(() => {

      if (this.map) {

        this.map.invalidateSize(true);

      }

    }, 300);
  }

  zoomIn(): void {

    if (this.map) {

      this.map.zoomIn();

    }

  }

  zoomOut(): void {

    if (this.map) {

      this.map.zoomOut();

    }

  }

  nuevoReporte(): void {

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      if (!this.esEmpleado) this.router.navigate(['/reportes/nuevo']);

    }

  }

  verDetalle(reporte: ReporteMapa): void {
    this.router.navigate(this.esEmpleado
      ? ['/empleado/bitacora', reporte.id]
      : ['/detalle-reporte', reporte.id]);
  }

  obtenerColorPrioridad(
    prioridad: string
  ): string {

    switch (
      prioridad
        .trim()
        .toLowerCase()
    ) {

      case 'alta':
      case 'alto':
        return 'marker-high';

      case 'media':
      case 'medio':
        return 'marker-medium';

      case 'baja':
      case 'bajo':
        return 'marker-low';

      case 'crítica':
      case 'critica':
      case 'crítico':
      case 'critico':
        return 'marker-high';

      default:
        return 'marker-medium';

    }
  }

  obtenerClasePrioridad(
    prioridad: string
  ): string {

    switch (
      prioridad
        .trim()
        .toLowerCase()
    ) {

      case 'alta':
      case 'alto':
        return 'priority-high';

      case 'media':
      case 'medio':
        return 'priority-medium';

      case 'baja':
      case 'bajo':
        return 'priority-low';

      case 'crítica':
      case 'critica':
      case 'crítico':
      case 'critico':
        return 'priority-high';

      default:
        return 'priority-medium';

    }
  }

  obtenerClaseEstado(
    estado: string
  ): string {

    switch (
      estado
        .trim()
        .toLowerCase()
    ) {

      case 'pendiente':
        return 'state-pending';

      case 'en proceso':
        return 'state-process';

      case 'resuelto':
        return 'state-resolved';

      default:
        return 'state-pending';

    }
  }

  obtenerIconoCategoria(
    categoria: string
  ): string {

    const categoriaNormalizada =
      categoria
        .trim()
        .toLowerCase();

    if (
      categoriaNormalizada.includes(
        'bache'
      )
    ) {

      return 'bi bi-cone-striped';

    }

    if (
      categoriaNormalizada.includes(
        'luminaria'
      )
    ) {

      return 'bi bi-lightbulb';

    }

    if (
      categoriaNormalizada.includes(
        'basura'
      )
    ) {

      return 'bi bi-trash3';

    }

    if (
      categoriaNormalizada.includes(
        'señal'
      ) ||
      categoriaNormalizada.includes(
        'senal'
      )
    ) {

      return 'bi bi-sign-stop';

    }

    if (
      categoriaNormalizada.includes(
        'agua'
      )
    ) {

      return 'bi bi-droplet';

    }

    if (
      categoriaNormalizada.includes(
        'árbol'
      ) ||
      categoriaNormalizada.includes(
        'arbol'
      )
    ) {

      return 'bi bi-tree';

    }

    return 'bi bi-geo-alt';
  }

  cantidadPorEstado(
    estado: string
  ): number {

    return this.reportes.filter(
      reporte =>
        reporte.estado
          .trim()
          .toLowerCase() ===
        estado
          .trim()
          .toLowerCase()
    ).length;

  }

  cantidadPorPrioridad(
    prioridad: string
  ): number {

    return this.reportes.filter(
      reporte =>
        reporte.prioridad
          .trim()
          .toLowerCase() ===
        prioridad
          .trim()
          .toLowerCase()
    ).length;

  }

  ngOnDestroy(): void {

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      window.removeEventListener(
        'verReporteCivicFix',
        this.manejarVerReporte
      );

    }

    if (this.map) {

      this.map.remove();

      this.map = null;

    }

    this.markers = [];

  }
}