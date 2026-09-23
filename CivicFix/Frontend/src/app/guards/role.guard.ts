import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import {
  SessionService,
  RolSesion
} from '../services/session.service';

export const roleGuard = (
  roles: RolSesion[]
): CanActivateFn => {

  return () => {

    const session = inject(SessionService);
    const router = inject(Router);

    if (session.estaAutenticado(roles)) {
      return true;
    }

    const rolActual = session.obtenerRol();

    if (rolActual === 'ciudadano') {
      return router.parseUrl('/inicio');
    }

    if (
      rolActual === 'empleado' ||
      rolActual === 'administrador'
    ) {
      return router.parseUrl('/home-empleado');
    }

    if (roles.includes('ciudadano')) {
      return router.parseUrl('/login');
    }

    return router.parseUrl('/empleado-login');
  };
};