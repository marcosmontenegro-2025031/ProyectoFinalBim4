import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface TipoIncidencia {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  reportes: number;
  estado: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-tipos-incidencia-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './tipos-incidencia-admin.component.html',
  styleUrl: './tipos-incidencia-admin.component.css'
})
export class TiposIncidenciaAdminComponent {

  textoBusqueda = '';
  filtroEstado = 'Todos';

  tipos: TipoIncidencia[] = [
    {
      id: 1,
      nombre: 'Baches',
      descripcion: 'Daños, hundimientos y deterioro de calles.',
      icono: 'bi-sign-turn-right-fill',
      color: '#0874dc',
      reportes: 48,
      estado: 'Activo',
      fechaCreacion: '2024-01-10'
    },
    {
      id: 2,
      nombre: 'Alumbrado público',
      descripcion: 'Luminarias apagadas, dañadas o deficientes.',
      icono: 'bi-lightbulb-fill',
      color: '#e58b00',
      reportes: 35,
      estado: 'Activo',
      fechaCreacion: '2024-01-15'
    },
    {
      id: 3,
      nombre: 'Basura',
      descripcion: 'Acumulación de basura y problemas de recolección.',
      icono: 'bi-trash3-fill',
      color: '#16a085',
      reportes: 42,
      estado: 'Activo',
      fechaCreacion: '2024-01-20'
    },
    {
      id: 4,
      nombre: 'Fugas de agua',
      descripcion: 'Fugas y problemas en tuberías o servicios de agua.',
      icono: 'bi-droplet-fill',
      color: '#3498db',
      reportes: 21,
      estado: 'Activo',
      fechaCreacion: '2024-02-05'
    },
    {
      id: 5,
      nombre: 'Áreas verdes',
      descripcion: 'Problemas relacionados con parques y áreas verdes.',
      icono: 'bi-tree-fill',
      color: '#27ae60',
      reportes: 19,
      estado: 'Activo',
      fechaCreacion: '2024-02-12'
    },
    {
      id: 6,
      nombre: 'Señalización',
      descripcion: 'Señales de tránsito dañadas o inexistentes.',
      icono: 'bi-signpost-2-fill',
      color: '#8e44ad',
      reportes: 14,
      estado: 'Inactivo',
      fechaCreacion: '2023-12-08'
    }
  ];

  get tiposFiltrados(): TipoIncidencia[] {
    return this.tipos.filter(tipo => {

      const texto = this.textoBusqueda
        .toLowerCase()
        .trim();

      const coincideTexto =
        tipo.nombre.toLowerCase().includes(texto) ||
        tipo.descripcion.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        tipo.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  get tiposActivos(): number {
    return this.tipos.filter(
      tipo => tipo.estado === 'Activo'
    ).length;
  }

  get tiposInactivos(): number {
    return this.tipos.filter(
      tipo => tipo.estado === 'Inactivo'
    ).length;
  }

  get totalReportes(): number {
    return this.tipos.reduce(
      (total, tipo) => total + tipo.reportes,
      0
    );
  }

  nuevoTipo(): void {
    alert('Aquí se abrirá el formulario para crear un tipo de incidencia.');
  }

  editarTipo(tipo: TipoIncidencia): void {
    alert(`Editar tipo de incidencia: ${tipo.nombre}`);
  }

  cambiarEstado(tipo: TipoIncidencia): void {
    tipo.estado =
      tipo.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarTipo(tipo: TipoIncidencia): void {

    const confirmar = confirm(
      `¿Deseas eliminar el tipo "${tipo.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.tipos = this.tipos.filter(
      item => item.id !== tipo.id
    );
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }
}