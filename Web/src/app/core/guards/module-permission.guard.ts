import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission.service';

export const modulePermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const module = route.data['module'];
  const component = route.data['component'];

   
  console.log( 'permissionService' ,module, component);

  if (!module || !permissionService.hasModuleAccess(module)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (component && !permissionService.hasComponentAccess(module, component)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
