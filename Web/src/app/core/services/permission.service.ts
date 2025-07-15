import { Injectable } from '@angular/core';
import { log } from 'console';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions: Set<string> = new Set();
private screenPermissions: string[] = [];
  private modulePermissions: Set<string> = new Set();

  constructor() {
     // debugger
     this.loadPermissions();
       const allowscreensRaw = sessionStorage.getItem('allowscreens');

         this.screenPermissions = allowscreensRaw ? JSON.parse(allowscreensRaw) : [];

    this.extractModules();
  }

    private extractModules() {
       // debugger
    this.screenPermissions.forEach(screen => {
      const parts = screen.split(':');
      if (parts.length > 0) {
        this.modulePermissions.add(parts[0]); // e.g., "Clinical"
      }
    });
  }

 private loadPermissions(): void {
   // debugger
    const sessionData = sessionStorage.getItem('allowscreens');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        if (Array.isArray(parsed)) {
          this.permissions = new Set(parsed);
        }
      } catch (e) {
        console.error('Failed to parse session storage allowscreens:', e);
      }
    }
  }

  hasPermission(permission: string): boolean {
     // debugger
    return this.permissions.has(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
     // debugger
    return permissions.some(permission => this.hasPermission(permission));
  }

  getPermissions(): string[] {
     // debugger
    return Array.from(this.permissions);
  }
   refresh(): void {
    this.loadPermissions();
  }
  hasModule(module: string): boolean {
     // debugger
  return this.modulePermissions.has(module);
}

}
