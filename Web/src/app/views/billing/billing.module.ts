import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BILLING_ROUTES } from './billing.routes';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     RouterModule.forChild(BILLING_ROUTES)
  ]
})
export class BillingModule { }
