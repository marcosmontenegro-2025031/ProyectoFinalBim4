import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../models/notificacion.model';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private http = inject(HttpClient);
  private usuariosService = inject(UsuariosService);

  private apiUrl = `${environment.apiUrl}/notificaciones`;

  private headers(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.usuariosService.obtenerToken() ?? ''}`
      })
    };
  }

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl, this.headers());
  }

  marcarComoLeida(
    idNotificacion: number
  ): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}/leida`,
      {}, this.headers()
    );
  }

  marcarTodasComoLeidas(): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/marcar-todas-leidas`,
      {}, this.headers()
    );
  }

  eliminarNotificacion(
    idNotificacion: number
  ): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}`, this.headers()
    );
  }
}
