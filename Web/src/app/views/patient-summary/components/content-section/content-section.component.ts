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
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { distinctUntilChanged, filter } from 'rxjs';
import { ClinicalNoteComponent } from '@/app/views/clinical/clinical-note/clinical-note.component';
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
    ClinicalNoteComponent
  ],
  templateUrl: './content-section.component.html',
  styleUrl: './content-section.component.scss'
})
export class ContentSectionComponent implements OnInit {
  @Input() selected: string = 'summary';

  constructor(
    private Service: SummarySheetApiService,
    private patientBannerService: PatientBannerService,
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
    }
  ];

  alerts: any[] = [
    {
      repeatDate: '2025-07-30 10:00 AM',
      alertType: 'Follow-up',
      alertMessage: 'Hypertension'
    },
    {
      repeatDate: '2025-07-29 02:00 PM',
      alertType: 'Initial Visit',
      alertMessage: 'Type 2 Diabetes'
    }
  ];

  medications: any[] = [
    {
      rxStartDate: '2025-07-30 10:00 AM',
      code: 'I10',
      providerId: 'Dr. John Doe',
      status: 'Active'
    },
    {
      rxStartDate: '2025-07-29 02:00 PM',
      code: 'E11',
      providerId: 'Dr. Jane Smith',
      status: 'Active'
    }, {
      rxStartDate: '2025-07-30 10:00 AM',
      code: 'I10',
      providerId: 'Dr. John Doe',
      status: 'Active'
    },
  ];

  allergies: any[] = [
    {
      type: 'Latex Allergy',
      allergen: 'test',
      providerId: 'Dr. John Doe',
      rxStartDate: '2025-07-30 10:00 AM',
      status: 'Active'
    },
    {
      type: 'Food Allergy',
      allergen: 'test',
      providerId: 'Dr. Jane Smith',
      rxStartDate: '2025-07-29 02:00 PM',
      status: 'Active'
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
    this.GetMedHistoryList();
    this.GetProblemList();
  }

  async GetMedHistoryList() {
    if (this.mrno == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'MR No is required',
      })
      return;
    }

    await this.Service.GetMedHistoryList(this.mrno, this.MHPaginationInfo.Page, this.MHPaginationInfo.RowsPerPage
    ).then((res: any) => {
      if (res?.data?.table1?.length > 0) {
        this.medicalHistory = res?.data?.table1 || [];
        this.MHtotalRecord = res?.data?.table2[0]?.totalCount || 0;
      } else {
        this.medicalHistory = [];
        this.MHtotalRecord = 0;
      }

    })
  }

  async GetProblemList() {
    if (this.mrno == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'MR No is required',
      })
      return;
    }

    await this.Service.GetPatientProblemList(this.mrno, this.PLPaginationInfo.Page, this.PLPaginationInfo.RowsPerPage
    ).then((res: any) => {
      if (res?.data?.table1?.length > 0) {
        this.problemList = res?.data?.table1 || [];
        this.PLtotalRecord = res?.data?.table2[0]?.totalCount || 0;
      } else {
        this.problemList = [];
        this.PLtotalRecord = 0;
      }

    })
  }

  onPLPageChanged(event: any) {
    this.PLPaginationInfo.Page = event.page;
    this.GetProblemList();
  }

  onMHPageChanged(event: any) {
    this.MHPaginationInfo.Page = event.page;
    this.GetMedHistoryList();
  }


  getProviderName(providerId: string): string {
    return providerId;
  }
}
