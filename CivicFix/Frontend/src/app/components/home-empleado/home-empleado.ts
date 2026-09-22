import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Incidencia {
  id: string;
  tipo: string;
  ubicacion: string;
  prioridad: string;
  estado: string;
  icono: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-home-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-empleado.html',
  styleUrl: './home-empleado.css'
})
export class HomeEmpleadoComponent {

  empleado = {
    nombre: 'Carlos López',
    cargo: 'Técnico Municipal',
    departamento: 'Obras Municipales'
  };

  estadisticas = {
    asignadas: 8,
    proceso: 5,
    revisitas: 3
  };

  incidencias: Incidencia[] = [
    {
      id: 'REP-0012',
      tipo: 'Fuga de agua',
      ubicacion: 'Zona 1',
      prioridad: 'Crítica',
      estado: 'En proceso',
      icono: 'fa-solid fa-droplet',
      x: 30,
      y: 35
    },
    {
      id: 'REP-0011',
      tipo: 'Bache',
      ubicacion: 'Zona 5',
      prioridad: 'Alta',
      estado: 'Asignado',
      icono: 'fa-solid fa-road',
      x: 62,
      y: 24
    },
    {
      id: 'REP-0010',
      tipo: 'Luminaria',
      ubicacion: 'Zona 7',
      prioridad: 'Media',
      estado: 'En proceso',
      icono: 'fa-solid fa-lightbulb',
      x: 76,
      y: 55
    },
    {
      id: 'REP-0009',
      tipo: 'Basura',
      ubicacion: 'Zona 3',
      prioridad: 'Baja',
      estado: 'En proceso',
      icono: 'fa-solid fa-trash',
      x: 44,
      y: 68
    },
    {
      id: 'REP-0008',
      tipo: 'Bache',
      ubicacion: 'Zona 8',
      prioridad: 'Alta',
      estado: 'Asignado',
      icono: 'fa-solid fa-road',
      x: 82,
      y: 77
    },
    {
      id: 'REP-0007',
      tipo: 'Agua',
      ubicacion: 'Zona 10',
      prioridad: 'Media',
      estado: 'En proceso',
      icono: 'fa-solid fa-droplet',
      x: 20,
      y: 72
    }
  ];

  constructor() {}

  obtenerClasePrioridad(prioridad: string): string {
    switch (prioridad) {
      case 'Crítica':
        return 'prioridad-critica';
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

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Asignado':
        return 'estado-asignado';
      case 'En proceso':
        return 'estado-proceso';
      case 'Resuelto':
        return 'estado-resuelto';
      default:
        return '';
    }
  }

  verIncidencia(id: string): void {
    console.log('Incidencia seleccionada:', id);
  }
}
