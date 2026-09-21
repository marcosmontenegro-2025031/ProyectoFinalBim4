import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ReporteReciente {
  id: number;
  titulo: string;
  ubicacion: string;
  fecha: string;
  estado: string;
  prioridad: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-usuario.html',
  styleUrl: './home-usuario.css'
})
export class HomeComponent {

  usuario = {
    nombre: 'Usuario',
    rol: 'Ciudadano'
  };

  estadisticas = {
    total: 8,
    pendientes: 2,
    proceso: 3,
    resueltos: 3
  };

  reportesRecientes: ReporteReciente[] = [
    {
      id: 1,
      titulo: 'Bache en la vía',
      ubicacion: 'Zona 10',
      fecha: 'Hoy, 09:35 AM',
      estado: 'En proceso',
      prioridad: 'Alta',
      icono: 'fa-solid fa-road'
    },
    {
      id: 2,
      titulo: 'Luminaria dañada',
      ubicacion: 'Zona 14',
      fecha: 'Ayer, 04:20 PM',
      estado: 'Pendiente',
      prioridad: 'Media',
      icono: 'fa-solid fa-lightbulb'
    },
    {
      id: 3,
      titulo: 'Basurero lleno',
      ubicacion: 'Zona 4',
      fecha: '12 Sep, 11:15 AM',
      estado: 'Resuelto',
      prioridad: 'Baja',
      icono: 'fa-solid fa-trash'
    }
  ];

  constructor(private router: Router) {}

  crearReporte(): void {
    this.router.navigate(['/crear-reporte']);
  }

  verMisReportes(): void {
    this.router.navigate(['/mis-reportes']);
  }

  verNotificaciones(): void {
    this.router.navigate(['/notificaciones']);
  }

  verReporte(id: number): void {
    this.router.navigate(['/mis-reportes'], {
      queryParams: { reporte: id }
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'estado-pendiente';
      case 'En proceso':
        return 'estado-proceso';
      case 'Resuelto':
        return 'estado-resuelto';
      default:
        return '';
    }
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'Alta':
        return 'prioridad-alta';
      case 'Media':
        return 'prioridad-media';
      case 'Baja':
        return 'prioridad-baja';
      default:
        return '';
    }
  }
}
