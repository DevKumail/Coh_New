import {Routes} from '@angular/router';
import {MainLayoutComponent} from '@layouts/main-layout/main-layout.component';
import {LandingComponent} from './views/landing/landing.component';
import { authGuard } from './core/guards/auth.guard';
import { modulePermissionGuard } from './core/guards/module-permission.guard';


export const routes: Routes = [
    {
        path: '',
         canActivate: [authGuard],
          runGuardsAndResolvers: 'always',
        component: MainLayoutComponent,
          children: [
    {
      path: '',
      loadChildren: () => import('./views/views.route').then((mod) => mod.VIEWS_ROUTES)
    },
    {
      path: 'clinical',
      canActivate: [modulePermissionGuard],
      data: { module: 'Clinical' },
      loadChildren: () => import('./views/clinical/clinical.module').then((m) => m.ClinicalModule)
    }
  ],
    },
    {
        path: '',
        loadChildren: () => import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES)
    },

    //  {
    //      path: 'clinical',
    //      canActivate: [authGuard, modulePermissionGuard],
    //      data: { module: 'Clinical' },
    //      loadChildren: () =>
    //        import('./views/clinical/clinical.module').then((m) => m.ClinicalModule)
    // },
    {
        path: 'landing',
        component: LandingComponent,
        data: {title: 'One page Landing'}
    },
    {
        path: '**',
        redirectTo: 'auth/login-2'
    }
];
