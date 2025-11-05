import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStoreService } from './auth-store.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private allowedScreens: Set<string> = new Set();
  private permissionsRefreshed = new BehaviorSubject<void>(undefined);

  constructor(private authStore: AuthStoreService) {
    void this.reloadFromDb();
  }

  private async reloadFromDb(): Promise<void> {
    const session = await this.authStore.getSessionOnce();
    this.allowedScreens = new Set(session?.allowscreens ?? []);
  }

  // Add public method to refresh permissions after login
  refreshPermissions(): void {
    void this.reloadFromDb().then(() => this.permissionsRefreshed.next());
  }

  // Observable to notify when permissions are refreshed
  onPermissionsRefreshed(): Observable<void> {
    return this.permissionsRefreshed.asObservable();
  }

  hasModuleAccess(module: string): boolean {
    console.log('permissionService', module);
    return [...this.allowedScreens].some(screen => screen.startsWith(`${module}:`));
  }

  hasComponentAccess(module: string, component: string): boolean {
    console.log('permissionService', module, component);
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
