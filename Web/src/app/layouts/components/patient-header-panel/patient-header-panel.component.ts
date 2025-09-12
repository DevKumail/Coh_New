import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { IconsModule } from '@/app/shared/icons.module';
import { DataStorageService } from '@/app/shared/data-storage.service';
import { SharedApiService } from '@/app/shared/shared.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { NgIconComponent } from '@ng-icons/core';
import { LoaderService } from '@core/services/loader.service';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-patient-header-panel',
  standalone: true,
  templateUrl: './patient-header-panel.component.html',
  styleUrls: ['./patient-header-panel.component.scss'],
  imports: [CommonModule, IconsModule,
    ReactiveFormsModule,
    NgbNavModule,
    NgbTooltip,
    FormsModule,
    NgIconComponent,
  ],
  animations: [
    trigger('slideToggle', [
      state('hidden', style({ height: '0', opacity: 0, overflow: 'hidden', padding: '0', margin: '0' })),
      state('visible', style({ height: '*', opacity: 1, overflow: 'visible', padding: '*', margin: '*' })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')])
    ])
  ]
})
export class PatientHeaderPanelComponent implements OnInit {
  patientData: any;
  visible: boolean = false;
  patientInfo : any = [];
  insuranceInfo: any = [];
  AppoinmentData:any = [];
  visitAppointments: any;
  ActiveAppoinment: any;
  modalService = new NgbModal();
  private modalRef!: NgbModalRef;   
  private readonly STORAGE_KEYS = {
    patientData: 'patient_banner_data',
    visitAppointments: 'patient_banner_visit_appts',
    selectedVisit: 'patient_banner_selected_visit'
  } as const;
  
  // Pagination state for Visits list
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  
  // Current page slice of appointments
  get paginatedAppointments(): any[] {
    if (!Array.isArray(this.AppoinmentData) || this.AppoinmentData.length === 0) {
      return [];
    }
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.AppoinmentData.slice(start, end);
  }
  
