import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { defer, filter, from, map, of, switchMap, take, timer } from 'rxjs';
import { AuthStoreService } from '../services/auth-store.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  // Helper: wait briefly for session hydration to avoid premature unauthorized on refresh
  const waitForSession$ = defer(() => from(authStore.getSessionOnce())).pipe(
    switchMap((s: any) => {
      if (s) return of(s as any);
      // Poll up to ~1.5s (15 x 100ms) for session to become available
      return timer(0, 100).pipe(
        switchMap(() => from(authStore.getSessionOnce() as Promise<any>)),
        filter((v: any) => !!v),
        take(1)
      );
    })
  );

  return from(authStore.getTokenFromDb()).pipe(
    switchMap((token) => {
      if (!token) {
        return of(router.createUrlTree(['/auth-2/sign-in'], { queryParams: { returnUrl: state.url } }));
      }
      return waitForSession$.pipe(
        map((session: any) => {
          // If session still not available, allow navigation to avoid breaking refresh; feature areas can re-check later
          if (!session) return true;

          const screens = new Set<string>((session?.allowscreens ?? []) as string[]);
          const module = route.data['module'];
          const component = route.data['component'];
          const action = route.data['action'];

          // Avoid redirect loop if already on unauthorized
          const isUnauthorizedUrl = state.url?.startsWith('/unauthorized');

          if (module && ![...screens].some((s: string) => s.startsWith(`${module}:`))) {
            return isUnauthorizedUrl ? true : router.createUrlTree(['/unauthorized']);
          }
          if (component && ![...screens].some((s: string) => s.startsWith(`${module}:${component}`))) {
            return isUnauthorizedUrl ? true : router.createUrlTree(['/unauthorized']);
          }
          if (action && !screens.has(`${module}:${component}:${action}`)) {
            return isUnauthorizedUrl ? true : router.createUrlTree(['/unauthorized']);
          }
          return true;
        })
      );
    })
  );
};
