import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { PermissionService } from '../services/permission.service';

export const modulePermissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {

  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredModule = route.data['module'] as string;

  if (!requiredModule || !permissionService.hasModule(requiredModule)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
