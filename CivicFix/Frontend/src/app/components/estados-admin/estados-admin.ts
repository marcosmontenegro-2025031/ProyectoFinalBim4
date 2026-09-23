<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
=======
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';
>>>>>>> fix-jaquino-2025376

interface Estado {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  reportes: number;
  estado: string;
}

@Component({
  selector: 'app-estados-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
<<<<<<< HEAD
  ],
=======
  , AdminSidebarComponent],
>>>>>>> fix-jaquino-2025376
  templateUrl: './estados-admin.html',
  styleUrl: './estados-admin.css'
})
export class EstadosAdminComponent {
<<<<<<< HEAD

  estados: Estado[] = [
    {
      id: 1,
      nombre: 'Pendiente',
      descripcion: 'El reporte fue recibido y está esperando atención.',
      color: '#f39c12',
      icono: 'bi-clock',
      reportes: 35,
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'En proceso',
      descripcion: 'El reporte está siendo atendido por el departamento correspondiente.',
      color: '#0874dc',
      icono: 'bi-arrow-repeat',
      reportes: 48,
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Resuelto',
      descripcion: 'El problema reportado fue solucionado.',
      color: '#198754',
      icono: 'bi-check-circle',
      reportes: 84,
      estado: 'Activo'
    },
    {
      id: 4,
      nombre: 'Cancelado',
      descripcion: 'El reporte fue cancelado y no continuará en proceso.',
      color: '#dc3545',
      icono: 'bi-x-circle',
      reportes: 9,
      estado: 'Activo'
    }
  ];
=======
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<Estado>('estados').subscribe({
      next: datos => { this.estados = datos; this.cd.markForCheck(); },
      error: error => { this.estados = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  estados: Estado[] = [];
>>>>>>> fix-jaquino-2025376

  textoBusqueda = '';
  filtroEstado = 'Todos';

  get estadosFiltrados(): Estado[] {
    return this.estados.filter(estado => {

      const coincideBusqueda =
        estado.nombre.toLowerCase().includes(
          this.textoBusqueda.toLowerCase()
        ) ||
        estado.descripcion.toLowerCase().includes(
          this.textoBusqueda.toLowerCase()
        );

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        estado.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }

  get estadosActivos(): number {
    return this.estados.filter(
      estado => estado.estado === 'Activo'
    ).length;
  }

  get estadosInactivos(): number {
    return this.estados.filter(
      estado => estado.estado === 'Inactivo'
    ).length;
  }

  get totalReportes(): number {
    return this.estados.reduce(
      (total, estado) => total + estado.reportes,
      0
    );
  }

  nuevoEstado(): void {
<<<<<<< HEAD
    alert('Aquí se abrirá el formulario para crear un nuevo estado.');
  }

  editarEstado(estado: Estado): void {
    alert(`Editar estado: ${estado.nombre}`);
  }

  cambiarEstado(estado: Estado): void {
    estado.estado =
      estado.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarEstado(estado: Estado): void {
    const confirmar = confirm(
      `¿Deseas eliminar el estado "${estado.nombre}"?`
    );

    if (confirmar) {
      this.estados = this.estados.filter(
        item => item.id !== estado.id
      );
    }
=======
    this.router.navigate(['/admin/estados/nuevo']);
  }

  editarEstado(actual: Estado): void {
    this.router.navigate(['/admin/estados/editar', actual.id]);
  }

  cambiarEstado(actual: Estado): void {
    this.adminApi.activar('estados',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarEstado(actual: Estado): void {
    if (!confirm('¿Eliminar estado #' + actual.id + '?')) return;
    this.adminApi.eliminar('estados',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
>>>>>>> fix-jaquino-2025376
  }

  obtenerClaseEstado(estado: string): string {
    return estado === 'Activo'
      ? 'estado-activo'
      : 'estado-inactivo';
  }
}