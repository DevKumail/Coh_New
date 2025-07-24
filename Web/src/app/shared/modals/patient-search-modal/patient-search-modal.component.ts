import { Component, TemplateRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { SharedApiService } from '../../shared.api.service';
import { LucideAngularModule } from 'lucide-angular';
import { UiCardComponent } from "@app/components/ui-card.component";
import { PatientHeaderPanelComponent } from './../../../layouts/components/patient-header-panel/patient-header-panel.component';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-patient-search-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    DataTablesModule,
    LucideAngularModule,
    UiCardComponent,
    PatientHeaderPanelComponent
  ],
  templateUrl: './patient-search-modal.component.html',
  styleUrls: ['./patient-search-modal.component.scss']
})
export class PatientSearchModalComponent implements AfterViewInit, OnDestroy {

  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50, 100],
    destroy: true,
    select: { style: 'single' },
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        self.onRowSelect(data);
      });
      return row;
    }
  };

  selectedPatient: any = null;
  state: 'visible' | 'hidden' = 'hidden';
  pinned: boolean = false;
 isTableVisible: boolean = true;
  dtTrigger: Subject<any> = new Subject();

  patientForm: FormGroup;
  name: string = '';
  Patient: any[] = [];
  PatientData: any[] = [];
  searchResults: any[] = [];
  totalRecord: number = 0;
  @Output() patientsFound = new EventEmitter<any[]>();

  PaginationInfo = {
    page: 1,
    limit: 10,
  };

  private modalRef?: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sharedApiService: SharedApiService,
  ) {
    this.patientForm = this.fb.group({
      mrNo: [''],
      name: [''],
      lastName: [''],
      phone: ['']
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(0);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); // ✅ Prevent memory leak
  }

  openModal(name: string) {
    const patient = sessionStorage.getItem('loadedPatientName');
    if (!patient) {
      this.name = name;
      this.modalRef = this.modalService.open(this.modalTemplate, { size: 'lg' });
    } else {
      console.log('Patient already loaded.');
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close(); // ✅ Close current modal properly
    } else {
      this.modalService.dismissAll(); // fallback
    }
  }

  onRowSelect(patient: any) {
    console.log('Selected Patient:', patient);
    this.selectedPatient = patient;
    this.close();
  }

  handlePatient(patient: any) {
    this.selectedPatient = patient;
    console.log('Patient received from modal:', patient);
  }

  onPinnedToggleAttempt() {
    alert('Please unpin to hide the header panel.');
  }

  searchPatient() {
    const filterData = this.patientForm.value;

    const requestData = {
      demographicList: filterData,
      PaginationInfo: {
        RowsPerPage: this.PaginationInfo.limit,
        Page: this.PaginationInfo.page
      }
    };

    this.GetCoverageAndRegPatient(requestData);
  }

//   GetCoverageAndRegPatient(req: any) {
//     this.sharedApiService.GetCoverageAndRegPatient(req).subscribe({
//       next: (demographics: any) => {
//         console.log("getCoverageAndRegPatient", demographics);

//         if (demographics?.table2) {
//           const newResults = demographics.table2;
//           this.searchResults = [...newResults, ...this.searchResults]; // ✅ Add at top
//           this.PatientData = [...newResults, ...this.PatientData];
//           this.Patient = [...newResults, ...this.Patient];

//           this.patientsFound.emit(this.searchResults);
//           this.totalRecord = demographics.table3?.[0]?.totalCount || 0;

//           this.rerender(); // ✅ Update table
//         }
//       },
//       error: (err: any) => {
//         console.error('Error fetching patients:', err);
//         this.sharedApiService.add({ severity: 'error', summary: 'Error', detail: err.message });
//       }
//     });
//   }
GetCoverageAndRegPatient(req: any) {
  this.sharedApiService.GetCoverageAndRegPatient(req).subscribe({
    next: (demographics: any) => {
      if (demographics?.table2) {
        const newResults = demographics.table2;

        this.searchResults = [...newResults, ...this.searchResults];
        this.PatientData = [...newResults, ...this.PatientData];
        this.Patient = [...newResults, ...this.Patient];

        this.totalRecord = demographics.table3?.[0]?.totalCount || 0;
        this.patientsFound.emit(this.searchResults);

        this.rerender(); // 🔁 force reinitialize
      }
    },
    error: (err: any) => {
      console.error('Error fetching patients:', err);
    }
  });
}


  onPageChanges(event: any) {
    this.PaginationInfo.page = event.page + 1;
    this.PaginationInfo.limit = event.rows;
    this.searchPatient();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy(); // ✅ Destroy old table instance
      this.dtTrigger.next(0); // ✅ Reinitialize
    });
  }
}