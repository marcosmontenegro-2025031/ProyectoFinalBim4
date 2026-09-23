import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { EmpleadoMunicipal } from "../models/empleadoMunicipal.model";
import { SessionService } from "./session.service";

@Injectable({
    providedIn: "root",
})
export class EmpleadoService {

    // Rutas administrativas
    private apiUrl = "http://localhost:3000/api/empleados";

    // Ruta pública para registrar empleados
    private apiUrlRegistro = "http://localhost:3000/api/empleados/registro";

    // Login
    private apiUrlLogin = "http://localhost:3000/api/login/empleado";

    private readonly TOKEN_KEY = "auth_token_empleado";

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private session: SessionService
    ) {}

    // ==========================================
    // ADMINISTRACIÓN
    // ==========================================

    obtenerEmpleados(): Observable<EmpleadoMunicipal[]> {
        return this.http.get<EmpleadoMunicipal[]>(this.apiUrl);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    login(credentials: { usuario: string; password: string }): Observable<any> {
        return this.http.post<any>(
            this.apiUrlLogin,
            credentials
        ).pipe(
            tap(response => {
                if (response && response.token) {
                    this.guardarToken(response.token);
                    this.session.guardarEmpleado(
                        response.token,
                        response.usuario
                    );
                }
            })
        );
    }

    // ==========================================
    // REGISTRO PÚBLICO
    // ==========================================

crearEmpleado(empleado: EmpleadoMunicipal) {
    return this.http.post<EmpleadoMunicipal>(
        this.apiUrlRegistro,
        empleado
    );
}   

    // ==========================================
    // TOKEN
    // ==========================================

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
        const token = this.obtenerToken();
        return !!token;
    }
}
