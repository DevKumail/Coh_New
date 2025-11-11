import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemComponent } from '../../../clinical/problem/problem.component';
import { MedicalHistoryComponent } from '../../../clinical/medical-history/medical-history.component';
import { AllergiesComponent } from '../../../clinical/allergies/allergies.component';
import { VitalSignsComponent } from '../../../clinical/vital-signs/vital-signs.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { SummarySheetApiService } from '@/app/shared/Services/Summary-Sheet/summary-sheet.api.service';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { Router } from '@angular/router';
import { ClinicalApiService } from '@/app/views/clinical/clinical.api.service';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { ImmunizationsComponent } from '@/app/views/clinical/immunizations/immunizations.component';
import { MedicationComponent } from '@/app/views/clinical/medication/medication.component';
import { ProcedureComponent } from '@/app/views/clinical/procedure/procedure.component';
import { ClinicalNoteComponent } from '@/app/views/clinical/clinical-note/clinical-note.component';
import { FamilyHistoryComponent } from '@/app/views/clinical/family-history/family-history.component';
import { SocialHistoryComponent } from '@/app/views/clinical/social-history/social-history.component';
import { ChargeCaptureComponent } from '@/app/views/billing/charge-capture/charge-capture.component';

@Component({
  selector: 'app-content-section',
  imports: [
    CommonModule,
    ProblemComponent,
    MedicalHistoryComponent,
    AllergiesComponent,
    VitalSignsComponent,
    TranslatePipe,
    GenericPaginationComponent,
    MedicationComponent,
    ImmunizationsComponent,
    ProcedureComponent,
    ClinicalNoteComponent,
    FamilyHistoryComponent,
    SocialHistoryComponent,
    ChargeCaptureComponent
  ],
  templateUrl: './content-section.component.html',
  styleUrl: './content-section.component.scss'
})
export class ContentSectionComponent implements OnInit {
  @Input() selected: string = 'summary';

  constructor(
    private Service: SummarySheetApiService,
    private patientBannerService: PatientBannerService,
    private clinicalApiService: ClinicalApiService,    
    private router: Router
  ) { }

  ngOnInit(): void {
    this.patientBannerService.patientData$.subscribe((data: any) => {
      this.SearchPatientData = data;
      if (this.SearchPatientData?.table2?.[0]?.mrNo) {
        this.mrno = this.SearchPatientData?.table2?.[0]?.mrNo;
        this.GetAllList();
      } 
    });       
        this.GetAllList();
  }
  SearchPatientData: any;
  mrno: any

  // Loading states for each table
  isLoadingAlerts: boolean = false;
  isLoadingMedications: boolean = false;
  isLoadingAllergies: boolean = false;
  isLoadingMedicalHistory: boolean = false;
  isLoadingProblemList: boolean = false;
  isLoadingImmunization: boolean = false;
  isLoadingProcedure: boolean = false;
  isLoadingEncounters: boolean = false;

  Encounters: any[] = [
    {
      appDateTime: '2025-07-30 10:00 AM',
      purposeOfVisit: 'Follow-up',
      providerId: 'Dr. John Doe'
    },
    {
      appDateTime: '2025-07-29 02:00 PM',
      purposeOfVisit: 'Initial Visit',
      providerId: 'Dr. Jane Smith'
    },
    {
      appDateTime: '2025-07-29 02:00 PM',
      purposeOfVisit: 'Initial Visit',
      providerId: 'Dr. Jane Smith'
    },
    {
      appDateTime: '2025-07-29 02:00 PM',
      purposeOfVisit: 'Initial Visit',
      providerId: 'Dr. Jane Smith'
    }
  ];

  medicalHistory: any[] = [];
  MHPaginationInfo: any = {
    Page: 1,
    RowsPerPage: 3,
  }
  MHtotalRecord: number = 0;
  problemList: any[] = [];
  PLPaginationInfo: any = {
    Page: 1,
    RowsPerPage: 3,
  }
  PLtotalRecord: number = 0;

