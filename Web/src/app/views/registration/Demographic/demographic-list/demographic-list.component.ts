import { Demographic } from './../../../../shared/Models/registration/Demographics/Demographic.model';
import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormArray,
} from '@angular/forms';
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

@Component({
    selector: 'app-demographic-list',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
    ],
    templateUrl: './demographic-list.component.html',
    styleUrl: './demographic-list.component.scss',
})

// export class DemographicsListComponent {
//     constructor(
//         public router: Router,
//         public DemographicApiServices: DemographicApiServices
//     ) {}
//   //Patient: Patient[] = [];
//   pageNumbers: number[] = [];
//     pagedPatients: any[] = [];
//     Patient: any[] = [];
//     RegPatient: any[] = [];
//     genders: any[] = [];
//     pageSize = 1000;
//     currentPage = 1;
//     pageSizes = [5, 10, 20, 50];
//     //pagedPatients = [];
//     totalPages = 0;
//     // pageNumbers = [];
//     start = 0;
//     end = 0;

//     demographic: any[] = [];

//     filter: boolean = false;
//     mrNo: string = '';
//     load: boolean = false;

//     cancelpopup: boolean = false;
//     position: string = '';
//     selectedGender: any | undefined;

//     FilterData: any = {
//         mrNo: '',
//         name: '',
//         phone: '',
//         genderId: '',
//     };

//     PaginationInfo: any = {
//         RowsPerPage: 10,
//         Page: 1,
//     };

//     totalRecord: number = 0;

//     rowsPerPage: number = 10;
//     first: number = 0;

//     cacheItems: string[] = [
//         'HREmployeeType',
//         'RegBloodGroup',
//         'HREmployee',
//         'RegMaritalStatus',
//         'RegGender',
//         'RegCountries',
//         'RegStates',
//         'RegCities',
//         'RegRelationShip',
//         'SecRole',
//         'RegFacility',
//     ];

//     ngOnInit(): void {
//         this.reloadData();
//         this.FillCache();

//         this.GetCoverageAndRegPatient(this.FilterData);
        
//     }
//     loadData() {
//         // Call this after fetching data from API
//         this.updatePagination();
//     }

//     updatePagination() {
//         this.totalPages = Math.ceil(this.Patient.length / this.pageSize);
//         this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//         this.start = (this.currentPage - 1) * this.pageSize;
//         this.end = Math.min(this.start + this.pageSize, this.Patient.length);
//         this.pagedPatients = this.Patient.slice(this.start, this.end);
//         this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//          this.pagedPatients = this.Patient;
//     }

// //     updatePagination() {
// //   this.totalPages = Math.ceil(this.Patient.length / this.pageSize);
// //   this.start = (this.currentPage - 1) * this.pageSize;
// //   this.end = Math.min(this.start + this.pageSize, this.Patient.length);
// //   this.pagedPatients = this.Patient.slice(this.start, this.end);
// //   this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
// // }

//     onPageSizeChange(event: any) {
//         this.currentPage = 1;
//         this.updatePagination();
//     }

//     goToPage(page: number) {
//         this.currentPage = page;
//         this.updatePagination();
//     }

//     prevPage() {
//         if (this.currentPage > 1) {
//             this.currentPage--;
//             this.updatePagination();
//         }
//     }

//     nextPage() {
//         if (this.currentPage < this.totalPages) {
//             this.currentPage++;
//             this.updatePagination();
//         }
//     }

//     reloadData() {
//         const Demographicsinfo = localStorage.getItem('Demographics');
//         if (Demographicsinfo) {
//             const Demographics = JSON.parse(Demographicsinfo);
//             this.mrNo = Demographics.table2[0]?.mrNo || '';
//         }
//         this.GetAllRegPatient(this.mrNo);
//         this.clearFilter();
//     }

//     GetAllRegPatient(MRNo: string) {
//         this.DemographicApiServices.GetRegPatientList()
//             .then((res: any) => {
//                 if (res.table1) {
//                     this.RegPatient = res.table1;
//                 }
//             })
//             .catch((error: any) => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Rejected',
//                     text: error.message,
//                 });
//             });
//     }

