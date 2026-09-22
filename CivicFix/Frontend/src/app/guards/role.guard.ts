import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService, RolSesion } from '../services/session.service';

export const roleGuard = (roles: RolSesion[]): CanActivateFn => {
  return () => {
    const session = inject(SessionService);
    const router = inject(Router);

    if (session.estaAutenticado(roles)) {
      return true;
    }

    const destino = roles.includes('ciudadano') ? '/login' : '/empleado-login';
    return router.parseUrl(destino);
  };
};
