import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    tap({
      next: (res) => {
        // optional: console log success
        console.log('API response:', res);
      },
      error: (err) => {
        console.error('API error:', err); // log backend error

        if (err.status === 401) {
          // optional: show warning instead of immediate logout
          console.warn('Token invalid or expired (401)');

          // Uncomment this ONLY if you want to force logout
          // localStorage.removeItem('auth_token');
          // router.navigate(['/login']);
        }
      }
    })
  );
};
