import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

interface Prioridad {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: number;
  color: string;
  reportes: number;
  estado: string;
  tiempoRespuesta: string;
}

@Component({
  selector: 'app-prioridades-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminSidebarComponent
  ],
  templateUrl: './prioridades-admin.html',
  styleUrl: './prioridades-admin.css'
})
export class PrioridadesAdminComponent {

  prioridades: Prioridad[] = [
    {
      id: 1,
      nombre: 'Crítica',
      descripcion: 'Situaciones que requieren atención inmediata.',
      nivel: 4,
      color: '#dc3545',
      reportes: 18,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 2 horas'
    },
    {
      id: 2,
      nombre: 'Alta',
      descripcion: 'Problemas que requieren atención prioritaria.',
      nivel: 3,
      color: '#fd7e14',
      reportes: 42,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 6 horas'
    },
    {
      id: 3,
      nombre: 'Media',
      descripcion: 'Problemas que deben ser atendidos en un plazo regular.',
      nivel: 2,
      color: '#ffc107',
      reportes: 76,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 24 horas'
    },
    {
      id: 4,
      nombre: 'Baja',
      descripcion: 'Problemas que pueden ser atendidos de forma programada.',
      nivel: 1,
      color: '#198754',
      reportes: 31,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 72 horas'
    }
  ];

  textoBusqueda = '';
  filtroEstado = 'Todos';

  get prioridadesFiltradas(): Prioridad[] {
    return this.prioridades.filter(prioridad => {

      const coincideBusqueda =
        prioridad.nombre.toLowerCase().includes(
          this.textoBusqueda.toLowerCase()
        ) ||
        prioridad.descripcion.toLowerCase().includes(
          this.textoBusqueda.toLowerCase()
        );

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        prioridad.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  get prioridadesActivas(): number {
    return this.prioridades.filter(
      prioridad => prioridad.estado === 'Activo'
    ).length;
  }

  get prioridadesInactivas(): number {
    return this.prioridades.filter(
      prioridad => prioridad.estado === 'Inactivo'
    ).length;
  }

  get totalReportes(): number {
    return this.prioridades.reduce(
      (total, prioridad) => total + prioridad.reportes,
      0
    );
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  nuevaPrioridad(): void {
    alert('Aquí se abrirá el formulario para crear una nueva prioridad.');
  }

  editarPrioridad(prioridad: Prioridad): void {
    alert(`Editar prioridad: ${prioridad.nombre}`);
  }

  cambiarEstado(prioridad: Prioridad): void {
    prioridad.estado =
      prioridad.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarPrioridad(prioridad: Prioridad): void {
    const confirmar = confirm(
      `¿Deseas eliminar la prioridad "${prioridad.nombre}"?`
    );

    if (confirmar) {
      this.prioridades = this.prioridades.filter(
        item => item.id !== prioridad.id
      );
    }
  }

  obtenerClaseEstado(estado: string): string {
    return estado === 'Activo'
      ? 'estado-activo'
      : 'estado-inactivo';
  }

  obtenerClasePrioridad(nombre: string): string {
    switch (nombre.toLowerCase()) {
      case 'crítica':
        return 'prioridad-critica';

      case 'alta':
        return 'prioridad-alta';

      case 'media':
        return 'prioridad-media';

      case 'baja':
        return 'prioridad-baja';

      default:
        return '';
    }
  }
}