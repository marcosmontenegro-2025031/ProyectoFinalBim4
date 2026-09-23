import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { ReporteService } from '../../services/reporte.service';
import { SessionService } from '../../services/session.service';
import { Reporte } from '../../models/reporte.model';

@Component({
  selector: 'app-usuario-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './usuario-home.html',
  styleUrl: './usuario-home.css'
})
export class UsuarioHome implements OnInit {

  reportes: Reporte[] = [];

  cargando = true;

  nombreUsuario = 'Usuario';

  constructor(
    private reporteService: ReporteService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarReportes();
  }

  cargarUsuario(): void {
    const usuario = this.sessionService.obtenerUsuario<any>();

    if (!usuario) {
      this.nombreUsuario = 'Usuario';
      return;
    }

    const nombre = usuario.nombre || usuario.nombres || '';
    const apellido = usuario.apellido || usuario.apellidos || '';

    if (nombre || apellido) {
      this.nombreUsuario = `${nombre} ${apellido}`.trim();
      return;
    }

    this.nombreUsuario =
      usuario.nombre_usuario ||
      usuario.usuario ||
      'Usuario';
  }

  cargarReportes(): void {
    this.cargando = true;

    this.reporteService.obtenerMisReportes().subscribe({
      next: (data) => {
        this.reportes = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener los reportes:', error);
        this.reportes = [];
        this.cargando = false;
      }
    });
  }

  obtenerCantidad(estado: string): number {
    return this.reportes.filter(
      reporte =>
        (reporte.estado || '').trim().toLowerCase() ===
        estado.trim().toLowerCase()
    ).length;
  }

  get totalReportes(): number {
    return this.reportes.length;
  }

  get reportesRecientes(): Reporte[] {
    return this.reportes.slice(0, 5);
  }

  obtenerClaseEstado(estado?: string): string {
    if (!estado) {
      return 'estado-pendiente';
    }

    switch (estado.trim().toLowerCase()) {

      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
      case 'resuelta':
        return 'estado-resuelto';

      case 'rechazado':
      case 'rechazada':
        return 'estado-rechazado';

      default:
        return 'estado-pendiente';
    }
  }

  obtenerIconoEstado(estado?: string): string {
    if (!estado) {
      return 'bi-clock';
    }

    switch (estado.trim().toLowerCase()) {

      case 'pendiente':
        return 'bi-clock';

      case 'en proceso':
        return 'bi-arrow-repeat';

      case 'resuelto':
      case 'resuelta':
        return 'bi-check-circle-fill';

      case 'rechazado':
      case 'rechazada':
        return 'bi-x-circle-fill';

      default:
        return 'bi-clock';
    }
  }
}