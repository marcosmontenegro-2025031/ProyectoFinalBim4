import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type RolSesion = 'ciudadano' | 'empleado' | 'administrador';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly EMPLEADO_TOKEN_KEY = 'auth_token_empleado';
  private readonly USER_KEY = 'auth_user';
  private readonly ROLE_KEY = 'auth_role';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  guardarCiudadano(token: string, usuario: unknown): void {
    this.guardarSesion(this.TOKEN_KEY, token, usuario, 'ciudadano');
  }

  guardarEmpleado(token: string, usuario: any): void {
    const rol = this.normalizarRol(usuario?.rol);
    this.guardarSesion(this.EMPLEADO_TOKEN_KEY, token, usuario, rol);
  }

  obtenerTokenCiudadano(): string | null {
    return this.obtenerItem(this.TOKEN_KEY);
  }

  obtenerTokenEmpleado(): string | null {
    return this.obtenerItem(this.EMPLEADO_TOKEN_KEY);
  }

  actualizarDatosEmpleado(datos: {nombre: string;apellido: string;usuario: string;correo: string;telefono: string;}): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const actual = this.obtenerUsuario<Record<string, unknown>>();
    if (actual) localStorage.setItem(this.USER_KEY, JSON.stringify({...actual, ...datos}));
  }

  obtenerRol(): RolSesion | null {
    const rol = this.obtenerItem(this.ROLE_KEY);
    return rol === 'ciudadano' || rol === 'empleado' || rol === 'administrador' ? rol : null;
  }

  obtenerUsuario<T = any>(): T | null {
    const usuario = this.obtenerItem(this.USER_KEY);
    if (!usuario) return null;
    try { return JSON.parse(usuario) as T; } catch { return null; }
  }

  estaAutenticado(roles: RolSesion[] = ['ciudadano', 'empleado', 'administrador']): boolean {
    const rol = this.obtenerRol();
    if (!rol || !roles.includes(rol)) return false;
    const token = rol === 'ciudadano' ? this.obtenerTokenCiudadano() : this.obtenerTokenEmpleado();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return !payload.exp || Date.now() < Number(payload.exp) * 1000;
    } catch { return false; }
  }

  cerrarSesion(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMPLEADO_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

  private guardarSesion(tokenKey: string, token: string, usuario: unknown, rol: RolSesion): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EMPLEADO_TOKEN_KEY);
    localStorage.setItem(tokenKey, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    localStorage.setItem(this.ROLE_KEY, rol);
  }

  private obtenerItem(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(key);
  }

  private normalizarRol(rol: string | undefined): RolSesion {
    const valor = (rol || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return valor.includes('admin') ? 'administrador' : 'empleado';
  }
}
