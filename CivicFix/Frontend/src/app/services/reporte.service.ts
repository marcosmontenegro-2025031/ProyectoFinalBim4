import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearReporteDTO, RespuestaReporte, PuntoMapa } from '../models/reporte.model';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/reportes';

  constructor(private usuariosService: UsuariosService) {}

  registrarReporte(dto: CrearReporteDTO): Observable<RespuestaReporte> {
    return this.http.post<RespuestaReporte>(this.apiUrl, dto);
  }

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

  obtenerPuntosMapa(): Observable<PuntoMapa[]> {
    return this.http.get<PuntoMapa[]>(`${this.apiUrl}/mapa`);
  }

  obtenerTodosLosReportes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  actualizarEstado(idReporte: number, idEstado: number): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(`${this.apiUrl}/${idReporte}/estado`, { idEstado });
  }
}