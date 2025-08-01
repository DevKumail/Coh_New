import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulingApiService } from './scheduling.api.service';
import { FilterModalComponent } from './filter.modal/filter.modal.component';
import { AppointmentDashboardComponent } from './appointment-dashboard/appointment-dashboard.component';

export const Scheduling_ROUTES: Routes = [
    {
        path: '',
        canActivate: [authGuard],

        data: { permissions: ['Scheduling:View Appointments'] },
        children: [
            {
                path: 'view appointments',
                component: AppointmentsComponent,
                data: { title: 'View Appointments' },
            },

            {
                path: 'view appointments',
                component: AppointmentDashboardComponent,
                data: { title: 'View Appointments' },
            },

            {
                path: 'create-appointment',
                component: CreateAppointmentComponent,
                data: { title: 'Create Appointment' },
            },
            {
                path: 'Filter',
                component: FilterModalComponent,
                data: { title: 'Filter Appointments' },
            },
        ],
    },
];


// export const Scheduling_ROUTES: Routes = [
//     {
//         path: '',
//         canActivate: [authGuard],
//         data: { permissions: ['Scheduling:View Appointments'] },
//         children: [
//             {
//                 path: 'View Appointments',
//                 component: AppointmentsComponent,
//                 data: { title: 'View Appointments' },
//             },
//             {
//                 path: 'create-appointment',
//                 component: CreateAppointmentComponent,
//                 data: { title: 'Create Appointment' },
//             },
//             {
//                 path: 'Filter',
//                 component: FilterModalComponent,
//                 data: { title: 'Filter Appointments' },
//             },
      
//         ],
//     },
//        // 🔓 Unprotected route for dashboard (no permission check)
//     {
//         path: 'appointment-dashboard',
//         component: AppointmentDashboardComponent,
//         data: { title: 'Appointment Dashboard' },
//     },
// ];
