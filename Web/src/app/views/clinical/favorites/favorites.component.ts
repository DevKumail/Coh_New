import { ClinicalApiService } from './../clinical.api.service';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import Swal from 'sweetalert2';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { LoaderService } from '@core/services/loader.service';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    NgIconComponent, 
    FormsModule,
    TranslatePipe, 
    FilledOnValueDirective,
    GenericPaginationComponent ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',

})
export class FavoritesComponent implements OnInit {
  favoritesForm!: FormGroup;
  @Output() editRecord = new EventEmitter<any>();
  private patientDataSubscription!: Subscription;
  ICDVersions: any[] = [];
  SearchList: any[] = [];
  favoritesData: any = [];
  favoritesTotalItems: any = 0;
  searchTotalItems: number = 0;
  SearchPatientData:any;
  Mrno:any;
  currentUser:any;
  Searchby: any = [
    { code: 1, name: 'Diagnosis Code' }, 
    { code: 2, name: 'Diagnosis Code Range' }, 
    { code: 3, name: 'Description' }
  ];
  cacheItems: string[] = [
    'BLICDVersion',
  ];

    PaginationInfo: any = {
      Page: 1,
      RowsPerPage: 5
    };
    favPaginationInfo: any = {
      Page: 1,
      RowsPerPage: 5
    };

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private clinicalApiService: ClinicalApiService, 
      private loader: LoaderService,
      private PatientData: PatientBannerService,
    ) {}

  async ngOnInit() {
    this.currentUser = sessionStorage.getItem('userId') || 0;
     this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) => 
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )).subscribe((data: any) => {
        this.SearchPatientData = data;
        this.Mrno = this.SearchPatientData?.table2?.[0]?.mrNo || '';
        this.getFAVORITELIST(this.Mrno,this.currentUser)
      });

    this.favoritesForm = this.fb.group({
      icdVersionId: ['2'],
      searchById: ['1'],
      startingCode: [''],
      endingCode: [''],
      description: ['']
    });

    await this.FillCache();
    await this.getFAVORITELIST(this.Mrno,this.currentUser)
  }
  async FillCache() {
    await this.clinicalApiService.getCacheItems({ entities: this.cacheItems }).then((response: any) => {
      if (response.cache != null) {
        this.FillDropDown(response);
      }
    })
  }
  FillDropDown(response: any) {
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let iCDVersion = JSON.parse(jParse).BLICDVersion;

    if (iCDVersion) {
      iCDVersion = iCDVersion.map(
        (item: { ICDVersionId: any; ICDVersion: any }) => {
          return {
            name: item.ICDVersion,
            code: item.ICDVersionId,
          };
        });
      const item = {
        name: 'ALL',
        code: 0,
      };
      iCDVersion.push(item);
      this.ICDVersions = iCDVersion;
      console.log(this.ICDVersions);
    }
  }
  async onSearch() {
    this.loader.show();
    const ICDVersionId = this.favoritesForm.value.icdVersionId || 0;
    const DiagnosisStartCode = this.favoritesForm.value.startingCode || '';
    const DiagnosisEndCode = this.favoritesForm.value.endingCode || '';
    const DescriptionFilter = this.favoritesForm.value.description || '';
    const PageNumber = this.PaginationInfo.Page || 1; 
    const PageSize = this.PaginationInfo.RowsPerPage || 5;

    await this.clinicalApiService.DiagnosisCodebyProvider(ICDVersionId, PageNumber, PageSize, DiagnosisStartCode, DiagnosisEndCode, DescriptionFilter).then((response: any) => {
      this.SearchList = response?.table1 || [];
      this.searchTotalItems = response?.table2[0]?.totalRecords || 0;
      console.log(this.SearchList, 'this.SearchList');
      this.loader.hide();
    })
    this.loader.hide();
  }
  async onsearchlistPageChanged(page: number) {
    this.PaginationInfo.Page = page;
    await this.onSearch();
  }
  async onClear(){
    this.favoritesForm.patchValue({
      icdVersionId: '',
      searchById: '1',
      startingCode: '',
      endingCode: '',
      description: ''
    });
    this.PaginationInfo.Page = 1;
    this.PaginationInfo.RowsPerPage = 5;
    await this.onSearch();
  }

  async getFAVORITELIST(mrno:any = this.Mrno,currentUser:any = 0){
    this.loader.show();
    const PageNumber = this.favPaginationInfo?.Page || 1;
    const PageSize = this.favPaginationInfo?.RowsPerPage || 5;
    await this.clinicalApiService.GetRowDataOfPatientProblem(true,mrno,currentUser,PageNumber,PageSize)
      .then((response: any) => {
        this.favoritesData = response?.patientProblems?.table1 || [];
        this.favoritesTotalItems = response?.patientProblems?.table2?.[0]?.totalRecords || 0;
        console.log(this.favoritesData, 'favoritesData');
      })
      .finally(() => this.loader.hide());
  }

  onEdit(record: any) {
    this.editRecord.emit(record);
  }

  async onfavPageChanged(page: number) {
    this.favPaginationInfo.Page = page;
    await this.getFAVORITELIST(this.Mrno,this.currentUser)
  }

      onDelete(id: any){
  
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader.show();
        this.clinicalApiService.DeletePatientProblem(id).then((response: any) => {
          this.getFAVORITELIST();
      Swal.fire({
        icon: 'success',
        title: 'Deleted Successfully',
      })  
      this.loader.hide();
  
      })      
    } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your record is safe :)',
            'error'
          );
        }
      })
  
      this.loader.hide();
      }
  
}
