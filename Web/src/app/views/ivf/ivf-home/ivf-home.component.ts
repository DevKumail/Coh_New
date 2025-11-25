import { Component, OnDestroy, OnInit, AfterViewInit, inject, TemplateRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { IvfSearchService } from '@/app/shared/Services/IVF/ivf-search.service';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CycleAddUpdateComponent } from './dashboard-cycle/cycle-add-update/cycle-add-update.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-ivf-home',
  templateUrl: './ivf-home.component.html',
  styleUrls: ['./ivf-home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    GenericPaginationComponent,
    TranslatePipe, 
    NgIcon,
  FilledOnValueDirective]
})
export class IVFHomeComponent {
  form: FormGroup;
  SearchPatientForm: FormGroup;
  couple: { female?: any; male?: any } | null = null;
  private noCoupleAlertShown = false;
  PatientList: any = [];
  PrimaryPatientData: any = [];
  isLoading = false;
  modalRefInstance: any;
  modalService = new NgbModal();
  selectedTab: 'messages' | 'lab' | 'consents' | 'application' = 'messages';
  overview: Array<{
    woman: string;
    no: string | number;
    start: string;
    eggTreatment: string;
    partner: string;
    sperm: string;
    stimulation: string;
    stimProt: string;
    stimMed: string;
    triggering: string;
    trigMed: string;
    cycle: string;
  }> = [];
  pagination: any = {
        pageSize: 10,
        currentPage: 1,
      };
   PatientListPaginationInfo: any = {
        pageSize: 5,
        currentPage: 1,
      };
      PatientListTotalrecord: any = 0;
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private patientBannerService : PatientBannerService,
    private ivfApi: IVFApiService
  ) {
    this.SearchPatientForm = this.fb.group({
      mrNo: [''],
      name: [''],
      phone: [''],
      emiratesId: [''],
    });
    this.form = this.fb.group({
      femaleId: [''],
    });
  }
  ngOnInit() {      
      this.patientBannerService.setIsbanneropen(false);
    this.patientBannerService.patientData$.subscribe((data: any) => {
        this.PrimaryPatientData = data;
        this.getgetCoupleData();
        this.handleCoupleResponse(data);
      });
      // this.getgetCoupleData();



    //   this.patientBannerService.getPatientData().subscribe((pd: any) => {
    //     const mrNo = pd?.table2?.[0]?.mrNo;
    //     debugger
    //     if (!mrNo) return;
    //     this.PrimaryPatientData = pd?.table2?.[0] || []; 
    //     console.log('IVF Home initialized', this.PrimaryPatientData);
    //     this.ivfApi.getCoupleData(String(mrNo)).subscribe({
    //       next: (res: any) => {
    //         this.handleCoupleResponse(res);
    //       try { 
    //        } catch {}
    //     },
    //     error: (err: any) => {
    //       console.error('Failed to fetch IVF couple data (init)', err);
    //     }
    //   });
    // });
  }

  // subscribe to IVF search events published by topbar
  private ivfSearch = inject(IvfSearchService);
  private ivfSearchSub: any;

  ngAfterViewInit() {
    this.getgetCoupleData();
  }


  getgetCoupleData(){
    debugger
    const mrNo = this.PrimaryPatientData?.table2?.[0]?.mrNo;
    if (!mrNo) return;
    this.ivfApi.getCoupleData(mrNo).subscribe({
        next: (res: any) => {
          console.log('IVF couple data (from ivf-home):', res);
          this.handleCoupleResponse(res);
        },
        error: (err: any) => {
          console.error('Failed to fetch IVF couple data', err);
        }
      });
  }

  ngOnDestroy(): void {

    this.patientBannerService.setIsbanneropen(true);
    // if (this.ivfSearchSub) {
    //   this.ivfSearchSub.unsubscribe();
    // }
  }

  viewSummary(side: 'female' | 'male') {
    // placeholder: wire to summary view when available
    this.router.navigate([`/ivf/patient-summary`], { queryParams: { id: side === 'female' ? this.form.value.femaleId : this.form.value.maleId } });
    console.log('View summary clicked for', side, 'ID:', side === 'female' ? this.form.value.femaleId : this.form.value.maleId);
  }

  private handleCoupleResponse(res: any) {
    debugger
    this.patientBannerService.setIVFPatientData(null);
    this.couple = res?.couple ?? res ?? null;
    try {
      const hasFemale = !!this.couple?.female;
      const hasMale = !!this.couple?.male;
      if (!hasFemale && !hasMale && !this.noCoupleAlertShown) {
        this.noCoupleAlertShown = true;
        this.patientBannerService.setIVFPatientData(null);
        // Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      }
      if (hasFemale || hasMale) {
        this.noCoupleAlertShown = false;
        this.patientBannerService.setIVFPatientData(null);
        this.patientBannerService.setIVFPatientData(res);
        // Load overview cycles once we have couple/mainId
        this.loadOverviewCycles();
      } else if(hasFemale && hasMale){
        this.patientBannerService.setIVFPatientData(null);
        this.patientBannerService.setIVFPatientData(res);
      }
    } catch {}
  }

  private resolveIvfMainId(): number | null {
    const idFromCouple = (this.couple as any)?.couple?.ivfMainId?.IVFMainId
      ?? (this.couple as any)?.ivfMainId?.IVFMainId
      ?? (this.couple as any)?.ivfMainId
      ?? (this.PrimaryPatientData as any)?.couple?.ivfMainId?.IVFMainId
      ?? (this.PrimaryPatientData as any)?.ivfMainId?.IVFMainId
      ?? (this.PrimaryPatientData as any)?.ivfMainId;
    const n = Number(idFromCouple);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  loadOverviewCycles(page: number = 1, rowsPerPage: number = 10) {
    const mainId = this.resolveIvfMainId();
    if (!mainId) {
      this.overview = [];
      return;
    }
    this.ivfApi.GetAllIVFDashboardTreatmentCycle(mainId, page, rowsPerPage).subscribe({
      next: (res: any) => {
        const data = res?.data || res || [];
        this.overview = (Array.isArray(data) ? data : []).map((x: any) => ({
          woman: x?.womanName ?? this.couple?.female?.name ?? '-',
          no: x?.cycleNo ?? x?.no ?? '-',
          start: x?.startDate ? new Date(x.startDate).toLocaleDateString() : (x?.start ?? '-'),
          eggTreatment: x?.eggTreatment ?? '-',
          partner: x?.partnerName ?? this.couple?.male?.name ?? '-',
          sperm: x?.sperm ?? '-',
          stimulation: x?.stimulation ?? '-',
          stimProt: x?.stimProtocol ?? '-',
          stimMed: x?.stimMedication ?? '-',
          triggering: x?.triggering ?? '-',
          trigMed: x?.triggerMedication ?? '-',
          cycle: x?.cycle ?? '-',
        }));
      },
      error: (err: any) => {
        console.error('Failed to fetch overview cycles', err);
        this.overview = [];
      }
    });
  }


  async openLinkaPatient(modalRef: TemplateRef<any>) {



      this.modalRefInstance = this.modalService.open(modalRef, {
      backdrop: 'static',
      size: 'xl',
      centered: true
    });
    this.modalRefInstance.result.then((result: any) => {
      if (result) {
        console.log('Modal returned:', result);
      }
    }).catch(() => {
      // Modal dismissed without selecting
      console.log('Modal dismissed');
    });
  }

   onRowSelect(SelactData: any, modal: any) {
     
    console.log("SELECTED DATA",SelactData)
    this.form.patchValue({ femaleId: SelactData?.name });

    if(!this.PrimaryPatientData?.table2?.[0]?.mrNo){
      Swal.fire('Validation Error', 'Primary Patient MrNo is a required field. Please load a patient.', 'warning');
      return;
    } else if(!SelactData?.mrNo){
      Swal.fire('Validation Error', 'Secondary Patient MrNo is a required field. Please Link a patient.', 'warning');
      return;
    }
    
    const body : any = {
      primaryMrNo: this.PrimaryPatientData?.table2?.[0]?.mrNo,
      secondaryMrNo: SelactData?.mrNo,
    }
    
    this.ivfApi.InsertPatientRelation(body).subscribe({
      next: (res: any) => {
        Swal.fire('Success', 'Patient Link Successfully', 'success');
        this.getgetCoupleData();
      try { 
       } catch {}
    },
    error: (err: any) => {
      console.error('Failed to fetch IVF couple data', err);
    }
  });
    
    modal.close(SelactData); 
  }

  SearchPatient(){
    debugger
    this.isLoading = true;
    this.PatientListPaginationInfo.currentPage = 1;
    this.PatientList = [];
    const body: any = {
      gender: this.PrimaryPatientData?.table2?.[0]?.gender || 'Unknown',
      mrno: this.SearchPatientForm.value.mrNo,
      phone: this.SearchPatientForm.value.phone,
      emiratesId: this.SearchPatientForm.value.emiratesId,
      name: this.SearchPatientForm.value.name
    }
    this.ivfApi.GetOppositeGenderPatients(body,this.PatientListPaginationInfo.currentPage,this.PatientListPaginationInfo.pageSize).subscribe({
      next: (res: any) => {
        this.PatientList = res?.data || [];
        this.PatientListTotalrecord = res?.total || 0;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch IVF couple data', err);
        this.isLoading = false;
      }
    })
  }

  onPatientPageChanged(event: any) {
    this.PatientListPaginationInfo.currentPage = event;
    this.SearchPatient();
  }

  openAddCycle() {
    this.modalRefInstance = this.modalService.open(CycleAddUpdateComponent, {
      backdrop: 'static',
      size: 'xl',
      centered: true,
      scrollable: true
    });
    this.modalRefInstance.result.then((result: any) => {
      // handle post-save actions if needed
    }).catch(() => {});
  }
}
