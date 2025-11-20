import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconComponent } from '@ng-icons/core';
import { MedicalHistoryBasicComponent } from '../Tabs/female-medical-history-basic/medical-history-basic.component';
import { MedicalHistoryGeneralComponent } from '../Tabs/female-medical-history-general/medical-history-general.component';
import { MedicalHistoryGeneticsComponent } from '../Tabs/female-medical-history-genetics/medical-history-genetics.component';
import { LoaderService } from '@core/services/loader.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { Page } from '@/app/shared/enum/dropdown.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-female-medical-history-list',
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    NgIconComponent,
    GenericPaginationComponent,
    MedicalHistoryBasicComponent,
    MedicalHistoryGeneralComponent,
    MedicalHistoryGeneticsComponent,
    FilledOnValueDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './female-medical-history-list.component.html',
  styleUrl: './female-medical-history-list.component.scss'
})
export class FemaleMedicalHistoryListComponent {
  @ViewChild(MedicalHistoryBasicComponent) basicComponent!: MedicalHistoryBasicComponent;
  
  dropdowns: any = [];
  activeTabId: number = 1;
  cacheItems: string[] = ['Provider'];
  hrEmployees: any = [];
  AllDropdownValues: any = [];
  totalrecord = 0;
  PaginationInfo: any ={
      Page: 1,
      RowsPerPage: 10,
  };
  ListData: any = [];
  isLoadingHistory: boolean = false;
  showAdd: boolean = false;
  isCreateUpdate: boolean = false;
  currentIvfMainId: number | null = null;
  isEditMode: boolean = false;
  currentEditId: number = 0;

    constructor(
    private fb: FormBuilder,
    private ivfservice: IVFApiService,
    private patientBannerService: PatientBannerService,
    private sharedservice: SharedService,
    private loderService: LoaderService

  ) {}

  ngOnInit(): void {
    this.getAlldropdown();
    // Load list by default
    this.GetAllFemaleMedicalHistory();
  }


