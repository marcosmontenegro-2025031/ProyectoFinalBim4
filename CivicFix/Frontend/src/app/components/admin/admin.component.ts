import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private reporteService = inject(ReporteService);
  reportes: any[] = [];
  cargando = true;

  imagenSeleccionada: string | null = null;

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.reporteService.obtenerTodosLosReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.cargando = false;
      }
    });
  }

  cambiarEstado(idReporte: number, idEstado: number): void {
    this.reporteService.actualizarEstado(idReporte, idEstado).subscribe({
      next: () => {
        this.cargarReportes();
      }
    });
  }

  abrirImagen(url: string): void {
    this.imagenSeleccionada = url;
  }

  cerrarModal(): void {
    this.imagenSeleccionada = null; 
  }

  probarClick(url: string): void {
    console.log('Clic recibido en la imagen con URL:', url);
    this.abrirImagen(url);
  }
}