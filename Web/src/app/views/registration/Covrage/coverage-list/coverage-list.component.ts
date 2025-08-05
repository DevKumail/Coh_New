import { RegistrationApiService } from '@/app/shared/Services/Registration/registration.api.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { PageTitleComponent} from '@app/components/page-title.component';
import { UiCardComponent} from '@app/components/ui-card.component';
import { NgIcon} from '@ng-icons/core';
import { NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { CoveragesApiService } from '@/app/shared/Services/Coverages/coverages.api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-coverage-list',
  standalone: true,
  templateUrl: './coverage-list.component.html',
  styleUrl: './coverage-list.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgIconComponent,
  ]
})


// export class CoverageListComponent implements OnInit, OnDestroy {
//   SearchPatientData: any;
//   coverages: any[] = [];
//   pagedCoverages: any[] = [];

//   currentPage: number = 1;
//   pageSize: number = 10;
//   totalPages: number = 0;
//   pageSizes: number[] = [5, 10, 25, 50];
//   start: number = 0;
//   end: number = 0;
//   pageNumbers: number[] = [];

//     patientSubscription: Subscription | undefined;
//   constructor(
//     private fb: FormBuilder,
//     public router: Router,
//     private patientBannerService: PatientBannerService,
//     private CoveragesApiService: CoveragesApiService,
//     private registrationApiService: RegistrationApiService,
//   ) {}

//   ngOnInit(): void {
//     this.patientSubscription = this.patientBannerService.patientData$
//       .pipe(
//         filter((data: any) => !!data?.table2?.[0]?.mrNo),
//         distinctUntilChanged((prev, curr) =>
//           prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
//         )
//       )
//       .subscribe((data: any) => {
//         console.log('✅ Patient selected:', data?.table2?.[0]?.mrNo);
//         this.SearchPatientData = data;
//         this.GetCoverageData();
//       });
//   }

//   GetCoverageData(): void {
//     if (!this.SearchPatientData) {
//       Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
//       return;
//     }

//     const mrNo = this.SearchPatientData.table2[0]?.mrNo;

//     const paginationInfo = {
//       page: this.currentPage,
//       pageSize: this.pageSize
//     };

//     this.CoveragesApiService.GetCoverageList(mrNo, paginationInfo).then((res: any) => {
//       console.log("📦 API Response:", res);
//       this.coverages = res?.table1 || [];

//       if (this.coverages.length === 0) {
//         Swal.fire('No Data', 'No coverage records found for this patient.', 'info');
//       }

//       this.updatePagination();
//     }).catch((error) => {
//       console.error("❌ Error loading coverage data", error);
//       Swal.fire('Error', 'Failed to load coverage data.', 'error');
//     });
//   }

//   updatePagination(): void {
//     this.totalPages = Math.ceil(this.coverages.length / this.pageSize);
//     this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//     this.start = (this.currentPage - 1) * this.pageSize;
//     this.end = Math.min(this.start + this.pageSize, this.coverages.length);
//     this.pagedCoverages = this.coverages.slice(this.start, this.end);
//   }

//   onPageSizeChange(event: any): void {
//     this.pageSize = parseInt(event.target.value, 10);
//     this.currentPage = 1;
//     this.updatePagination();
//   }

//   goToPage(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePagination();
//     }
//   }