//     onPageChanges(event: any) {
//         this.PaginationInfo.RowsPerPage = event.rows;
//         this.PaginationInfo.Page = Math.floor(event.first / event.rows) + 1;
//         this.first = event.first;
//         this.rowsPerPage = event.rows;
//         this.currentPage = this.PaginationInfo.Page;
//         this.GetCoverageAndRegPatient(this.FilterData);
//     }

//     GetCoverageAndRegPatient(req: any) {
//         this.load = true;
//         this.DemographicApiServices.GetAllDemographicsData(
//             req,
//             this.PaginationInfo
//         ).subscribe({
//             next: (demographics: any) => {
//                 if (demographics?.table1) {
//                     this.Patient = demographics.table1;
//                     this.totalRecord =
//                         demographics.table2?.[0]?.totalCount || 0;
//                     this.RegPatient = demographics.table2 || [];
//                 }
//                 this.load = false;
//             },
//             error: (error: any) => {
//                 this.load = false;
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Rejected',
//                     text: error.message,
//                 });
//             },
//         });
//     }

//     FillCache() {
//         this.DemographicApiServices.getCacheItem({ entities: this.cacheItems })
//             .then((response: any) => {
//                 if (response.cache != null) {
//                     this.FillDropDown(response);
//                 }
//             })
//             .catch((error: any) => {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Rejected',
//                     text: error.message,
//                 });
//             });
//     }

//     FillDropDown(response: any) {
//         let jParse = JSON.parse(JSON.stringify(response)).cache;
//         let gender = JSON.parse(jParse).RegGender;

//         if (gender) {
//             this.genders = gender.map((item: any) => ({
//                 name: item.Gender,
//                 code: item.GenderId,
//             }));
//         }
//     }

//     clearFilter() {
//         this.FilterData = {
//             mrNo: '',
//             name: '',
//             phone: '',
//             genderId: '',
//         };
//         this.GetCoverageAndRegPatient(this.FilterData);
//         this.filter = false;
//     }

//     submitFilter() {
//         this.filter = false;
//         this.GetCoverageAndRegPatient(this.FilterData);
//     }

//     ClickFilter() {
//         this.filter = true;
//     }

//     editPatient(patient: any) {
//         this.router.navigate(['/registration/demographic-create'], {
//             queryParams: { id: patient.mrNo },
//         });
//     }

//     Remove(e: Event, Id: number, position: string) {
//         this.position = position;

