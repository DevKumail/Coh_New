import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { NgIcon } from '@ng-icons/core';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { ClinicalApiService } from '../clinical.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import Swal from 'sweetalert2';
import { tablerArrowWaveLeftDown } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-family-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    NgIcon,
    FilledOnValueDirective,
    GenericPaginationComponent,
    NgbModalModule
  ],
  templateUrl: './family-history.component.html',
  styleUrls: ['./family-history.component.scss']
})
export class FamilyHistoryComponent {
  @Input() clinicalnote: boolean = false;
  FamilyForm!: FormGroup;
  pagegination: any = {
    currentPage: 1,
    pageSize: 5,
  }
  FamilyHistoryTotalItems: number = 0;
  isSubmitting: boolean = false;
  private patientDataSubscription: Subscription | undefined;
  SelectedVisit: any;
  SearchPatientData: any;
  id: any;
  RelationshipData: any = [];
  GetFamilyHistory: any = [];
  cacheItems: string[] = [
    'RegRelationShip'
  ];
  FamilyHistoryList: any = [];
  constructor(
    private fb: FormBuilder,
    private ClinicalApiService: ClinicalApiService,
    private PatientData: PatientBannerService,
    private modalService: NgbModal,
  ) { }

  // Custom validator: only null is invalid (0 is allowed)
  private notNullValidator(control: import('@angular/forms').AbstractControl) {
    return control.value === null ? { required: true } : null;
  }

  ngOnInit(): void {
    this.GetFamilyProblemHistory();
    this.FillCache()

    this.FamilyForm = this.fb.group({
      Problem: [null, Validators.required],
      Relationship: [null, [this.notNullValidator.bind(this)]],
    })

    this.patientDataSubscription = this.PatientData.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        console.log(' Subscription triggered with MRNO:', data?.table2?.[0]?.mrNo);
        this.SearchPatientData = data;
        this.pagegination.currentPage = 1;
        this.getFamilyHistoryData();
      });

    this.PatientData.selectedVisit$.subscribe((data: any) => {
      this.SelectedVisit = data;
    });

    this.getFamilyHistoryData();
  }



  async FillCache() {

    await this.ClinicalApiService.getCacheItem({ entities: this.cacheItems }).then((response: any) => {
      if (response.cache != null) {
        this.FillDropDown(response);
      }
    })
      .catch((error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong!',
          confirmButtonColor: '#d33'
        })
      })
  }
  FillDropDown(response: any) {
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let relationships = JSON.parse(jParse).RegRelationShip;

    if (relationships) {
      relationships = relationships.map(
        (item: { RelationshipId: any; Relationship: any }) => {
          return {
            name: item.Relationship,
            code: item.RelationshipId,
          };
        }
      );
      this.RelationshipData = relationships;
    }
  }


  submit() {
   if(this.FamilyForm.invalid){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please fill all the required fields',
      confirmButtonColor: '#d33'
    })
    return
   }
        const uid = sessionStorage.getItem('userId');

    const data: any = {
      fhid: this.id || 0,
      mrno: this.SearchPatientData?.table2?.[0]?.mrNo,
      fhitem: this.FamilyForm.value.Problem,
      relationShipId: this.FamilyForm.value.Relationship,
      createdBy: uid,
      updatedBy: uid,
      active: 1,
      AppointmentId: this.SelectedVisit?.appointmentId || 0
    }

    this.ClinicalApiService.CreateFamilyHistory(data).then((list: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Family History Successfully Created',
        confirmButtonColor: '#d33'
      })
      this.getFamilyHistoryData();
      this.id = 0;
      this.resetForm();
      return
    }).catch((error: any) => Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong!',
      confirmButtonColor: '#d33'
    }));
  }

  GetFamilyProblemHistory() {
    this.ClinicalApiService.GetFamilyProblemHistory().then((res: any) => {
      this.GetFamilyHistory = res.result
    })
  }

  resetForm(){
    this.FamilyForm.reset();
    this.pagegination.currentPage = 1;
    this.getFamilyHistoryData();
  }

  getFamilyHistoryData(){
    this.ClinicalApiService.GetAllFamilyHistory(this.SearchPatientData?.table2?.[0]?.mrNo, this.pagegination.currentPage, this.pagegination.pageSize).then((res: any) => {
      this.FamilyHistoryList = res?.table1 || [];
      this.FamilyHistoryTotalItems = res?.table2?.[0]?.totalRecords || 0;
    })
  }

  onFamilyHistoryPageChanged(page: number){
    this.pagegination.currentPage = page;
    this.getFamilyHistoryData();
  }

  deleteSocialHistory(id: any){
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be to Delete this!",
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ClinicalApiService.DeleteFamilyHistoryByFHID(id).then((res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Family History Successfully Deleted',
        confirmButtonColor: '#d33'
      })
      this.getFamilyHistoryData();
      this.pagegination.currentPage = 1;
      return
    }).catch((error: any) => Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong!',
      confirmButtonColor: '#d33'
    }));
  }
})
}

  openAddModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  editFamilyHistory(data: any){
    this.id = data.fhid;
    this.FamilyForm.patchValue({
      Problem: data.fhItem,
      Relationship: data.relationShipId,
    })
  }
}
