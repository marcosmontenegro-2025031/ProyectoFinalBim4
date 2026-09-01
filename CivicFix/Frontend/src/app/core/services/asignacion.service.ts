import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Asignacion } from '../models/asignacion.model';

@Injectable({ providedIn: 'root' })
export class AsignacionService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/asignaciones`;

    crear(asignacion: Omit<Asignacion, 'id_asignacion' | 'fecha_asignacion'>): Observable<Asignacion> {
        return this.http.post<Asignacion>(this.baseUrl, asignacion);
    }

    listar(): Observable<Asignacion[]> {
        return this.http.get<Asignacion[]>(this.baseUrl);
    }

    obtenerPorId(id: number): Observable<Asignacion> {
        return this.http.get<Asignacion>(`${this.baseUrl}/${id}`);
    }

    listarPorReporte(idReporte: number): Observable<Asignacion[]> {
        return this.http.get<Asignacion[]>(`${this.baseUrl}/reporte/${idReporte}`);
    }

    actualizar(id: number, observacion: string): Observable<Asignacion> {
        return this.http.put<Asignacion>(`${this.baseUrl}/${id}`, { observacion });
    }

    eliminar(id: number): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
    }
}
