import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

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
  , AdminSidebarComponent],
  templateUrl: './tipos-incidencia-admin.html',
  styleUrl: './tipos-incidencia-admin.css'
})
export class TiposIncidenciaAdminComponent {
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<TipoIncidencia>('tipos-incidencia').subscribe({
      next: datos => { this.tipos = datos; this.cd.markForCheck(); },
      error: error => { this.tipos = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  textoBusqueda = '';
  filtroEstado = 'Todos';

  tipos: TipoIncidencia[] = [];

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
    this.router.navigate(['/admin/tipos-incidencia/nuevo']);
  }

  editarTipo(actual: TipoIncidencia): void {
    this.router.navigate(['/admin/tipos-incidencia/editar', actual.id]);
  }

  cambiarEstado(actual: TipoIncidencia): void {
    this.adminApi.activar('tipos-incidencia',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarTipo(actual: TipoIncidencia): void {
    if (!confirm('¿Eliminar tipo #' + actual.id + '?')) return;
    this.adminApi.eliminar('tipos-incidencia',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }
}