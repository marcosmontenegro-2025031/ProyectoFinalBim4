import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';

interface UsuarioAdmin {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  correo: string;
  telefono: string;
  fechaRegistro: string;
  estado: string;
}

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AdminSidebarComponent
  ],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css'
})
export class UsuariosAdminComponent {
  private readonly router = inject(Router);
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.adminApi.listar<UsuarioAdmin>('usuarios').subscribe({
      next: datos => { this.usuarios = datos; this.cd.markForCheck(); },
      error: error => { this.usuarios = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }


  textoBusqueda = '';
  filtroEstado = 'Todos';

  usuarios: UsuarioAdmin[] = [];

  get usuariosFiltrados(): UsuarioAdmin[] {
    const texto = this.textoBusqueda.toLowerCase().trim();

    return this.usuarios.filter(usuario => {

      const coincideTexto =
        !texto ||
        usuario.nombre.toLowerCase().includes(texto) ||
        usuario.apellido.toLowerCase().includes(texto) ||
        usuario.usuario.toLowerCase().includes(texto) ||
        usuario.correo.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        usuario.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get usuariosActivos(): number {
    return this.usuarios.filter(
      usuario => usuario.estado === 'Activo'
    ).length;
  }

  get usuariosInactivos(): number {
    return this.usuarios.filter(
      usuario => usuario.estado === 'Inactivo'
    ).length;
  }

  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
  }

  nuevoUsuario(): void {
    this.router.navigate(['/admin/usuarios/nuevo']);
  }

  editarUsuario(actual: UsuarioAdmin): void {
    this.router.navigate(['/admin/usuarios/editar', actual.id]);
  }

  cambiarEstado(actual: UsuarioAdmin): void {
    this.adminApi.activar('usuarios',actual.id,actual.estado !== 'Activo').subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  eliminarUsuario(actual: UsuarioAdmin): void {
    if (!confirm('¿Eliminar usuario #' + actual.id + '?')) return;
    this.adminApi.eliminar('usuarios',actual.id).subscribe({
      next: () => this.cargar(), error: e => this.adminApi.aviso(e)
    });
  }

  obtenerClaseEstado(estado: string): string {
    if (estado === 'Activo') {
      return 'estado-activo';
    }

    return 'estado-inactivo';
  }

  obtenerIniciales(usuario: UsuarioAdmin): string {
    const primera = usuario.nombre.charAt(0);
    const segunda = usuario.apellido.charAt(0);

    return (primera + segunda).toUpperCase();
  }
}