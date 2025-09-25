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

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [ CommonModule,ReactiveFormsModule,NgIconComponent,
  FavoritesComponent,
  ProblemListComponent,
  NgbNavModule,
  TranslatePipe],
  templateUrl: './medical-history.component.html',
  styleUrl: './medical-history.component.scss'
})

export class MedicalHistoryComponent implements OnInit {

    medicalForm!: FormGroup;

    activeTabId = 1;

    medicalHistoryData = [
      {
        provider: 1,
        problem: 'Hypertension',
        comments: 'Patient needs regular monitoring',
        confidential: true,
        status: 'Active',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      {
        provider: 2,
        problem: 'Diabetes',
        comments: 'Monthly insulin checkup',
        confidential: false,
        status: 'Inactive',
        startDate: '2023-05-10',
        endDate: '2023-12-15'
      }
    ];

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



  }
