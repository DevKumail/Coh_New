import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { IconsModule } from '@/app/shared/icons.module';
import { DataStorageService } from '@/app/shared/data-storage.service';
import { SharedApiService } from '@/app/shared/shared.api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { NgIconComponent } from '@ng-icons/core';
import { LoaderService } from '@core/services/loader.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import Swal from 'sweetalert2';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { Router } from '@angular/router';
import { SecureStorageService } from '@core/services/secure-storage.service';


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
    TranslatePipe,
    GenericPaginationComponent
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
  isLoading: boolean = true;
  patientInfo: any = [];
  insuranceInfo: any = [];
  AppoinmentData: any = [];
  visitAppointments: any;
  ActiveAppoinment: any;
  modalService = new NgbModal();
  private modalRef!: NgbModalRef;   
    constructor(
    private patientBannerService: PatientBannerService,
    private loader: LoaderService,
    private demographicapi: DemographicApiServices,
        private router: Router
  ) { }


  closeBanner() {
    this.visible = false;
    this.patientBannerService.setPatientData(null);
  }

  ngOnInit(): void {
     console.log('🎬 PatientHeaderPanel: ngOnInit started');
     
     // Subscribe to loading state
     this.patientBannerService.isLoading$.subscribe((loading: boolean) => {
       this.isLoading = loading;
       console.log('Banner Loading State:', loading);
     });

     // Subscribe to live stream from RxDB-backed service
     this.patientBannerService.patientData$.subscribe((data: any) => {
       console.log('📡 Patient Data Observable Fired:', data ? 'Has Data' : 'Null');
       this.patientData = data;
       
       if (this.patientData) {
         console.log('✅ Processing patient data, MR:', this.patientData?.table2?.[0]?.mrNo);
         this.visitAppointments = this.patientBannerService.getSelectedVisit();
         if (this.visitAppointments) {
           this.ActiveAppoinment = this.visitAppointments?.appointmentId;
         }
         this.patientInfo = this.patientData?.table2?.[0] || null;
         this.insuranceInfo = this.patientData?.table1?.[0] || [];
         
         if (this.patientInfo?.mrNo) {
           this.GetAllVisit();
         }
          
         if(this.router.url == '/ivf/dashboard' ){
           this.visible = false;
         } else {
           this.visible = true;
           console.log('✅ Banner set to visible');
         }
       } else {
         // Only hide the banner if we're not loading (i.e., hydration is complete)
         // This prevents the banner from hiding during the initial data load
         if (!this.isLoading) {
           console.log('❌ No patient data, hiding banner');
           this.visible = false;
           this.patientInfo = null;
           this.insuranceInfo = [];
           this.visitAppointments = null;
           this.ActiveAppoinment = null;
         } else {
           console.log('⏳ Still loading, keeping current banner state');
         }
       }
     });

     this.patientBannerService.selectedVisit$.subscribe((data: any) => {
       this.visitAppointments = data;
       if (this.visitAppointments) {
         console.log('banner Selected Visit Appointments ', this.visitAppointments);
         this.ActiveAppoinment = this.visitAppointments?.appointmentId;
       }
     });


  this.patientBannerService.Isbanneropen$.subscribe((data: any) => {
   
    if(this.router.url == '/ivf/dashboard' ){
      this.visible = false;
    } else{
      this.visible = data;
    }
  })


    // .subscribe((data: any) => {
    //   this.visitAppointments = data;
    //   if (this.visitAppointments) {
    //     console.log('banner Selected Visit Appointments ',this.visitAppointments);
    //   }
    // });

  }






  async searchAppointment(mrNo: any, modalContent: any){


  this.ActiveAppoinment = null;

  if (!mrNo) {
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
  this.GetAllVisit();

    this.patientBannerService.selectedVisit$.subscribe((data: any) => {
      this.visitAppointments = data;
      if (this.visitAppointments) {
        console.log('Selected Visit Appointments ', this.visitAppointments);
        this.ActiveAppoinment = this.visitAppointments?.appointmentId;
      }
    });


  // this.patientBannerService.visitAppointments$.subscribe((data: any) => {
  //   if (data) {
  //     this.AppoinmentData = data?.table;
  //     console.log('All Visit Appointments ', this.AppoinmentData);
  //   }
  // });
  this.modalRef = this.modalService.open(modalContent, { size: 'xl', backdrop: 'static' });
}

appointmentLoad(data: any){
  this.patientBannerService.setSelectedVisit(data);
  if (this.modalRef) {
    this.modalRef.close();
    }
    // persisted via PatientBannerService
  }

       get isRtl(): boolean {
  try {
    return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
  } catch {
    return false;
  }
}


AllVisitPaginationInfo: any = {
  Page: 1,
  RowsPerPage: 10
};
AllVisitTotalItems = 0;
  
      async onAllVisitPageChanged(page: number) {
  this.AllVisitPaginationInfo.Page = page;
  await this.GetAllVisit();
}

     async GetAllVisit(){
  if (this.patientInfo?.mrNo) {
    this.loader.show();
    await this.demographicapi.GetAppointmentByMRNO(this.patientInfo?.mrNo, this.AllVisitPaginationInfo.Page, this.AllVisitPaginationInfo.RowsPerPage).subscribe({
      next: (Response: any) => {
        console.log("All Visit =>", Response);
        if (Response?.table1?.length > 0) {
          this.AppoinmentData = Response?.table1;
          this.AllVisitTotalItems = Response?.table2?.[0]?.totalRecords;
          this.patientBannerService.setVisitAppointments(this.AppoinmentData);
        } else {
          this.AppoinmentData = [];
        }
        this.loader.hide();
      },
      error: (err) => {
        console.error('GetAppointmentByMRNO failed', err);
        this.AppoinmentData = [];
        this.loader.hide();
      }
    })
  }
}


}
