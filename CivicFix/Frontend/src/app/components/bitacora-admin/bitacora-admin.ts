<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
=======
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { AdminApiService } from '../../services/admin-api.service';
>>>>>>> fix-jaquino-2025376

interface RegistroBitacora {
  id: number;
  usuario: string;
  rol: string;
  accion: string;
  modulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ip: string;
  resultado: string;
}

@Component({
  selector: 'app-bitacora-admin',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, FormsModule, RouterModule],
=======
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent],
>>>>>>> fix-jaquino-2025376
  templateUrl: './bitacora-admin.html',
  styleUrl: './bitacora-admin.css'
})
export class BitacoraAdminComponent {

<<<<<<< HEAD
  registros: RegistroBitacora[] = [
    {
      id: 1,
      usuario: 'Carlos López',
      rol: 'Administrador',
      accion: 'Crear',
      modulo: 'Usuarios',
      descripcion: 'Creó un nuevo usuario en el sistema',
      fecha: '21/09/2026',
      hora: '08:42',
      ip: '192.168.1.10',
      resultado: 'Exitoso'
    },
    {
      id: 2,
      usuario: 'María García',
      rol: 'Empleado',
      accion: 'Actualizar',
      modulo: 'Reportes',
      descripcion: 'Actualizó el estado de un reporte',
      fecha: '21/09/2026',
      hora: '09:15',
      ip: '192.168.1.15',
      resultado: 'Exitoso'
    },
    {
      id: 3,
      usuario: 'José Martínez',
      rol: 'Administrador',
      accion: 'Eliminar',
      modulo: 'Servicios',
      descripcion: 'Eliminó un servicio municipal',
      fecha: '20/09/2026',
      hora: '10:27',
      ip: '192.168.1.12',
      resultado: 'Exitoso'
    },
    {
      id: 4,
      usuario: 'Ana Morales',
      rol: 'Empleado',
      accion: 'Actualizar',
      modulo: 'Asignaciones',
      descripcion: 'Cambió el estado de una asignación',
      fecha: '20/09/2026',
      hora: '11:03',
      ip: '192.168.1.20',
      resultado: 'Exitoso'
    },
    {
      id: 5,
      usuario: 'Pedro Ramírez',
      rol: 'Administrador',
      accion: 'Crear',
      modulo: 'Tipos de Incidencia',
      descripcion: 'Registró un nuevo tipo de incidencia',
      fecha: '19/09/2026',
      hora: '14:18',
      ip: '192.168.1.18',
      resultado: 'Exitoso'
    },
    {
      id: 6,
      usuario: 'Luis Hernández',
      rol: 'Empleado',
      accion: 'Inicio de sesión',
      modulo: 'Autenticación',
      descripcion: 'Inicio de sesión en el sistema',
      fecha: '19/09/2026',
      hora: '15:32',
      ip: '192.168.1.25',
      resultado: 'Exitoso'
    },
    {
      id: 7,
      usuario: 'Sofía Castillo',
      rol: 'Usuario',
      accion: 'Crear',
      modulo: 'Reportes',
      descripcion: 'Registró un nuevo reporte ciudadano',
      fecha: '18/09/2026',
      hora: '16:45',
      ip: '192.168.1.30',
      resultado: 'Exitoso'
    },
    {
      id: 8,
      usuario: 'Carlos López',
      rol: 'Administrador',
      accion: 'Inicio de sesión',
      modulo: 'Autenticación',
      descripcion: 'Intento de inicio de sesión',
      fecha: '18/09/2026',
      hora: '17:20',
      ip: '192.168.1.10',
      resultado: 'Fallido'
    }
  ];
=======
  registros: RegistroBitacora[] = [];
  private readonly adminApi = inject(AdminApiService);
  private readonly cd = inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.adminApi.listar<RegistroBitacora>('bitacora').subscribe({
      next: datos => { this.registros = datos; this.cd.markForCheck(); },
      error: error => { this.registros = []; this.adminApi.aviso(error); this.cd.markForCheck(); }
    });
  }
>>>>>>> fix-jaquino-2025376

  textoBusqueda = '';
  filtroAccion = 'Todas';
  filtroModulo = 'Todos';
  filtroResultado = 'Todos';

  get registrosFiltrados(): RegistroBitacora[] {
    const texto = this.textoBusqueda.toLowerCase().trim();

    return this.registros.filter(registro => {

      const coincideBusqueda =
        !texto ||
        registro.usuario.toLowerCase().includes(texto) ||
        registro.accion.toLowerCase().includes(texto) ||
        registro.modulo.toLowerCase().includes(texto) ||
        registro.descripcion.toLowerCase().includes(texto) ||
        registro.ip.toLowerCase().includes(texto);

      const coincideAccion =
        this.filtroAccion === 'Todas' ||
        registro.accion === this.filtroAccion;

      const coincideModulo =
        this.filtroModulo === 'Todos' ||
        registro.modulo === this.filtroModulo;

      const coincideResultado =
        this.filtroResultado === 'Todos' ||
        registro.resultado === this.filtroResultado;

      return coincideBusqueda &&
        coincideAccion &&
        coincideModulo &&
        coincideResultado;
    });
  }

  get totalRegistros(): number {
    return this.registros.length;
  }

  get registrosExitosos(): number {
    return this.registros.filter(
      registro => registro.resultado === 'Exitoso'
    ).length;
  }

  get registrosFallidos(): number {
    return this.registros.filter(
      registro => registro.resultado === 'Fallido'
    ).length;
  }

  get usuariosActividad(): number {
    return new Set(
      this.registros.map(registro => registro.usuario)
    ).size;
  }

  obtenerClaseAccion(accion: string): string {
    switch (accion) {
      case 'Crear':
        return 'accion-crear';

      case 'Actualizar':
        return 'accion-actualizar';

      case 'Eliminar':
        return 'accion-eliminar';

      case 'Inicio de sesión':
        return 'accion-login';

      default:
        return 'accion-default';
    }
  }

  obtenerIconoAccion(accion: string): string {
    switch (accion) {
      case 'Crear':
        return 'bi-plus-circle';

      case 'Actualizar':
        return 'bi-pencil-square';

      case 'Eliminar':
        return 'bi-trash3';

      case 'Inicio de sesión':
        return 'bi-box-arrow-in-right';

      default:
        return 'bi-activity';
    }
  }

  obtenerClaseResultado(resultado: string): string {
    return resultado === 'Exitoso'
      ? 'resultado-exitoso'
      : 'resultado-fallido';
  }

  obtenerClaseRol(rol: string): string {
    switch (rol) {
      case 'Administrador':
        return 'rol-admin';

      case 'Empleado':
        return 'rol-empleado';

      case 'Usuario':
        return 'rol-usuario';

      default:
        return 'rol-default';
    }
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.filtroAccion = 'Todas';
    this.filtroModulo = 'Todos';
    this.filtroResultado = 'Todos';
  }

  verDetalle(registro: RegistroBitacora): void {
    alert(
      `Detalle de actividad\n\n` +
      `Usuario: ${registro.usuario}\n` +
      `Rol: ${registro.rol}\n` +
      `Acción: ${registro.accion}\n` +
      `Módulo: ${registro.modulo}\n` +
      `Descripción: ${registro.descripcion}\n` +
      `Fecha: ${registro.fecha}\n` +
      `Hora: ${registro.hora}\n` +
      `IP: ${registro.ip}\n` +
      `Resultado: ${registro.resultado}`
    );
  }
}