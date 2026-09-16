import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject
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

import { ReporteService } from '../../services/reporte.service';
import { FotoProblemaService } from '../../services/fotoProblema.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent
  implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', {
    static: false
  })
  mapContainer!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private reporteService = inject(ReporteService);
  private fotoService = inject(FotoProblemaService);

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
      1,
      Validators.required
    ]

  });


  async ngAfterViewInit(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(async () => {

      if (!this.mapContainer?.nativeElement) {
        return;
      }

      const L = await import('leaflet');

      this.map = L.map(
        this.mapContainer.nativeElement,
        {
          zoomControl: true
        }
      ).setView(
        [
          14.6349,
          -90.5069
        ],
        16
      );


      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; OpenStreetMap contributors'
        }
      ).addTo(this.map);


      this.marker = L.marker(
        [
          14.6349,
          -90.5069
        ],
        {
          draggable: true
        }
      ).addTo(this.map);


      this.map.on(
        'click',
        (event: any) => {

          this.actualizarUbicacion(
            event.latlng.lat,
            event.latlng.lng
          );

        }
      );


      this.marker.on(
        'dragend',
        () => {

          const posicion =
            this.marker?.getLatLng();

          if (!posicion) {
            return;
          }

          this.actualizarUbicacion(
            posicion.lat,
            posicion.lng
          );

        }
      );


      setTimeout(() => {

        this.map?.invalidateSize();

      }, 300);

    });

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

      latitud: latCorta,

      longitud: lngCorta

    });


    this.marker?.setLatLng([
      latCorta,
      lngCorta
    ]);


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

        if (!data?.display_name) {
          return;
        }

        const direccion =
          data.display_name
            .split(',')
            .slice(0, 4)
            .join(',');

        this.form.patchValue({
          direccion
        });

      })
      .catch(() => {

        console.warn(
          'No fue posible obtener la dirección automáticamente.'
        );

      });

  }


  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }


    if (
      !file.type.startsWith(
        'image/'
      )
    ) {

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
      URL.createObjectURL(
        file
      );


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

    if (
      this.form.invalid
    ) {

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

  }


  ngOnDestroy(): void {

    if (
      this.vistaPrevia
    ) {

      URL.revokeObjectURL(
        this.vistaPrevia
      );

    }


    if (
      this.map
    ) {

      this.map.remove();

    }

  }

}