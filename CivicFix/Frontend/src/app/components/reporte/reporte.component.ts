import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReporteService } from '../../services/reporte.service';
import { FotoProblemaService } from '../../services/fotoProblema.service'; // Ajusta tu ruta

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ReporteComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private reporteService = inject(ReporteService);
  private fotoService = inject(FotoProblemaService);
  
  private map?: any;
  private marker?: any;
  cargando = false;
  resultado?: any;
  mensajeError?: string;
  archivoSeleccionado: File | null = null;

  form = this.fb.group({
    textoCiudadano: ['', [Validators.required, Validators.minLength(10)]],
    direccion: ['', Validators.required],
    zona: [''],
    referencia: [''],
    latitud: [14.6349, Validators.required],
    longitud: [-90.5069, Validators.required],
    idUsuario: [1, Validators.required]
  });

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.map = L.map(this.mapContainer.nativeElement).setView([14.6349, -90.5069], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      this.marker = L.marker([14.6349, -90.5069], { draggable: true }).addTo(this.map);
      
      this.map.on('click', (e: any) => this.actualizarUbicacion(e.latlng.lat, e.latlng.lng));
      this.marker.on('dragend', () => {
        const pos = this.marker?.getLatLng();
        if (pos) this.actualizarUbicacion(pos.lat, pos.lng);
      });
    }
  }

  private actualizarUbicacion(lat: number, lng: number): void {
    const latCorta = Number(lat.toFixed(6));
    const lngCorta = Number(lng.toFixed(6));
    this.form.patchValue({ latitud: latCorta, longitud: lngCorta });
    this.marker?.setLatLng([latCorta, lngCorta]);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latCorta}&lon=${lngCorta}`)
      .then(res => res.json())
      .then(data => {
        if (data?.display_name) {
          this.form.patchValue({ direccion: data.display_name.split(',').slice(0, 3).join(',') });
        }
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  obtenerPrioridad(): string {
    const obj = this.resultado?.data?.analisis || this.resultado?.analisis || this.resultado;
    const valor = obj?.nivel_prioridad || obj?.codigo_prioridad || obj?.prioridad;
    return valor ? String(valor) : 'No especificada';
  }

  obtenerColorPrioridad(): string {
    const p = this.obtenerPrioridad().toLowerCase();
    if (p.includes('crít') || p.includes('crit')) return '#C62828';
    if (p.includes('alt')) return '#EF6C00';
    if (p.includes('med')) return '#F9A825';
    return '#2E7D32';
  }

  verificarValidez(): boolean {
    const obj = this.resultado?.data?.analisis || this.resultado?.analisis || this.resultado;
    if (obj && obj.es_reporte_valido === false) return false;
    return true;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.cargando = true;
    this.resultado = null;
    this.mensajeError = undefined;

    console.log('[ANGULAR] Enviando formulario de reporte...');

    this.reporteService.registrarReporte(this.form.getRawValue() as any).subscribe({
      next: (res: any) => { 
        console.log('[ANGULAR] Respuesta completa recibida:', res);

        const obj = res?.data?.analisis || res?.analisis || res;
        
        if (obj && obj.es_reporte_valido === false) {
          this.resultado = res;
          this.cargando = false;
          this.mensajeError = "La IA determinó que el texto ingresado no corresponde a un problema urbano válido.";
          return;
        }

        const dataReporte = Array.isArray(res) ? res[0] : (res?.data || res);
        const reporteId = dataReporte?.id_reporte || dataReporte?.id;

        console.log('[ANGULAR] ID detectado:', reporteId);
        console.log('[ANGULAR] ¿Hay archivo seleccionado?:', !!this.archivoSeleccionado);

        if (this.archivoSeleccionado && reporteId) {
          console.log('[ANGULAR] Enviando fotografía asociada al reporte ID:', reporteId);
          
          this.fotoService.subirFoto(reporteId, this.archivoSeleccionado).subscribe({
            next: (fotoRes) => {
              console.log('[ANGULAR] ¡Foto guardada en la BD con éxito!', fotoRes);
              this.resultado = res;
              this.cargando = false;
              this.form.reset({ idUsuario: 1, latitud: 14.6349, longitud: -90.5069 });
              this.archivoSeleccionado = null;
            },
            error: (err) => {
              console.error('🔥 [ANGULAR] Error al subir la foto:', err);
              this.cargando = false;
              this.mensajeError = 'El reporte se creó, pero hubo un error al subir la fotografía.';
            }
          });
        } else {
          this.resultado = res;
          this.cargando = false;
          this.form.reset({ idUsuario: 1, latitud: 14.6349, longitud: -90.5069 });
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = "Ocurrió un error al procesar el reporte con el servidor.";
        console.error('[ANGULAR] Error al registrar el reporte base:', err);
      }
    });
  }

  ngOnDestroy(): void { 
    if (this.map) {
      this.map.remove(); 
    }
  }

}