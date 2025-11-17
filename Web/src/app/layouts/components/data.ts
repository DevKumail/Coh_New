import { ProblemComponent } from './../../views/clinical/problem/problem.component';
import { MenuItemType } from '@/app/types/layout';

type UserDropdownItemType = {
    label?: string;
    icon?: string;
    url?: string;
    isDivider?: boolean;
    isHeader?: boolean;
    class?: string;
    action?: 'logout' | string;
};

export interface ExtendedMenuItemType extends MenuItemType {
    module?: string;
}

export const userDropdownItems: UserDropdownItemType[] = [
    {
        label: 'WELCOME_BACK!',
        isHeader: true,
    },
    {
        label: 'PROFILE',
        icon: 'tablerUserCircle',
        url: 'pages-profile.html',
    },
    {
        label: 'ACCOUNT_SETTINGS',
        icon: 'tablerSettings2',
        url: '#',
    },
    {
        label: 'SUPPORT_CENTER',
        icon: 'tablerHeadset',
        url: '#',
    },
    {
        isDivider: true,
    },
    {
        // label: 'Log Out',
        // icon: 'tablerLogout2',
        // url: '',
        // class: 'text-danger fw-semibold',
        // action: 'logout'

        label: 'LOG_OUT',
        icon: 'tablerLogout2',
        url: '', // Remove the #
        class: 'text-danger fw-semibold',
        action: 'logout',
    },
];

export const menuItems: ExtendedMenuItemType[] = [
    { label: 'Menu', isTitle: true },
    { label: 'Menu', isTitle: true },

    {
        label: 'Clinical',
        icon: 'tablerHeartbeat',
        module: 'Clinical',
        isCollapsed: true,
        children: [
            { label: 'Alerts', url: '/clinical/alerts' },
            { label: 'Allergies', url: '/clinical/allergies' },
            { label: 'Problem List', url: '/clinical/problem' },
            { label: 'Medical History', url: '/clinical/medical-history' },
            { label: 'Problem', url: '/clinical/problem' },
            { label: 'Medication', url: '/clinical/medications' },

        ],
    },

    { label: 'Menu', isTitle: true },

    
    {
        label: 'Registration',
        icon: 'tablerIdBadge2',
        module: 'Registration',
        isCollapsed: true,
        children: [
            // ✅ Clinical Module Section (permission based)
            {
                label: 'Clinical',
                icon: 'tablerHeartbeat',
                module: 'Clinical', // 👈 this is used by PermissionService
                isCollapsed: true,
                children: [
                    { label: 'Alerts', url: '/clinical/alerts' },
                    { label: 'Allergies', url: '/clinical/allergies' },
                    { label: 'Problem List', url: '/clinical/problem' },
                    { label: 'Medical History', url: '/clinical/medical-history' },
                    { label: 'Problem', url: '/clinical/problem' },
                    { label: 'Vital Signs', url: '/clinical/vital-signs' },
                    { label: 'Medication', url: '/clinical/medications' },
                ],
            },

            { label: 'Menu', isTitle: true },
            { label: 'Menu', isTitle: true },

            // ✅ Clinical Module Section (permission based)
            {
                label: 'Registration',
                icon: 'pi pi-clipboard',
                module: 'Registration',
                isCollapsed: true,
                children: [
                    { label: 'Alerts', url: '/registration/alerts' },
                    { label: 'Coverages', url: '/registration/coverages' },
                    {
                        label: 'Coverage Create',
                        url: '/registration/covrage-create',
                    },
                ],
            },
            { label: 'Menu', isTitle: true },
            {
                label: 'Control Panel',
                icon: 'tablerSettingsCog',
                module: 'Control Panel',
                isCollapsed: true,
                children: [
                    { label: 'Alerts', url: '/registration/alerts' },
                    { label: 'Coverages', url: '/registration/coverages' },
                    {
                        label: 'Coverage Create',
                        url: '/registration/covrage-create',
                    },
                    {
                        label: 'Demographics',
                        url: '/registration/demographics',
                    },
                    {
                        label: 'Demographic Create',
                        url: '/registration/demographic-create',
                    },
                ],
            },
            { label: 'Alerts', url: '/registration/alerts' },
            { label: 'Coverages', url: '/registration/coverages' },
            { label: 'Coverage Create', url: '/registration/covrage-create' },
            { label: 'Demographics', url: '/registration/demographics' },
            {
                label: 'Demographic Create',
                url: '/registration/demographic-create',
            },
            {
                label: 'Demographic List',
                url: '/registration/demographics',
            },
            {
                label: 'Temporary Patient Demographics',
                url: '/registration/temporary-patient-demographics',
            },
        ],
    },

    { label: 'Menu', isTitle: true },

    // ✅ Clinical Module Section (permission based)

    {
        label: 'Control Panel',
        icon: 'pi pi-clipboard',
        module: 'Control Panel',
        isCollapsed: true,
        children: [
            { label: 'Human Resources', url: '/control-panel/human-resources' },
            {
                label: 'Human Resources Add',
                url: '/control-panel/human-resources-add',
            },
        ],
    },

    {
        label: 'Billing',
        icon: 'tablerHeartbeat',
        module: 'Billing', // 👈 this is used by PermissionService
        isCollapsed: true,
        children: [{ label: 'Charge Capture', url: '/billing/charge capture' }],
    },
    
];

