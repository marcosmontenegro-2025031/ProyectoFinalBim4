import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { EMPTY, BehaviorSubject, Observable, concat, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Notificacion } from '../models/notificacion.model';
import { environment } from '../../environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private http = inject(HttpClient);
  private session = inject(SessionService);

  private apiUrl = `${environment.apiUrl}/notificaciones`;
  private readonly cacheKey = 'notificaciones';
  private readonly notificacionesSubject = new BehaviorSubject<Notificacion[]>(
    this.session.obtenerCache<Notificacion[]>(this.cacheKey) ?? []
  );
  readonly cantidadNoLeidas$ = this.notificacionesSubject.pipe(
    map(notificaciones => notificaciones.filter(notificacion => !notificacion.leida).length)
  );

  private actualizarCache(mutacion: (notificaciones: Notificacion[]) => Notificacion[]): void {
    const cache = this.session.obtenerCache<Notificacion[]>(this.cacheKey);
    if (cache) {
      const notificaciones = mutacion(cache);
      this.session.guardarCache(this.cacheKey, notificaciones);
      this.notificacionesSubject.next(notificaciones);
    }
  }

  private headers(): { headers: HttpHeaders } {
    const rol = this.session.obtenerRol();
    const token = rol === 'empleado' || rol === 'administrador'
      ? this.session.obtenerTokenEmpleado()
      : this.session.obtenerTokenCiudadano();

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`
      })
    };
  }

  obtenerNotificaciones(): Observable<Notificacion[]> {
    const cache = this.session.obtenerCache<Notificacion[]>(this.cacheKey);
    const actualizacion = this.http.get<Notificacion[]>(this.apiUrl, this.headers()).pipe(
      tap(notificaciones => {
        this.session.guardarCache(this.cacheKey, notificaciones);
        this.notificacionesSubject.next(notificaciones);
      }),
      catchError(error => cache !== null ? EMPTY : throwError(() => error))
    );

    return cache === null ? actualizacion : concat(of(cache), actualizacion);
  }

  marcarComoLeida(
    idNotificacion: number
  ): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}/leida`,
      {}, this.headers()
    ).pipe(tap(() => this.actualizarCache(notificaciones => notificaciones.map(notificacion =>
      notificacion.id_notificacion === idNotificacion ? { ...notificacion, leida: true } : notificacion
    ))));
  }

  marcarComoNoLeida(idNotificacion: number): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}/no-leida`,
      {}, this.headers()
    ).pipe(tap(() => this.actualizarCache(notificaciones => notificaciones.map(notificacion =>
      notificacion.id_notificacion === idNotificacion ? { ...notificacion, leida: false } : notificacion
    ))));
  }

  marcarComoNoLeidaLocal(idNotificacion: number): void {
    this.actualizarCache(notificaciones => notificaciones.map(notificacion =>
      notificacion.id_notificacion === idNotificacion ? { ...notificacion, leida: false } : notificacion
    ));
  }

  marcarTodasComoLeidas(): Observable<{ mensaje: string }> {
    return this.http.patch<{ mensaje: string }>(
      `${this.apiUrl}/marcar-todas-leidas`,
      {}, this.headers()
    ).pipe(tap(() => this.actualizarCache(notificaciones => notificaciones.map(notificacion => ({ ...notificacion, leida: true })))));
  }

  eliminarNotificacion(
    idNotificacion: number
  ): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/${idNotificacion}`, this.headers()
    ).pipe(tap(() => this.actualizarCache(notificaciones => notificaciones.filter(
      notificacion => notificacion.id_notificacion !== idNotificacion
    ))));
  }
}
