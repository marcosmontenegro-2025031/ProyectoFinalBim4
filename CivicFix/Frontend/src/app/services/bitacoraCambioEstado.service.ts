import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { BitacoraCambioEstado } from '../models/bitacoraCambioEstado.model';
import { EmpleadoService } from './empleado.service';

@Injectable({
  providedIn: 'root'
})
export class BitacoraCambioEstadoService {

  private http = inject(HttpClient);
  private empleadoService = inject(EmpleadoService);

  private baseUrl = `${environment.apiUrl}/bitacora`;

  listar(): Observable<BitacoraCambioEstado[]> {

    const token = this.empleadoService.obtenerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<BitacoraCambioEstado[]>(
      this.baseUrl,
      { headers }
    );
  }

  listarPorReporte(
    idReporte: number
  ): Observable<BitacoraCambioEstado[]> {

    const token = this.empleadoService.obtenerToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<BitacoraCambioEstado[]>(
      `${this.baseUrl}/reporte/${idReporte}`,
      { headers }
    );
  }

  actualizar(
    idBitacora: number,
    bitacora: BitacoraCambioEstado
  ): Observable<BitacoraCambioEstado> {

        return this.http.put<BitacoraCambioEstado>(
            `${this.baseUrl}/${idBitacora}`,
            { comentario: bitacora.comentario }
        );
    }
}