import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormArray,
} from '@angular/forms';
import { TemporaryPatientDemographicApiServices } from '@/app/shared/Services/TemporaryDempographics/temporarydemographic.api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { LucideAngularModule, LucideHome, LucideChevronRight, LucideUsers, LucideFilter, LucideFilterX, LucideUserPlus, LucideEdit, LucideTrash2 } from 'lucide-angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { LoaderService } from '@core/services/loader.service';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { HasPermissionDirective } from '@/app/shared/directives/has-permission.directive';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';

@Component({
  selector: 'app-temporary-patient-demographic-list',
  imports: [ CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        TranslatePipe,
        NgIconComponent,
        GenericPaginationComponent,
        LucideAngularModule,
      HasPermissionDirective],
  templateUrl: './temporary-patient-demographic-list.component.html',
  styleUrls: ['./temporary-patient-demographic-list.component.scss'],
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('250ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})

export class TemporaryPatientDemographicListComponent {
  pagedTemps: any[] = [];
  FilterData: any = {};
  TotalTempCount: any = 0;
  // lucide-angular icons for breadcrumb, heading and actions
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly headingIcon = LucideUserPlus;
  protected readonly filterIcon = LucideFilter;
  protected readonly filterOffIcon = LucideFilterX;
  protected readonly addIcon = LucideUserPlus;
  protected readonly editIcon = LucideEdit;
  protected readonly deleteIcon = LucideTrash2;

  pageSize = 10;
  currentPage = 1;
  totalRecord = 0;
  totalPages = 0;
  pageNumbers: number[] = [];
  start = 0;
  end = 0;
  isTempDemoFiltered : boolean = false;
  pageSizes = [5, 10, 25, 50];
  PaginationInfo: any = {
    RowsPerPage: 10,
    Page: 1,
  };

  filter = false;
  position = 'center';

  constructor(
    public router: Router,
    public TemporaryPatientDemographicApiServices: TemporaryPatientDemographicApiServices,
    public Loader : LoaderService,
    private secureStorage: SecureStorageService,

  ) {}

//   ngOnInit(): void {
//     this.getTempDemographics(this.FilterData);
//   }
  ngOnInit(): void {
    // Ensure UI pagination matches API pagination defaults
    this.pageSize = this.PaginationInfo.RowsPerPage;
    this.currentPage = this.PaginationInfo.Page;
    this.getTempDemographics(this.FilterData);
    //this.GetTempDemographicsByTempId(  );
  }

  ClickFilter() {
    this.filter = true;
  }

  submitFilter() {
    this.filter = false;
    // Build a clean filter object with only the allowed keys and provided values
    const clean: any = {};
    const tempId = this.FilterData?.tempId ?? this.FilterData?.TempId;
    const name = this.FilterData?.name ?? this.FilterData?.Name;
    let dob = this.FilterData?.dob ?? this.FilterData?.DOB ?? this.FilterData?.dOB;
    const gender = this.FilterData?.gender ?? this.FilterData?.Gender;

    if (tempId !== undefined && tempId !== null && String(tempId) !== '') clean.TempId = tempId;
    if (name !== undefined && name !== null && String(name).trim() !== '') clean.Name = String(name).trim();
    if (dob) {
      // Normalize date to yyyy-MM-DD expected by API
      dob = moment(dob).format('YYYY-MM-DD');
      clean.DOB = dob;
    }
    if (gender !== undefined && gender !== null && String(gender) !== '') clean.Gender = gender;

  // mark filter flag based on what's in the clean object
  this.isTempDemoFiltered = Object.keys(clean).length > 0;

  this.getTempDemographics(clean);
  }

  clearFilter() {
    // Reset filter model and reload with empty filter
    this.FilterData = {};
    this.currentPage = 1;
    this.PaginationInfo.Page = 1;
  this.isTempDemoFiltered = false;
  this.getTempDemographics({});
  }


  // Map gender code to human-readable label
  genderLabel(value: any): string {
    if (value === null || value === undefined || value === '') return 'N/A';

    // Accept strings like '0', '1', '2', 'M', 'F', 'O', and already text like 'Male'
    const str = String(value).trim().toLowerCase();
    if (str === '0' || str === 'm' || str === 'male') return 'Male';
    if (str === '1' || str === 'f' || str === 'female') return 'Female';
    if (str === '2' || str === 'o' || str === 'other') return 'Other';

    // Try numeric fallback
    const num = Number(value);
    if (!Number.isNaN(num)) {
      if (num === 0) return 'Male';
      if (num === 1) return 'Female';
      if (num === 2) return 'Other';
    }

    // If it's some other text, return as is
    return String(value);
  }

  buttonRoute(url: string) {
    this.router.navigate([url]);
  }



getTempDemographics(data: any) {
  this.Loader.show(); // Show loader at start

    this.isTempDemoFiltered = Object.values(data).some(
    (value) => value !== '' && value !== null && value !== undefined
  );

  // Build TempListReq with only allowed fields and omit empty values
  const tempReq: any = {};
  const tempId = data?.TempId ?? data?.tempId;
  const name = data?.Name ?? data?.name;
  const dob = data?.DOB ?? data?.dob ?? data?.dOB; // accept common variants
  const gender = data?.Gender ?? data?.gender;

  if (tempId !== undefined && tempId !== null && tempId !== '') tempReq.TempId = tempId;
  if (name !== undefined && name !== null && name !== '') tempReq.Name = name;
  if (dob !== undefined && dob !== null && dob !== '') tempReq.DOB = dob;
  if (gender !== undefined && gender !== null && gender !== '') tempReq.Gender = gender;

  // When all filters are empty, tempReq will be {} as required

  this.TemporaryPatientDemographicApiServices.getTempDemographics_pagination(tempReq, this.PaginationInfo)
    .then((res: any) => {
      if (res.table2) {
        // Keep the full API row object so downstream pages can use all fields
        this.pagedTemps = res.table2.map((item: any) => ({ ...item }));
        this.TotalTempCount = res.table1[0]?.totalCount || 0;

        this.totalRecord = res.table1[0]?.totalCount || 0;
        const rowsPerPage = this.PaginationInfo.RowsPerPage;
        this.totalPages = Math.ceil(this.totalRecord / rowsPerPage);
        this.start = (this.currentPage - 1) * rowsPerPage;
        this.end = this.start + rowsPerPage;
        this.pageNumbers = Array(this.totalPages)
          .fill(0)
          .map((_, i) => i + 1);
      }

      this.Loader.hide(); // Hide loader after data loaded
    })
    .catch((error: any) => {
      this.Loader.hide(); // Hide loader if error occurs

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch temporary demographics',
      });
    });
}



  editTemp(tempOrId: any) {
    debugger;
    const isObj = typeof tempOrId === 'object' && tempOrId !== null;
    const tempObj = isObj ? tempOrId : this.pagedTemps.find(t => t.tempId === tempOrId);
    const tempId = isObj ? tempOrId.tempId : tempOrId;

    // Store as a fallback in case user refreshes the edit page (obfuscated)
    if (tempId != null) this.secureStorage.setItem('tempEditId', String(tempId));

    // Navigate using Router state so the ID isn't visible in the URL, include full object for convenience
    this.router.navigate(['/registration/temporary-patient-demographics-create'], {
      state: { tempId, temp: tempObj },
    });
  }


Remove(Id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this record?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.TemporaryPatientDemographicApiServices.deleteTempdemographics(Id).then((response:any) => {
        if (response.success) {
          Swal.fire(
            'Deleted!',
            'Record has been successfully deleted.',
            'success'
          );
          this.getTempDemographics(this.FilterData);
        } else {
          Swal.fire(
            'Error!',
            'Something went wrong while deleting.',
            'error'
          );
        }
      });
    }
  });
}


onTEMPDEMOPageChanged(event: number) {
  this.PaginationInfo.Page = event;
  this.currentPage = event; 
  this.getTempDemographics(this.FilterData);
}


  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }
}
