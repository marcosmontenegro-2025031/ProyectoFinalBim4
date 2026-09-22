import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BitacoraCambioEstado } from '../../app/models/bitacoraCambioEstado.model';

@Injectable({ providedIn: 'root' })
export class BitacoraCambioEstadoService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/bitacora`;

    registrar(bitacora: Omit<BitacoraCambioEstado, 'id_bitacora' | 'fecha_cambio'>): Observable<BitacoraCambioEstado> {
        return this.http.post<BitacoraCambioEstado>(this.baseUrl, bitacora);
    }

    listar(): Observable<BitacoraCambioEstado[]> {
        return this.http.get<BitacoraCambioEstado[]>(this.baseUrl);
    }

    listarPorReporte(idReporte: number): Observable<BitacoraCambioEstado[]> {
        return this.http.get<BitacoraCambioEstado[]>(`${this.baseUrl}/reporte/${idReporte}`);
    }
}
