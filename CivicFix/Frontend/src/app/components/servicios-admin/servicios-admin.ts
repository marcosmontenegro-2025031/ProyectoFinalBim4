import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

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
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<Servicio>('servicios').subscribe({
      next: datos => { this.servicios = datos; this.cd.markForCheck(); },
      error: error => { this.servicios = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  textoBusqueda = '';
  filtroEstado = 'Todos';
  filtroDepartamento = 'Todos';

  servicios: Servicio[] = [];

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
    this.router.navigate(['/admin/servicios/nuevo']);
  }

  editarServicio(actual: Servicio): void {
    this.router.navigate(['/admin/servicios/editar', actual.id]);
  }

  cambiarEstado(actual: Servicio): void {
    this.adminApi.activar('servicios',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarServicio(actual: Servicio): void {
    if (!confirm('¿Eliminar servicio #' + actual.id + '?')) return;
    this.adminApi.eliminar('servicios',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
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