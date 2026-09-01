import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  private platformId = inject(PLATFORM_ID);
  private reporteService = inject(ReporteService);
  private map?: any;

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.map = L.map(this.mapContainer.nativeElement).setView([14.6349, -90.5069], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      
      this.reporteService.obtenerPuntosMapa().subscribe(reportes => {
        reportes.forEach(r => {
          const color = r.prioridad === 'Crítica' ? '#C62828' : r.prioridad === 'Alta' ? '#EF6C00' : r.prioridad === 'Media' ? '#F9A825' : '#2E7D32';
          const iconoPersonalizado = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
            iconSize: [20, 20], iconAnchor: [10, 10]
          });
          if (this.map && r.latitud && r.longitud) {
            L.marker([r.latitud, r.longitud], { icon: iconoPersonalizado }).addTo(this.map).bindPopup(`<b>${r.titulo}</b><br>${r.direccion}`);
          }
        });
      });
    }
  }

  ngOnDestroy(): void { 
    if (this.map) {
      this.map.remove(); 
    }
  }
}