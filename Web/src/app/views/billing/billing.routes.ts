import { Routes } from '@angular/router';

import { authGuard } from '@/app/core/guards/auth.guard';
import { ChargeCaptureComponent } from './charge-capture/charge-capture.component';
import { AppointmentDashboardComponent } from '../Scheduling/appointment-dashboard/appointment-dashboard.component';
import { modulePermissionGuard } from '@core/guards/module-permission.guard';
import { BillGeneratorComponent } from './bill-generator/bill-generator.component';


export const BILLING_ROUTES: Routes = [
  // {
  //   path: '',
  //   canActivate: [authGuard],
  //   data: { permissions: ['Billing:charge-capture',]},
  //   children: [

  //     {
  //       path: 'charge capture',
  //       // component: AppointmentDashboardComponent,
  //       component: ChargeCaptureComponent,
  //       data: { title: 'Charge Capture' }
  //     },

  //     {
  //       path: 'Appointments History',
  //       component: AppointmentDashboardComponent,
  //       // component: ChargeCaptureComponent,
  //       data: { title: 'Appointments History' }
  //     }

      

  //   ]
  // }

  {
      path: '',
      canActivate: [authGuard],
      children: [
        {
          path: 'charge capture',
          component: ChargeCaptureComponent,
          canActivate: [modulePermissionGuard],
          data: { module: 'Billing', component: 'Charge Capture', title: 'Charge Capture' }
        },
        {
          path: 'bill generator',
          component: BillGeneratorComponent,
          canActivate: [modulePermissionGuard],
          data: { module: 'Billing', component: 'Bill Generator', title: 'Bill Generator' }
        },
      ]
    }
];
