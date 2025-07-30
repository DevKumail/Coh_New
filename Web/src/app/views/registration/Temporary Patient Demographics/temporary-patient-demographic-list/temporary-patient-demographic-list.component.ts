import { Component } from '@angular/core';
import { Demographic } from './../../../../shared/Models/registration/Demographics/Demographic.model';
import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
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
import { PageTitleComponent } from '@app/components/page-title.component';
import { UiCardComponent } from '@app/components/ui-card.component';
import { NgIcon } from '@ng-icons/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-temporary-patient-demographic-list',
  imports: [ CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,],
  templateUrl: './temporary-patient-demographic-list.component.html',
  styleUrl: './temporary-patient-demographic-list.component.scss'
})

// export class TemporaryPatientDemographicListComponent  {

//   pagedTemps: any[] = [];

//   FilterData: any = {};

//   pageSize = 25;
//   currentPage = 1;
//   totalRecord = 0;
//   totalPages = 0;
//   pageNumbers: number[] = [];
//   start = 0;
//   end = 0;
//   pageSizes = [5, 10, 25, 50];
//   PaginationInfo: any = {
//     RowsPerPage: 10,
//     Page: 1,
//   };

//   // 🔘 Dialogs
//   filter = false;
//   position = 'center';

//   constructor(
//     public router: Router,
//     public TemporaryPatientDemographicApiServices: TemporaryPatientDemographicApiServices,

//   ) {}

//   ngOnInit(): void {
//     this.getTempDemographics(this.FilterData);
//   }

//   ClickFilter() {
//     this.filter = true;
//   }

//   submitFilter() {
//     this.filter = false;
//     if (this.FilterData.dOB) {
//       this.FilterData.dOB = moment(this.FilterData.dOB).format('yyyy-MM-DD');
//     }
//     this.getTempDemographics(this.FilterData);
//   }

//   buttonRoute(url: string) {
//     this.router.navigate([url]);
//   }

//   // 🔃 Pagination Trigger
//   onPageChanges(event: any) {
//     this.PaginationInfo.RowsPerPage = event.rows;
//     this.PaginationInfo.Page = Math.floor(event.first / event.rows) + 1;
//     this.pageSize = event.rows;
//     this.currentPage = Math.floor(event.first / event.rows) + 1;
//     this.getTempDemographics(this.FilterData);
//   }


// getTempDemographics(data: any) {
//   this.TemporaryPatientDemographicApiServices.getTempDemographics_pagination(data, this.PaginationInfo).then((res: any) => {
//     if (res.table2) {
//       this.pagedTemps = res.table2.map((item: any) => ({
//         personFullName: item.personFullName,
//         personEmail: item.personEmail,
//         patientBirthDate: item.patientBirthDate,
//         nationalityName: item.nationalityName,
//         countryName: item.countryName,
//         personSex: item.personSex,
//         tempId: item.tempId,
//       }));

//       this.totalRecord = res.table1[0]?.totalCount || 0;


//       this.totalPages = Math.ceil(this.totalRecord / this.pageSize);
//       this.start = (this.currentPage - 1) * this.pageSize;
//       this.end = this.start + this.pageSize;
//       this.pageNumbers = Array(this.totalPages)
//         .fill(0)
//         .map((_, i) => i + 1);
//     }
//   });
// }

//   goToPage(page: number) {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.PaginationInfo.Page = page;
//       this.getTempDemographics(this.FilterData);
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.PaginationInfo.Page = this.currentPage;
//       this.getTempDemographics(this.FilterData);
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.PaginationInfo.Page = this.currentPage;
//       this.getTempDemographics(this.FilterData);
//     }
//   }

//   onPageSizeChange(event: any) {
//     this.pageSize = +event.target.value;
//     this.currentPage = 1;
//     this.PaginationInfo.Page = 1;
//     this.PaginationInfo.RowsPerPage = this.pageSize;
//     this.getTempDemographics(this.FilterData);
//   }

//   // ❌ Delete
// //   Remove(id: number) {
// //     this.confirmationService.confirm({
// //       message: 'Are you sure that you want to delete this record?',
// //       icon: 'pi pi-exclamation-triangle',
// //       accept: () => {
// //         this.tempService.deleteTempdemographics(id).then((res) => {
// //           if (res.success) {
// //             this.messageService.add({
// //               severity: 'success',
// //               summary: 'Deleted',
// //               detail: 'Temporary patient deleted successfully',
// //             });
// //             this.getTempDemographics(this.FilterData);
// //           }
// //         });
// //       },
// //       reject: () => {
// //         this.messageService.add({
// //           severity: 'info',
// //           summary: 'Cancelled',
// //           detail: 'Action cancelled',
// //         });
// //       },
// //       key: 'positionDialog',
// //     });
// //   }

// Remove(){

// }
// }
export class TemporaryPatientDemographicListComponent {
  pagedTemps: any[] = [];
  FilterData: any = {};

  pageSize = 25;
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

    this.getTempDemographics(this.FilterData);
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

//   getTempDemographics(data: any) {
//     this.TemporaryPatientDemographicApiServices.getTempDemographics_pagination(data, this.PaginationInfo).then((res: any) => {
//         debugger
//       if (res.table2) {
//         this.pagedTemps = res.table2.map((item: any) => ({
//           personFullName: item.personFullName,
//           personEmail: item.personEmail,
//           patientBirthDate: item.patientBirthDate,
//           nationalityName: item.nationalityName,
//           countryName: item.countryName,
//           personSex: item.personSex,
//           tempId: item.tempId,
//         }));

//         this.totalRecord = res.table1[0]?.totalCount || 0;
//         this.totalPages = Math.ceil(this.totalRecord / this.pageSize);
//         this.start = (this.currentPage - 1) * this.pageSize;
//         this.end = this.start + this.pageSize;
//         this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
//       }
//     });
//   }
getTempDemographics(data: any) {
  this.Loader.show(); // ✅ Show loader at start

  this.TemporaryPatientDemographicApiServices.getTempDemographics_pagination(data, this.PaginationInfo).then((res: any) => {
    debugger

    if (res.table2) {
      this.pagedTemps = res.table2.map((item: any) => ({
        personFullName: item.personFullName,
        personEmail: item.personEmail,
        patientBirthDate: item.patientBirthDate,
        nationalityName: item.nationalityName,
        countryName: item.countryName,
        personSex: item.personSex,
        tempId: item.tempId,
      }));

      this.totalRecord = res.table1[0]?.totalCount || 0;
      this.totalPages = Math.ceil(this.totalRecord / this.pageSize);
      this.start = (this.currentPage - 1) * this.pageSize;
      this.end = this.start + this.pageSize;
      this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    }

    this.Loader.hide(); // ✅ Hide loader after data loaded

  }).catch((error: any) => {
    this.Loader.hide(); // ✅ Hide loader if error occurs

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to fetch temporary demographics'
    });
  });
}

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
