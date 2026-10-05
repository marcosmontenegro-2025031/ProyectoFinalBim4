import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

interface Estado {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
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
  , AdminSidebarComponent],
  templateUrl: './estados-admin.html',
  styleUrl: './estados-admin.css'
})
export class EstadosAdminComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);

  estados: Estado[] = [];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.adminApi.listar<Estado>('estados').subscribe({
      next: datos => {
        this.estados = datos;
        this.cd.markForCheck();
      },
      error: error => {
        this.estados = [];
        this.adminApi.aviso(error);
        this.cd.markForCheck();
      }
    });
  }

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
    alert('Aquí se abrirá el formulario para crear un nuevo estado.');
  }

  editarEstado(estado: Estado): void {
    alert(`Editar estado: ${estado.nombre}`);
  }

  cambiarEstado(estado: Estado): void {
    this.adminApi.activar('estados', estado.id, estado.estado !== 'Activo').subscribe({
      next: () => this.cargar(),
      error: error => this.adminApi.aviso(error)
    });
  }

  eliminarEstado(estado: Estado): void {
    const confirmar = confirm(
      `¿Deseas eliminar el estado "${estado.nombre}"?`
    );

    if (confirmar) {
      this.adminApi.eliminar('estados', estado.id).subscribe({
        next: () => this.cargar(),
        error: error => this.adminApi.aviso(error)
      });
    }
  }

  obtenerIcono(nombre: string): string {
    switch (nombre.trim().toLowerCase()) {
      case 'pendiente':
        return 'bi-clock-fill';
      case 'recibido':
        return 'bi-inbox-fill';
      case 'en proceso':
        return 'bi-arrow-repeat';
      case 'asignado':
        return 'bi-person-check-fill';
      case 'resuelto':
        return 'bi-check-circle-fill';
      case 'cancelado':
        return 'bi-x-circle-fill';
      case 'rechazado':
        return 'bi-x-octagon-fill';
      default:
        return 'bi-circle-fill';
    }
  }

  obtenerClaseEstado(estado: string): string {
    return estado === 'Activo'
      ? 'estado-activo'
      : 'estado-inactivo';
  }
}