  GetAllList() {
    if (this.mrno == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'MR No is required Please Load Patient',
      })
      return;
    }
    this.searchAppointment()
    this.GetPatientAlertsData();
    this.GetAllCurrentPrescriptions();
    this.GetPatientAllergyData();
    this.GetMedHistoryList();
    this.GetProblemList();
    this.GetPatientImmunizationData();
    this.GetPatientProcedureData();
  }

  async GetMedHistoryList() {
  this.isLoadingMedicalHistory = true;
  const userIdStr = sessionStorage.getItem('userId');
  const userId = userIdStr ? Number(userIdStr) : 0; 
  await this.clinicalApiService.GetPatientProblemData(
    true,
    this.mrno,
    userId,
    this.MHPaginationInfo.Page,
    this.MHPaginationInfo.RowsPerPage
  ).then((res: any) => {
    this.medicalHistory = res.patientProblems?.table1 || [];
    this.MHtotalRecord = res.patientProblems?.table2?.[0]?.totalCount || 0;
  }).finally(() => {
    this.isLoadingMedicalHistory = false;
  });
    // await this.Service.GetMedHistoryList(this.mrno, this.MHPaginationInfo.Page, this.MHPaginationInfo.RowsPerPage
    // ).then((res: any) => {
    //   if (res?.data?.table1?.length > 0) {
    //     this.medicalHistory = res?.data?.table1 || [];
    //     this.MHtotalRecord = res?.data?.table2[0]?.totalCount || 0;
    //   } else {
    //     this.medicalHistory = [];
    //     this.MHtotalRecord = 0;
    //   }

    // })
  }

  async GetProblemList() {
  this.isLoadingProblemList = true;
  const userIdStr = sessionStorage.getItem('userId');
  const userId = userIdStr ? Number(userIdStr) : 0; 

      await this.clinicalApiService.GetPatientProblemData(
    false,
    this.mrno,
    userId,
    this.PLPaginationInfo.Page, 
    this.PLPaginationInfo.RowsPerPage
  ).then((res: any) => {
    this.problemList = res.patientProblems?.table1 || [];
    this.PLtotalRecord = res.patientProblems?.table2?.[0]?.totalCount || 0;
  }).finally(() => {
    this.isLoadingProblemList = false;
  });

    // await this.Service.GetPatientProblemList(this.mrno, this.PLPaginationInfo.Page, this.PLPaginationInfo.RowsPerPage
    // ).then((res: any) => {
    //   if (res?.data?.table1?.length > 0) {
    //     this.problemList = res?.data?.table1 || [];
    //     this.PLtotalRecord = res?.data?.table2[0]?.totalCount || 0;
    //   } else {
    //     this.problemList = [];
    //     this.PLtotalRecord = 0;
    //   }

    // })
  }

  onPLPageChanged(event: any) {
    this.PLPaginationInfo.Page = event;
    this.GetProblemList();
  }

  onMHPageChanged(event: any) {
    this.MHPaginationInfo.Page = event;
    this.GetMedHistoryList();
  }

Allergiepagegination : any = {
  currentPage: 1,
  pageSize: 3,
}
allergieTotalItems = 0;
MyAllergiesData: any = []
    async GetPatientAllergyData() {
      this.isLoadingAllergies = true;
      this.allergieTotalItems = 0;
       
      await this.clinicalApiService.GetPatientAllergyData(
        this.mrno, 
        this.Allergiepagegination.currentPage, 
        this.Allergiepagegination.pageSize )
        .then((res: any) => {
        this.MyAllergiesData = res.allergys?.table1 || [];
        this.allergieTotalItems = res.allergys?.table2[0]?.totalCount || 0;
      }).finally(() => {
        this.isLoadingAllergies = false;
      })  
    }

    async onallergiePageChanged(page: number) {
  this.Allergiepagegination.currentPage = page;
  await this.GetPatientAllergyData();
}

