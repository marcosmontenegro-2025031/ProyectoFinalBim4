<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
=======
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';
>>>>>>> fix-jaquino-2025376

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
<<<<<<< HEAD
    RouterLink
=======
    RouterLink,
    AdminSidebarComponent
>>>>>>> fix-jaquino-2025376
  ],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css'
})
export class UsuariosAdminComponent {
<<<<<<< HEAD
=======
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

>>>>>>> fix-jaquino-2025376

  textoBusqueda = '';
  filtroEstado = 'Todos';

<<<<<<< HEAD
  usuarios: UsuarioAdmin[] = [
    {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Ramírez',
      usuario: 'carlos.ramirez',
      correo: 'carlos@email.com',
      telefono: '5555-1234',
      fechaRegistro: '2026-01-15',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'López',
      usuario: 'maria.lopez',
      correo: 'maria@email.com',
      telefono: '5555-2345',
      fechaRegistro: '2026-02-03',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Juan',
      apellido: 'Pérez',
      usuario: 'juan.perez',
      correo: 'juan@email.com',
      telefono: '5555-3456',
      fechaRegistro: '2026-02-18',
      estado: 'Inactivo'
    },
    {
      id: 4,
      nombre: 'Ana',
      apellido: 'Gómez',
      usuario: 'ana.gomez',
      correo: 'ana@email.com',
      telefono: '5555-4567',
      fechaRegistro: '2026-03-10',
      estado: 'Activo'
    },
    {
      id: 5,
      nombre: 'Luis',
      apellido: 'Hernández',
      usuario: 'luis.hernandez',
      correo: 'luis@email.com',
      telefono: '5555-5678',
      fechaRegistro: '2026-03-22',
      estado: 'Activo'
    }
  ];
=======
  usuarios: UsuarioAdmin[] = [];
>>>>>>> fix-jaquino-2025376

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
<<<<<<< HEAD
    console.log('Nuevo usuario');
  }

  editarUsuario(usuario: UsuarioAdmin): void {
    console.log('Editar usuario:', usuario);
  }

  cambiarEstado(usuario: UsuarioAdmin): void {
    usuario.estado =
      usuario.estado === 'Activo'
        ? 'Inactivo'
        : 'Activo';
  }

  eliminarUsuario(usuario: UsuarioAdmin): void {
    const confirmar = confirm(
      `¿Deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    this.usuarios = this.usuarios.filter(
      item => item.id !== usuario.id
    );
=======
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
>>>>>>> fix-jaquino-2025376
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