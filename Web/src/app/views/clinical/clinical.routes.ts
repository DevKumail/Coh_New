import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProblemComponent } from './problem/problem.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { Component } from 'lucide-angular';
import { AppointmentsComponent } from '../Scheduling/appointments/appointments.component';
import { modulePermissionGuard } from '@core/guards/module-permission.guard';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';

export const CLINICAL_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'medical history',
        component: MedicalHistoryComponent,
        canActivate: [modulePermissionGuard],
        data: { module: 'Clinical', component: 'Medical History', title: 'Medical History' }
      },
      {
        path: 'favorites',
        component: FavoritesComponent,
        canActivate: [modulePermissionGuard],
        data: { module: 'Clinical', component: 'Favorites', title: 'Favorites' }
      },
      {
        path: 'problem list',
        component: ProblemComponent,
        canActivate: [modulePermissionGuard],
        data: { module: 'Clinical', component: 'Problem', title: 'Problem List' }
      },
      {
        path: 'allergies',
        canActivate: [modulePermissionGuard],
        component: AllergiesComponent,
        data: { title: 'Allergies' }
      },

      {
        path: 'vital signs',
        canActivate: [modulePermissionGuard],
        component: VitalSignsComponent,

        data: {  title: 'Vital Signs' }
      },
    ]
  }
];