currentMedicationPaginationInfo: any = {
    Page: 1,
    RowsPerPage: 3,
}
currentMedicationTotalItems = 0;
currentMedicationData: any = [];
        GetAllCurrentPrescriptions() {
        this.isLoadingMedications = true;
        this.currentMedicationTotalItems = 0;
        this.clinicalApiService.GetAllCurrentPrescriptions(
          this.mrno,
          this.currentMedicationPaginationInfo.Page,
          this.currentMedicationPaginationInfo.RowsPerPage)
            .then((res: any) => {
                this.currentMedicationData = res?.prescription?.table1 || [];;
                this.currentMedicationTotalItems = res?.prescription?.table2?.[0]?.totalRecords || 0;
            })
            .catch((error: any) => {
            })
            .finally(() => {
                this.isLoadingMedications = false;
            });

    }
  onCurrentMedicationPageChanged(event: any) {
        this.currentMedicationPaginationInfo.Page = event;
        this.GetAllCurrentPrescriptions();
    }


    alertPaginationInfo: any = {
      Page: 1,
      RowsPerPage: 3,
    }
    alertTotalItems = 0;
    MyAlertsData: any = [];
  GetPatientAlertsData() {
    this.isLoadingAlerts = true;
    this.clinicalApiService.GetAlertDetailsDb(
      this.mrno,
      this.alertPaginationInfo.Page,
      this.alertPaginationInfo.RowsPerPage).then((res: any) => {
      this.MyAlertsData = res?.alert?.table1 || [];
      this.alertTotalItems = res?.alert?.table2[0]?.totalRecords || 0;
    
    }).catch((error: any) => {
      console.error("Failed to fetch alert data", error);
    }).finally(() => {
      this.isLoadingAlerts = false;
    });
  }

  onAlertPageChanged(event: any) {
    this.alertPaginationInfo.Page = event;
    this.GetPatientAlertsData();
  }

  immunizationList: any[] = [];

  immunizationPaginationInfo: any = {
    PageNumber: 1,
    PageSize: 3,
  }
  totalimmunizationCount: any = 0;
  GetPatientImmunizationData() {
    this.isLoadingImmunization = true;
    const status = -1;
    this.clinicalApiService.GetPatientImmunizationData(this.mrno, this.immunizationPaginationInfo.PageNumber, this.immunizationPaginationInfo.PageSize, status).then((res: any) => {
      this.immunizationList = res.patient?.table1 || [];
      this.totalimmunizationCount = res.patient?.table2?.[0]?.totalRecords || 0;
    }).finally(() => {
      this.isLoadingImmunization = false;
    });
  }

  onImmunizationPageChanged(event: any) {
    this.immunizationPaginationInfo.PageNumber = event;
    this.GetPatientImmunizationData();
  }

  procedureHistoryData: any = [];
  procedureTotalItems: any = 0;

  procedurePaginationInfo: any = {
    Page: 1,
    RowsPerPage: 2,
  }
      async GetPatientProcedureData() {
          this.isLoadingProcedure = true;
          this.procedureHistoryData = [];
          this.procedureTotalItems = 0;
  
          const status:any = -1;
          await this.clinicalApiService
              .GetPatientProceduresList(
                  status,
                  this.mrno,
                  this.procedurePaginationInfo.Page,
                  this.procedurePaginationInfo.RowsPerPage,
              )
              .then((res: any) => {
                  console.log('res', res);
                  this.procedureHistoryData = res.data?.table1 || [];
                  this.procedureTotalItems = res.data?.table2?.[0]?.totalRecords || 0;
              })
              .finally(() => {
                  this.isLoadingProcedure = false;
              });
      }
 async onProcedurePageChanged(page: number) {
        this.procedurePaginationInfo.Page = page;
        this.GetPatientProcedureData();
    }


      EncounterpaginationInfo: any={
    currentPage: 1,
    pageSize: 3,
  };
  EncounterData: any = [];
  EncounterTotalRecord: any ;

  searchAppointment(){
      this.isLoadingEncounters = true;
      this.clinicalApiService.GetAppointmentByMRNO(this.mrno,this.EncounterpaginationInfo.currentPage,this.EncounterpaginationInfo.pageSize).subscribe({
        next: (Response: any) => {
          console.log("topbar Load Visit =>", Response);
          if (Response?.table1?.length > 0){
            this.EncounterData = Response?.table1 || [];
            this.EncounterTotalRecord = Response?.table2?.[0]?.totalRecords || 0; 
          }
        },
        error: (error: any) => {
          console.error("Error fetching appointment data:", error);
        },
        complete: () => {
          this.isLoadingEncounters = false;
        }
      });
  }
  onEncounterPageChanged(event: any){
    this.EncounterpaginationInfo.currentPage = event;
    this.searchAppointment();
  }


}
