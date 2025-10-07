import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LucideHome, LucideChevronRight, LucidePlus, LucideEdit, LucideIdCard as LucideIdCard } from 'lucide-angular';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { CoveragesApiService } from '@/app/shared/Services/Coverages/coverages.api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '@core/services/loader.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { NgIconComponent } from '@ng-icons/core';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';

@Component({
  selector: 'app-coverage-list',
  standalone: true,
  templateUrl: './coverage-list.component.html',
  styleUrls: ['./coverage-list.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    NgIconComponent,
    TranslatePipe,
    GenericPaginationComponent,
    FilledOnValueDirective
  ]
})

export class CoverageListComponent implements OnInit, OnDestroy {

  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly plusIcon = LucidePlus;
  protected readonly editIcon = LucideEdit;
  protected readonly headingIcon = LucideIdCard;



  SearchPatientData: any;
  coverages: any[] = [];
  pagedCoverages: any[] = [];
      loader: any

  currentPage: number = 1;
  pageSize: number = 1;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 25, 50];
  start: number = 0;
  end: number = 0;
  pageNumbers: number[] = [];

  patientSubscription: Subscription | undefined;

  constructor(
    private patientBannerService: PatientBannerService,
    private CoveragesApiService: CoveragesApiService,
    private registrationApiService: RegistrationApiService,
    private route: ActivatedRoute,
    public router: Router,
    public Loader : LoaderService,

  ) {}

  ngOnInit(): void {

    console.log('coverage start');
    

    this.patientSubscription = this.patientBannerService.patientData$
    .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
            prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
    )
      )
      .subscribe((data: any) => {
         this.SearchPatientData = data;
        this.GetCoverageData();
      });

      this.GetCoverageData();

      console.log('coverage end');

  }


coveragesarray: any[] = [];

GetCoverage(MrNo: string) {
  this.CoveragesApiService
    .GetCoverage(MrNo)
    .then((res: unknown) => {
      const coverages = res as CoverageResponse;
      if (coverages.table1) {
        let coveragesvararray = [];

        for (let i = 0; i < coverages.table1.length; i++) {
          coveragesvararray.push({
            type: coverages.table1[i].type,
            subscriberName: coverages.table1[i].subscriberName,
            payerName: coverages.table1[i].payerName,
            memberId: coverages.table1[i].memberId,
            plan: coverages.table1[i].plan,
            terminationDate: coverages.table1[i].terminationDate,
            careerAddress: coverages.table1[i].careerAddress,
            relationCode: coverages.table1[i].relationCode,
            priority: coverages.table1[i].priority,
          });
        }

        this.coveragesarray = coveragesvararray;
      }
    })
    .catch((error: any) =>
      Swal.fire('Error', error.message || 'Unknown error', 'error')
    );
}


paginationInfo = {
  Page: 1,
  RowsPerPage: 10
};
coverageTotalItems = 0;

GetCoverageData() {
  debugger
  if (!this.SearchPatientData?.table2[0]?.mrNo) {
    Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
    return;
  }

  this.Loader.show();

  // const paginationInfo = {
  //   page: this.coverageCurrentPage,
  //   RowsPerPage: this.coveragePageSize
  // };

  const coverageListReq = {
    mrno: this.SearchPatientData?.table2[0]?.mrNo || 0
  }

  this.CoveragesApiService.GetCoverageList(coverageListReq, this.paginationInfo)
    .then((res: any) => {
      this.pagedCoverages = res?.table1 || [];
      this.coverageTotalItems = res?.table2?.[0]?.totalCount || 0;
      this.Loader.hide();
    })
    .catch((error) => {
      this.Loader.hide();
      Swal.fire('Error', 'Failed to load coverage data.', 'error');
    });
}

 async onCoveragePageChanged(page: number) {
    this.paginationInfo.Page = page;
    this.GetCoverageData();
    }



// Map a row's current status value. Try multiple casings/properties to be resilient to backend variations.
getRowCoverageOrder(row: any): number | null {
  if (!row) return null;
  const val = row.coverageOrder ?? row.CoverageOrder ?? row.coverage_Status ?? row.priority ?? null;
  const num = typeof val === 'string' ? parseInt(val, 10) : val;
  return Number.isFinite(num) ? num : null;
}

// Persist inline status change
async onStatusChange(row: any, newValue: number | null) {
  if (!row) return;
  if (newValue === null || newValue === undefined) return;
  const oldValue = this.getRowCoverageOrder(row);
  // Optimistic update in UI
  if ('coverageOrder' in row) row.coverageOrder = newValue;
  else if ('CoverageOrder' in row) row.CoverageOrder = newValue;
  else row.coverageOrder = newValue;

  try {
    await this.CoveragesApiService.UpdateCoverageOrder({
      subscriberId: row.subscriberId ?? row.SubscriberId ?? row.subscribedId ?? row.SubscribedId,
      mrno: row.mrNo ?? row.MRNo ?? row.mrno ?? null,
      coverageOrder: newValue
    });
    Swal.fire({ icon: 'success', title: 'Updated', text: 'Status updated successfully.', timer: 1200, showConfirmButton: false });
  } catch (error: any) {
    // Revert UI on failure
    if ('coverageOrder' in row) row.coverageOrder = oldValue;
    else if ('CoverageOrder' in row) row.CoverageOrder = oldValue as any;
    Swal.fire('Error', error?.message || 'Failed to update status.', 'error');
  }
}

ngOnDestroy(): void {
  if (this.patientSubscription) {
    this.patientSubscription.unsubscribe();
  }
}

Remove($event: MouseEvent,arg1: any,arg2: string) {
Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this Coverage?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the API to delete the coverage
        // this.CoveragesApiService.RemoveCoverage(arg1, arg2).then(() => {
        //   Swal.fire('Deleted!', 'The coverage has been deleted.', 'success');
        //   this.GetCoverageData(); // Refresh the coverage list
        // }).catch((error) => {
        //   Swal.fire('Error', 'Failed to delete coverage.', 'error');
        // });
      }
    });
}


EditCoverage(subscriberId: number) {
  this.router.navigate(['registration/covrage-create'], {
    state: { subscriberId },
  });

}

get isRtl(): boolean {
  try {
    return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
  } catch {
    return false;
  }
}

}
  interface CoverageResponse {
  table1: {
    type: string;
    subscriberName: string;
    payerName: string;
    memberId: string;
    plan: string;
    terminationDate: string;
    careerAddress: string;
    relationCode: string;
    priority: number;
  }[];


  }

