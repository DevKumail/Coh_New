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
import { filter,distinctUntilChanged  } from 'rxjs/operators';
import { NgIconComponent } from '@ng-icons/core';
import { LoaderService } from '@core/services/loader.service';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import Swal from 'sweetalert2';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';


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
    constructor(
    private patientBannerService: PatientBannerService,
    private loader: LoaderService,
    private demographicapi: DemographicApiServices,
    private secureStorage: SecureStorageService,
  ) { }

  
  closeBanner() {
    this.visible = false;
    this.patientBannerService.setPatientData(null);
    // Clear stored state on close
    this.secureStorage.removeItem(this.STORAGE_KEYS.patientData);
    this.secureStorage.removeItem(this.STORAGE_KEYS.visitAppointments);
    this.secureStorage.removeItem(this.STORAGE_KEYS.selectedVisit);
  }

  ngOnInit(): void {
     // 1) Hydrate from secure storage (if available)
     this.GetAllVisit();
      
     const storedPatient = this.secureStorage.getJson<any>(this.STORAGE_KEYS.patientData);
     if (storedPatient?.table2?.[0]?.mrNo) {
       this.patientData = storedPatient;
       this.patientInfo = this.patientData?.table2?.[0] || null;
       this.insuranceInfo = this.patientData?.table1?.[0] || [];
       this.visible = true;
     }
    //  const storedLoadVisitAppts = this.secureStorage.getJson<any>(this.STORAGE_KEYS.selectedVisit);
    //  if (storedLoadVisitAppts) {
    //   this.visitAppointments = storedLoadVisitAppts;
    //  }

     // 2) Subscribe to live stream and persist
      this.patientBannerService.patientData$.subscribe((data: any) => {
        this.patientData = data;
        if (this.patientData) {
          this.visitAppointments = this.patientBannerService.getSelectedVisit()
          if (this.visitAppointments) {
              this.ActiveAppoinment = this.visitAppointments?.appointmentId; 
              this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, this.visitAppointments);
          }
          this.patientInfo = this.patientData?.table2?.[0] || null;
          this.insuranceInfo = this.patientData?.table1?.[0] || [];
          console.log('Patient Data:', this.patientInfo);
          console.log('Insurance Info:', this.insuranceInfo);
          // Persist patient data
          this.secureStorage.setJson(this.STORAGE_KEYS.patientData, this.patientData);
            
          this.visible = true;
          }
      });


      this.patientBannerService.selectedVisit$.subscribe((data: any) => {
        this.visitAppointments = data;
        if (this.visitAppointments) {
          console.log('banner Selected Visit Appointments ',this.visitAppointments);
          this.ActiveAppoinment = this.visitAppointments?.appointmentId; 
          this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, this.visitAppointments);
        }
      });




    // .subscribe((data: any) => {
    //   this.visitAppointments = data;
    //   if (this.visitAppointments) {
    //     console.log('banner Selected Visit Appointments ',this.visitAppointments);
    //   }
    // });

  }



  async searchAppointment(mrNo: any, modalContent: any){

     
    this.ActiveAppoinment = null;

    if(!mrNo){
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
        console.log('Selected Visit Appointments ',this.visitAppointments);
        this.ActiveAppoinment = this.visitAppointments?.appointmentId; 
        this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, this.visitAppointments);
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
    if (data) {
      this.secureStorage.setJson(this.STORAGE_KEYS.selectedVisit, data);
    }
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
       if(this.patientInfo?.mrNo){
         this.loader.show();
       await this.demographicapi.GetAppointmentByMRNO(this.patientInfo?.mrNo,this.AllVisitPaginationInfo.Page,this.AllVisitPaginationInfo.RowsPerPage).subscribe((Response: any)=>{
      console.log("All Visit =>", Response);
      if (Response?.table1?.length > 0){
        this.AppoinmentData = Response?.table1;
        this.AllVisitTotalItems = Response?.table2?.[0]?.totalRecords;
        this.loader.hide();
        this.secureStorage.removeItem(this.STORAGE_KEYS.visitAppointments);
        this.secureStorage.setJson(this.STORAGE_KEYS.visitAppointments, this.AppoinmentData);
      } else{
        this.AppoinmentData = [];
        this.loader.hide();
      } 
    })
    }
  }
      
}
