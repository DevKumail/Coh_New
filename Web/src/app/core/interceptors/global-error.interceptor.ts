import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const GlobalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (!navigator.onLine || error.status === 0 || error.status >= 500) {
        console.error('Backend down. Redirecting to maintenance page...');
        router.navigate(['/maintenance']);
      }
      return throwError(() => error);
    })
  );
};
