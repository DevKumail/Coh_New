import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthStoreService } from '@core/services/auth-store.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStoreService);
  return from(authStore.getTokenFromDb()).pipe(
    switchMap((token) => {
      if (token) {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(cloned);
      }
      return next(req);
    })
  );
};