//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'Are you sure you want to delete this patient?',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, confirm it!',
//             cancelButtonText: 'No, cancel',
//             reverseButtons: true,
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 this.DemographicApiServices.deletedemographics(Id).then(
//                     (response: any) => {
//                         if (response.success) {
//                             this.GetCoverageAndRegPatient(this.FilterData);
//                             Swal.fire({
//                                 icon: 'info',
//                                 title: 'Confirmed',
//                                 text: 'Patient deleted successfully',
//                             });
//                         }
//                     }
//                 );
//             } else if (result.dismiss === Swal.DismissReason.cancel) {
//                 // Rejected
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Rejected',
//                     text: 'You have rejected',
//                 });
//             }
//         });
//     }

//     deleteUser() {
//         this.cancelpopup = false;
//     }

//     buttonRoute(url: string) {
//         this.router.navigate([url]);
//     }

//     confirm(event: Event, Id: number, position: string) {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'You won’t be able to revert this!',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, confirm it!',
//             cancelButtonText: 'No, cancel',
//             reverseButtons: true,
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 Swal.fire({
//                     icon: 'info',
//                     title: 'Confirmed',
//                     text: 'You have rejected',
//                 });
//             } else if (result.dismiss === Swal.DismissReason.cancel) {
//                 // Rejected
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Rejected',
//                     text: 'You have rejected',
//                 });
//             }
//         });
//     }
// }
export class DemographicsListComponent {
  constructor(
    public router: Router,
    public DemographicApiServices: DemographicApiServices
  ) {}

  Patient: any[] = [];
  pagedPatients: any[] = [];
  RegPatient: any[] = [];
  genders: any[] = [];

  pageSize = 25;
  currentPage = 1;
  totalRecord = 0;
  totalPages = 0;
  pageNumbers: number[] = [];
  start = 0;
  end = 0;

  filter: boolean = false;
  mrNo: string = '';
  load: boolean = false;

  cancelpopup: boolean = false;
  position: string = '';
  selectedGender: any | undefined;

  FilterData: any = {
    mrNo: '',
    name: '',
    phone: '',
    genderId: '',
  };

  PaginationInfo: any = {
    RowsPerPage: 10,
    Page: 1,
  };

  pageSizes = [5, 10, 20, 50];

  cacheItems: string[] = [
    'HREmployeeType',
    'RegBloodGroup',
    'HREmployee',
    'RegMaritalStatus',
    'RegGender',
    'RegCountries',
    'RegStates',
    'RegCities',
    'RegRelationShip',
    'SecRole',
    'RegFacility',
  ];

  ngOnInit(): void {
    this.reloadData();
    this.FillCache();
    this.GetCoverageAndRegPatient(this.FilterData);
  }

  reloadData() {
    const Demographicsinfo = localStorage.getItem('Demographics');
    if (Demographicsinfo) {
      const Demographics = JSON.parse(Demographicsinfo);
      this.mrNo = Demographics.table2[0]?.mrNo || '';
    }
    this.GetAllRegPatient(this.mrNo);
    this.clearFilter();
  }

  GetAllRegPatient(MRNo: string) {
    this.DemographicApiServices.GetRegPatientList()
      .then((res: any) => {
        if (res.table1) {
          this.RegPatient = res.table1;
        }
      })
      .catch((error: any) => {
        Swal.fire({ icon: 'error', title: 'Rejected', text: error.message });
      });
  }

  GetCoverageAndRegPatient(req: any) {
    this.load = true;
    this.PaginationInfo.RowsPerPage = this.pageSize;
    this.PaginationInfo.Page = this.currentPage;

    this.DemographicApiServices.GetAllDemographicsData(
      req,
      this.PaginationInfo
    ).subscribe({
      next: (demographics: any) => {
        if (demographics?.table1) {
          this.Patient = demographics.table1;
          this.pagedPatients = this.Patient; // backend returns current page
          this.totalRecord = demographics.table2?.[0]?.totalCount || 0;
          this.RegPatient = demographics.table2 || [];
        }

        this.updatePagination();
        this.load = false;
      },
      error: (error: any) => {
        this.load = false;
        Swal.fire({ icon: 'error', title: 'Rejected', text: error.message });
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalRecord / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.start = (this.currentPage - 1) * this.pageSize;
    this.end = Math.min(this.start + this.pageSize, this.totalRecord);
  }

  onPageSizeChange(event: any) {
    this.currentPage = 1;
    this.GetCoverageAndRegPatient(this.FilterData);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.GetCoverageAndRegPatient(this.FilterData);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.GetCoverageAndRegPatient(this.FilterData);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.GetCoverageAndRegPatient(this.FilterData);
    }
  }

  clearFilter() {
    this.FilterData = {
      mrNo: '',
      name: '',
      phone: '',
      genderId: '',
    };
    this.currentPage = 1;
    this.GetCoverageAndRegPatient(this.FilterData);
    this.filter = false;
  }

  submitFilter() {
    this.currentPage = 1;
    this.filter = false;
    this.GetCoverageAndRegPatient(this.FilterData);
  }

  ClickFilter() {
    this.filter = true;
  }

  FillCache() {
    this.DemographicApiServices.getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response.cache != null) {
          this.FillDropDown(response);
        }
      })
      .catch((error: any) => {
        Swal.fire({ icon: 'error', title: 'Rejected', text: error.message });
      });
  }

  FillDropDown(response: any) {
    let jParse = JSON.parse(JSON.stringify(response)).cache;
    let gender = JSON.parse(jParse).RegGender;

    if (gender) {
      this.genders = gender.map((item: any) => ({
        name: item.Gender,
        code: item.GenderId,
      }));
    }
  }

  editPatient(patient: any) {
    this.router.navigate(['/registration/demographic-create'], {
      queryParams: { id: patient.mrNo },
    });
  }

  Remove(e: Event, Id: number, position: string) {
    this.position = position;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this patient?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.DemographicApiServices.deletedemographics(Id).then((response: any) => {
          if (response.success) {
            this.GetCoverageAndRegPatient(this.FilterData);
            Swal.fire({
              icon: 'info',
              title: 'Confirmed',
              text: 'Patient deleted successfully',
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'error',
          title: 'Rejected',
          text: 'You have rejected',
        });
      }
    });
  }
}

