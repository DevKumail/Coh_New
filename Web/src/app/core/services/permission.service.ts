import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private allowedScreens: Set<string> = new Set();
  private permissionsRefreshed = new BehaviorSubject<void>(undefined);
  
  constructor() {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    const screens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');
    this.allowedScreens = new Set(screens);
  }

  // Add public method to refresh permissions after login
  refreshPermissions(): void {
    this.loadPermissions();
    this.permissionsRefreshed.next();
  }

  // Observable to notify when permissions are refreshed
  onPermissionsRefreshed(): Observable<void> {
    return this.permissionsRefreshed.asObservable();
  }

  hasModuleAccess(module: string): boolean {
    return [...this.allowedScreens].some(screen => screen.startsWith(`${module}:`));
  }

  hasComponentAccess(module: string, component: string): boolean {
    return [...this.allowedScreens].some(screen =>
      screen.startsWith(`${module}:${component}`)
    );
  }

  hasActionAccess(module: string, component: string, action: string): boolean {
    return this.allowedScreens.has(`${module}:${component}:${action}`);
  }

  getAllowedScreens(): string[] {
    return Array.from(this.allowedScreens);
  }

}
