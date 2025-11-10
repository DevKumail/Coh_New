 import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { modulePermissionGuard } from '@/app/core/guards/module-permission.guard';
import { CryoContainerListComponent } from './cryo-container-list/cryo-container-list.component';

export const CRYO_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [ 
      {
        path: 'cryo-management',
        canActivate: [modulePermissionGuard],
        component: CryoContainerListComponent,
        data: { module: 'Cryo Mangement', component: 'Cryo Manager', title: 'Cryo Manager' }
      },
    ]
  }
];
