import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { EmpleadoMunicipal } from "../models/empleadoMunicipal.model";

@Injectable({
    providedIn: "root",
})
export class EmpleadoService {

    private apiUrl = "http://localhost:3000/api/empleados";
    private apiUrlLogin = "http://localhost:3000/api/login/empleado";
    private readonly TOKEN_KEY = 'auth_token_empleado';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    obtenerEmpleados(): Observable<EmpleadoMunicipal[]> {
        return this.http.get<EmpleadoMunicipal[]>(this.apiUrl);
    }

    login(credentials: { usuario: string; password: string }): Observable<any> {
        return this.http.post<any>(
            this.apiUrlLogin,
            credentials
        ).pipe(
            tap(response => {
                if (response && response.token) {
                    this.guardarToken(response.token);
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
        if(isPlatformBrowser(this.platformId)){
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    eliminarToken(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }

    estaAutenticado(): boolean {
        const token = this.obtenerToken();
        return !!token;
    }
}