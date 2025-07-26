import { ClinicalApiService } from './../../../shared/Services/Clinical/clinical.api.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { ProblemListComponent } from '../problem-list/problem-list.component';
import { FavoritesComponent } from '../favorites/favorites.component'; 



@Component({
  selector: 'app-problem',
  imports: [CommonModule,ReactiveFormsModule,NgIconComponent,
    FavoritesComponent,
    ProblemListComponent,
    NgbNavModule],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss'
})
export class ProblemComponent {


    activeTabId = 1;

}
