import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { modulePermissionGuard } from '@/app/core/guards/module-permission.guard';
import { CryoContainerListComponent } from './cryo-container-list/cryo-container-list.component';
import { CryoContainerAddComponent } from './cryo-container-add/cryo-container-add.component';
import { CryoContainerEditComponent } from './cryo-container-edit/cryo-container-edit.component';
import { DropdownConfigrationComponent } from '../setup/dropdown-configration/dropdown-configration.component';

export const CRYO_ROUTES: Routes = [
    {
        path: 'cryo-management',
        component: CryoContainerListComponent,
        canActivate: [authGuard, modulePermissionGuard],
        data: {
            module: 'Cryo Mangement', component: 'Cryo Manager', title: 'Cryo Manager'
        }
    },
    {
        path: 'cryo-management/add',
        component: CryoContainerAddComponent,
        canActivate: [authGuard, modulePermissionGuard],
        data: {
            module: 'Cryo Mangement', component: 'Cryo Manager', title: 'Cryo Manager'
        }
    },
    {
        path: 'cryo-management/edit/:id',
        component: CryoContainerEditComponent,
        canActivate: [authGuard, modulePermissionGuard],
        data: {
            module: 'Cryo Mangement', component: 'Cryo Manager', title: 'Cryo Manager'
        }
    },
    {
        path: 'dropdown-configration',
        component: DropdownConfigrationComponent,
        canActivate: [authGuard, modulePermissionGuard],
        data: {
            module: 'Cryo Mangement', component: 'Cryo Manager', title: 'Cryo Manager'
        }
    }


];
