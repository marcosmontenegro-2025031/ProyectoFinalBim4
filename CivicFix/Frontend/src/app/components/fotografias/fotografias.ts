import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReporteService } from '../../services/reporte.service';
import { ReporteAdmin } from '../../models/reporte.model';
@Component({selector:'app-fotografias',standalone:true,imports:[CommonModule,RouterLink],
 templateUrl:'./fotografias.html',styleUrl:'./fotografias.css'})
export class Fotografias implements OnInit {
  private service=inject(ReporteService);
  reportes:ReporteAdmin[]=[];
  cargando=false;error='';
  ngOnInit():void {this.cargar();}
  cargar():void {this.cargando=true;this.error='';this.service.obtenerMisAsignaciones().subscribe({
    next:data=>{this.reportes=(data??[]).filter(r=>!!r.ruta_fotografia);this.cargando=false;},
    error:err=>{this.cargando=false;this.error=err.status===401?'Sesión sin autorización. Inicia sesión nuevamente.':'Error al cargar fotografías.';}
  });}
  url(r:ReporteAdmin):string {const ruta=r.ruta_fotografia??'';return /^https?:\/\//i.test(ruta)?ruta:'http://localhost:3000/'+ruta.replace(/^\/+/,'');}
}
