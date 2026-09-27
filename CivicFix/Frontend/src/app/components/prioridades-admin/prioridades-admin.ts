import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

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
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<Prioridad>('prioridades').subscribe({
      next: datos => { this.prioridades = datos; this.cd.markForCheck(); },
      error: error => { this.prioridades = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  prioridades: Prioridad[] = [];

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
    this.router.navigate(['/admin/prioridades/nuevo']);
  }

  editarPrioridad(actual: Prioridad): void {
    this.router.navigate(['/admin/prioridades/editar', actual.id]);
  }

  cambiarEstado(actual: Prioridad): void {
    this.adminApi.activar('prioridades',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarPrioridad(actual: Prioridad): void {
    if (!confirm('¿Eliminar prioridad #' + actual.id + '?')) return;
    this.adminApi.eliminar('prioridades',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
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