import { Routes } from '@angular/router';
import { authGuard } from '@/app/core/guards/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { HumanResourcesComponent } from './human-resources/human-resources.component';
import { HumanResourcesAddComponent } from './human-resources-add/human-resources-add.component';


export const Control_Panel_ROUTES: Routes = [

  {
    path: '',
    canActivate: [authGuard],
    data: { permissions: ['Control Panel:Human Resources']},
    children: [
      {
        path: 'human resources',
        component: HumanResourcesComponent,
        data: { title: 'Human Resources' }
      },

      {
        path: 'human-resources-add',
        component: HumanResourcesAddComponent,
        data: { title: ' Human Resources Add ' }
      }

    ]
  },

]
