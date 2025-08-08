import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { AlertComponent } from './alert/alert.component';
import { CovrageCreateComponent } from './Covrage/covrage-create/covrage-create.component';
import { CoverageListComponent } from './Covrage/coverage-list/coverage-list.component';
import { DemographicCreateComponent } from './Demographic/demographic-create/demographic-create.component';
import { DemographicListComponent } from './Demographic/demographic-list/demographic-list.component';
import { Contact } from 'lucide-angular';
import { title } from 'process';
import { TemporaryPatientDemographicListComponent } from './Temporary Patient Demographics/temporary-patient-demographic-list/temporary-patient-demographic-list.component';
import { TemporaryDemographicsComponent } from './Temporary Patient Demographics/temporary-demographics/temporary-demographics.component';


export const Registration_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    data: { permissions: ['Registration:Alerts'] },
    children: [
      {
        path: 'alerts',
        component: AlertComponent,
        data: { title: 'Alerts' }
      },

      {
        path: 'coverages',
        component: CoverageListComponent,
        data: { title: 'Coverage List' }
      },

      {
        path: 'covrage-create',
        component: CovrageCreateComponent,
        data: { title: 'Coverage Create' }
      },

      {
        path: 'demographics',
        component: DemographicListComponent,
        data: { title: 'Demographic List' }
      },

      {
        path: 'demographic-create',
        component: DemographicCreateComponent,
        data: { title: 'Demographic Create' }
      },

      {
        path: 'temporary patient demographics',
        component: TemporaryPatientDemographicListComponent,
        data: { title: 'Temporary Patient Demographic List' },
      },


      {
        path: 'temporary-demographics',
        component: TemporaryDemographicsComponent,
        data: { title: 'Temporary Demographics' },
      },

    ]
  }
];
