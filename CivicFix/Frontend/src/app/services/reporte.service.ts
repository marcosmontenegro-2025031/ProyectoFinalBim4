import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import {
  CrearReporteDTO,
  RespuestaReporte,
  PuntoMapa,
  ReporteAdmin
} from '../models/reporte.model';
=======
import { CrearReporteDTO, RespuestaReporte, PuntoMapa, ReporteAdmin } from '../models/reporte.model';
>>>>>>> d415eb1296741435254f3888415e9765aa112a68
import { UsuariosService } from './usuarios.service';
import { EmpleadoService } from './empleado.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);
<<<<<<< HEAD

  private usuariosService = inject(UsuariosService);

  private empleadoService = inject(EmpleadoService);

=======
  private usuariosService = inject(UsuariosService);
  private empleadoService = inject(EmpleadoService);
>>>>>>> d415eb1296741435254f3888415e9765aa112a68
  private apiUrl = 'http://localhost:3000/api/reportes';

  registrarReporte(dto: CrearReporteDTO): Observable<RespuestaReporte> {
    return this.http.post<RespuestaReporte>(
      this.apiUrl,
      dto
    );
  }

  obtenerMisReportes(): Observable<any[]> {
    const token = this.usuariosService.obtenerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

<<<<<<< HEAD
    return this.http.get<any[]>(
      `${this.apiUrl}/mis-reportes`,
      { headers }
    );
  }

  obtenerPuntosMapa(): Observable<PuntoMapa[]> {
    return this.http.get<PuntoMapa[]>(
      `${this.apiUrl}/mapa`
    );
  }

  obtenerTodosLosReportes(): Observable<ReporteAdmin[]> {

=======
    return this.http.get<any[]>(`${this.apiUrl}/mis-reportes`, { headers });
  }

  obtenerPuntosMapa(): Observable<PuntoMapa[]> {
    return this.http.get<PuntoMapa[]>(`${this.apiUrl}/mapa`);
  }

  obtenerTodosLosReportes(): Observable<ReporteAdmin[]> {
>>>>>>> d415eb1296741435254f3888415e9765aa112a68
    const token = this.empleadoService.obtenerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

<<<<<<< HEAD
    return this.http.get<ReporteAdmin[]>(
      this.apiUrl,
      { headers }
    );
  }

  actualizarEstado(
    idReporte: number,
    idEstado: number
  ): Observable<{ mensaje: string }> {

=======
    return this.http.get<ReporteAdmin[]>(this.apiUrl, { headers });
  }

  actualizarEstado(idReporte: number, idEstado: number): Observable<{ mensaje: string }> {
>>>>>>> d415eb1296741435254f3888415e9765aa112a68
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idReporte}/estado`,
      { idEstado }
    );
  }
}
