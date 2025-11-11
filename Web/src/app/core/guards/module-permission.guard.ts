import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { defer, filter, from, map, of, switchMap, take, timer } from 'rxjs';
import { AuthStoreService } from '../services/auth-store.service';

export const modulePermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  const module = route.data['module'] as string | undefined;
  const component = route.data['component'] as string | undefined;

  // Wait briefly for session so refresh does not cause false unauthorized
  const waitForSession$ = defer(() => from(authStore.getSessionOnce())).pipe(
    switchMap((s: any) => {
      if (s) return of(s as any);
      return timer(0, 100).pipe(
        switchMap(() => from(authStore.getSessionOnce() as Promise<any>)),
        filter((v: any) => !!v),
        take(1)
      );
    })
  );

  return waitForSession$.pipe(
    map((session: any) => {
      // If no module restriction, allow
      if (!module) return true;

      const screens = new Set<string>((session?.allowscreens ?? []) as string[]);
      const isUnauthorizedUrl = state.url?.startsWith('/unauthorized');

      const hasModule = [...screens].some((s: string) => s.startsWith(`${module}:`));
      if (!hasModule) return isUnauthorizedUrl ? true : router.createUrlTree(['/unauthorized']);

      if (component) {
        const hasComponent = [...screens].some((s: string) => s.startsWith(`${module}:${component}`));
        if (!hasComponent) return isUnauthorizedUrl ? true : router.createUrlTree(['/unauthorized']);
      }
      return true;
    })
  );
};
