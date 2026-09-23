import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CrearReporteDTO,
  RespuestaReporte,
  PuntoMapa,
  ReporteAdmin,
  Reporte
} from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/reportes';

  registrarReporte(
    dto: CrearReporteDTO
  ): Observable<RespuestaReporte> {

    return this.http.post<RespuestaReporte>(
      this.apiUrl,
      dto
    );
  }

  obtenerMisReportes(): Observable<Reporte[]> {

    return this.http.get<Reporte[]>(
      `${this.apiUrl}/mis-reportes`
    );
  }

  obtenerReporte(
    idReporte: number
  ): Observable<Reporte> {

    return this.http.get<Reporte>(
      `${this.apiUrl}/${idReporte}`
    );
  }

  obtenerPuntosMapa(): Observable<PuntoMapa[]> {

    return this.http.get<PuntoMapa[]>(
      `${this.apiUrl}/mapa`
    );
  }

  obtenerTodosLosReportes(): Observable<ReporteAdmin[]> {

    return this.http.get<ReporteAdmin[]>(
      this.apiUrl
    );
  }

  actualizarEstado(
    idReporte: number,
    idEstado: number
  ): Observable<{ mensaje: string }> {

    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idReporte}/estado`,
      { idEstado }
    );
  }
}