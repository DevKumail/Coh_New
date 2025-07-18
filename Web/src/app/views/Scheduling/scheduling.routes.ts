import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulingApiService } from './scheduling.api.service';




export const Scheduling_ROUTES: Routes = [
    {
        path: '',
        canActivate: [authGuard],

        data: { permissions: ['Scheduling:View Appointments'] },
        children: [
            {
                path: 'View-Appointments',
                component: AppointmentsComponent,
                data: { title: 'View Appointments' }
            },
            // {
            //     path: 'Create-Appointments',
            //     component: AppointmentsComponent,
            //     data: { title: 'View Appointments' }
            //   },
            {
                path: 'Create-Appointments',
                component: CreateAppointmentComponent,
                data: { title: 'Create Appointment' }
            },
 



            //   {
            //     path: 'Appointments/Create',
            //     component: AppointmentsComponent,
            //     data: { title: 'Appointment Booking' }
            //   },

        ]
    }
];
