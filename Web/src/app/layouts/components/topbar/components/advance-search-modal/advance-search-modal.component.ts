import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { AfterViewInit, Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule } from '@/app/shared/icons.module';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '@app/components/ui-card.component';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedApiService } from '@/app/shared/shared.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

declare var bootstrap: any;
@Component({
  selector: 'app-advance-search-modal',
  imports: [FormsModule, IconsModule, CommonModule, UiCardComponent, ReactiveFormsModule, DataTablesModule,],
  templateUrl: './advance-search-modal.component.html',
  styleUrl: './advance-search-modal.component.scss'
})

export class AdvanceSearchModalComponent {
  selectedPatient: any = null;
  patientForm: FormGroup;
  Patient: any[] = [];
  searchResults: any[] = [];
  totalRecord: number = 0;
  @Output() onPatientSelect = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private sharedApiService: SharedApiService,
    private modalService: NgbModal,
    private patientBannerService: PatientBannerService,
    private demographicApiService: DemographicApiServices
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

  onRowSelect(mrno: string) {
    console.log("selected mrno: ", mrno)
    this.onPatientSelect.emit(mrno);
    this.closeModal();
  }

  onSubmit() {
    console.log("payload: ", this.patientForm.value);
    this.getSearchResults(this.patientForm.value);
  }

  getSearchResults(req: any) {
    this.sharedApiService.GetCoverageAndRegPatient(req).subscribe((res => {
      if (res?.table2) {
        this.searchResults = res.table2;
        this.totalRecord = res.table3?.[0]?.totalCount || 0;
      }
    }))
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
    const modalElement = document.getElementById('advance-filter-modal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

}
