import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
import { DEFINICIONES_ADMIN } from '../admin-formulario/admin-formulario';

@Component({selector:'app-admin-catalogo',standalone:true,
 imports:[CommonModule,FormsModule,RouterLink,AdminSidebarComponent],
 templateUrl:'./admin-catalogo.html',styleUrl:'./admin-catalogo.css'})
export class AdminCatalogoComponent implements OnInit{
 private route=inject(ActivatedRoute);private router=inject(Router);private api=inject(AdminApiService);private cd=inject(ChangeDetectorRef);
 modulo=''; items:Record<string,any>[]=[];busqueda='';cargando=false;error='';
 get titulo():string{return DEFINICIONES_ADMIN[this.modulo]?.titulo||'Catálogo';}
 get singular():string{return DEFINICIONES_ADMIN[this.modulo]?.singular||'registro';}
 get filtrados():Record<string,any>[]{const b=this.busqueda.toLowerCase().trim();return this.items.filter(i=>!b||Object.values(i).some(v=>String(v??'').toLowerCase().includes(b)));}
 ngOnInit():void{this.modulo=this.route.snapshot.data['modulo'];this.cargar();}
 cargar():void{this.cargando=true;this.error='';this.api.listar<Record<string,any>>(this.modulo).subscribe({
 next:items=>{this.items=items;this.cargando=false;this.cd.markForCheck();},
 error:e=>{this.error=e?.error?.message||'No se pudieron cargar los registros';this.cargando=false;this.cd.markForCheck();}
 });}
 nuevo():void{this.router.navigate(['/admin',this.modulo,'nuevo']);}
 editar(item:Record<string,any>):void{this.router.navigate(['/admin',this.modulo,'editar',item['id']]);}
 eliminar(item:Record<string,any>):void{
 if(!confirm('¿Eliminar '+this.singular+' #'+item['id']+'? Esta operación no se puede deshacer.'))return;
 this.api.eliminar(this.modulo,item['id']).subscribe({next:()=>this.cargar(),error:e=>{this.error=e?.error?.message||'No se pudo eliminar el registro';this.cd.markForCheck();}});
 }
}
