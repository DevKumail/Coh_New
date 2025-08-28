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
    constructor(
    private patientBannerService: PatientBannerService,
    private loader: LoaderService,
    private demographicapi: DemographicApiServices
  ) { }
  // patientBannerService = inject(PatientBannerService)

  closeBanner() {
    this.visible = false;
    this.patientBannerService.setPatientData(null);
  }

  // get patientInfo() {
  //   return this.patientData?.table2?.[0] || null;
  // }

  // get insuranceInfo() {
  //   console.log('insuranceInfo');
  //   return this.patientData?.table1 || [];
  // }

  ngOnInit(): void {
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
          
        this.visible = true;
        }
      });
      this.patientBannerService.visitAppointments$.subscribe((data: any) => {
        console.log('✅ Subscription triggered with Visit Appointments in Alert Component:', data?.length);
        this.visitAppointments = data?.table?.[0];
        if (this.visitAppointments) {
          console.log('Visit Appointments',this.visitAppointments);          
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
      }
    });
    
    this.loader.show();
    await this.demographicapi.GetAppointmentByMRNO(mrNo).subscribe((Response: any)=>{
      console.log("Load Visit new work =>", Response);
      if (Object.keys(Response).length > 0){
        this.AppoinmentData = Response?.table;
        this.modalRef = this.modalService.open(modalContent, { size: 'xl', backdrop: 'static' });
        // this.patientBannerService.setVisitAppointments(Response);
        // this.patientBannerService.setSelectedVisit(Response?.table[0]);
        this.loader.hide();
      } else{
        // this.patientBannerService.setVisitAppointments(null);
        // this.patientBannerService.setSelectedVisit(null);
        this.loader.hide();
      }
    })
  }

  appointmentLoad(data: any){
    this.patientBannerService.setSelectedVisit(data);
    if (this.modalRef) {
    this.modalRef.close();
    }
  }
}
