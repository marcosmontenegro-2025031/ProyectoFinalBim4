import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuarios.model';

@Injectable({
    providedIn: "root",
})
export class UsuariosService {
    private apiUrl = "http://localhost:3000/api/usuarios";
    private apiUrlLogin = "http://localhost:3000/api/login/usuario";
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient) {}

    crearUsuario(usuario: Usuario) {
        return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    login(credentials: { usuario: string; password: string }): Observable<any> {
        return this.http.post<any>(this.apiUrlLogin, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    this.guardarToken(response.token);
                }
            })
        );
    }

    private guardarToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    obtenerToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    eliminarToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    estaAutenticado(): boolean {
        return !!this.obtenerToken(); 
    }
}
