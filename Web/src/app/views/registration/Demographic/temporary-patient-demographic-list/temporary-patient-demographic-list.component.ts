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
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { LoaderService } from '@core/services/loader.service';
import { HasPermissionDirective } from '@/app/shared/directives/has-permission.directive';

@Component({
  selector: 'app-temporary-patient-demographic-list',
  imports: [ CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
      HasPermissionDirective],
  templateUrl: './temporary-patient-demographic-list.component.html',
  styleUrls: ['./temporary-patient-demographic-list.component.scss']
})

export class TemporaryPatientDemographicListComponent {
  pagedTemps: any[] = [];
  FilterData: any = {};

  pageSize = 10;
  currentPage = 1;
  totalRecord = 0;
  totalPages = 0;
  pageNumbers: number[] = [];
  start = 0;
  end = 0;
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
    if (this.FilterData.dOB) {
      this.FilterData.dOB = moment(this.FilterData.dOB).format('yyyy-MM-DD');
    }
    this.getTempDemographics(this.FilterData);
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

  onPageChanges(event: any) {
    this.PaginationInfo.RowsPerPage = event.rows;
    this.PaginationInfo.Page = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.getTempDemographics(this.FilterData);
  }

getTempDemographics(data: any) {
  this.Loader.show(); // Show loader at start

  // Build TempListReq with only allowed fields and omit empty values
  const tempReq: any = {};
  const mrno = data?.Mrno ?? data?.mrno;
  const tempId = data?.TempId ?? data?.tempId;
  const name = data?.Name ?? data?.name;
  const dob = data?.DOB ?? data?.dob ?? data?.dOB; // accept common variants
  const gender = data?.Gender ?? data?.gender;

  if (mrno !== undefined && mrno !== null && mrno !== '') tempReq.Mrno = mrno;
  if (tempId !== undefined && tempId !== null && tempId !== '') tempReq.TempId = tempId;
  if (name !== undefined && name !== null && name !== '') tempReq.Name = name;
  if (dob !== undefined && dob !== null && dob !== '') tempReq.DOB = dob;
  if (gender !== undefined && gender !== null && gender !== '') tempReq.Gender = gender;

  // When all filters are empty, tempReq will be {} as required

  this.TemporaryPatientDemographicApiServices.getTempDemographics_pagination(tempReq, this.PaginationInfo)
    .then((res: any) => {
      if (res.table2) {
        this.pagedTemps = res.table2.map((item: any) => ({
          mrno: item.mrno,
          personFullName: item.personFullName,
          patientBirthDate: item.patientBirthDate,
          personSex: item.personSex,
          tempId: item.tempId,
        }));

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

// GetTempDemographicsByTempId(){
//     this.Loader.show();

//     this.TemporaryPatientDemographicApiServices.GetTempDemographicsByTempId(this.FilterData.TempId).then((res: any) => {
//         if (res) {
//         this.pagedTemps = res.table2.map((item: any) => ({
//             personFullName: item.personFullName,
//             personEmail: item.personEmail,
//             patientBirthDate: item.patientBirthDate,
//             nationalityName: item.nationalityName,
//             countryName: item.countryName,
//             personSex: item.personSex,
//             tempId: item.tempId,
//           }));
//         }
//         this.Loader.hide();
//       }).catch((error: any) => {
//         this.Loader.hide();
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: error.message || 'Failed to fetch temporary demographics'
//         });
//       });
//   }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.PaginationInfo.Page = page;
      this.getTempDemographics(this.FilterData);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.PaginationInfo.Page = this.currentPage;
      this.getTempDemographics(this.FilterData);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.PaginationInfo.Page = this.currentPage;
      this.getTempDemographics(this.FilterData);
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
    this.PaginationInfo.Page = 1;
    this.PaginationInfo.RowsPerPage = this.pageSize;
    this.getTempDemographics(this.FilterData);
  }


  editTemp(tempId: number) {
    this.router.navigate(['/registration/temporary-demographics'], {
      queryParams: { id: tempId },
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
}
