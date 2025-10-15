import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
// import { ProblemListComponent } from '../problem-list/problem-list.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import { ProblemListComponent } from '../problem-list/problem-list.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [ CommonModule,ReactiveFormsModule,NgIconComponent,
  FavoritesComponent,
  ProblemListComponent,
  NgbNavModule,
  TranslatePipe,
  FilledOnValueDirective],
  templateUrl: './medical-history.component.html',
  styleUrl: './medical-history.component.scss'
})

export class MedicalHistoryComponent implements OnInit {

    medicalForm!: FormGroup;

    activeTabId = 1;
    editedFavorite: any = null;



    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
      this.medicalForm = this.fb.group({
        provider: [''],
        providerName: [''],
        code: [''],
        problem: [''],
        icdVersion: [''],
        confidential: [''],
        startDate: [''],
        endDate: [''],
        comments: [''],
        status: ['']
      });
    }

      get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }

    // ✅ Reset form
    onClear(): void {
      this.medicalForm.reset();
    }


    // ✅ Receive edited row from Favorites and switch to Problem tab
    onFavoriteEdit(record: any): void {
      this.editedFavorite = record;
      this.activeTabId = 1;
    }



  }
