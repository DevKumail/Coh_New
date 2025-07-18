import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth-2/sign-in'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const module = route.data['module'];
  const component = route.data['component'];
  const action = route.data['action'];

  if (module && !permissionService.hasModuleAccess(module)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (component && !permissionService.hasComponentAccess(module, component)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (action && !permissionService.hasActionAccess(module, component, action)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
