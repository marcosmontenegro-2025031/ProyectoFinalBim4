import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EvidenciaSolucion } from '../models/evidenciaSolucion.model';

@Injectable({ providedIn: 'root' })
export class EvidenciaSolucionService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/evidencias`;

    crear(evidencia: Omit<EvidenciaSolucion, 'id_evidencia' | 'fecha_subida'>): Observable<EvidenciaSolucion> {
        return this.http.post<EvidenciaSolucion>(this.baseUrl, evidencia);
    }

    listar(): Observable<EvidenciaSolucion[]> {
        return this.http.get<EvidenciaSolucion[]>(this.baseUrl);
    }

    obtenerPorId(id: number): Observable<EvidenciaSolucion> {
        return this.http.get<EvidenciaSolucion>(`${this.baseUrl}/${id}`);
    }

    listarPorReporte(idReporte: number): Observable<EvidenciaSolucion[]> {
        return this.http.get<EvidenciaSolucion[]>(`${this.baseUrl}/reporte/${idReporte}`);
    }

    eliminar(id: number): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
    }
}
