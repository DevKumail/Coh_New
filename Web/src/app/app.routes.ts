import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';
import { LandingComponent } from './views/landing/landing.component';
import { authGuard } from './core/guards/auth.guard';
import { modulePermissionGuard } from './core/guards/module-permission.guard';


export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
    component: MainLayoutComponent,
    children: [
      // Default landing inside main layout (optional; helps when navigating to root)
      { path: '', redirectTo: 'dashboards/dashboard', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('./views/views.route').then((mod) => mod.VIEWS_ROUTES)
      },
      {
        path: 'clinical',
        canActivate: [modulePermissionGuard],
        data: { module: 'Clinical' },
        loadChildren: () => import('./views/clinical/clinical.module').then((m) => m.ClinicalModule)
      },
      {
        path: 'ivf',
        canActivate: [modulePermissionGuard],
        data: { module: 'IVF' },
        loadChildren: () => import('./views/ivf/ivf.module').then((m) => m.IVFModule)
      },
       {
        path: 'cryo',
        canActivate: [modulePermissionGuard],
        data: { module: 'Cryo Mangement' },
        loadChildren: () => import('./views/cryo-management/cryo.module').then((m) => m.CRYOModule)
      },
        {
        path: 'setup',
        canActivate: [modulePermissionGuard],
        data: { module: 'Cryo Mangement' },
        loadChildren: () => import('./views/cryo-management/cryo.module').then((m) => m.CRYOModule)
      },
      {
        path: 'registration',
        canActivate: [modulePermissionGuard],
        data: { module: 'Registration' },
        loadChildren: () => import('./views/registration/registration.module').then((m) => m.RegistrationModule)
      },
      {
        path: 'control-panel',
        canActivate: [modulePermissionGuard],
        data: { module: 'Control Panel' },
        loadChildren: () => import('./views/control-panel/control-panel.module').then((m) => m.ControlPanelModule)
      },
      {
          path: 'billing',
          canActivate: [authGuard, modulePermissionGuard],
          data: { module: 'Billing' },
          loadChildren: () => import('./views/billing/billing.module').then((m) => m.BillingModule)
        },
        {
        path: 'scheduling',
        canActivate: [authGuard, modulePermissionGuard],
        data: { module: 'Scheduling' },
        loadChildren: () => import('./views/Scheduling/scheduling.module').then((m) => m.SchedulingModule)
      }


    ],
  },
  {
    path: '',
    loadChildren: () => import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES)
  },
  // Alias for guard redirection path
  { path: 'auth-2/sign-in', redirectTo: 'auth/login-2', pathMatch: 'full' },
  {
    path: 'maintenance',
    loadComponent: () => import('./views/other-pages/maintenance/maintenance.component').then(m => m.MaintenanceComponent)
  },
  {
    path: 'landing',
    component: LandingComponent,
    data: { title: 'One page Landing' }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./views/error/error-401/error-401.component').then(m => m.Error401Component)
  },
  {
    path: '**',
    redirectTo: 'auth/login-2'
  }
];
