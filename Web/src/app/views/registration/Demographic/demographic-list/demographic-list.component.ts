import { LoaderService } from '@core/services/loader.service';
import { LoaderComponent } from './../../../../components/loader/loader.component';
import { Demographic } from './../../../../shared/Models/registration/Demographics/Demographic.model';
import { DemographicApiServices } from './../../../../shared/Services/Demographic/demographic.api.serviec';
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
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
import { HasPermissionDirective } from '@/app/shared/directives/has-permission.directive';
import { LucideAngularModule, LucideHome, LucideChevronRight, LucideUsers, LucideFilter, LucideFilterX, LucideUserPlus, LucideEdit, LucideTrash2 } from 'lucide-angular';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';


@Component({
    selector: 'app-demographic-list',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgIconComponent,
        NgIcon,
        TranslatePipe,
        LucideAngularModule,
        HasPermissionDirective,
        GenericPaginationComponent,
        FilledOnValueDirective
    ],
    templateUrl: './demographic-list.component.html',
    styleUrl: './demographic-list.component.scss',
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

export class DemographicListComponent {
  constructor(
    public router: Router,
    public DemographicApiServices: DemographicApiServices,
    public Loader : LoaderService,
    private secureStorage: SecureStorageService,
    
  ) {}

  // lucide-angular icons for breadcrumb, heading and actions
  protected readonly homeIcon = LucideHome;
  protected readonly chevronRightIcon = LucideChevronRight;
  protected readonly headingIcon = LucideUsers;
  protected readonly filterIcon = LucideFilter;
  protected readonly filterOffIcon = LucideFilterX;
  protected readonly addIcon = LucideUserPlus;
  protected readonly editIcon = LucideEdit;
  protected readonly deleteIcon = LucideTrash2;

  Patient: any[] = [];
  pagedPatients: any[] = [];
  RegPatient: any[] = [];
  genders: any[] = [];
  loader: any
  isAppointmentFiltered: boolean = false;
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
  DemographicsPagedData: any[] = [];
  DemographicsTotalItems: any;

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

  async ngOnInit() {
    // this.reloadData();
     await this.DemographicsFetchData(this.FilterData);
    this.FillCache();
    // this.GetCoverageAndRegPatient(this.FilterData);
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

        // Derive a stable appointment id and persist as fallback for refresh
    const patientId: number = Number(patient?.patientId ?? patient?.patientId ?? 0);
    if (patientId) {
      this.secureStorage.setItem('demographicEditId', String(patientId));
    }
    // Navigate using Router state (hide id from URL) and include full object for convenience
    this.router.navigate(['/registration/demographic-create'], {
      state: { patientId, patient },
    });



  //   this.router.navigate(['/registration/demographic-create'], //{
  //   {
  //   state: { patient },
  // });
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



async DemographicsFetchData(req: any) {
    debugger
  this.Loader.show();

 // Set filter flag based on FilterData
  this.isAppointmentFiltered = Object.values(this.FilterData).some(
    (value) => value !== '' && value !== null && value !== undefined
  );
  await this.DemographicApiServices.GetAllDemographicsData(req, this.PaginationInfo).subscribe({
    next: (response: any) => {
      this.DemographicsPagedData = response?.table1 || [];

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


  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch {
      return false;
    }
  }

   async onDemographicPageChanged(page: number) {
    this.PaginationInfo.Page = page;
    this.DemographicsFetchData(this.FilterData);
    }

}

