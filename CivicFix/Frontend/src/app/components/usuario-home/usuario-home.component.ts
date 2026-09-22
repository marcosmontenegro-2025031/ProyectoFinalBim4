import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-usuario-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './usuario-home.html',
  styleUrl: './usuario-home.css'
})
export class UsuarioHome implements OnInit {

  reportes: any[] = [];

  cargando = true;

  nombreUsuario = 'Usuario';

  constructor(
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {

    this.cargando = true;

    this.reporteService.obtenerMisReportes().subscribe({

      next: (data) => {

        console.log('Reportes del usuario:', data);

        this.reportes = data;

        this.cargando = false;
      },

      error: (error) => {

        console.error(
          'Error al obtener los reportes:',
          error
        );

        this.reportes = [];

        this.cargando = false;
      }

    });
  }

  obtenerCantidad(estado: string): number {

    return this.reportes.filter(
      reporte =>
        reporte.estado?.toLowerCase() === estado.toLowerCase()
    ).length;
  }

  get totalReportes(): number {
    return this.reportes.length;
  }

  get reportesRecientes(): any[] {
    return this.reportes.slice(0, 5);
  }

  obtenerClaseEstado(estado: string): string {

    if (!estado) {
      return 'estado-pendiente';
    }

    switch (estado.toLowerCase()) {

      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
      case 'resuelta':
        return 'estado-resuelto';

      case 'rechazado':
      case 'rechazada':
        return 'estado-rechazado';

      default:
        return 'estado-pendiente';
    }
  }

  obtenerIconoEstado(estado: string): string {

    if (!estado) {
      return 'bi-clock';
    }

    switch (estado.toLowerCase()) {

      case 'pendiente':
        return 'bi-clock';

      case 'en proceso':
        return 'bi-arrow-repeat';

      case 'resuelto':
      case 'resuelta':
        return 'bi-check-circle-fill';

      case 'rechazado':
      case 'rechazada':
        return 'bi-x-circle-fill';

      default:
        return 'bi-clock';
    }
  }

}