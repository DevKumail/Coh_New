import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
      this.sharedservice.getDropDownValuesByName(Page.IVFFertilityHistory).subscribe((res: any) => {
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
  }

  onCancel(){
    this.isCreateUpdate = false;
    this.showAdd = false;
  }
  onSave(){}

  onPageChanged(page: any){

  }

  openEditById(id: any){}
  delete(id: any){}

  GetAllFemaleMedicalHistory(){
    this.isLoadingHistory = true;
    this.patientBannerService.getIVFPatientData().subscribe((data: any) => {
          const ivfMainId = data?.couple?.ivfMainId?.IVFMainId ?? null;
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
          }else{
            this.isLoadingHistory = false;
          }
        });
  }
}
