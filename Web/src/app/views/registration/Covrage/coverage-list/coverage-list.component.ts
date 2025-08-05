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

export class CoverageListComponent {
  coverages: any[] = [];
  pagedCoverages: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 25, 50];
  start: number = 0;
  end: number = 0;
  pageNumbers: number[] = [];

  constructor(private fb: FormBuilder,
    public router: Router,
    private patientBannerService: PatientBannerService,
    private CoveragesApiService: CoveragesApiService,
    private RegistrationApiService: RegistrationApiService,
  ) {}



  ngOnInit(): void {
    this.loadData(); // Initial data load
  }

  loadData() {


    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.coverages.length / this.pageSize);
    this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = Math.min(this.start + this.pageSize, this.coverages.length);
    this.pagedCoverages = this.coverages.slice(this.start, this.end);
  }

  onPageSizeChange(event: any) {
    this.currentPage = 1;
    this.pageSize = parseInt(event.target.value);
    this.updatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  reloadData() {
    this.loadData();
  }


//    GetCoveragesList(Data: any) {

//     this.RegistrationApiService.GetCoverageList(Data,this.PaginationInfo)
//       .then((inssub) => {

//         this.totalRecord=inssub.table2[0].totalCount

//         if (inssub.table1) {

//           let inssubarray: any[] = [];

//           for (let i = 0; i < inssub.table1.length; i++) {
//             let subscriberName = inssub.table1[i].subscriberName;
//             let insuranceCarrier = inssub.table1[i].insuranceCarrier;
//             let insuranceIDNo = inssub.table1[i].insuranceIDNo;
//             let subscriberId = inssub.table1[i].subscriberId;
//             let type = inssub.table1[i].typeinText;
//             let active = inssub.table1[i].active;
//             let carrierAddress = inssub.table1[i].carrierAddress;
//             let mrNo = inssub.table1[i].mrNo;
//             inssubarray.push({
//               subscriberId: inssub.table1[i].subscriberId,
//               subscriberName: inssub.table1[i].subscriberName,
//               insuranceCarrier: inssub.table1[i].insuranceCarrier,
//               insuranceIDNo: inssub.table1[i].insuranceIDNo,
//               mrNo: inssub.table1[i].mrNo,
//               type: inssub.table1[i].typeinText,
//               active: inssub.table1[i].active,
//               carrierAddress: inssub.table1[i].carrierAddress,
//             });
//           }

//           this.insuredsubs = inssubarray;
//         }
//       })
//       .catch((error) =>
//         this.RegistrationApiService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: error.message,
//         })
//       );
//   }

}

