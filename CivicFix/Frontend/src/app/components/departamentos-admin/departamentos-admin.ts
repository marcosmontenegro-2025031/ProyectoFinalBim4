import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

interface Departamento {
  id: number;
  nombre: string;
  descripcion: string;
  encargado: string;
  empleados: number;
  servicios: number;
  estado: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-departamentos-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  , AdminSidebarComponent],
  templateUrl: './departamentos-admin.html',
  styleUrl: './departamentos-admin.css'
})
export class DepartamentosAdminComponent {

  textoBusqueda = '';
  filtroEstado = 'Todos';

  departamentos: Departamento[] = [
    {
      id: 1,
      nombre: 'Servicios Públicos',
      descripcion: 'Atención y mantenimiento de los servicios públicos municipales.',
      encargado: 'Carlos Ramírez',
      empleados: 12,
      servicios: 5,
      estado: 'Activo',
      fechaCreacion: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Infraestructura',
      descripcion: 'Gestión de obras, calles y mantenimiento de infraestructura.',
      encargado: 'Luis Castillo',
      empleados: 9,
      servicios: 4,
      estado: 'Activo',
      fechaCreacion: '2024-02-10'
    },
    {
      id: 3,
      nombre: 'Medio Ambiente',
      descripcion: 'Gestión de áreas verdes, limpieza y protección ambiental.',
      encargado: 'María López',
      empleados: 8,
      servicios: 3,
      estado: 'Activo',
      fechaCreacion: '2024-03-05'
    },
    {
      id: 4,
      nombre: 'Seguridad Municipal',
      descripcion: 'Coordinación de seguridad y atención de incidencias.',
      encargado: 'José Hernández',
      empleados: 15,
      servicios: 4,
      estado: 'Activo',
      fechaCreacion: '2024-04-20'
    },
    {
      id: 5,
      nombre: 'Atención Ciudadana',
      descripcion: 'Atención directa y seguimiento de solicitudes ciudadanas.',
      encargado: 'Ana Morales',
      empleados: 7,
      servicios: 3,
      estado: 'Inactivo',
      fechaCreacion: '2023-09-12'
    }
  ];

  get departamentosFiltrados(): Departamento[] {
    return this.departamentos.filter(departamento => {

      const texto = this.textoBusqueda
        .toLowerCase()
        .trim();

      const coincideTexto =
        departamento.nombre.toLowerCase().includes(texto) ||
        departamento.descripcion.toLowerCase().includes(texto) ||
        departamento.encargado.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        departamento.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  get departamentosActivos(): number {
    return this.departamentos.filter(
      departamento => departamento.estado === 'Activo'
    ).length;
  }

  get departamentosInactivos(): number {
    return this.departamentos.filter(
      departamento => departamento.estado === 'Inactivo'
    ).length;
  }

  get totalEmpleados(): number {
    return this.departamentos.reduce(
      (total, departamento) => total + departamento.empleados,
      0
    );
  }

  get totalServicios(): number {
    return this.departamentos.reduce(
      (total, departamento) => total + departamento.servicios,
      0
    );
  }

  nuevoDepartamento(): void {
    alert('Aquí se abrirá el formulario para crear un departamento.');
  }

  editarDepartamento(departamento: Departamento): void {
    alert(`Editar departamento: ${departamento.nombre}`);
  }

  cambiarEstado(departamento: Departamento): void {
    departamento.estado =
      departamento.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarDepartamento(departamento: Departamento): void {

    const confirmar = confirm(
      `¿Deseas eliminar el departamento "${departamento.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.departamentos = this.departamentos.filter(
      item => item.id !== departamento.id
    );
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }

  obtenerIniciales(nombre: string): string {

    const palabras = nombre.split(' ');

    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }

    return (
      palabras[0].charAt(0) +
      palabras[1].charAt(0)
    ).toUpperCase();
  }
}