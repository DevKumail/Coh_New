import { LoaderService } from '@core/services/loader.service';
import { LoaderComponent } from './../../../../components/loader/loader.component';
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

export class DemographicListComponent {
  constructor(
    public router: Router,
    public DemographicApiServices: DemographicApiServices,
    public Loader : LoaderService,
  ) {}

  Patient: any[] = [];
  pagedPatients: any[] = [];
  RegPatient: any[] = [];
  genders: any[] = [];
  loader: any

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
    RowsPerPage: 5,
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
    // this.GetCoverageAndRegPatient(this.FilterData);
    this.DemographicsFetchData(this.FilterData);
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

//   GetCoverageAndRegPatient(req: any) {
//     this.load = true;
//     this.PaginationInfo.RowsPerPage = this.pageSize;
//     this.PaginationInfo.Page = this.currentPage;

//     this.DemographicApiServices.GetAllDemographicsData(
//       req,
//       this.PaginationInfo
//     ).subscribe({
//       next: (demographics: any) => {
//         if (demographics?.table1) {
//           this.Patient = demographics.table1;
//           this.pagedPatients = this.Patient; // backend returns current page
//           this.totalRecord = demographics.table2?.[0]?.totalCount || 0;
//           this.RegPatient = demographics.table2 || [];
//         }

//         this.updatePagination();
//         this.load = false;
//       },
//       error: (error: any) => {
//         this.load = false;
//         Swal.fire({ icon: 'error', title: 'Rejected', text: error.message });
//       },
//     });
//   }


  clearFilter() {
    this.FilterData = {
      mrNo: '',
      name: '',
      phone: '',
      genderId: '',
    };
    this.currentPage = 1;
    this.DemographicsFetchData(this.FilterData);
    this.filter = false;
  }

  submitFilter() {
    this.currentPage = 1;
    this.filter = false;
    this.DemographicsFetchData(this.FilterData);
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
    this.router.navigate(['/registration/demographic-create'], //{
    {
    state: { patient },
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
            this.DemographicsFetchData(this.FilterData);
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


DemographicsPagedData: any[] = [];
DemographicsCurrentPage = 1;
DemographicsPageSize = 10;
DemographicsTotalItems = 0;

get DemographicsTotalPages(): number {
  return Math.ceil(this.DemographicsTotalItems / this.DemographicsPageSize);
}

get DemographicsStart(): number {
  return (this.DemographicsCurrentPage - 1) * this.DemographicsPageSize;
}

get DemographicsEnd(): number {
  return Math.min(this.DemographicsStart + this.DemographicsPageSize, this.DemographicsTotalItems);
}

get DemographicsPageNumbers(): (number | string)[] {
  const total = this.DemographicsTotalPages;
  const current = this.DemographicsCurrentPage;
  const delta = 2;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return range;
}

DemographicsGoToPage(page: number) {
  if (typeof page !== 'number' || page < 1 || page > this.DemographicsTotalPages) return;
  this.DemographicsCurrentPage = page;
  this.DemographicsFetchData(this.FilterData);
}

DemographicsNextPage() {
  if (this.DemographicsCurrentPage < this.DemographicsTotalPages) {
    this.DemographicsCurrentPage++;
    this.DemographicsFetchData(this.FilterData);
  }
}

DemographicsPrevPage() {
  if (this.DemographicsCurrentPage > 1) {
    this.DemographicsCurrentPage--;
    this.DemographicsFetchData(this.FilterData);
  }
}

DemographicsFetchData(req: any) {
    debugger
  this.Loader.show();
  const paginationInfo = {
    Page: this.DemographicsCurrentPage,
    RowsPerPage: this.DemographicsPageSize
  };

  this.DemographicApiServices.GetAllDemographicsData(req, paginationInfo).subscribe({
    next: (response: any) => {
      this.DemographicsPagedData = response?.table1 || [];
      console.log( 'this.DemographicsPagedData =>',this.DemographicsPagedData);

      this.DemographicsTotalItems = response?.table2?.[0]?.totalCount || 0;
      this.RegPatient = response.table2 || [];
      this.Loader.hide();
    },
    error: (error: any) => {
      this.Loader.hide();
      Swal.fire({ icon: 'error', title: 'Rejected', text: error.message });
    }
  });
}

onDemographicsPageSizeChange(event: any) {
  this.DemographicsPageSize = +event.target.value;
  this.DemographicsCurrentPage = 1; // Reset to first page
  debugger
  this.DemographicsFetchData(this.FilterData);
}

}

