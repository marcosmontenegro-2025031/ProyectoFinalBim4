import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { ReporteAdmin } from '../../models/reporte.model';
@Component({selector:'app-notificaciones-empleado',standalone:true,imports:[CommonModule,RouterLink],
  templateUrl:'./notificaciones-empleado.html',styleUrl:'./notificaciones-empleado.css'})
export class NotificacionesEmpleadoComponent implements OnInit {
  private reportesService=inject(ReporteService);
  private router=inject(Router);
  reportes: ReporteAdmin[]=[];
  cargando=false;
  error='';
  ngOnInit():void {this.cargar();}
  cargar():void {
    this.cargando=true;this.error='';
    this.reportesService.obtenerMisAsignaciones().subscribe({
      next:data=>{this.reportes=data??[];this.cargando=false;},
      error:err=>{this.cargando=false;this.error=err.status===401?'Tu sesión no está autorizada. Inicia sesión de nuevo.':'No se pudieron consultar las novedades de tus incidencias.';}
    });
  }
  abrir(id:number):void {this.router.navigate(['/empleado/bitacora',id]);}
}
