import { Routes } from '@angular/router';

import { authGuard } from '@/app/core/guards/auth.guard';
import { ChargeCaptureComponent } from './charge-capture/charge-capture.component';
import { AppointmentDashboardComponent } from '../Scheduling/appointment-dashboard/appointment-dashboard.component';


export const BILLING_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { permissions: ['Billing:charge-capture',]},
    children: [

      {
        path: 'charge capture',
        // component: AppointmentDashboardComponent,
        component: ChargeCaptureComponent,
        data: { title: 'Charge Capture' }
      }

    ]
  }
];
