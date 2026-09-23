import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage === 'undefined' || req.headers.has('Authorization')) return next(req);
  const role = localStorage.getItem('auth_role');
  const token = role === 'ciudadano' ? localStorage.getItem('auth_token')
    : localStorage.getItem('auth_token_empleado');
  return next(token ? req.clone({setHeaders:{Authorization:`Bearer ${token}`}}) : req);
};
