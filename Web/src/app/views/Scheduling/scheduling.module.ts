import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';


import { Scheduling_ROUTES } from './scheduling.routes'

@NgModule({
  declarations: [],
  imports: [
     CreateAppointmentComponent,
    CommonModule,
     RouterModule.forChild(Scheduling_ROUTES)
  ]
})
export class SchedulingModule { }
