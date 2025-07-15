import { Routes } from '@angular/router';

import { authGuard } from '@/app/core/guards/auth.guard';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProblemComponent } from './problem/problem.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { AppointmentsComponent } from '../Scheduling/appointments/appointments.component';


export const CLINICAL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { permissions: ['Clinical:Medical History','Registration:Alerts']},
    children: [

         {
        path: 'medical-history',
        component: MedicalHistoryComponent,
        data: { title: 'Medical History' }
      },
    //   {
    //     path: 'problem-list',
    //     component: ProblemListComponent,
    //     data: { title: 'Problem List' }
    //   },
      {
        path: 'favorites',
        component: FavoritesComponent,
        data: { title: 'Favorites' }
      },
      {
        path: 'problem-list',
        component: ProblemComponent,
        data: { title: 'Problem List' }
      },
      {
        path: 'allergies',
        component: AppointmentsComponent,
        data: { title: 'Allergies' }
        // AllergiesComponent,
      }

    ]
  }
];
