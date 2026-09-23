import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

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
  , AdminSidebarComponent],
  templateUrl: './estados-admin.html',
  styleUrl: './estados-admin.css'
})
export class EstadosAdminComponent {
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
  }

  obtenerClaseEstado(estado: string): string {
    return estado === 'Activo'
      ? 'estado-activo'
      : 'estado-inactivo';
  }
}