export const horizontalMenuItems: MenuItemType[] = [
    // {
    //     label: 'Dashboards',
    //     icon: 'tablerLayoutDashboard',
    //     children: [
    //         { label: 'Dashboard', url: '/dashboards/dashboard-2' },
    //     ]
    // },
    {
        label: 'Registration',
        icon: 'tablerIdBadge2',
        module: 'Registration',
        isCollapsed: true,
        children: [
            {
                label: 'Alerts',
                icon: 'tablerBell',
                url: '/registration/alerts',
            },
            {
                label: 'Coverages',
                icon: 'tablerIdBadge2',
                url: '/registration/coverages',
            },
            {
                label: 'Demographics',
                icon: 'tablerUsers',
                url: '/registration/demographics',
            },

            {
                label: 'Alerts',
                icon: 'tablerBell',
                url: '/registration/alerts',
            },
            {
                label: 'Temporary Patient Demographics',
                icon: 'tablerUserPlus',
                url: '/registration/temporary-patient-demographics',
            },
        ],
    },

    // {
    //     label: 'Clinical',
    //     icon: 'tablerStethoscope', // Use appropriate icon
    //     isCollapsed: true,
    //     children: [
        
    //         // {
    //         //     label: 'Alerts',
    //         //     icon: 'tablerBell',
    //         //     url: '/clinical/alerts',
    //         // },
    //         {
    //             label: 'Allergies',
    //             icon: 'tablerAlertTriangle',
    //             url: '/clinical/allergies',
    //         },
    //         {
    //             label: 'Problem List',
    //             icon: 'tablerListDetails',
    //             url: '/clinical/problem',
    //         },
    //         {
    //             label: 'Medical History',
    //             icon: 'tablerHeartbeat',
    //             url: '/clinical/medical-history',
    //         },
    //         // {
    //         //     label: 'Problem',
    //         //     icon: 'tablerClipboardText',
    //         //     url: '/clinical/Problem-List',
    //         // },
    //         {
    //             label: 'Vital Signs',
    //             icon: 'tablerHeartbeat',
    //             url: '/clinical/vital-signs',
    //         },
    //         {
    //             label:'Medications',
    //             icon: 'tablerSyringe',
    //             url:'/clinical/medications'
    //         },
    //         {
    //             label:'Immunizations',
    //             icon: 'tablerSyringe',
    //             url:'/clinical/immunizations'

    //         },
    //     ],
    // },


    // {
    //     label: 'cryo management',
    //     icon: 'tablerRocket',
    //     module: 'Cryo Manager',
    //     url: '/cryo/cryo-management',
        
    // },

        {
        label: 'Setup',
        icon: 'tablerHeartHandshake',
        module: 'IVF', // this is used by PermissionService
        isCollapsed: true,
        children: [
            {
                label: 'Dropdown Configuration',
                icon: 'tablerUsers',
                url: '/setup/dropdown-configuration'
            },
            {
                label: 'Cryo Management',
                icon: 'tablerFiles',
                url: '/cryo/cryo-management'
            }
        ]
    },
    {
        label: 'IVF',
        icon: 'tablerHeartHandshake',
        module: 'IVF', // this is used by PermissionService
        isCollapsed: true,
        children: [
            {
                label: 'IVF Dashboard',
                icon: 'tablerUsers',
                url: '/ivf/dashboard'
            },
            {
                label: 'Patient Summary',
                icon: 'tablerFiles',
                url: '/ivf/patient-summary'
            }
        ]
    },

    {
        label: 'Billing',
        icon: 'tablerReceipt', // Use receipt icon for billing module
        module: 'Billing', // this is used by PermissionService
        isCollapsed: true,
        children: [
            {
                label: 'Charge Capture',
                icon: 'tablerReceipt',
                url: '/billing/charge capture',
            },
        ],
    },



    {
        label: 'Scheduling',
        icon: 'tablerCalendarEvent',
        module: 'Scheduling',
        isCollapsed: true,
        children: [
            {
                label: 'View Appointments',
                icon: 'tablerCalendar',
                url: '/scheduling/view appointments',
            },
            {
                label: 'Appointment Dashboard',
                icon: 'tablerLayoutDashboard',
                url: '/scheduling/appointment dashboard',
            },
            // {
            //     label: 'Create Appointment',
            //     icon: 'tablerPlus',
            //     url: '/scheduling/create appointment',
            // },
            // {
            //     label: 'Filter Appointments',
            //     icon: 'tablerFilter',
            //     url: '/scheduling/Filter',
            // },
        ],
    },





];
