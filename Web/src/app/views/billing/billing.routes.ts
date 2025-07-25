import { Routes } from '@angular/router';

import { authGuard } from '@/app/core/guards/auth.guard';
import { ChargeCaptureComponent } from './charge-capture/charge-capture.component';


export const BILLING_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { permissions: ['Billing:Charge Capture',]},
    children: [

      {
        path: 'charge-capture',
        component: ChargeCaptureComponent,
        data: { title: 'Charge Capture' }
      }

    ]
  }
];
