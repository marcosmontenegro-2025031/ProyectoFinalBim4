import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Usuario } from '../models/usuarios.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:3000/api/usuarios';
  private apiUrlLogin = 'http://localhost:3000/api/login/usuario';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      this.apiUrl,
      usuario
    );
  }

  obtenerUsuarios(): Observable<Usuario[]> {

    const token = this.sessionService.obtenerTokenCiudadano();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });

    return this.http.get<Usuario[]>(
      this.apiUrl,
      { headers }
    );
  }

  login(
    credentials: {
      usuario: string;
      password: string;
    }
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrlLogin,
      credentials
    ).pipe(

      tap(response => {

        console.log('Respuesta login:', response);

        if (!response) {
          return;
        }

        const token =
          response.token ||
          response.accessToken ||
          response.jwt;

        const usuario =
          response.usuario ||
          response.user ||
          response.data?.usuario ||
          response.data;

        if (token) {

          this.sessionService.guardarCiudadano(
            token,
            usuario
          );

          console.log(
            'Sesión ciudadano guardada correctamente'
          );

          console.log(
            'Rol:',
            this.sessionService.obtenerRol()
          );
        }

      })

    );
  }

  obtenerToken(): string | null {
    return this.sessionService.obtenerToken();
  }

  eliminarToken(): void {
    this.sessionService.cerrarSesion();
  }

  estaAutenticado(): boolean {
    return this.sessionService.estaAutenticado([
      'ciudadano'
    ]);
  }

  obtenerUsuario<T = any>(): T | null {
    return this.sessionService.obtenerUsuario<T>();
  }

  obtenerRol(): string | null {
    return this.sessionService.obtenerRol();
  }

  cerrarSesion(): void {
    this.sessionService.cerrarSesion();
  }
}