  private updatePagination(): void {
    const totalItems = Array.isArray(this.AppoinmentData) ? this.AppoinmentData.length : 0;
    this.totalPages = Math.max(1, Math.ceil(totalItems / this.pageSize));
    // Clamp current page into range
    this.currentPage = Math.min(Math.max(this.currentPage, 1), this.totalPages);
    // Build page numbers [1..totalPages]
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
    constructor(
    private patientBannerService: PatientBannerService,
    private loader: LoaderService,
    private demographicapi: DemographicApiServices,
    private secureStorage: SecureStorageService
  ) { }
  // patientBannerService = inject(PatientBannerService)

  closeBanner() {
    this.visible = false;
    this.patientBannerService.setPatientData(null);
    // Clear stored state on close
    this.secureStorage.removeItem(this.STORAGE_KEYS.patientData);
    this.secureStorage.removeItem(this.STORAGE_KEYS.visitAppointments);
    this.secureStorage.removeItem(this.STORAGE_KEYS.selectedVisit);
  }

  // get patientInfo() {
  //   return this.patientData?.table2?.[0] || null;
  // }

  // get insuranceInfo() {
  //   console.log('insuranceInfo');
  //   return this.patientData?.table1 || [];
  // }

  ngOnInit(): void {
     // 1) Hydrate from secure storage (if available)
     const storedPatient = this.secureStorage.getJson<any>(this.STORAGE_KEYS.patientData);
     if (storedPatient?.table2?.[0]?.mrNo) {
       this.patientData = storedPatient;
       this.patientInfo = this.patientData?.table2?.[0] || null;
       this.insuranceInfo = this.patientData?.table1 || [];
       this.visible = true;
     }
     const storedVisitAppts = this.secureStorage.getJson<any>(this.STORAGE_KEYS.visitAppointments);
     if (storedVisitAppts?.table?.[0]) {
       this.visitAppointments = storedVisitAppts?.table?.[0];
     }

     // 2) Subscribe to live stream and persist
     this.patientBannerService.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) => 
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        console.log('✅ Subscription triggered with MRNO in Header Component:', data?.table2?.[0]?.mrNo);
        this.patientData = data;
        if (this.patientData) {
        this.patientInfo = this.patientData?.table2?.[0] || null;
        this.insuranceInfo = this.patientData?.table1 || [];
        console.log('✅ Subscription triggered with MRNO in Header Component:', this.patientData);
        // Persist patient data
        this.secureStorage.setJson(this.STORAGE_KEYS.patientData, this.patientData);
          
        this.visible = true;
        }
      });
      this.patientBannerService.visitAppointments$.subscribe((data: any) => {
        console.log('✅ Subscription triggered with Visit Appointments in Alert Component:', data?.length);
        this.visitAppointments = data?.table?.[0];
        if (this.visitAppointments) {
          console.log('Visit Appointments',this.visitAppointments);          
          // Persist visit appointments payload
          this.secureStorage.setJson(this.STORAGE_KEYS.visitAppointments, data);
        }
      });
      // Persist selected visit whenever it changes
      this.patientBannerService.selectedVisit$.subscribe((sel: any) => {
        if (sel) {
          this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, sel);
        }
      });


    // this.patientBannerService.patientData$.subscribe(data => {
    //   this.patientData = data;
    //   if (this.patientData) {
    //     this.visible = true;
    //   }
    // });
  }



  async searchAppointment(mrNo: any, modalContent: any){

    this.ActiveAppoinment = null;

    if(!mrNo){
        this.loader.hide();
        if (this.modalRef) {
          this.modalRef.close();
        }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load appointments please load MRNO',
              });
              return;
    }

    this.patientBannerService.selectedVisit$.subscribe((data: any) => {
      console.log('✅ Subscription triggered with Visit Appointments in Alert Component:', data?.length);
      this.visitAppointments = data;
      if (this.visitAppointments) {
        console.log('Visit Appointments',this.visitAppointments);
        this.ActiveAppoinment = this.visitAppointments?.appointmentId; 
        // Persist currently selected visit
        this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, this.visitAppointments);
      }
    });


    this.patientBannerService.visitAppointments$.subscribe((data: any) => {
      console.log('✅ Subscription triggered with Visit Appointments in Alert Component:', data?.length);
      if (data) {
        this.AppoinmentData = data?.table;
        // this.ActiveAppoinment = this.visitAppointments?.appointmentId; 
        // Persist currently selected visit
        // this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, this.visitAppointments);
      }
    });
    
    
    // this.AppoinmentData = this.AppoinmentData = this.secureStorage.getItem(this.STORAGE_KEYS.visitAppointments);
    
    
    // const storedAllVisitAppts = this.secureStorage.getJson<any>(this.STORAGE_KEYS.visitAppointments);
    // if (storedAllVisitAppts?.table?.[0]) {
    //   this.AppoinmentData = storedAllVisitAppts?.table;
    //   console.log('Visit All Appointments',this.AppoinmentData);
    //  }

    this.modalRef = this.modalService.open(modalContent, { size: 'xl', backdrop: 'static' });
    // this.loader.show();
    // await this.demographicapi.GetAppointmentByMRNO(mrNo).subscribe((Response: any)=>{
    //   console.log("Load Visit new work =>", Response);
    //   if (Object.keys(Response).length > 0){
    //     this.AppoinmentData = Response?.table;
    //     // reset and build pagination
    //     this.currentPage = 1;
    //     this.updatePagination();
    //     // this.patientBannerService.setVisitAppointments(Response);
    //     // this.patientBannerService.setSelectedVisit(Response?.table[0]);
    //     this.loader.hide();
    //   } else{
    //     // this.patientBannerService.setVisitAppointments(null);
    //     // this.patientBannerService.setSelectedVisit(null);
    //     this.AppoinmentData = [];
    //     this.currentPage = 1;
    //     this.updatePagination();
    //     this.loader.hide();
    //   }
    // })
  }

  appointmentLoad(data: any){
    this.patientBannerService.setSelectedVisit(data);
    if (this.modalRef) {
    this.modalRef.close();
    }
    // Persist selected visit explicitly on selection
    if (data) {
      this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, data);
    }
  }
}
