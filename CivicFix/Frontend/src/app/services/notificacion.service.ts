import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/notificaciones';

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  marcarComoLeida(
    idNotificacion: number
  ): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}/leida`,
      {}
    );
  }

  marcarTodasComoLeidas(): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/marcar-todas-leidas`,
      {}
    );
  }

  eliminarNotificacion(
    idNotificacion: number
  ): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}`
    );
  }
}
