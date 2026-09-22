import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FotografiaProblema } from '../models/fotoProblema.model';

@Injectable({ providedIn: 'root' })
export class FotoProblemaService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/fotografias`;

    crear(foto: Omit<FotografiaProblema, 'id_fotografia' | 'fecha_subida'>): Observable<FotografiaProblema> {
        return this.http.post<FotografiaProblema>(this.baseUrl, foto);
    }

    listar(): Observable<FotografiaProblema[]> {
        return this.http.get<FotografiaProblema[]>(this.baseUrl);
    }

    obtenerPorId(id: number): Observable<FotografiaProblema> {
        return this.http.get<FotografiaProblema>(`${this.baseUrl}/${id}`);
    }

    listarPorReporte(idReporte: number): Observable<FotografiaProblema[]> {
        return this.http.get<FotografiaProblema[]>(`${this.baseUrl}/reporte/${idReporte}`);
    }

    eliminar(id: number): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
    }
}
