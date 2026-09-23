import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

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
  , AdminSidebarComponent],
  templateUrl: './asignaciones-admin.html',
  styleUrl: './asignaciones-admin.css'
})
export class AsignacionesAdminComponent {
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<Asignacion>('asignaciones').subscribe({
      next: datos => { this.asignaciones = datos; this.cd.markForCheck(); },
      error: error => { this.asignaciones = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  asignaciones: Asignacion[] = [];

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
      asignacion => asignacion.estado.toLowerCase() === 'en proceso'
    ).length;
  }

  get resueltas(): number {
    return this.asignaciones.filter(
      asignacion => asignacion.estado === 'Resuelto'
    ).length;
  }

  nuevaAsignacion(): void {
    this.router.navigate(['/admin/asignaciones/nuevo']);
  }

  editarAsignacion(actual: Asignacion): void {
    this.router.navigate(['/admin/asignaciones/editar', actual.id]);
  }

  cambiarEstado(actual: Asignacion): void {
    const siguientes: Record<string,string> = {'Asignado':'En Proceso','En proceso':'Resuelto','En Proceso':'Resuelto','Resuelto':'Asignado'};
    const nombre = siguientes[actual.estado] ?? 'Asignado';
    this.adminApi.listar<{id:number;nombre:string}>('estados').subscribe({
      next: estados => {
        const estado = estados.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
        if (!estado) { alert('Estado no encontrado en la base de datos'); return; }
        this.adminApi.estadoReporte((actual as any).id_reporte,estado.id).subscribe({
          next: () => this.cargar(),error: e => this.adminApi.aviso(e)
        });
      }, error: e => this.adminApi.aviso(e)
    });
  }

  eliminarAsignacion(actual: Asignacion): void {
    if (!confirm('¿Eliminar asignacion #' + actual.id + '?')) return;
    this.adminApi.eliminar('asignaciones',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Asignado':
        return 'estado-asignado';

      case 'En Proceso':
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