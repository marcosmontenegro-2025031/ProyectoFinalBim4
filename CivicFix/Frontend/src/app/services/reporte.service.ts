import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, concat, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CrearReporteDTO, RespuestaReporte, PuntoMapa, ReporteAdmin, ReporteDashboard } from '../models/reporte.model';
import { UsuariosService } from './usuarios.service';
import { EmpleadoService } from './empleado.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private http = inject(HttpClient);
  private usuariosService = inject(UsuariosService);
  private empleadoService = inject(EmpleadoService);
  private session = inject(SessionService);
  private apiUrl = 'http://localhost:3000/api/reportes';

  private desdeCache<T>(clave: string, solicitud: Observable<T>): Observable<T> {
    const cache = this.session.obtenerCache<T>(clave);
    const actualizacion = solicitud.pipe(
      tap(datos => this.session.guardarCache(clave, datos)),
      catchError(error => cache !== null ? EMPTY : throwError(() => error))
    );

    return cache === null ? actualizacion : concat(of(cache), actualizacion);
  }

  registrarReporte(dto: CrearReporteDTO): Observable<RespuestaReporte> {
    const token = this.usuariosService.obtenerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token?.replace(/^Bearer\s+/i, '').trim() ?? ''}`
    });

    return this.http.post<RespuestaReporte>(
      this.apiUrl,
      dto,
      { headers }
    );
  }

  obtenerMisReportes(): Observable<ReporteDashboard[]> {
    const token = this.usuariosService.obtenerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token?.replace(/^Bearer\s+/i, '').trim() ?? ''}`
    });

    return this.desdeCache(
      'mis-reportes',
      this.http.get<ReporteDashboard[]>(`${this.apiUrl}/mis-reportes`, { headers })
    );
  }

  obtenerPuntosMapa(): Observable<PuntoMapa[]> {
    return this.desdeCache('puntos-mapa', this.http.get<PuntoMapa[]>(`${this.apiUrl}/mapa`));
  }

  obtenerTodosLosReportes(): Observable<ReporteAdmin[]> {
    const token = this.empleadoService.obtenerToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token?.replace(/^Bearer\s+/i, '').trim() ?? ''}`
    });

    return this.http.get<ReporteAdmin[]>(this.apiUrl, { headers });
  }

  actualizarEstado(idReporte: number, idEstado: number): Observable<{ mensaje: string }> {
    const token = this.empleadoService.obtenerToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token?.replace(/^Bearer\s+/i, '').trim() ?? ''}` });

    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idReporte}/estado`,
      { idEstado },
      { headers }
    );
  }

  obtenerMisAsignaciones(): Observable<ReporteAdmin[]> {
    const token = this.empleadoService.obtenerToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token?.replace(/^Bearer\s+/i, '').trim() ?? ''}` });

    return this.desdeCache(
      'mis-asignaciones',
      this.http.get<ReporteAdmin[]>(`${this.apiUrl}/mis-asignaciones`, { headers })
    );
  }
}
