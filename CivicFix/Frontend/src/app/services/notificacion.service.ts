import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/notificaciones`;

    crear(notificacion: Omit<Notificacion, 'id_notificacion' | 'fecha_notificacion' | 'leida'>): Observable<Notificacion> {
        return this.http.post<Notificacion>(this.baseUrl, notificacion);
    }

    listarPorUsuario(idUsuario: number): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.baseUrl}/usuario/${idUsuario}`);
    }

    obtenerPorId(id: number): Observable<Notificacion> {
        return this.http.get<Notificacion>(`${this.baseUrl}/${id}`);
    }

    marcarComoLeida(id: number): Observable<Notificacion> {
        return this.http.put<Notificacion>(`${this.baseUrl}/${id}/leida`, {});
    }

    eliminar(id: number): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
    }
}
