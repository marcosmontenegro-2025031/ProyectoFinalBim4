import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Asignacion {
  id: number;
  reporte: string;
  empleado: string;
  departamento: string;
  prioridad: string;
  estado: string;
  fechaAsignacion: string;
  fechaLimite: string;
}

@Component({
  selector: 'app-asignaciones-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './asignaciones-admin.component.html',
  styleUrl: './asignaciones-admin.component.css'
})
export class AsignacionesAdminComponent {

  asignaciones: Asignacion[] = [
    {
      id: 1,
      reporte: 'Bache en Avenida Reforma',
      empleado: 'Carlos López',
      departamento: 'Obras Públicas',
      prioridad: 'Alta',
      estado: 'Asignado',
      fechaAsignacion: '18/09/2026',
      fechaLimite: '20/09/2026'
    },
    {
      id: 2,
      reporte: 'Lámpara sin funcionar',
      empleado: 'María García',
      departamento: 'Alumbrado Público',
      prioridad: 'Media',
      estado: 'En proceso',
      fechaAsignacion: '17/09/2026',
      fechaLimite: '19/09/2026'
    },
    {
      id: 3,
      reporte: 'Acumulación de basura',
      empleado: 'José Martínez',
      departamento: 'Servicios Públicos',
      prioridad: 'Crítica',
      estado: 'Asignado',
      fechaAsignacion: '18/09/2026',
      fechaLimite: '19/09/2026'
    },
    {
      id: 4,
      reporte: 'Fuga de agua',
      empleado: 'Ana Morales',
      departamento: 'Agua y Saneamiento',
      prioridad: 'Alta',
      estado: 'Resuelto',
      fechaAsignacion: '15/09/2026',
      fechaLimite: '17/09/2026'
    },
    {
      id: 5,
      reporte: 'Señalización dañada',
      empleado: 'Pedro Ramírez',
      departamento: 'Tránsito',
      prioridad: 'Baja',
      estado: 'Asignado',
      fechaAsignacion: '16/09/2026',
      fechaLimite: '22/09/2026'
    }
  ];

  textoBusqueda = '';
  filtroEstado = 'Todos';
  filtroPrioridad = 'Todas';

  get asignacionesFiltradas(): Asignacion[] {
    return this.asignaciones.filter(asignacion => {

      const texto = this.textoBusqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        asignacion.reporte.toLowerCase().includes(texto) ||
        asignacion.empleado.toLowerCase().includes(texto) ||
        asignacion.departamento.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        asignacion.estado === this.filtroEstado;

      const coincidePrioridad =
        this.filtroPrioridad === 'Todas' ||
        asignacion.prioridad === this.filtroPrioridad;

      return coincideBusqueda &&
        coincideEstado &&
        coincidePrioridad;
    });
  }

  get totalAsignaciones(): number {
    return this.asignaciones.length;
  }

  get asignadas(): number {
    return this.asignaciones.filter(
      asignacion => asignacion.estado === 'Asignado'
    ).length;
  }

  get enProceso(): number {
    return this.asignaciones.filter(
      asignacion => asignacion.estado === 'En proceso'
    ).length;
  }

  get resueltas(): number {
    return this.asignaciones.filter(
      asignacion => asignacion.estado === 'Resuelto'
    ).length;
  }

  nuevaAsignacion(): void {
    alert('Aquí se abrirá el formulario para crear una nueva asignación.');
  }

  editarAsignacion(asignacion: Asignacion): void {
    alert(`Editar asignación del reporte: ${asignacion.reporte}`);
  }

  cambiarEstado(asignacion: Asignacion): void {

    if (asignacion.estado === 'Asignado') {
      asignacion.estado = 'En proceso';
      return;
    }

    if (asignacion.estado === 'En proceso') {
      asignacion.estado = 'Resuelto';
      return;
    }

    asignacion.estado = 'Asignado';
  }

  eliminarAsignacion(asignacion: Asignacion): void {

    const confirmar = confirm(
      `¿Deseas eliminar la asignación del reporte "${asignacion.reporte}"?`
    );

    if (confirmar) {
      this.asignaciones = this.asignaciones.filter(
        item => item.id !== asignacion.id
      );
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
        return 'estado-default';
    }
  }

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
        return 'prioridad-default';
    }
  }
}