/**
 * Permission utility functions for common permission operations
 */

export interface PermissionConfig {
  module: string;
  component: string;
  actions?: string[];
}

export interface ActionPermissions {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canPrint: boolean;
  [key: string]: boolean;
}

/**
 * Common permission configurations for different modules
 */
export const PERMISSION_CONFIGS = {
  REGISTRATION: {
    DEMOGRAPHICS: {
      module: 'Registration',
      component: 'Demographics',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    },
    COVERAGES: {
      module: 'Registration',
      component: 'Coverages',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    },
    ENCOUNTERS: {
      module: 'Registration',
      component: 'Encounters',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    }
  },
  CLINICAL: {
    MEDICAL_HISTORY: {
      module: 'Clinical',
      component: 'Medical History',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    },
    ALLERGIES: {
      module: 'Clinical',
      component: 'Allergies',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    },
    VITAL_SIGNS: {
      module: 'Clinical',
      component: 'Vital Signs',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    },
    PROBLEM: {
      module: 'Clinical',
      component: 'Problem',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    }
  },
  BILLING: {
    CHARGES: {
      module: 'Billing',
      component: 'Charges',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    },
    PAYMENTS: {
      module: 'Billing',
      component: 'Payments',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    }
  },
  SCHEDULING: {
    APPOINTMENTS: {
      module: 'Scheduling',
      component: 'Appointments',
      actions: ['Add', 'Edit', 'Delete', 'View', 'Print']
    }
  }
} as const;

/**
 * Standard CRUD actions
 */
export const CRUD_ACTIONS = {
  ADD: 'Add',
  EDIT: 'Edit',
  DELETE: 'Delete',
  VIEW: 'View',
  PRINT: 'Print'
} as const;

/**
 * Build permission string
 * @param module - Module name
 * @param component - Component name
 * @param action - Action name
 * @returns Permission string in format "Module:Component:Action"
 */
export function buildPermissionString(module: string, component: string, action: string): string {
  return `${module}:${component}:${action}`;
}

/**
 * Parse permission string
 * @param permissionString - Permission string in format "Module:Component:Action"
 * @returns Object with module, component, and action
 */
export function parsePermissionString(permissionString: string): { module: string; component: string; action: string } | null {
  const parts = permissionString.split(':');
  if (parts.length !== 3) {
    return null;
  }
  return {
    module: parts[0],
    component: parts[1],
    action: parts[2]
  };
}

/**
 * Get permission strings for a component's CRUD operations
 * @param module - Module name
 * @param component - Component name
 * @returns Array of permission strings for CRUD operations
 */
export function getCrudPermissionStrings(module: string, component: string): string[] {
  return [
    buildPermissionString(module, component, CRUD_ACTIONS.ADD),
    buildPermissionString(module, component, CRUD_ACTIONS.EDIT),
    buildPermissionString(module, component, CRUD_ACTIONS.DELETE),
    buildPermissionString(module, component, CRUD_ACTIONS.VIEW),
    buildPermissionString(module, component, CRUD_ACTIONS.PRINT)
  ];
}
