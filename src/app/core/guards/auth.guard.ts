import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('gupetify_token');
  if (token) return true;
  router.navigate(['/login']);
  return false;
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('gupetify_token');
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};