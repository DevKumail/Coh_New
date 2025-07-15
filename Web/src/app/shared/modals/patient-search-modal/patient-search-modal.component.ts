import { Component, TemplateRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { SharedApiService } from '../../shared.api.service';
import { LucideAngularModule } from 'lucide-angular';
import { DataTablesModule } from 'angular-datatables';
import { DataStorageService } from '../../data-storage.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-patient-search-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModalModule,
    DataTablesModule,
    LucideAngularModule,
  ],
  templateUrl: './patient-search-modal.component.html',
  styleUrls: ['./patient-search-modal.component.scss']
})
export class PatientSearchModalComponent implements AfterViewInit, OnDestroy {

  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 100,
    lengthMenu: [50, 10, 25, 50, 100],
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
    limit: 100,
  };

  private modalRef?: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private sharedApiService: SharedApiService,
    private dataStorageService: DataStorageService
  ) {
    this.patientForm = this.fb.group({
      mrNo: [''],
      name: [''],
      lastName: [''],
      phone: ['']
    });
  }


    // ngOnInit(): void {
    // debugger
    //   const getdata = this.dataStorageService.getData('Demographics');
    //   }

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
    this.dataStorageService.clearData('Demographics');

    const filterData = this.patientForm.value;
    const requestData = {
      demographicList: filterData,
    };

    this.GetCoverageAndRegPatient(requestData);
  }


GetCoverageAndRegPatient(req: any) {

    let PaginationInfo = {
        RowsPerPage: this.PaginationInfo.limit,
        Page: this.PaginationInfo.page
      }

  this.sharedApiService.GetCoverageAndRegPatient(req,PaginationInfo).subscribe({
    next: (demographics: any) => {
      if (demographics?.table2) {
        this.PatientData = demographics.table2;
        this.Patient = demographics.table2;

        this.totalRecord = demographics.table3?.[0]?.totalCount || 0;
        console.log('this.searchResults =>',this.PatientData);
        
        this.patientsFound.emit(this.PatientData);

        this.rerender(); // 🔁 force reinitialize
      }
    },
    error: (err: any) => {
         Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message
            })
    }
  });
}

    loadVisit(e: Event, Id: number) {
     debugger
       const mrNo = Id.toString(); 
      //  this.patientForm.get('mrNo')?.value;
     
      this.GetDemographicsByMRNo(mrNo);
      // this.GetAppointmentsByMRNO(mrNo);

      console.log('Row clicked!', e);
      this.dataStorageService.toggleShow(true);

       if (this.modalRef) {
      this.modalRef.close(); // ✅ Close current modal properly
    } else {
      this.modalService.dismissAll(); // fallback
    }
    }


    GetDemographicsByMRNo(MrNo: string = '') {
        this.sharedApiService.getCoverageAndRegPatientbyMrno(MrNo).then((demographics: any) => {
          if (demographics) {

            this.dataStorageService.setSearchData(demographics);
            this.dataStorageService.setData('Demographics', demographics);

            // localStorage.setItem('Demographics', JSON.stringify(demographics));
          }
        })
        .catch((error: any) =>
            Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message
            })
        );
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
