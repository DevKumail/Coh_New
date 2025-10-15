import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulingApiService } from './scheduling.api.service';
import { FilterModalComponent } from './filter.modal/filter.modal.component';
import { AppointmentDashboardComponent } from './appointment-dashboard/appointment-dashboard.component';
import { modulePermissionGuard } from '@core/guards/module-permission.guard';

export const Scheduling_ROUTES: Routes = [
    // {
    //     path: '',
    //     canActivate: [authGuard],

    //     data: { permissions: ['Scheduling:View Appointments'] },
    //     children: [
    //         {
    //             path: 'view appointments',
    //             component: AppointmentsComponent,
    //             data: { title: 'View Appointments' },
    //         },


    //         {
    //             path: 'create-appointment',
    //             component: CreateAppointmentComponent,
    //             data: { title: 'Create Appointment' },
    //         },
    //         {
    //             path: 'Filter',
    //             component: FilterModalComponent,
    //             data: { title: 'Filter Appointments' },
    //         },
    //     ],
    // },


    {
        path: '',
        canActivate: [authGuard],
        children: [
          {
            path: 'Filter',
            component: FilterModalComponent,
            canActivate: [modulePermissionGuard],
            data: { module: 'Scheduling', component: 'Filter', title: 'Filter Appointments' }
          },
          {
            path: 'view appointments',
            component: AppointmentsComponent,
            canActivate: [modulePermissionGuard],
            data: { module: 'Scheduling', component: 'View Appointments', title: 'View Appointments' }
          },
          {
          path: 'appointment dashboard',
          component: AppointmentDashboardComponent,
          canActivate: [modulePermissionGuard],
          data: { module: 'Scheduling', component: 'Appointment Dashboard', title: 'Appointment Dashboard' }
        },
        {
            path: 'appointment booking',
            component: CreateAppointmentComponent,
            canActivate: [modulePermissionGuard],
            data: { module: 'Scheduling', component: 'Appointment Booking', title: 'Appointment Booking' }
        },
        ]
      }
];
