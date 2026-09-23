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
<<<<<<< HEAD
  ],
=======
  , AdminSidebarComponent],
>>>>>>> fix-jaquino-2025376
  templateUrl: './asignaciones-admin.html',
  styleUrl: './asignaciones-admin.css'
})
export class AsignacionesAdminComponent {
<<<<<<< HEAD

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
=======
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
>>>>>>> fix-jaquino-2025376

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
<<<<<<< HEAD
      asignacion => asignacion.estado === 'En proceso'
=======
      asignacion => asignacion.estado.toLowerCase() === 'en proceso'
>>>>>>> fix-jaquino-2025376
    ).length;
  }

  get resueltas(): number {
    return this.asignaciones.filter(
      asignacion => asignacion.estado === 'Resuelto'
    ).length;
  }

  nuevaAsignacion(): void {
<<<<<<< HEAD
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
=======
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
>>>>>>> fix-jaquino-2025376
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'Asignado':
        return 'estado-asignado';

<<<<<<< HEAD
=======
      case 'En Proceso':
>>>>>>> fix-jaquino-2025376
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