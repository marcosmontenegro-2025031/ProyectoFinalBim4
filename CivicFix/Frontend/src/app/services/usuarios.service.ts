import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuarios.model';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root',
})
export class UsuariosService {

    private apiUrl = "http://localhost:3000/api/usuarios";
    private apiUrlLogin = "http://localhost:3000/api/login/usuario";
    private readonly TOKEN_KEY = 'auth_token';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private session: SessionService
    ) {}

    crearUsuario(usuario: Usuario) {
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    obtenerUsuarios(): Observable<Usuario[]> {

        const token = this.obtenerToken();
        console.log('Token obtenido:', token);

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<Usuario[]>(
            this.apiUrl,
            { headers }
        );
    }

    login(credentials: { usuario: string; password: string }): Observable<any> {
        return this.http.post<any>(
            this.apiUrlLogin,
            credentials
        ).pipe(
            tap(response => {
                if (response && response.token) {
                    this.guardarToken(response.token);
                    this.session.guardarCiudadano(response.token, response.usuario);
                }
            })
        );
    }

    private guardarToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    obtenerToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.TOKEN_KEY);
        }

        return null;
    }

    eliminarToken(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOKEN_KEY);
        }

        this.session.cerrarSesion();
    }

    estaAutenticado(): boolean {
        return !!this.obtenerToken();
    }
}
