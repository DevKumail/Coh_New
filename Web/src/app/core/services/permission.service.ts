import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private allowedScreens: Set<string> = new Set();
  constructor() {
    this.loadPermissions();
  }

  private loadPermissions(): void {
    const screens = JSON.parse(sessionStorage.getItem('allowscreens') || '[]');
    this.allowedScreens = new Set(screens);
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
