import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  departamento: string;
  cargo: string;
  estado: string;
  fechaIngreso: string;
}

@Component({
  selector: 'app-empleados-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  , AdminSidebarComponent],
  templateUrl: './empleados-admin.html',
  styleUrl: './empleados-admin.css'
})
export class EmpleadosAdminComponent {
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<Empleado>('empleados').subscribe({
      next: datos => { this.empleados = datos; this.cd.markForCheck(); },
      error: error => { this.empleados = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  textoBusqueda = '';
  filtroEstado = 'Todos';

  empleados: Empleado[] = [];

  get empleadosFiltrados(): Empleado[] {
    return this.empleados.filter(empleado => {

      const texto = this.textoBusqueda.toLowerCase().trim();

      const coincideTexto =
        empleado.nombre.toLowerCase().includes(texto) ||
        empleado.apellido.toLowerCase().includes(texto) ||
        empleado.correo.toLowerCase().includes(texto) ||
        empleado.departamento.toLowerCase().includes(texto) ||
        empleado.cargo.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        empleado.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  get empleadosActivos(): number {
    return this.empleados.filter(
      empleado => empleado.estado === 'Activo'
    ).length;
  }

  get empleadosInactivos(): number {
    return this.empleados.filter(
      empleado => empleado.estado === 'Inactivo'
    ).length;
  }

  get departamentos(): number {
    return new Set(
      this.empleados.map(empleado => empleado.departamento)
    ).size;
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  nuevoEmpleado(): void {
    this.router.navigate(['/admin/empleados/nuevo']);
  }

  editarEmpleado(actual: Empleado): void {
    this.router.navigate(['/admin/empleados/editar', actual.id]);
  }

  cambiarEstado(actual: Empleado): void {
    this.adminApi.activar('empleados',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarEmpleado(actual: Empleado): void {
    if (!confirm('¿Eliminar empleado #' + actual.id + '?')) return;
    this.adminApi.eliminar('empleados',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  obtenerClaseEstado(estado: string): string {

    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }

  obtenerIniciales(empleado: Empleado): string {
    return (
      empleado.nombre.charAt(0) +
      empleado.apellido.charAt(0)
    ).toUpperCase();
  }
}