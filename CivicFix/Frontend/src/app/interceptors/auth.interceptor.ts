import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  // Preserve Authorization supplied by a particular service; never use the legacy "token" key.
  if (req.headers.has('Authorization') || /\/api\/login\//.test(req.url)) return next(req);
  const rol = session.obtenerRol();
  const token = rol === 'ciudadano' ? session.obtenerTokenCiudadano() : session.obtenerTokenEmpleado();
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token.replace(/^Bearer\s+/i, '').trim()}` } }));
};
