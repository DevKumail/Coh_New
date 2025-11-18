import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProblemComponent } from './problem/problem.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { modulePermissionGuard } from '@core/guards/module-permission.guard';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';
import { ImmunizationsComponent } from './immunizations/immunizations.component';
import { MedicationComponent } from './medication/medication.component';
import { SocialHistoryComponent } from './social-history/social-history.component';
import { FamilyHistoryComponent } from './family-history/family-history.component';
import { ClinicalNoteComponent } from './clinical-note/clinical-note.component';
import { ClinicalNoteCreateComponent } from './clinical-note-create/clinical-note-create.component';
import {ClinicalStructuredNoteCreateComponent} from './clinical-structured-note-create/clinical-structured-note-create.component';
import {ClinicalFreeTextNoteCreateComponent} from './clinical-free-text-note-create/clinical-free-text-note-create.component';
import { PatientSummaryComponent } from '../patient-summary/patient-summary.component';

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
        path: 'social-history',
        canActivate: [modulePermissionGuard],
        component: SocialHistoryComponent,
        data: { module: 'Clinical', component: 'Social History', title: 'Social History' }
      },
      {
        path: 'family-history',
        canActivate: [modulePermissionGuard],
        component: FamilyHistoryComponent,
        data: { module: 'Clinical', component: 'Family History', title: 'Family History' }
      },
      {
        path: 'notes',
        canActivate: [modulePermissionGuard],
        component: ClinicalNoteComponent,
        data: { module: 'Clinical', component: 'Notes', title: 'Notes' }
      },
      {
        path:'create-notes',
        canActivate:[modulePermissionGuard],
        component:ClinicalNoteCreateComponent,
        data: { module: 'Clinical', component: 'Immunizations', title: 'Immunizations' }
      },
        {
        path:'create-structured-notes',
        canActivate:[modulePermissionGuard],
        component:ClinicalStructuredNoteCreateComponent,
        data: { module: 'Clinical', component: 'Immunizations', title: 'Immunizations' }
      },
      {
        path:'create-free-text-notes',
        canActivate:[modulePermissionGuard],
        component:ClinicalFreeTextNoteCreateComponent,
        data: { module: 'Clinical', component: 'Immunizations', title: 'Immunizations' }
      },

         {
        path:'patient-summary/:id',
        canActivate:[modulePermissionGuard],
        component:PatientSummaryComponent,
        data: { module: 'Clinical', component: 'Immunizations', title: 'Immunizations' }
      },
    ]
  }
];