//   prevPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePagination();
//     }
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.updatePagination();
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.patientSubscription) {
//       this.patientSubscription.unsubscribe();
//     }
//   }
// }


// export class CoverageListComponent implements OnInit, OnDestroy {
//   SearchPatientData: any;
//   coverages: any[] = [];
//   pagedCoverages: any[] = [];

//   currentPage: number = 1;
//   pageSize: number = 10;
//   totalPages: number = 0;
//   pageSizes: number[] = [5, 10, 25, 50];
//   start: number = 0;
//   end: number = 0;
//   pageNumbers: number[] = [];

//   patientSubscription: Subscription | undefined;

//   constructor(
//     private patientBannerService: PatientBannerService,
//     private CoveragesApiService: CoveragesApiService,
//     private registrationApiService: RegistrationApiService,
//     private route: ActivatedRoute,
//     public router: Router,
//   ) {}

//   ngOnInit(): void {
//     console.log("📢 ngOnInit chala");

//     this.patientSubscription = this.patientBannerService.patientData$
//       .pipe(
//         filter((data: any) => !!data?.table2?.[0]?.mrNo),
//         distinctUntilChanged((prev, curr) =>
//           prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
//         )
//       )
//       .subscribe((data: any) => {
//         console.log('✅ Patient selected:', data?.table2?.[0]?.mrNo);
//         this.SearchPatientData = data;
//         this.GetCoverageData();
//       });
//   }

//   GetCoverageData(): void {
//     debugger
//     if (!this.SearchPatientData) {
//       Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
//       return;
//     }

//     const mrNo = this.SearchPatientData.table2[0]?.mrNo;
//     console.log("🧾 MrNo =>", mrNo);

//     const paginationInfo = {
//       page: this.currentPage,
//       pageSize: this.pageSize
//     };

//     console.log("📤 Calling API with:", mrNo, paginationInfo);

//     this.CoveragesApiService.GetCoverageList(mrNo, paginationInfo).then((res: any) => {
//       console.log("📦 API Response:", res);
//       this.coverages = res?.table1 || [];

//       if (this.coverages.length === 0) {
//         Swal.fire('No Data', 'No coverage records found for this patient.', 'info');
//       }

//       this.updatePagination();
//     }).catch((error) => {
//       console.error("❌ Error loading coverage data", error);
//       Swal.fire('Error', 'Failed to load coverage data.', 'error');
//     });
//   }

//   updatePagination(): void {
//     this.totalPages = Math.ceil(this.coverages.length / this.pageSize);
//     this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//     this.start = (this.currentPage - 1) * this.pageSize;
//     this.end = Math.min(this.start + this.pageSize, this.coverages.length);
//     this.pagedCoverages = this.coverages.slice(this.start, this.end);
//   }

//   onPageSizeChange(event: any): void {
//     this.pageSize = parseInt(event.target.value, 10);
//     this.currentPage = 1;
//     this.updatePagination();
//   }

//   goToPage(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePagination();
//     }
//   }

//   prevPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePagination();
//     }
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.updatePagination();
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.patientSubscription) {
//       this.patientSubscription.unsubscribe();
//     }
//   }
// }



export class CoverageListComponent implements OnInit, OnDestroy {
  SearchPatientData: any;
  coverages: any[] = [];
  pagedCoverages: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
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
  ) {}

  ngOnInit(): void {


    this.patientSubscription = this.patientBannerService.patientData$
      .pipe(
        filter((data: any) => !!data?.table2?.[0]?.mrNo),
        distinctUntilChanged((prev, curr) =>
          prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
        )
      )
      .subscribe((data: any) => {
        const mrNo = data?.table2?.[0]?.mrNo;
        // console.log('Patient selected:', mrNo);
        Swal.fire('Patient Selected', `MrNo: ${mrNo}`, 'success');

        this.SearchPatientData = data;
        this.GetCoverageData();
      });

      this.GetCoverageData();
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


    GetCoverageData() {

    if (!this.SearchPatientData) {
      Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
      return;
    }

    const paginationInfo = {
      page: this.currentPage,
      RowsPerPage: this.pageSize
    };

    const coverageListReq = {
        mrno: this.SearchPatientData?.table2[0]?.mrNo || 0
    }



    this.CoveragesApiService.GetCoverageList(coverageListReq, paginationInfo).then((res: any) => {

      this.coverages = res?.table1 || [];

    //   if (this.coverages.length === 1) {
    //     Swal.fire('No Data', 'No coverage records found for this patient.', 'info');
    //   } else {
    //     Swal.fire('Success', `${this.coverages.length} record(s) loaded.`, 'success');
    //   }

      this.updatePagination();
    }).catch((error) => {

      Swal.fire('Error', 'Failed to load coverage data.', 'error');
    });
  }

// GetCoverageData() {
//   console.log("🔍 GetCoverageData called");

//   if (!this.SearchPatientData) {
//     Swal.fire('Validation Error', 'MrNo is a required field. Please load a patient.', 'warning');
//     return;
//   }

//   const mrNo = this.SearchPatientData.table2[0]?.mrNo;
//   console.log(" Sending API call with MRNO:", mrNo);

//   const coverageListReq = {
//     mrno: mrNo
//   };

//   const paginationInfo = {
//     page: this.currentPage,
//     pageSize: this.pageSize
//   };

//   this.CoveragesApiService.GetCoverageList(coverageListReq, paginationInfo).then((res: any) => {
//     console.log("📦 API Response:", res);
//     this.coverages = res?.table1 || [];

//     if (this.coverages.length === 0) {
//       Swal.fire('No Data', 'No coverage records found for this patient.', 'info');
//     } else {
//       Swal.fire('Success', `${this.coverages.length} record(s) loaded.`, 'success');
//     }

//     this.updatePagination();
//   }).catch((error) => {
//     console.error("❌ API Error:", error);
//     Swal.fire('Error', 'Failed to load coverage data.', 'error');
//   });
// }


  updatePagination(): void {
    this.totalPages = Math.ceil(this.coverages.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = Math.min(this.start + this.pageSize, this.coverages.length);
    this.pagedCoverages = this.coverages.slice(this.start, this.end);
    console.log(`📄 Showing page ${this.currentPage} (items ${this.start + 1}-${this.end})`);
  }

  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  ngOnDestroy(): void {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
  }}

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

