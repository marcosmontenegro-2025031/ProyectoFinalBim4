import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SessionService } from '../services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const sessionService = inject(SessionService);

  const token = sessionService.obtenerToken();

  if (!token) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};