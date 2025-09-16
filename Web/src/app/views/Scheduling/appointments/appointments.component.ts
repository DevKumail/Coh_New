import { SchedulingApiService } from './../scheduling.api.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { LoaderService } from '@core/services/loader.service';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { NgIconComponent } from '@ng-icons/core';
import { StepsModule } from 'primeng/steps';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import moment from 'moment';

@Component({
    selector: 'app-appointments',
    imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    GenericPaginationComponent,
    NgIconComponent,
    StepsModule,
    FormsModule,
    TranslatePipe
    ],
    templateUrl: './appointments.component.html',
    // styleUrl: './appointments.component.scss',
    styleUrls: [],
})
export class AppointmentsComponent {
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private Service: SchedulingApiService,
        private loader: LoaderService,
        private secureStorage: SecureStorageService
    ) {}
    private modalRef!: NgbModalRef; 
    Patientpopup: boolean = false;
    FilterForm!: FormGroup;
    mrNO: any;
    appId: any;
    isAppointmentFiltered: boolean = false;
    selectedReschedulingReasons:any;
    patient_FName: any;
    filter: boolean = false;
    showDiv: boolean = false;
    ChildactiveIndex: any;
    activeIndex: number = 0;
    modalService = new NgbModal();
    AppoinmentBooking: any = {};
    AppointmentStatus: any = {};
    items: any[] = [];
    itemsChild: any[] = [];
    BlPatientVisit:any={}
    Date:any
    messageService = {};
    totalRecord: number = 0;
    FilterData: any = {};
    PaginationInfo: any = {
        Page: 1,
        RowsPerPage: 10
    };

    // Accordion toggler reference for programmatic collapse (like dashboard)
    @ViewChild('appointmentToggler') appointmentToggler?: ElementRef<HTMLButtonElement>;

    selectedFacility: any;
    selectedProviders: any;
    selectedLocations: any;
    selectedSites: any;
    date: any;
    minDate = new Date().toISOString().split("T")[0]; 
    reason: any;
    ReschedulingReasons: any[] = [];
    appointments: any[] = [];
    appointmentStatuses: any[] = [];
    providers: any[] = [];
    facilities: any[] = [];
    sites: any[] = [];
    speciality: any[] = [];
    referred: any[] = [];
    type: any[] = [];
    payer: any;
    criteriaId: any[] = [];
    notified: any[] = [];
    payerPlan: any[] = [];
    status: any[] = [];
    purpose: any[] = [];

    appointmentcriteria: any[] = [];
    visitType: any = [
        { code: 1, name: 'New' },
        { code: 2, name: 'Follow-up' },
        { code: 3, name: 'Emergency' },
    ];
    locations: any = [];
    appointmentType: any;
    add: any;

    cacheItems: string[] = [
    'ReschedulingReasons',
    'RegLocations',
    'RegLocationTypes',
    'Provider',
    'providerspecialty',
    'RegFacility',
    'SchAppointmentStatus',
    'VisitType',
    'SchAppointmentCriteria',
    'HREmployee',
  ];

    ngOnInit(): void {
        // Initialize filter form first
        this.FilterForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
            providerId: [''],
            facilityId: [''],
            sitesId: [''],
            specialityId: [''],
            criteriaId: [''],
            visitTypeId: [''],
            locationId: [''],
            appointmentId: [''],
        });

        this.FilterForm.patchValue({ 
          fromDate: this.toDateInputValue(new Date()),
          toDate: this.toDateInputValue(new Date()) });


        // Load data
        this.SearchAppointmentWithpagination();
        this.FillCache();

        this.items = [
            {
              label: 'Check In',
              command: (event: any, appointment: any) => {
                   
                this.AppoinmentBooking.appId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 2;
                this.AppoinmentBooking.appVisitId = 0;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.appId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
      
                  )
                  .then((ReSch: any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   summary: 'First Step',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
                  var userinfo = localStorage.getItem('currentUser');
                  let user:any
                  if (userinfo) {
                    var userId = JSON.parse(localStorage.getItem('currentUser') || '');
                    user = userId.userId;
                  }
                  this.BlPatientVisit.mrno=this.mrNO
                  this.BlPatientVisit.user=user
                  this.BlPatientVisit.appId=this.AppoinmentBooking.appId
                  this.BlPatientVisit.date= moment(this.Date).format('yyyy-MM-DD')
                 // this.schedulingService.AddBLPatientVisit(this.BlPatientVisit).subscribe(res => {
                    this.SearchAppointmentWithpagination();
                  //})
              },
            },
            {
              label: 'Ready',
              // command: (event: any) => this.messageService.add({ severity: 'info', summary: 'First Step', detail: event.item.label }),
            },
            {
              label: 'Check Out',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 6;
                this.AppoinmentBooking.appVisitId = 0;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch: any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   summary: 'Second Step',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
          ];
          this.itemsChild = [
            {
              label: 'Awaiting Nurse',
      
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 33;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch: any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
      
            {
              label: 'With Nurse',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 34;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch:any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
      
            {
              label: 'Awaiting Doctor',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 35;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch:any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
      
            {
              label: 'With Doctor',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 36;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch:any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
      
            {
              label: 'Left without seen',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 37;
                this.visitType;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch:any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
      
            {
              label: 'Investigations to do ',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 38;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch:any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
      
            {
              label: 'Seen Completed',
              command: (event: any) => {
                this.AppoinmentBooking.AppId = this.appId;
                this.AppoinmentBooking.PatientStatusId = 3;
                this.AppoinmentBooking.appVisitId = 39;
                this.Service
                  .UpdateAppointmentStatus(
                    this.AppoinmentBooking.AppId,
                    this.AppoinmentBooking.PatientStatusId,
                    this.AppoinmentBooking.appVisitId
                  )
                  .then((ReSch:any) => {
                    this.SearchAppointmentWithpagination();
                    // this.messageService.add({
                    //   severity: 'info',
                    //   detail: event.item.label,
                    // });

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: event.item.label,
                    })
                  });
              },
            },
          ];
    }
FillDropDown(response: any) {
       
    let jParse = JSON.parse(JSON.stringify(response)).cache;

    let visitType = JSON.parse(jParse).VisitType;
    let regLocations = JSON.parse(jParse).RegLocations;
    let schAppointmentCriteria = JSON.parse(jParse).SchAppointmentCriteria;
    let provider = JSON.parse(jParse).Provider;
    let SchAppointmentType = JSON.parse(jParse).SchAppointmentType;
    let speciality = JSON.parse(jParse).providerspecialty;
    let sites = JSON.parse(jParse).RegLocationTypes;
    let regFacility = JSON.parse(jParse).RegFacility;
    let ReschedulingReasons = JSON.parse(jParse).ReschedulingReasons;

    if (ReschedulingReasons) {
        ReschedulingReasons = ReschedulingReasons.map(
          (item: { ReSchId: any; Reasons: any }) => {
            return {
              name: item.Reasons,
              code: item.ReSchId,
            };
          }
        );
        this.ReschedulingReasons = ReschedulingReasons;
      }


    // ✅ Provider
    if (provider) {
           
        this.providers = provider.map((item: { EmployeeId: any; FullName: any }) => ({
            name: item.FullName,
            code: item.EmployeeId,
        }));
    }

    // ✅ Facility
    if (regFacility) {
      regFacility = regFacility.map((item: { Id: number; Name: any }) => {
        return {
          name: item.Name,
          code: item.Id,
        };
      });
      this.facilities = regFacility;
      console.log(this.facilities, 'this.facilities');
    }
    // ✅ Site
    if (sites) {
        this.sites = sites.map((item: { TypeId: any; Name: any }) => ({
            name: item.Name,
            code: item.TypeId,
        }));
    }

    // ✅ Speciality
    if (speciality) {
        this.speciality = speciality.map((item: { SpecialtyID: any; SpecialtyName: any }) => ({
            name: item.SpecialtyName,
            code: item.SpecialtyID,
        }));
    }

    // ✅ Criteria
    if (schAppointmentCriteria) {
        this.appointmentcriteria = schAppointmentCriteria.map((item: { CriteriaId: any; CriteriaName: any }) => ({
            name: item.CriteriaName,
            code: item.CriteriaId,
        }));
    }

    // ✅ Visit Type
    if (visitType) {
        this.visitType = visitType.map((item: { VisitTypeId: any; VisitTypeName: any }) => ({
            name: item.VisitTypeName,
            code: item.VisitTypeId,
        }));
    }

    // ✅ Location
    if (regLocations) {
        this.locations = regLocations.map((item: { LocationId: any; Name: any }) => ({
            name: item.Name,
            code: item.LocationId,
        }));
    }

    // ✅ Appointment Type
    if (SchAppointmentType) {
        this.appointmentType = SchAppointmentType.map((item: { AppTypeId: any; AppType: any }) => ({
            name: item.AppType,
            code: item.AppTypeId,
        }));
    }

  // Layout helper for templates: flips icons/order in RTL

}
get isRtl(): boolean {
  try {
    return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
  } catch {
    return false;
  }
}

  FillCache() {
    this.Service.getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response.cache != null) {
          this.FillDropDown(response);
        }
      })
      .catch((error:any) =>
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        })

        // this.SchedulingApiService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: error.message,
        // })
      );
  }


  // Helper: collapse accordion if it's currently open (mirrors dashboard pattern)
  private collapseIfOpen(toggler?: ElementRef<HTMLButtonElement>) {
    if (!toggler) return;
    const btn = toggler.nativeElement;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      btn.click();
    }
  }


    async SearchAppointmentWithpagination() {
        this.loader.show();
        debugger
        const {
          fromDate,
          toDate,
          providerId,
          facilityId,
          sitesId,
          specialityId,
          criteriaId,
          visitTypeId,
          locationId,
          appointmentId,
        } = this.FilterForm?.value || {};

        const body = {
          fromDate: fromDate && fromDate.trim() !== "" ? fromDate : null,
          toDate: toDate && toDate.trim() !== "" ? toDate : null,
          providerId: providerId || null,
          facilityId: facilityId || null,
          siteId: sitesId || null,
          specialityId: specialityId || null,
          criteriaId: criteriaId || null,
          visitTypeId: visitTypeId || null,
          locationId: locationId || null,
          appointmentTypeId: appointmentId || null,
        };

        await this.Service.SearchAppointmentDBWithPagination(
          body,
          this.PaginationInfo
        ).subscribe(
            (appointment: any) => {
                // Set filter flag based on whether any filter is applied
                this.isAppointmentFiltered = !!(
                    fromDate || toDate || providerId || facilityId || sitesId ||
                    specialityId || criteriaId || visitTypeId || locationId || appointmentId
                );

                if (appointment && Object.keys(appointment).length > 0) {
                    let appointments: any[] = [];
                    for (let i = 0; i < (appointment.table1?.length || 0); i++) {
                        let appointmentStatusColor = 'black'; // Default color
                        if (appointment.table1[i].appStatus === 'Cancelled') {
                            appointmentStatusColor = 'red';
                        } else if (appointment.table1[i].appStatus === 'Rescheduled') {
                            appointmentStatusColor = 'blue';
                        }
                        appointments.push({
                            appointment_Id: appointment.table1[i].appointment_Id,
                            visitAccDisplay: appointment.table1[i].visitAccDisplay,
                            mrNo: appointment.table1[i].mrNo,
                            patient_FName: appointment.table1[i].patient_FName,
                            appDateTime: appointment.table1[i].appDateTime,
                            appointment_SiteName: appointment.table1[i].appointment_SiteName,
                            appType: appointment.table1[i].appType,
                            appStatus: appointment.table1[i].appStatus,
                            appointment_PatientStatus: appointment.table1[i].appointment_PatientStatus,
                            purposeOfVisit: appointment.table1[i].purposeOfVisit,
                            statusColor: appointmentStatusColor,
                        });
                    }
                    this.appointments = appointments;
                    this.totalRecord = appointment?.table2?.[0]?.totalCount || 0;
                    this.loader.hide();
                } else {
                    this.appointments = [];
                    this.totalRecord = 0;
                    this.loader.hide();
                }
                // Close accordion after search, like dashboard behavior
                this.collapseIfOpen(this.appointmentToggler);
            },
            (error: any) => {
                this.loader.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Something went wrong',
                });
            }
        );
    }

    // appointments: any[] = [];

    buttonRoute(path: string) {
        this.router.navigate([path]);
    }

    ClearFilter() {
        if (!this.FilterForm) return;
        this.FilterForm.reset({
            fromDate: '',
            toDate: '',
            providerId: '',
            facilityId: '',
            sitesId: '',
            specialityId: '',
            criteriaId: '',
            visitTypeId: '',
            locationId: '',
            appointmentId: '',
        });
        this.isAppointmentFiltered = false;
        // Refresh list with cleared filters
        this.SearchAppointmentWithpagination();
        // Close accordion after clear
        this.collapseIfOpen(this.appointmentToggler);
    }

    ClickFilter(modalRef: TemplateRef<any>) {
        this.modalService.open(modalRef, {
            backdrop: 'static',
            size: 'xl',
            centered: true,
        });
    }

    PatientStatus(appointmentId:any,patientName:any,mrNo:any,modalContent: any) {
        // your logic
        this.mrNO = mrNo;
        this.appId = appointmentId;
        this.patient_FName = patientName;
        this.modalService.open(modalContent, { size: 'lg', backdrop: 'static' });
    }

    confirmCancel(modalContent: any,appointmentId: any) {
        this.appId = +appointmentId;
        this.modalRef = this.modalService.open(modalContent, { size: 'lg', backdrop: 'static' });

    }

    Reschedule(modalContent: any, appointment: any) {
        this.appId = +appointment.appointment_Id;
        this.modalRef = this.modalService.open(modalContent, { size: 'lg', backdrop: 'static' });

    }
    openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
        this.modalService.open(content, options);
    }
    buttonRouter(path: string): void {
        this.router.navigate([path]);
    }
    onSubmit() {}

    onActiveIndexChange(event: number) {
           ;
        if (event === 1) {
          this.showDiv = true;
        } else {
          this.showDiv = false;
          this.Patientpopup = false;
        }
        this.activeIndex = event;
      }


      cancelApp() {
           ;
        this.changeAppointmentStatus(this.appId,3,false,this.selectedReschedulingReasons.code);

        if (this.modalRef) {
            this.modalRef.close();
          }
      }

    //   rescheduleApp() {
    //     this.changeAppointmentStatus(this.appId,2,false,this.selectedReschedulingReasons.code,false);
    //     }


        ReScheduleApp(appointment: any) {
            this.AppoinmentBooking.AppId = this.appId;
            this.AppoinmentBooking.ProviderId = this.selectedProviders;
            this.AppoinmentBooking.AppDateTime = this.date;
            this.AppoinmentBooking.AppStatusId = 2;
            this.AppoinmentBooking.SiteId = this.selectedSites;
            this.AppoinmentBooking.FacilityId = this.selectedFacility;
            this.AppoinmentBooking.LocationId = this.selectedLocations;
            this.AppoinmentBooking.Reason = this.reason;
        
            this.Service.UpdateRescheduleById(this.AppoinmentBooking).then((ReSch: any) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Appointment Rescheduled Successfully',
                  });
                  if (this.modalRef) {
                    this.modalRef.close();
                  }
                this.SearchAppointmentWithpagination();
              });
          }

      changeAppointmentStatus(
        AppId: number,
        AppStatusId: number,
        ByProvider: boolean,
        RescheduledId: number,
        isCancel: boolean = true
      ) {
        this.Service
          .cancelBooking(AppId, AppStatusId, ByProvider, RescheduledId)
          .then((appointment: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Appointment Successfully Cancelled',
            });
            this.SearchAppointmentWithpagination();
          })
          .catch((error) =>
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Something went wrong',
            })
          );
      }
      
  onActiveChildIndexChange(event: number) {
    this.ChildactiveIndex = event;
    switch (event) {
      case 0:
        this.Patientpopup = false;
        // code block
        break;
      case 1:
        this.Patientpopup = false;
        // code block
        break;
      case 2:
        this.Patientpopup = false;
        // code block
        break;

      case 3:
        this.Patientpopup = false;
        // code block
        break;

      case 4:
        this.Patientpopup = false;
        // code block
        break;

      case 5:
        this.Patientpopup = false;
        // code block
        break;
      case 6:
        this.Patientpopup = false;
        // code block
        break;

      default:
      // code block
    }
  }
 
    pagedappointments: any[] = [];

    async onappointmentsPageChanged(page: number) {
    this.PaginationInfo.Page = page;
    this.setPagedappointmentsData();
    }

    setPagedappointmentsData() {
        this.SearchAppointmentWithpagination();
    // const startIndex = (this.PaginationInfo.Page - 1) * this.PaginationInfo.RowsPerPage;
    // const endIndex = startIndex + this.PaginationInfo.RowsPerPage;
    // this.pagedappointments = this.appointments.slice(startIndex, endIndex);
    }

    FilterAppoinment() {
        this.SearchAppointmentWithpagination();
    }
    private toDateInputValue(d: Date): string {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      // HTML input[type=date] expects YYYY-MM-DD
      return `${year}-${month}-${day}`;
  }

  PatientEdit(appointment: any) {
    // Derive a stable appointment id and persist as fallback for refresh
    const appId: number = Number(appointment?.appointment_Id ?? appointment?.appId ?? 0);
    if (appId) {
      this.secureStorage.setItem('appointmentEditId', String(appId));
    }
    // Navigate using Router state (hide id from URL) and include full object for convenience
    this.router.navigate(['/scheduling/appointment booking'], {
      state: { appId, appointment },
    });
  }
}
