import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { ReporteAdmin } from '../../models/reporte.model';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-notificaciones-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notificaciones-empleado.html',
  styleUrls: ['./notificaciones-empleado.css', '../home-empleado/home-empleado.css']
})
export class NotificacionesEmpleadoComponent implements OnInit {
  private readonly reportesService = inject(ReporteService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly cd = inject(ChangeDetectorRef);

  empleado = { nombre: 'Empleado', cargo: 'Empleado Municipal' };
  reportes: ReporteAdmin[] = [];
  cargando = false;
  error = '';

  ngOnInit(): void {
    const usuario = this.session.obtenerUsuario<{
      nombre?: string;
      apellido?: string;
      cargo?: string;
      rol?: string;
    }>();
    if (usuario) {
      this.empleado.nombre = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim() || 'Empleado';
      this.empleado.cargo = usuario.cargo || usuario.rol || 'Empleado Municipal';
    }
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.reportesService.obtenerMisAsignaciones().subscribe({
      next: data => {
        this.reportes = data ?? [];
        this.cargando = false;
        this.cd.markForCheck();
      },
      error: err => {
        this.cargando = false;
        this.error = err.status === 401
          ? 'Tu sesión no está autorizada. Inicia sesión de nuevo.'
          : 'No se pudieron consultar las novedades de tus incidencias.';
        this.cd.markForCheck();
      }
    });
  }

  abrir(id: number): void {
    this.router.navigate(['/empleado/bitacora', id]);
  }
}
