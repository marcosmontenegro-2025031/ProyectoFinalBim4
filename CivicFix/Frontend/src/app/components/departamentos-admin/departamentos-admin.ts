import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

interface Departamento {
  id: number;
  nombre: string;
  descripcion: string;
  encargado: string;
  empleados: number;
  servicios: number;
  estado: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-departamentos-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  , AdminSidebarComponent],
  templateUrl: './departamentos-admin.html',
  styleUrl: './departamentos-admin.css'
})
export class DepartamentosAdminComponent {
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<Departamento>('departamentos').subscribe({
      next: datos => { this.departamentos = datos; this.cd.markForCheck(); },
      error: error => { this.departamentos = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  textoBusqueda = '';
  filtroEstado = 'Todos';

  departamentos: Departamento[] = [];

  get departamentosFiltrados(): Departamento[] {
    return this.departamentos.filter(departamento => {

      const texto = this.textoBusqueda
        .toLowerCase()
        .trim();

      const coincideTexto =
        departamento.nombre.toLowerCase().includes(texto) ||
        departamento.descripcion.toLowerCase().includes(texto) ||
        departamento.encargado.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        departamento.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  get departamentosActivos(): number {
    return this.departamentos.filter(
      departamento => departamento.estado === 'Activo'
    ).length;
  }

  get departamentosInactivos(): number {
    return this.departamentos.filter(
      departamento => departamento.estado === 'Inactivo'
    ).length;
  }

  get totalEmpleados(): number {
    return this.departamentos.reduce(
      (total, departamento) => total + departamento.empleados,
      0
    );
  }

  get totalServicios(): number {
    return this.departamentos.reduce(
      (total, departamento) => total + departamento.servicios,
      0
    );
  }

  nuevoDepartamento(): void {
    this.router.navigate(['/admin/departamentos/nuevo']);
  }

  editarDepartamento(actual: Departamento): void {
    this.router.navigate(['/admin/departamentos/editar', actual.id]);
  }

  cambiarEstado(actual: Departamento): void {
    this.adminApi.activar('departamentos',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarDepartamento(actual: Departamento): void {
    if (!confirm('¿Eliminar departamento #' + actual.id + '?')) return;
    this.adminApi.eliminar('departamentos',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }

  obtenerIniciales(nombre: string): string {

    const palabras = nombre.split(' ');

    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }

    return (
      palabras[0].charAt(0) +
      palabras[1].charAt(0)
    ).toUpperCase();
  }
}