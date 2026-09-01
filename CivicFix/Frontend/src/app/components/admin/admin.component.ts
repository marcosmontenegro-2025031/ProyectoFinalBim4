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

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.reporteService.obtenerPuntosMapa().subscribe({
      next: (data) => {
        this.reportes = data;
        this.cargando = false;
      },
      error: () => {
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
}