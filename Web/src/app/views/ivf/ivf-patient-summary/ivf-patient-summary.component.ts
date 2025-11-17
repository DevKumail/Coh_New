import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { IvfSideMenuComponent } from './ivf-side-menu/ivf-side-menu.component';
import { IvfPsDemographicComponent } from './sections/demographic/ivf-ps-demographic.component';
import { IvfPsMedicalHistoryComponent } from './sections/medical-history/ivf-ps-medical-history.component';
import { IvfPsPathologyResultsComponent } from './sections/lab-diagnostics/ivf-ps-pathology-results.component';
import { IvfPsLabOrdersComponent } from './sections/lab-diagnostics/ivf-ps-lab-orders.component';
import { IvfPsSemenAnalysisComponent } from './sections/lab-diagnostics/ivf-ps-semen-analysis.component';
import { SemenListComponent } from './sections/semen/semen-list/semen-list.component';
import { IvfPsBillingComponent } from './sections/billing/ivf-ps-billing.component';
import { IvfPsMessageComponent } from './sections/message/ivf-ps-message.component';
import { IvfPsCycleComponent } from './sections/cycle/ivf-ps-cycle.component';
import { IvfPsSwitchPartnerComponent } from './sections/switch-partner/ivf-ps-switch-partner.component';
import { AdvanceSearchModalComponent } from '@/app/layouts/components/topbar/components/advance-search-modal/advance-search-modal.component';
import { ModalTriggerService } from '@core/services/modal-trigger.service';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { LoaderService } from '@core/services/loader.service';
import { SocialHistoryComponent } from '../../clinical/social-history/social-history.component';
import { FamilyHistoryComponent } from '../../clinical/family-history/family-history.component';
import { log } from 'node:console';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';

@Component({
  selector: 'app-ivf-patient-summary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIcon,
    IvfSideMenuComponent,
    IvfPsDemographicComponent,
    IvfPsMedicalHistoryComponent,
    IvfPsPathologyResultsComponent,
    IvfPsLabOrdersComponent,
    SemenListComponent,
    IvfPsBillingComponent,
    IvfPsMessageComponent,
    IvfPsCycleComponent,
    IvfPsSwitchPartnerComponent,
    AdvanceSearchModalComponent,
    SocialHistoryComponent,
    FamilyHistoryComponent
  ],
  templateUrl: './ivf-patient-summary.component.html',
  styleUrls: ['./ivf-patient-summary.component.scss']
})
export class IvfPatientSummaryComponent implements OnInit {
  leftCollapsed = false;
  selectedId: string = 'demographic';
  offset = 120; // px: used in CSS var --patient-summary-offset
  isCoupleLink: boolean = false;
  isivfstart: boolean = false;
  PrimaryPatientData: any = [];
  PrimaryPatientDataAppId: any;
  SecondaryPatientData: any;
  patientBannerService = inject(PatientBannerService);
  router = inject(Router);
  modalTrigger = inject(ModalTriggerService);
  demographicapi = inject(DemographicApiServices);
  loader = inject(LoaderService);
  ivfapi = inject(IVFApiService);

  ngOnInit(): void {
    // Auto-open Advanced Filter modal when no patient is loaded

    this.patientBannerService.patientData$.subscribe(data => {
      if (!data) {
        this.modalTrigger.openModal('advance-filter-modal', 'ivf-patient-summary');
      } else {
        this.PrimaryPatientData = data.table2[0] || [];
        this.patientBannerService.selectedVisit$.subscribe((visit: any) => {
          if (visit) {
            this.PrimaryPatientDataAppId = visit.appointmentId;
          }
        });


      }
    });

    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      console.log("IVF Patient Data", data)
      if (data) {
        this.SecondaryPatientData = data?.couple || [];
        if (data?.couple?.female && data?.couple?.male) {
          this.isCoupleLink = true;
          this.isivfstart = data?.couple?.isIVFmain || false;
        }
      }
    });



  }

  toggleLeft(): void {
    this.leftCollapsed = !this.leftCollapsed;
  }


  onSelect(id: string): void {
    this.selectedId = id;
  }

  GotoDashboard() {
    this.router.navigate(['/ivf/dashboard']);
  }

  StartIvf() {
    this.isivfstart = true;

    const primaryMrNo = Number(this?.PrimaryPatientData?.mrNo);

    // Collect secondary MR numbers
    const secondaryMrs = [
      Number(this.SecondaryPatientData.female.mrNo),
      Number(this.SecondaryPatientData.male.mrNo)
    ];

    // Filter ONLY unmatched MR
    const unmatchedMr = secondaryMrs.filter(mr => mr !== primaryMrNo);

    const body: any = {
      primaryMrNo: primaryMrNo,
      secondaryMrNo: unmatchedMr[0] || '',
      appId: this.PrimaryPatientDataAppId || '',
      primaryIsMale: this?.PrimaryPatientData?.gender === 'Male' || false,
    };

    console.log(body);

    this.ivfapi.GenerateIVFMain(body).subscribe({
      next: (res: any) => {
        this.isivfstart = true;
        console.log("IVF Patient Data", res)
      },
      error: (err: any) => {
        console.error('Failed to update IVF patient data (init)', err);
      }
    });
  }

  async onPatientPicked(ev: { mrno: string, context?: string }) {
    const mrNo = ev?.mrno;
    if (!mrNo) return;
    // Load patient data and visits same as topbar behavior
    this.loader.show();
    this.demographicapi.getPatientByMrNo(mrNo).subscribe({
      next: (res: any) => {
        if (res?.table2?.length > 0) {
          this.patientBannerService.setPatientData(res);
          // After patient data, load appointments/visits
          this.loadAppointments(mrNo);
        } else {
          this.patientBannerService.setPatientData(null);
          this.loader.hide();
        }
      },
      error: () => {
        this.patientBannerService.setPatientData(null);
        this.loader.hide();
      }
    });
  }

  private loadAppointments(mrNo: string) {
    const paginationInfo: any = { currentPage: 1, pageSize: 10 };
    this.demographicapi.GetAppointmentByMRNO(mrNo, paginationInfo.currentPage, paginationInfo.pageSize)
      .subscribe((Response: any) => {
        if (Response?.table1?.length > 0) {
          this.patientBannerService.setVisitAppointments(Response?.table1);
          this.patientBannerService.setSelectedVisit(Response?.table1[0]);
        } else {
          this.patientBannerService.setVisitAppointments(null);
          this.patientBannerService.setSelectedVisit(null);
        }
        this.loader.hide();
      });
  }
}
