import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly sesion = inject(SessionService);
  private readonly url = 'http://localhost:3000/api/admin';
  private opciones() {
    const token = this.sesion.obtenerTokenEmpleado();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` }) };
  }
  listar<T>(modulo: string): Observable<T[]> { return this.http.get<T[]>(`${this.url}/${modulo}`,this.opciones()); }
  resumenReporte<T>(id:number):Observable<T> {return this.http.get<T>(`${this.url}/reportes/${id}/resumen`,this.opciones());}
  detalle<T>(modulo:string,id:number):Observable<T> {return this.http.get<T>(`${this.url}/${modulo}/${id}`,this.opciones());}
  crear<T>(modulo:string, datos:object):Observable<T> {return this.http.post<T>(`${this.url}/${modulo}`,datos,this.opciones());}
  editar<T>(modulo:string,id:number,datos:object):Observable<T> {return this.http.put<T>(`${this.url}/${modulo}/${id}`,datos,this.opciones());}
  activar(modulo:string,id:number,activo:boolean):Observable<any> {return this.http.patch(`${this.url}/${modulo}/${id}/estado`,{activo},this.opciones());}
  eliminar(modulo:string,id:number):Observable<any> {return this.http.delete(`${this.url}/${modulo}/${id}`,this.opciones());}
  estadoReporte(id:number,idEstado:number):Observable<any> {return this.http.patch(`${this.url}/reportes/${id}/estado`,{idEstado},this.opciones());}
  prioridadReporte(id:number,idPrioridad:number):Observable<any> {return this.http.patch(`${this.url}/reportes/${id}/prioridad`,{idPrioridad},this.opciones());}
  aviso(error:any):void {alert(error?.error?.message || error?.error?.mensaje || 'No se pudo guardar el cambio. Comprueba tus permisos y la base de datos.');}
}
