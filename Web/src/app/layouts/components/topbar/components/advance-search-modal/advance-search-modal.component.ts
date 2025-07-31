import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '@/app/shared/icons.module';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '@app/components/ui-card.component';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedApiService } from '@/app/shared/shared.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { LoaderComponent } from "@app/components/loader/loader.component";
import { ModalTriggerService } from '@core/services/modal-trigger.service';

declare var bootstrap: any;
@Component({
  selector: 'app-advance-search-modal',
  imports: [FormsModule, IconsModule, CommonModule, UiCardComponent, ReactiveFormsModule, DataTablesModule, LoaderComponent],
  templateUrl: './advance-search-modal.component.html',
  styleUrl: './advance-search-modal.component.scss'
})

export class AdvanceSearchModalComponent implements AfterViewInit {
  lastOpenContext: string | undefined;
  selectedMrNo: string | null = null;
  patientForm: FormGroup;
  Patient: any[] = [];
  searchResults: any[] = [];
  totalRecord: number = 0;
  isLoading: boolean = false;
  @Output() onPatientSelect = new EventEmitter<{ mrno: string, context?: string }>();

  @ViewChild('hiddenTrigger') hiddenTrigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('hiddenCloseBtn') hiddenCloseBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private fb: FormBuilder,
    private sharedApiService: SharedApiService,
    private modalTriggerService: ModalTriggerService,
  ) {
    this.patientForm = this.fb.group({
      demographicList: this.fb.group({
        name: [''],
        mrno: [''],
        genderId: [0],
        phone: ['']
      }),
      paginationInfo: this.fb.group({
        page: [0],
        rowsPerPage: [5]
      })
    });
  }

  ngAfterViewInit(): void {
    this.modalTriggerService.modalTrigger$.subscribe(({ modalId, context }) => {
      this.lastOpenContext = context;
      if (modalId === 'advance-filter-modal') {
        this.hiddenTrigger.nativeElement.click();
      }
    });
  }

  onRowSelect(mrno: string) {
    this.selectedMrNo = mrno;
    this.onPatientSelect.emit({ mrno, context: this.lastOpenContext });
    this.closeModal();
  }

  onSubmit() {
    this.getSearchResults(this.patientForm.value);
  }

  getSearchResults(req: any) {
    this.isLoading = true;
    this.sharedApiService.GetCoverageAndRegPatient(req).subscribe({
      next: (res) => {
        if (res?.table2) {
          this.searchResults = res.table2;
          this.totalRecord = res.table3?.[0]?.totalCount || 0;
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  resetFilter() {
    this.patientForm.reset({
      demographicList: {
        name: '',
        mrno: '',
        genderId: 0,
        phone: ''
      },
      paginationInfo: {
        page: 0,
        rowsPerPage: 5
      }
    });
  }

  closeModal() {
    this.hiddenCloseBtn.nativeElement.click();
  }

}
