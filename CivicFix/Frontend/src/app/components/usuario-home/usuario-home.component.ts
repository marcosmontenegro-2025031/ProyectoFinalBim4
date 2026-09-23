import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { ReporteService } from '../../services/reporte.service';
import { SessionService } from '../../services/session.service';
import { Reporte } from '../../models/reporte.model';
=======
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
>>>>>>> fix-jaquino-2025376

@Component({
  selector: 'app-usuario-home',
  standalone: true,
  imports: [
    CommonModule,
<<<<<<< HEAD
    RouterLink,
    RouterLinkActive
=======
    RouterLink
>>>>>>> fix-jaquino-2025376
  ],
  templateUrl: './usuario-home.html',
  styleUrl: './usuario-home.css'
})
export class UsuarioHome implements OnInit {

<<<<<<< HEAD
  reportes: Reporte[] = [];
=======
  reportes: any[] = [];
>>>>>>> fix-jaquino-2025376

  cargando = true;

  nombreUsuario = 'Usuario';

  constructor(
<<<<<<< HEAD
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
=======
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {

    this.cargando = true;

    this.reporteService.obtenerMisReportes().subscribe({

      next: (data) => {

        console.log('Reportes del usuario:', data);

        this.reportes = (data || []).map((reporte: any) => ({
          ...reporte,
          estado: this.normalizarEstado(reporte.estado)
        }));

        this.cargando = false;
      },

      error: (error) => {

        console.error(
          'Error al obtener los reportes:',
          error
        );

        this.reportes = [];

        this.cargando = false;
      }

    });
  }

  private normalizarEstado(estado: string | undefined): string {
    const valor = (estado || 'Pendiente').trim().toLowerCase();
    if (valor === 'recibido' || valor === 'en revisión' || valor === 'en revision') return 'pendiente';
    if (valor === 'asignado') return 'en proceso';
    return valor;
  }

  obtenerCantidad(estado: string): number {

    return this.reportes.filter(
      reporte =>
        reporte.estado?.toLowerCase() === estado.toLowerCase()
>>>>>>> fix-jaquino-2025376
    ).length;
  }

  get totalReportes(): number {
    return this.reportes.length;
  }

<<<<<<< HEAD
  get reportesRecientes(): Reporte[] {
    return this.reportes.slice(0, 5);
  }

  obtenerClaseEstado(estado?: string): string {
=======
  get reportesRecientes(): any[] {
    return this.reportes.slice(0, 5);
  }

  obtenerClaseEstado(estado: string): string {

>>>>>>> fix-jaquino-2025376
    if (!estado) {
      return 'estado-pendiente';
    }

<<<<<<< HEAD
    switch (estado.trim().toLowerCase()) {
=======
    switch (estado.toLowerCase()) {
>>>>>>> fix-jaquino-2025376

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

<<<<<<< HEAD
  obtenerIconoEstado(estado?: string): string {
=======
  obtenerIconoEstado(estado: string): string {

>>>>>>> fix-jaquino-2025376
    if (!estado) {
      return 'bi-clock';
    }

<<<<<<< HEAD
    switch (estado.trim().toLowerCase()) {
=======
    switch (estado.toLowerCase()) {
>>>>>>> fix-jaquino-2025376

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
<<<<<<< HEAD
=======

>>>>>>> fix-jaquino-2025376
}