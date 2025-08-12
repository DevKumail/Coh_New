import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Scheduling_ROUTES } from './scheduling.routes'
import { i } from 'node_modules/@angular/cdk/data-source.d-Bblv7Zvh';

@NgModule({
  declarations: [],
  imports: [
    ReactiveFormsModule,
     CreateAppointmentComponent,
    CommonModule,
     RouterModule.forChild(Scheduling_ROUTES)
  ]
})
export class SchedulingModule { }
