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
<<<<<<< HEAD
    RouterModule
=======
    RouterModule,
    AdminSidebarComponent
>>>>>>> fix-jaquino-2025376
  ],
  templateUrl: './prioridades-admin.html',
  styleUrl: './prioridades-admin.css'
})
export class PrioridadesAdminComponent {
<<<<<<< HEAD

  prioridades: Prioridad[] = [
    {
      id: 1,
      nombre: 'Crítica',
      descripcion: 'Situaciones que requieren atención inmediata.',
      nivel: 4,
      color: '#dc3545',
      reportes: 18,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 2 horas'
    },
    {
      id: 2,
      nombre: 'Alta',
      descripcion: 'Problemas que requieren atención prioritaria.',
      nivel: 3,
      color: '#fd7e14',
      reportes: 42,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 6 horas'
    },
    {
      id: 3,
      nombre: 'Media',
      descripcion: 'Problemas que deben ser atendidos en un plazo regular.',
      nivel: 2,
      color: '#ffc107',
      reportes: 76,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 24 horas'
    },
    {
      id: 4,
      nombre: 'Baja',
      descripcion: 'Problemas que pueden ser atendidos de forma programada.',
      nivel: 1,
      color: '#198754',
      reportes: 31,
      estado: 'Activo',
      tiempoRespuesta: 'Menos de 72 horas'
    }
  ];
=======
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
>>>>>>> fix-jaquino-2025376

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
<<<<<<< HEAD
    alert('Aquí se abrirá el formulario para crear una nueva prioridad.');
  }

  editarPrioridad(prioridad: Prioridad): void {
    alert(`Editar prioridad: ${prioridad.nombre}`);
  }

  cambiarEstado(prioridad: Prioridad): void {
    prioridad.estado =
      prioridad.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarPrioridad(prioridad: Prioridad): void {
    const confirmar = confirm(
      `¿Deseas eliminar la prioridad "${prioridad.nombre}"?`
    );

    if (confirmar) {
      this.prioridades = this.prioridades.filter(
        item => item.id !== prioridad.id
      );
    }
=======
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
>>>>>>> fix-jaquino-2025376
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