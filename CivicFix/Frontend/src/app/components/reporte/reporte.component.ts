import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ReporteService } from '../../services/reporte.service';
import { FotoProblemaService } from '../../services/fotoProblema.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ReporteComponent implements OnInit, OnDestroy {

  @ViewChild('mapContainer', { static: false })
  mapContainer!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private reporteService = inject(ReporteService);
  private fotoService = inject(FotoProblemaService);
  private session = inject(SessionService);

  private map: any;
  private marker: any;

  cargando = false;

  resultado: any = null;

  mensajeError: string | undefined;

  archivoSeleccionado: File | null = null;

  vistaPrevia: string | null = null;

  analisisCompleto = false;

  form = this.fb.group({

    textoCiudadano: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]
    ],

    direccion: [
      '',
      Validators.required
    ],

    zona: [
      '',
      Validators.required
    ],

    referencia: [
      ''
    ],

    latitud: [
      14.6349,
      Validators.required
    ],

    longitud: [
      -90.5069,
      Validators.required
    ],

    idUsuario: [
      0,
      Validators.required
    ]

  });


  async ngOnInit(): Promise<void> {

    const usuario = this.session.obtenerUsuario<{ id_usuario?: number }>();
    if (usuario?.id_usuario) {
      this.form.patchValue({ idUsuario: usuario.id_usuario });
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(async () => {

      try {

        const L = await import('leaflet');

        if (!this.mapContainer?.nativeElement) {

          console.error(
            '[CIVICFIX] No se encontró el contenedor del mapa.'
          );

          return;
        }

        this.map = L.map(
          this.mapContainer.nativeElement,
          {
            zoomControl: true
          }
        ).setView(
          [14.6349, -90.5069],
          15
        );

        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution:
              '&copy; OpenStreetMap contributors'
          }
        ).addTo(this.map);

        const iconoCivicFix = L.divIcon({

          className:
            'civicfix-map-marker-wrapper',

          html: `
            <div class="civicfix-map-marker">

              <div class="civicfix-marker-pulse"></div>

              <div class="civicfix-marker-pin">
                <i class="bi bi-geo-alt-fill"></i>
              </div>

            </div>
          `,

          iconSize: [
            48,
            58
          ],

          iconAnchor: [
            24,
            58
          ],

          popupAnchor: [
            0,
            -58
          ]

        });

        this.marker = L.marker(
          [
            14.6349,
            -90.5069
          ],
          {
            draggable: true,
            icon: iconoCivicFix
          }
        ).addTo(this.map);

        this.marker.bindPopup(`
          <div class="civicfix-popup">

            <strong>
              Ubicación del reporte
            </strong>

            <span>
              Arrastra el marcador para cambiar la ubicación
            </span>

          </div>
        `);

        this.marker.on(
          'dragend',
          () => {

            const posicion =
              this.marker?.getLatLng();

            if (posicion) {

              this.actualizarUbicacion(
                posicion.lat,
                posicion.lng
              );

            }

          }
        );

        this.map.on(
          'click',
          (event: any) => {

            this.actualizarUbicacion(
              event.latlng.lat,
              event.latlng.lng
            );

          }
        );

        setTimeout(() => {

          if (this.map) {

            this.map.invalidateSize();

          }

        }, 500);

        console.log(
          '[CIVICFIX] Mapa y marker cargados correctamente.'
        );

      } catch (error) {

        console.error(
          '[CIVICFIX] Error al cargar Leaflet:',
          error
        );

      }

    }, 300);

  }


  private actualizarUbicacion(
    lat: number,
    lng: number
  ): void {

    const latCorta =
      Number(
        lat.toFixed(6)
      );

    const lngCorta =
      Number(
        lng.toFixed(6)
      );

    this.form.patchValue({

      latitud:
        latCorta,

      longitud:
        lngCorta

    });

    if (this.marker) {

      this.marker.setLatLng([
        latCorta,
        lngCorta
      ]);

    }

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCorta}&lon=${lngCorta}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    )
      .then(response => {

        if (!response.ok) {

          throw new Error(
            'No se pudo obtener la dirección'
          );

        }

        return response.json();

      })
      .then(data => {

        if (data?.display_name) {

          const direccion =
            data.display_name
              .split(',')
              .slice(0, 4)
              .join(',');

          this.form.patchValue({
            direccion
          });

        }

      })
      .catch(() => {

        console.warn(
          '[CIVICFIX] No fue posible obtener la dirección automáticamente.'
        );

      });

  }


  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {

      this.mensajeError =
        'Selecciona únicamente una imagen.';

      input.value = '';

      return;
    }

    this.archivoSeleccionado =
      file;

    if (this.vistaPrevia) {

      URL.revokeObjectURL(
        this.vistaPrevia
      );

    }

    this.vistaPrevia =
      URL.createObjectURL(file);

    this.mensajeError =
      undefined;

  }


  eliminarFoto(): void {

    this.archivoSeleccionado =
      null;

    if (this.vistaPrevia) {

      URL.revokeObjectURL(
        this.vistaPrevia
      );

    }

    this.vistaPrevia =
      null;

  }


  obtenerAnalisis(): any {

    return (
      this.resultado?.data?.analisis ||
      this.resultado?.analisis ||
      this.resultado ||
      null
    );

  }


  obtenerTitulo(): string {

    const obj =
      this.obtenerAnalisis();

    return (
      obj?.titulo_corto ||
      obj?.titulo ||
      'Incidencia urbana'
    );

  }


  obtenerTipo(): string {

    const obj =
      this.obtenerAnalisis();

    return (
      obj?.nombre_tipo ||
      obj?.tipo_incidencia ||
      obj?.codigo_tipo ||
      'No especificado'
    );

  }


  obtenerPrioridad(): string {

    const obj =
      this.obtenerAnalisis();

    const prioridad =
      obj?.nivel_prioridad ||
      obj?.codigo_prioridad ||
      obj?.prioridad;

    return prioridad
      ? String(prioridad)
      : 'No especificada';

  }


  obtenerEstado(): string {

    const obj =
      this.obtenerAnalisis();

    return (
      obj?.estado ||
      'Pendiente'
    );

  }


  obtenerServicio(): string {

    const obj =
      this.obtenerAnalisis();

    return (
      obj?.servicio_municipal ||
      obj?.servicio ||
      'Por asignar'
    );

  }


  obtenerResumen(): string {

    const obj =
      this.obtenerAnalisis();

    return (
      obj?.resumen ||
      obj?.resumen_analisis ||
      obj?.justificacion ||
      'La IA ha analizado la información proporcionada.'
    );

  }


  obtenerColorPrioridad(): string {

    const prioridad =
      this.obtenerPrioridad()
        .toLowerCase();

    if (
      prioridad.includes('crít') ||
      prioridad.includes('crit')
    ) {

      return '#C62828';

    }

    if (
      prioridad.includes('alt')
    ) {

      return '#EF6C00';

    }

    if (
      prioridad.includes('med')
    ) {

      return '#F9A825';

    }

    return '#2E7D32';

  }


  obtenerIconoPrioridad(): string {

    const prioridad =
      this.obtenerPrioridad()
        .toLowerCase();

    if (
      prioridad.includes('crít') ||
      prioridad.includes('crit')
    ) {

      return 'bi-exclamation-octagon-fill';

    }

    if (
      prioridad.includes('alt')
    ) {

      return 'bi-exclamation-circle-fill';

    }

    if (
      prioridad.includes('med')
    ) {

      return 'bi-dash-circle-fill';

    }

    return 'bi-check-circle-fill';

  }


  obtenerIconoTipo(): string {

    const tipo =
      this.obtenerTipo()
        .toLowerCase();

    if (
      tipo.includes('agua')
    ) {

      return 'bi-droplet-fill';

    }

    if (
      tipo.includes('luminaria')
    ) {

      return 'bi-lightbulb-fill';

    }

    if (
      tipo.includes('bache')
    ) {

      return 'bi-cone-striped';

    }

    return 'bi-exclamation-triangle-fill';

  }


  obtenerIconoEstado(): string {

    const estado =
      this.obtenerEstado()
        .toLowerCase();

    switch (estado) {

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


  verificarValidez(): boolean {

    const obj =
      this.obtenerAnalisis();

    if (
      obj &&
      obj.es_reporte_valido === false
    ) {

      return false;

    }

    return true;

  }


  onSubmit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.cargando =
      true;

    this.analisisCompleto =
      false;

    this.resultado =
      null;

    this.mensajeError =
      undefined;

    this.reporteService
      .registrarReporte(
        this.form.getRawValue() as any
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            '[CIVICFIX] Respuesta Gemini:',
            res
          );

          const analisis =
            res?.data?.analisis ||
            res?.analisis ||
            res;

          if (
            analisis &&
            analisis.es_reporte_valido === false
          ) {

            this.resultado =
              res;

            this.analisisCompleto =
              true;

            this.cargando =
              false;

            this.mensajeError =
              'La IA determinó que el texto ingresado no corresponde a un problema urbano válido.';

            return;

          }

          const dataReporte =
            Array.isArray(res)
              ? res[0]
              : (
                res?.data ||
                res
              );

          const reporteId =
            dataReporte?.id_reporte ||
            dataReporte?.id;

          console.log(
            '[CIVICFIX] ID reporte:',
            reporteId
          );

          if (
            this.archivoSeleccionado &&
            reporteId
          ) {

            this.fotoService
              .subirFoto(
                reporteId,
                this.archivoSeleccionado
              )
              .subscribe({

                next: () => {

                  this.resultado =
                    res;

                  this.cargando =
                    false;

                  this.analisisCompleto =
                    true;

                  this.resetFormulario();

                },

                error: error => {

                  console.error(
                    '[CIVICFIX] Error fotografía:',
                    error
                  );

                  this.resultado =
                    res;

                  this.cargando =
                    false;

                  this.analisisCompleto =
                    true;

                  this.mensajeError =
                    'El reporte fue creado, pero ocurrió un problema al guardar la fotografía.';

                }

              });

          } else {

            this.resultado =
              res;

            this.cargando =
              false;

            this.analisisCompleto =
              true;

            this.resetFormulario();

          }

        },

        error: error => {

          console.error(
            '[CIVICFIX] Error reporte:',
            error
          );

          this.cargando =
            false;

          this.mensajeError =
            'Ocurrió un error al procesar el reporte con el servidor.';

        }

      });

  }


  private resetFormulario(): void {

    this.form.reset({

      textoCiudadano: '',
      direccion: '',
      zona: '',
      referencia: '',
      latitud: 14.6349,
      longitud: -90.5069,
      idUsuario: 1

    });

    this.eliminarFoto();

    setTimeout(() => {

      if (this.map) {

        this.map.setView(
          [14.6349, -90.5069],
          15
        );

        this.marker?.setLatLng([
          14.6349,
          -90.5069
        ]);

      }

    }, 100);

  }


  ngOnDestroy(): void {

    if (this.vistaPrevia) {

      URL.revokeObjectURL(
        this.vistaPrevia
      );

    }

    if (this.map) {

      this.map.remove();

    }

  }

}