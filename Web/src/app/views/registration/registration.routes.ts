import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { AlertComponent } from './alert/alert.component';
import { CovrageCreateComponent } from './Covrage/covrage-create/covrage-create.component';
import { CoverageListComponent } from './Covrage/coverage-list/coverage-list.component';
import { DemographicCreateComponent } from './Demographic/demographic-create/demographic-create.component';
import { DemographicListComponent } from './Demographic/demographic-list/demographic-list.component';
import { modulePermissionGuard } from '@core/guards/module-permission.guard';
import { TemporaryPatientDemographicListComponent } from './Demographic/temporary-patient-demographic-list/temporary-patient-demographic-list.component';
import { TemporaryDemographicsComponent } from './Demographic/temporary-demographics/temporary-demographics.component';

export const Registration_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { permissions: ['Registration:Alerts'] },
    children: [
      {
        path: 'alerts',
        canActivate: [modulePermissionGuard],
        component: AlertComponent,
        data: { title: 'Alerts' }
      },

      {
        path: 'coverages',
        canActivate: [modulePermissionGuard],
        component: CoverageListComponent,
        data: { title: 'Coverage List' }
      },

      {
        path: 'covrage-create',
        canActivate: [modulePermissionGuard],
        component: CovrageCreateComponent,
        data: { title: 'Coverage Create' }
      },

      {
        path: 'demographics',
        canActivate: [modulePermissionGuard],
        component: DemographicListComponent,
        data: { title: 'Demographic List' }
      },

      {
        path: 'demographic-create',
        canActivate: [modulePermissionGuard],
        component: DemographicCreateComponent,
        data: { title: 'Demographic Create' }
      },

      {
        path: 'temporary-patient-demographics',
        canActivate: [modulePermissionGuard],
        component: TemporaryPatientDemographicListComponent,
        data: { title: 'Temporary Demographic List' },
      },


      {
        path: 'temporary-patient-demographics-create',
        canActivate: [modulePermissionGuard],
        component: TemporaryDemographicsComponent,
        data: { title: 'Temporary Patient Demographics' },
      },







      //   {
      //   path: 'coverages',
      //   component: CoverageListComponent,
      //   data: { title: 'Coverage List' }
      // },

      //   {
      //     path: 'problem-list',
      //     component: ProblemListComponent,
      //     data: { title: 'Problem List' }
      //   },
      //   {
      //     path: 'favorites',
      //     component: FavoritesComponent,
      //     data: { title: 'Favorites' }
      //   },
      //   {
      //     path: 'problem',
      //     component: ProblemComponent,
      //     data: { title: 'problem-list' }
      //   },
      //   {
      //     path: 'allergies',
      //     component: AllergiesComponent,
      //     data: { title: 'Allergies' }
      //   }

    ]
  }
];
