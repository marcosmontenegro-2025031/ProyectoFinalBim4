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

    private apiUrl = "http://localhost:3000/api/empleados";
    private apiUrlLogin = "http://localhost:3000/api/login/empleado";
    private readonly TOKEN_KEY = 'auth_token_empleado';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        private session: SessionService
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
                    this.session.guardarEmpleado(response.token, response.usuario);
                }
            })
        );
    }

    obtenerMiPerfil(): Observable<EmpleadoMunicipal> {
        return this.http.get<EmpleadoMunicipal>(`${this.apiUrl}/me`);
    }

    actualizarMiPerfil(datos: Pick<EmpleadoMunicipal, 'nombre' | 'apellido' | 'usuario' | 'correo' | 'telefono'>): Observable<EmpleadoMunicipal> {
        return this.http.put<EmpleadoMunicipal>(`${this.apiUrl}/me`, datos);
    }

    crearEmpleado(empleado: EmpleadoMunicipal) {
        return this.http.post<EmpleadoMunicipal>(this.apiUrl, empleado);
    }

    obtenerEmpleadoPorId(id: number): Observable<EmpleadoMunicipal> {

        return this.http.get<EmpleadoMunicipal>(
            `${this.apiUrl}/${id}`,
        );
    }

    actualizarEmpleado(
        id: number,
        empleado: EmpleadoMunicipal
    ): Observable<EmpleadoMunicipal> {

        return this.http.put<EmpleadoMunicipal>(
            `${this.apiUrl}/${id}`,
            empleado,
        );
    }

    obtenerToken(): string | null {
        if(isPlatformBrowser(this.platformId)){
            return this.session.obtenerTokenEmpleado();
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
