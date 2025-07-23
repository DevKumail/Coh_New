// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);

//   const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     return true;
//   }
//  router.navigate(['/auth-2/sign-in']);
//   return false;
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

export const authGuard: CanActivateFn = (

  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  // Check authentication first
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth-2/sign-in'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check permissions if specified in route data
  const requiredPermissions = route.data['permissions'] as string[] | undefined;

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = permissionService.hasAnyPermission(requiredPermissions);

    if (!hasPermission) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
