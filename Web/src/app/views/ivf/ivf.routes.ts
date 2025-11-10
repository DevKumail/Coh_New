 import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { modulePermissionGuard } from '@/app/core/guards/module-permission.guard';
import { IVFHomeComponent } from './ivf-home/ivf-home.component';
import { IvfPatientSummaryComponent } from './ivf-patient-summary/ivf-patient-summary.component';

export const IVF_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        canActivate: [modulePermissionGuard],
        component: IVFHomeComponent,
        data: { module: 'IVF', component: 'IVF', title: 'IVF' }
      },
      {
        path: 'dashboard',
        canActivate: [modulePermissionGuard],
        component: IVFHomeComponent,
        data: { module: 'IVF', component: 'IVF Dashboard', title: 'IVF Dashboard' }
      },
      {
        path: 'patient-summary',
        canActivate: [modulePermissionGuard],
        component: IvfPatientSummaryComponent,
        data: { module: 'IVF', component: 'Patient Summary', title: 'Patient Summary' }
      }
    ]
  }
];
