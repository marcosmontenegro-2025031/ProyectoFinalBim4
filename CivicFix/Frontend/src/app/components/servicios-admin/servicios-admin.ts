import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  departamento: string;
  responsable: string;
  reportes: number;
  estado: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  , AdminSidebarComponent],
  templateUrl: './servicios-admin.html',
  styleUrl: './servicios-admin.css'
})
export class ServiciosAdminComponent {

  textoBusqueda = '';
  filtroEstado = 'Todos';
  filtroDepartamento = 'Todos';

  servicios: Servicio[] = [
    {
      id: 1,
      nombre: 'Recolección de basura',
      descripcion: 'Servicio de recolección de residuos en las diferentes zonas.',
      departamento: 'Servicios Públicos',
      responsable: 'Carlos Ramírez',
      reportes: 38,
      estado: 'Activo',
      fechaCreacion: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Mantenimiento de calles',
      descripcion: 'Reparación y mantenimiento de calles y vías municipales.',
      departamento: 'Infraestructura',
      responsable: 'Luis Castillo',
      reportes: 52,
      estado: 'Activo',
      fechaCreacion: '2024-02-10'
    },
    {
      id: 3,
      nombre: 'Limpieza de áreas verdes',
      descripcion: 'Mantenimiento y limpieza de parques y áreas verdes.',
      departamento: 'Medio Ambiente',
      responsable: 'María López',
      reportes: 24,
      estado: 'Activo',
      fechaCreacion: '2024-03-05'
    },
    {
      id: 4,
      nombre: 'Alumbrado público',
      descripcion: 'Atención de problemas relacionados con luminarias públicas.',
      departamento: 'Servicios Públicos',
      responsable: 'Carlos Ramírez',
      reportes: 31,
      estado: 'Activo',
      fechaCreacion: '2024-03-18'
    },
    {
      id: 5,
      nombre: 'Señalización vial',
      descripcion: 'Instalación y mantenimiento de señales de tránsito.',
      departamento: 'Infraestructura',
      responsable: 'Luis Castillo',
      reportes: 17,
      estado: 'Inactivo',
      fechaCreacion: '2023-11-20'
    }
  ];

  get serviciosFiltrados(): Servicio[] {
    return this.servicios.filter(servicio => {

      const texto = this.textoBusqueda
        .toLowerCase()
        .trim();

      const coincideTexto =
        servicio.nombre.toLowerCase().includes(texto) ||
        servicio.descripcion.toLowerCase().includes(texto) ||
        servicio.departamento.toLowerCase().includes(texto) ||
        servicio.responsable.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        servicio.estado === this.filtroEstado;

      const coincideDepartamento =
        this.filtroDepartamento === 'Todos' ||
        servicio.departamento === this.filtroDepartamento;

      return coincideTexto &&
        coincideEstado &&
        coincideDepartamento;
    });
  }

  get serviciosActivos(): number {
    return this.servicios.filter(
      servicio => servicio.estado === 'Activo'
    ).length;
  }

  get serviciosInactivos(): number {
    return this.servicios.filter(
      servicio => servicio.estado === 'Inactivo'
    ).length;
  }

  get totalReportes(): number {
    return this.servicios.reduce(
      (total, servicio) => total + servicio.reportes,
      0
    );
  }

  get departamentos(): string[] {
    return [
      ...new Set(
        this.servicios.map(servicio => servicio.departamento)
      )
    ];
  }

  nuevoServicio(): void {
    alert('Aquí se abrirá el formulario para crear un servicio.');
  }

  editarServicio(servicio: Servicio): void {
    alert(`Editar servicio: ${servicio.nombre}`);
  }

  cambiarEstado(servicio: Servicio): void {
    servicio.estado =
      servicio.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarServicio(servicio: Servicio): void {

    const confirmar = confirm(
      `¿Deseas eliminar el servicio "${servicio.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.servicios = this.servicios.filter(
      item => item.id !== servicio.id
    );
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }

  obtenerIconoServicio(nombre: string): string {

    const nombreNormalizado = nombre.toLowerCase();

    if (nombreNormalizado.includes('basura')) {
      return 'bi-trash3-fill';
    }

    if (nombreNormalizado.includes('calle')) {
      return 'bi-cone-striped';
    }

    if (nombreNormalizado.includes('verde')) {
      return 'bi-tree-fill';
    }

    if (nombreNormalizado.includes('alumbrado')) {
      return 'bi-lightbulb-fill';
    }

    if (nombreNormalizado.includes('señal')) {
      return 'bi-signpost-2-fill';
    }

    return 'bi-tools';
  }
}