import { Injectable } from '@angular/core';
import { PermissionService } from '@core/services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonPermissionService {

  constructor(private permissionService: PermissionService) {}

  /**
   * Check if user can perform a specific action on a component
   * @param module - Module name (e.g., 'Registration')
   * @param component - Component name (e.g., 'Demographics')
   * @param action - Action name (e.g., 'Edit', 'Delete', 'Add', 'View', 'Print')
   * @returns boolean
   */
  canPerformAction(module: string, component: string, action: string): boolean {
    return this.permissionService.hasActionAccess(module, component, action);
  }

  /**
   * Get all available actions for a specific module and component
   * @param module - Module name
   * @param component - Component name
   * @returns Array of available actions
   */
  getAvailableActions(module: string, component: string): string[] {
    const allScreens = this.permissionService.getAllowedScreens();
    const prefix = `${module}:${component}:`;
    
    return allScreens
      .filter(screen => screen.startsWith(prefix))
      .map(screen => screen.replace(prefix, ''));
  }

  /**
   * Check multiple actions at once
   * @param module - Module name
   * @param component - Component name
   * @param actions - Array of actions to check
   * @returns Object with action names as keys and boolean permissions as values
   */
  checkMultipleActions(module: string, component: string, actions: string[]): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    
    actions.forEach(action => {
      result[action] = this.canPerformAction(module, component, action);
    });
    
    return result;
  }

  /**
   * Common CRUD permissions check
   * @param module - Module name
   * @param component - Component name
   * @returns Object with common CRUD permissions
   */
  getCrudPermissions(module: string, component: string) {
    return {
      canAdd: this.canPerformAction(module, component, 'Add'),
      canEdit: this.canPerformAction(module, component, 'Edit'),
      canDelete: this.canPerformAction(module, component, 'Delete'),
      canView: this.canPerformAction(module, component, 'View'),
      canPrint: this.canPerformAction(module, component, 'Print')
    };
  }

  /**
   * Check if user has any action permission for a component
   * @param module - Module name
   * @param component - Component name
   * @returns boolean
   */
  hasAnyActionAccess(module: string, component: string): boolean {
    return this.permissionService.hasComponentAccess(module, component);
  }
}
