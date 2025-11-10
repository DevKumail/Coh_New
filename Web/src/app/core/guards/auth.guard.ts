import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { from, map, of, switchMap } from 'rxjs';
import { AuthStoreService } from '../services/auth-store.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  return from(authStore.getTokenFromDb()).pipe(
    switchMap((token) => {
      if (!token) {
        router.navigate(['/auth-2/sign-in'], { queryParams: { returnUrl: state.url } });
        return of(false);
      }
      return from(authStore.getSessionOnce()).pipe(
        map((session) => {
          const screens = new Set(session?.allowscreens ?? []);
          const module = route.data['module'];
          const component = route.data['component'];
          const action = route.data['action'];

          if (module && ![...screens].some((s) => s.startsWith(`${module}:`))) {
            router.navigate(['/unauthorized']);
            return false;
          }
          if (component && ![...screens].some((s) => s.startsWith(`${module}:${component}`))) {
            router.navigate(['/unauthorized']);
            return false;
          }
          if (action && !screens.has(`${module}:${component}:${action}`)) {
            router.navigate(['/unauthorized']);
            return false;
          }
          return true;
        })
      );
    })
  );
};
