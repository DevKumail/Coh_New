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
import { ImmunizationsComponent } from './immunizations/immunizations.component';
import { MedicationComponent } from './medication/medication.component';
import { ClinicalNoteComponent } from './clinical-note/clinical-note.component';
import { ClinicalNoteCreateComponent } from './clinical-note-create/clinical-note-create.component';

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
      // Alias for hyphenated path
      {
        path: 'medical-history',
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
      // Aliases for problem list
      {
        path: 'problem',
        component: ProblemComponent,
        canActivate: [modulePermissionGuard],
        data: { module: 'Clinical', component: 'Problem', title: 'Problem List' }
      },
      {
        path: 'problem-list',
        component: ProblemComponent,
        canActivate: [modulePermissionGuard],
        data: { module: 'Clinical', component: 'Problem', title: 'Problem List' }
      },
      {
        path: 'allergies',
        canActivate: [modulePermissionGuard],
        component: AllergiesComponent,
        data: { module: 'Clinical', component: 'Allergies', title: 'Allergies' }
      },
      {
        path: 'vital-signs',
        canActivate: [modulePermissionGuard],
        component: VitalSignsComponent,
        data: { module: 'Clinical', component: 'Vital Signs', title: 'Vital Signs' }
      },
      {
        path: 'medications',
        canActivate: [modulePermissionGuard],
        component: MedicationComponent,
        data: { module: 'Clinical', component: 'Medications', title: 'Medications' }
      },
      {
        path:'immunizations',
        canActivate:[modulePermissionGuard],
        component:ImmunizationsComponent,
        data: { module: 'Clinical', component: 'Immunizations', title: 'Immunizations' }
      },
      {
        path:'create-notes',
        canActivate:[modulePermissionGuard],
        component:ClinicalNoteCreateComponent,
        data: { module: 'Clinical', component: 'Immunizations', title: 'Immunizations' }
      },
    ]
  }
];