    // Store payload from service for dynamic labels/options
    getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
      this.dropdowns = payload || {};
    }
    getAlldropdown() {
      this.sharedservice.getDropDownValuesByName(Page.IVFFemaleFertilityHistory).subscribe((res: any) => {
        this.AllDropdownValues = res;
        this.getAllDropdown(res);
        console.log(this.AllDropdownValues);
      })
      this.FillCache();
    }
  
    FillCache() {
      this.sharedservice.getCacheItem({ entities: this.cacheItems }).subscribe((response: any) => {
        if (response.cache != null) {
          this.FillDropDown(response);
        }
      })
    }
    FillDropDown(response: any) {
      let jParse = JSON.parse(JSON.stringify(response)).cache;
      let provider = JSON.parse(jParse).Provider;
  
      if (provider) {
        provider = provider.map(
          (item: { EmployeeId: any; FullName: any }) => {
            return {
              name: item.FullName,
              providerId: item.EmployeeId,
            };
          },
        );
        this.hrEmployees = provider;
        try {
        } catch { }
      }
    }



  openAdd(){
    this.isCreateUpdate = true;
    this.showAdd = true;
    this.isEditMode = false;
    this.currentEditId = 0;
    // Reset form when adding new
    setTimeout(() => {
      if (this.basicComponent) {
        this.basicComponent.resetForm();
      }
    }, 100);
  }

  onCancel(){
    this.isCreateUpdate = false;
    this.showAdd = false;
    this.isEditMode = false;
    this.currentEditId = 0;
  }

  onSave(){
    if (!this.basicComponent) {
      Swal.fire('Error', 'Form component not found', 'error');
      return;
    }

    const formData = this.basicComponent.getFormData();
    
    // Get IVF Main ID from patient banner
    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      const ivfMainId = data?.couple?.ivfMainId?.IVFMainId ?? null;
      
      if (!ivfMainId) {
        Swal.fire('Error', 'IVF Main ID not found', 'error');
        return;
      }

      // Parse unprotected intercourse month/year
      let unprotectedYear = '';
      let unprotectedMonth = '';
      if (formData.unprotectedMonthYear) {
        const [year, month] = formData.unprotectedMonthYear.split('-');
        unprotectedYear = year;
        unprotectedMonth = month;
      }

      // Build payload according to API structure
      const payload = {
        ivfFemaleFHId: formData.ivfFemaleFHId || 0,
        ivfMainId: ivfMainId,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        providerId: formData.attendingClinician || 0,
        unprotectedIntercourseYear: unprotectedYear,
        unprotectedIntercourseMonth: unprotectedMonth,
        adiposityCategoryId: formData.adiposity || 0,
        generallyHealthyCategoryId: formData.generallyHealthy || 0,
        longTermMedication: formData.longTermMedication || '',
        chromosomeAnalysisCategoryId: formData.chromosomeAnalysis || 0,
        cftrcarrierCategoryId: formData.cftrCarrier || 0,
        patencyRightCategoryId: formData.patencyRight || 0,
        patencyLeftCategoryId: formData.patencyLeft || 0,
        fallopianTubeYear: formData.fallopianYear || '',
        prevOperativeTreatmentsCount: formData.previousOperative || 0,
        ovarianStimulationsCount: formData.ovarianStimulations || 0,
        ivfIcsiTreatmentsCount: formData.IVFandICSI || 0,
        hasAlternativePretreatments: formData.alternativePretreatments || false,
        comment: formData.editorContent || '',
        createdBy: 0,
        updatedBy: 0,
        impairmentFactors: (formData.sterilityFactors || []).map((factor: string) => ({
          impairmentFactor: factor
        })),
        prevIllnesses: (formData.previousIllnesses || []).map((illness: string) => ({
          prevIllness: illness
        }))
      };

      this.loderService.show();
      this.ivfservice.CreateUpdateFemaleFertilityHistory(payload).subscribe({
        next: (response: any) => {
          this.loderService.hide();
          Swal.fire('Success', 'Female fertility history saved successfully', 'success');
          this.onCancel();
          this.GetAllFemaleMedicalHistory();
        },
        error: (error: any) => {
          this.loderService.hide();
          Swal.fire('Error', error?.error?.message || 'Failed to save female fertility history', 'error');
        }
      });
    });
  }

  onPageChanged(page: any){
    this.PaginationInfo.Page = page;
    this.GetAllFemaleMedicalHistory();
  }

  openEditById(id: any){
    if (!id) return;
    
    this.loderService.show();
    this.ivfservice.GetFemaleFertilityHistoryById(id).subscribe({
      next: (response: any) => {
        this.loderService.hide();
        this.isCreateUpdate = true;
        this.showAdd = true;
        this.isEditMode = true;
        this.currentEditId = id;
        
        // Wait for component to be rendered
        setTimeout(() => {
          if (this.basicComponent && response) {
            this.basicComponent.populateForm(response);
          }
        }, 100);
      },
      error: (error: any) => {
        this.loderService.hide();
        Swal.fire('Error', error?.error?.message || 'Failed to load fertility history', 'error');
      }
    });
  }

  delete(id: any){
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this fertility history record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loderService.show();
        this.ivfservice.DeleteFemaleFertilityHistory(id).subscribe({
          next: () => {
            this.loderService.hide();
            Swal.fire('Deleted!', 'Fertility history has been deleted.', 'success');
            this.GetAllFemaleMedicalHistory();
          },
          error: (error: any) => {
            this.loderService.hide();
            Swal.fire('Error', error?.error?.message || 'Failed to delete fertility history', 'error');
          }
        });
      }
    });
  }

  GetAllFemaleMedicalHistory(){
    this.isLoadingHistory = true;
    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
      const ivfMainId = data?.couple?.ivfMainId?.IVFMainId ?? null;
      this.currentIvfMainId = ivfMainId;
      if(ivfMainId){
        this.ivfservice.GetAllFemaleMedicalHistory(ivfMainId, this.PaginationInfo.Page, this.PaginationInfo.RowsPerPage).subscribe({
          next: (res: any) => {
            this.isLoadingHistory = false;
            this.ListData = res.data;
            this.totalrecord = res.totalrecord;
          },
          error: () => {
            this.isLoadingHistory = false;
          }
        });
      } else {
        this.isLoadingHistory = false;
      }
    });
  }
}
