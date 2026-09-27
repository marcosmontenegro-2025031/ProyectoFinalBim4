import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { ReporteService } from '../../services/reporte.service';
import { ReporteAdmin } from '../../models/reporte.model';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  , AdminSidebarComponent],
  templateUrl: './reportes-admin.html',
  styleUrl: './reportes-admin.css'
})
export class ReportesAdminComponent implements OnInit {

  private reporteService = inject(ReporteService);
  private adminApi = inject(AdminApiService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);

  reportes: ReporteAdmin[] = [];
  cargando = false;
  detalle: {reporte:any; historial:any[]}|null=null;
  cargandoDetalle=false;
  errorDetalle='';
  error = '';

  textoBusqueda = '';
  filtroEstado = 'Todos';
  filtroPrioridad = 'Todas';

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.cargando = true;
    this.error = '';

    this.reporteService.obtenerTodosLosReportes().subscribe({
      next: (reportes) => {
        this.reportes = reportes;
        this.cargando = false;
        this.cd.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar reportes:', error);
        this.error = 'No se pudieron cargar los reportes.';
        this.cargando = false;
        this.cd.markForCheck();
      }
    });
  }

  get reportesFiltrados(): ReporteAdmin[] {
    return this.reportes.filter(reporte => {

      const texto = this.textoBusqueda.toLowerCase().trim();

      const coincideBusqueda =
        !texto ||
        reporte.titulo?.toLowerCase().includes(texto) ||
        reporte.descripcion?.toLowerCase().includes(texto) ||
        reporte.usuario?.toLowerCase().includes(texto) ||
        reporte.tipo_incidencia?.toLowerCase().includes(texto) ||
        reporte.direccion?.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        (this.filtroEstado === 'Pendiente'
          ? ['recibido','en revision','asignado'].includes(this.normalizar(reporte.estado))
          : this.normalizar(reporte.estado) === this.normalizar(this.filtroEstado));

      const coincidePrioridad =
        this.filtroPrioridad === 'Todas' ||
        this.normalizar(reporte.prioridad) === this.normalizar(this.filtroPrioridad);

      return coincideBusqueda &&
             coincideEstado &&
             coincidePrioridad;
    });
  }

  get totalReportes(): number {
    return this.reportes.length;
  }

  get pendientes(): number {
    return this.reportes.filter(
      reporte => ['recibido','en revision','asignado'].includes(this.normalizar(reporte.estado))
    ).length;
  }

  get enProceso(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.estado) === 'en proceso'
    ).length;
  }

  get resueltos(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.estado) === 'resuelto'
    ).length;
  }

  get criticos(): number {
    return this.reportes.filter(
      reporte => this.normalizar(reporte.prioridad) === 'critica'
    ).length;
  }

  normalizar(valor: string | undefined): string {
    return (valor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  obtenerClaseEstado(estado: string): string {
    switch (this.normalizar(estado)) {
      case 'recibido':
      case 'en revision':
      case 'asignado':
      case 'pendiente':
        return 'estado-pendiente';

      case 'en proceso':
        return 'estado-proceso';

      case 'resuelto':
        return 'estado-resuelto';

      case 'cancelado':
        return 'estado-cancelado';

      default:
        return 'estado-default';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch (this.normalizar(estado)) {
      case 'recibido':
      case 'en revision':
      case 'asignado':
      case 'pendiente':
        return 'bi-clock';

      case 'en proceso':
        return 'bi-arrow-repeat';

      case 'resuelto':
        return 'bi-check-circle';

      case 'cancelado':
        return 'bi-x-circle';

      default:
        return 'bi-question-circle';
    }
  }

  obtenerClasePrioridad(prioridad: string): string {
    switch (this.normalizar(prioridad)) {
      case 'critica':
        return 'prioridad-critica';

      case 'alta':
        return 'prioridad-alta';

      case 'media':
        return 'prioridad-media';

      case 'baja':
        return 'prioridad-baja';

      default:
        return 'prioridad-default';
    }
  }

  verDetalle(reporte: ReporteAdmin): void {
    this.detalle=null;this.cargandoDetalle=true;this.errorDetalle='';
    this.adminApi.resumenReporte<{reporte:any;historial:any[]}>(reporte.id_reporte).subscribe({
      next: data=>{this.detalle=data;this.cargandoDetalle=false;this.cd.markForCheck();},
      error: e=>{this.cargandoDetalle=false;this.errorDetalle=e?.error?.message||'No se pudo obtener el reporte.';this.cd.markForCheck();}
    });
  }
  cerrarDetalle():void {this.detalle=null;this.cargandoDetalle=false;this.errorDetalle='';}

  nuevoReporte():void { this.router.navigate(['/admin/reportes/nuevo']); }
  editarReporte(reporte:ReporteAdmin):void { this.router.navigate(['/admin/reportes/editar',reporte.id_reporte]); }
  actualizarEstado(reporte:ReporteAdmin):void { this.editarReporte(reporte); }
}
