import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { LoaderService } from '@core/services/loader.service';
import { SchedulingApiService } from '../scheduling.api.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgIconComponent,
    GenericPaginationComponent,
    TranslatePipe,
    FilledOnValueDirective
  ],
  templateUrl: './appointment-history.component.html',
  styles: []
})
export class AppointmentHistoryComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: SchedulingApiService,
    private loader: LoaderService,
  ) {}

  FilterForm!: FormGroup;
  appointments: any[] = [];
  totalRecord: number = 0;
  isAppointmentFiltered = false;

  PaginationInfo: any = {
    Page: 1,
    RowsPerPage: 10,
  };

  providers: any[] = [];
  facilities: any[] = [];
  sites: any[] = [];
  speciality: any[] = [];
  appointmentcriteria: any[] = [];
  visitType: any[] = [];
  locations: any[] = [];
  appointmentType: any[] = [];

  cacheItems: string[] = [
    'Provider',
    // 'RegLocations',
    // 'RegLocationTypes',
    // 'providerspecialty',
    // 'RegFacility',
    // 'SchAppointmentStatus',
    // 'VisitType',
    // 'SchAppointmentCriteria',
    // 'SchAppointmentType'
  ];

  ngOnInit(): void {
    // this.FilterForm = this.fb.group({
    //   fromDate: [''],
    //   toDate: [''],
    //   providerId: [''],
    //   facilityId: [''],
    //   sitesId: [''],
    //   specialityId: [''],
    //   criteriaId: [''],
    //   visitTypeId: [''],
    //   locationId: [''],
    //   appointmentId: [''],
    // });

    // Default today
    // const today = this.toDateInputValue(new Date());
    // this.FilterForm.patchValue({ fromDate: today, toDate: today });

    // Load dropdowns
    this.FillCache();

    // If mrNo passed, load history for this patient; else normal search
    const mrNo = this.route.snapshot.queryParamMap.get('mrNo');
    if (mrNo) {
      this.loadHistoryByMrNo(mrNo);
    }
  }

//   private toDateInputValue(d: Date): string {
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const day = String(d.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch { return false; }
  }

  FillCache() {
    this.service.getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response.cache != null) {
          let jParse = JSON.parse(JSON.stringify(response)).cache;
          const cache = JSON.parse(jParse);

          const mapToNameCode = (arr: any[], map: (item: any) => any) => arr?.map(map) || [];

          this.providers = mapToNameCode(cache.Provider, (i: any) => ({ name: i.FullName, code: i.EmployeeId }));
          // this.facilities = mapToNameCode(cache.RegFacility, (i: any) => ({ name: i.Name, code: i.Id }));
          // this.sites = mapToNameCode(cache.RegLocationTypes, (i: any) => ({ name: i.Name, code: i.TypeId }));
          // this.speciality = mapToNameCode(cache.providerspecialty, (i: any) => ({ name: i.SpecialtyName, code: i.SpecialtyID }));
          // this.appointmentcriteria = mapToNameCode(cache.SchAppointmentCriteria, (i: any) => ({ name: i.CriteriaName, code: i.CriteriaId }));
          // this.visitType = mapToNameCode(cache.VisitType, (i: any) => ({ name: i.VisitTypeName, code: i.VisitTypeId }));
          // this.locations = mapToNameCode(cache.RegLocations, (i: any) => ({ name: i.Name, code: i.LocationId }));
          // this.appointmentType = mapToNameCode(cache.SchAppointmentType, (i: any) => ({ name: i.AppType, code: i.AppTypeId }));
        }
      })
      .catch((error:any) =>
        Swal.fire({ icon: 'error', title: 'Error', text: error.message })
      );
  }

  async SearchHistoryWithPagination() {
    // this.loader.show();
    // const {
    //   fromDate,
    //   toDate,
    //   providerId,
    //   facilityId,
    //   sitesId,
    //   specialityId,
    //   criteriaId,
    //   visitTypeId,
    //   locationId,
    //   appointmentId,
    // } = this.FilterForm?.value || {};

    // const body = {
    //   fromDate: fromDate && fromDate.trim() !== '' ? fromDate : null,
    //   toDate: toDate && toDate.trim() !== '' ? toDate : null,
    //   providerId: providerId || null,
    //   facilityId: facilityId || null,
    //   siteId: sitesId || null,
    //   specialityId: specialityId || null,
    //   criteriaId: criteriaId || null,
    //   visitTypeId: visitTypeId || null,
    //   locationId: locationId || null,
    //   appointmentTypeId: appointmentId || null,
    // };

    // await this.service.SearchAppointmentDBWithPagination(body, this.PaginationInfo).subscribe(
    //   (appointment: any) => {
    //     this.isAppointmentFiltered = !!(fromDate || toDate || providerId || facilityId || sitesId || specialityId || criteriaId || visitTypeId || locationId || appointmentId);
    //     this.fillTableFromResponse(appointment);
    //   },
    //   (error: any) => {
    //     this.loader.hide();
    //     Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Something went wrong' });
    //   }
    // );
  }

  loadHistoryByMrNo(mrNo: string = '0') {
    this.loader.show();
    const mrno = mrNo || '0';
    this.service.searchAppointmentHistory(mrno,this.PaginationInfo.RowsPerPage,this.PaginationInfo.Page).then((appointment: any) => {
      this.appointments = appointment?.table1;
      this.totalRecord = appointment?.table2?.[0]?.totalRecords;
    //   this.fillTableFromResponse(appointment);
      this.loader.hide();
    });
  }

  onHistoryPageChanged(page: number) {
    this.PaginationInfo.Page = page;
    this.loadHistoryByMrNo();
  }

  getProviderName(id: any): string {
    const provider = this.providers?.find((e: any) => e.code == id);
    console.log( 'provider => ',provider)
    return provider ? provider.name : 'N/A';
  }
}
