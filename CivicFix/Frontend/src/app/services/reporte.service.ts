import { Injectable, inject } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearReporteDTO, RespuestaReporte, PuntoMapa } from '../models/reporte.model';
=======
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearReporteDTO, RespuestaReporte, PuntoMapa } from '../models/reporte.model';
import { UsuariosService } from './usuarios.service';
import { EmpleadoService } from './empleado.service';
>>>>>>> Develop

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/reportes';

<<<<<<< HEAD
=======
  constructor(private usuariosService: UsuariosService, private empleadoService: EmpleadoService) {}

>>>>>>> Develop
  registrarReporte(dto: CrearReporteDTO): Observable<RespuestaReporte> {
    return this.http.post<RespuestaReporte>(this.apiUrl, dto);
  }

<<<<<<< HEAD
=======
  obtenerMisReportes(): Observable<any[]> {

    const token = this.usuariosService.obtenerToken();

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(
        `${this.apiUrl}/mis-reportes`,
        { headers }
    );
}

>>>>>>> Develop
  obtenerPuntosMapa(): Observable<PuntoMapa[]> {
    return this.http.get<PuntoMapa[]>(`${this.apiUrl}/mapa`);
  }

  obtenerTodosLosReportes(): Observable<any[]> {
<<<<<<< HEAD
    return this.http.get<any[]>(this.apiUrl);
=======
    const token = this.empleadoService.obtenerToken();

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
>>>>>>> Develop
  }

  actualizarEstado(idReporte: number, idEstado: number): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${idReporte}/estado`, { idEstado });
  }
}