import {Routes} from '@angular/router';
import {MainLayoutComponent} from '@layouts/main-layout/main-layout.component';
import {LandingComponent} from './views/landing/landing.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboards/dashboard-2',
        
        pathMatch: 'full',
    },
    {
        path: '',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        loadChildren: () => import('./views/views.route').then((mod) => mod.VIEWS_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./views/error/error.route').then((mod) => mod.ERROR_PAGES_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./views/other-pages/other-pages.route').then((mod) => mod.OTHER_PAGES_ROUTES)
    },
    {
        path: 'landing',
        component: LandingComponent,
        data: {title: 'One page Landing'}
    },
];
