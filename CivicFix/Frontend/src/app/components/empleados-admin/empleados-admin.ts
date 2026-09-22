import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  departamento: string;
  cargo: string;
  estado: string;
  fechaIngreso: string;
}

@Component({
  selector: 'app-empleados-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './empleados-admin.html',
  styleUrl: './empleados-admin.css'
})
export class EmpleadosAdminComponent {

  textoBusqueda = '';
  filtroEstado = 'Todos';

  empleados: Empleado[] = [
    {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Ramírez',
      correo: 'carlos.ramirez@municipalidad.gob.gt',
      telefono: '5555-1001',
      departamento: 'Servicios Públicos',
      cargo: 'Supervisor',
      estado: 'Activo',
      fechaIngreso: '2025-01-15'
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'López',
      correo: 'maria.lopez@municipalidad.gob.gt',
      telefono: '5555-1002',
      departamento: 'Medio Ambiente',
      cargo: 'Coordinadora',
      estado: 'Activo',
      fechaIngreso: '2024-08-20'
    },
    {
      id: 3,
      nombre: 'José',
      apellido: 'Hernández',
      correo: 'jose.hernandez@municipalidad.gob.gt',
      telefono: '5555-1003',
      departamento: 'Infraestructura',
      cargo: 'Técnico',
      estado: 'Activo',
      fechaIngreso: '2025-03-10'
    },
    {
      id: 4,
      nombre: 'Ana',
      apellido: 'Morales',
      correo: 'ana.morales@municipalidad.gob.gt',
      telefono: '5555-1004',
      departamento: 'Servicios Públicos',
      cargo: 'Inspectora',
      estado: 'Inactivo',
      fechaIngreso: '2023-11-05'
    },
    {
      id: 5,
      nombre: 'Luis',
      apellido: 'Castillo',
      correo: 'luis.castillo@municipalidad.gob.gt',
      telefono: '5555-1005',
      departamento: 'Infraestructura',
      cargo: 'Ingeniero',
      estado: 'Activo',
      fechaIngreso: '2024-02-12'
    }
  ];

  get empleadosFiltrados(): Empleado[] {
    return this.empleados.filter(empleado => {

      const texto = this.textoBusqueda.toLowerCase().trim();

      const coincideTexto =
        empleado.nombre.toLowerCase().includes(texto) ||
        empleado.apellido.toLowerCase().includes(texto) ||
        empleado.correo.toLowerCase().includes(texto) ||
        empleado.departamento.toLowerCase().includes(texto) ||
        empleado.cargo.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        empleado.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  get empleadosActivos(): number {
    return this.empleados.filter(
      empleado => empleado.estado === 'Activo'
    ).length;
  }

  get empleadosInactivos(): number {
    return this.empleados.filter(
      empleado => empleado.estado === 'Inactivo'
    ).length;
  }

  get departamentos(): number {
    return new Set(
      this.empleados.map(empleado => empleado.departamento)
    ).size;
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  nuevoEmpleado(): void {
    alert('Aquí se abrirá el formulario para crear un empleado.');
  }

  editarEmpleado(empleado: Empleado): void {
    alert(`Editar empleado: ${empleado.nombre} ${empleado.apellido}`);
  }

  cambiarEstado(empleado: Empleado): void {
    empleado.estado =
      empleado.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarEmpleado(empleado: Empleado): void {

    const confirmar = confirm(
      `¿Deseas eliminar a ${empleado.nombre} ${empleado.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    this.empleados = this.empleados.filter(
      item => item.id !== empleado.id
    );
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }

  obtenerIniciales(empleado: Empleado): string {
    return (
      empleado.nombre.charAt(0) +
      empleado.apellido.charAt(0)
    ).toUpperCase();
  }
}