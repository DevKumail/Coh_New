import { SchedulingApiService } from './../scheduling.api.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-appointments',
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './appointments.component.html',
    // styleUrl: './appointments.component.scss',
    styleUrls: [],
})
export class AppointmentsComponent {
    SchedulingApiService: any;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private Service: SchedulingApiService
    ) {}

    Patientpopup: boolean = false;
    FilterForm!: FormGroup;
    mrNO: any;
    appId: any;
    patient_FName: any;
    filter: boolean = false;
    modalService = new NgbModal();

    messageService = {};
    totalRecord: number = 0;
    FilterData: any = {};
    PaginationInfo: any = {};
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
        debugger
        this.SearchAppointmentWithpagination();

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
    }

    // FillDropDown(response: any) {
    //     let jParse = JSON.parse(JSON.stringify(response)).cache;
    //     console.log(jParse, 'wer');
    //     let visitType = JSON.parse(jParse).VisitType;
    //     let regLocations = JSON.parse(jParse).RegLocations;
    //     let schAppointmentCriteria = JSON.parse(jParse).SchAppointmentCriteria;
    //     let patientNotifiedOptions = JSON.parse(jParse).PatientNotifiedOptions;
    //     let schAppointmentStatus = JSON.parse(jParse).SchAppointmentStatus;
    //     let blPayer = JSON.parse(jParse).BLPayer;
    //     let problemList = JSON.parse(jParse).ProblemList;
    //     let provider = JSON.parse(jParse).Provider;
    //     let SchAppointmentType = JSON.parse(jParse).SchAppointmentType;
    //     let speciality = JSON.parse(jParse).providerspecialty;
    //     let sites = JSON.parse(jParse).RegLocationTypes;
    //     let regFacility = JSON.parse(jParse).RegFacility;
    //     let blPayerPlan = JSON.parse(jParse).BLPayerPlan;

    //     if (blPayer) {
    //         blPayer = blPayer.map((item: { PayerId: any; PayerName: any }) => {
    //             return {
    //                 name: item.PayerName,
    //                 code: item.PayerId,
    //             };
    //         });
    //         this.payer = blPayer;
    //     }

    //     if (sites) {
    //         sites = sites.map((item: { TypeId: any; Name: any }) => {
    //             return {
    //                 name: item.Name,
    //                 code: item.TypeId,
    //             };
    //         });
    //         //this.sites = sites;
    //     }

    //     if (provider) {
    //         provider = provider.map(
    //             (item: { EmployeeId: any; FullName: any }) => {
    //                 return {
    //                     name: item.FullName,
    //                     code: item.EmployeeId,
    //                 };
    //             }
    //         );
    //         this.providers = provider;
    //     }

    //     if (speciality) {
    //         speciality = speciality.map(
    //             (item: { SpecialtyID: any; SpecialtyName: any }) => {
    //                 return {
    //                     name: item.SpecialtyName,
    //                     code: item.SpecialtyID,
    //                 };
    //             }
    //         );

    //         //this.speciality = speciality;
    //     }

    //     if (SchAppointmentType) {
    //         SchAppointmentType = SchAppointmentType.map(
    //             (item: { AppTypeId: any; AppType: any }) => {
    //                 return {
    //                     name: item.AppType,
    //                     code: item.AppTypeId,
    //                 };
    //             }
    //         );

    //         this.type = SchAppointmentType;
    //     }

    //     if (provider) {
    //         this.referred = provider;
    //     }

    //     if (visitType) {
    //         visitType = visitType.map(
    //             (item: { VisitTypeId: any; VisitTypeName: any }) => {
    //                 return {
    //                     name: item.VisitTypeName,
    //                     visittypeid: item.VisitTypeId,
    //                 };
    //             }
    //         );
    //         this.visitType = visitType;
    //     }
    //     if (blPayerPlan) {
    //         blPayerPlan = blPayerPlan.map(
    //             (item: { PlanId: any; PlanName: any }) => {
    //                 return {
    //                     name: item.PlanName,
    //                     code: item.PlanId,
    //                 };
    //             }
    //         );
    //         this.payerPlan = blPayerPlan;
    //     }

    //     this.case = [
    //         { name: 'Case 1', criteriaid: 1 },
    //         { name: 'Case 2', criteriaid: 2 },
    //         { name: 'Case 3', criteriaid: 3 },
    //     ];

    //     this.duration = [
    //         { name: '15 minutes', criteriaid: 1, value: '15' },
    //         { name: '30 minutes', criteriaid: 2, value: '30' },
    //         { name: '45 minutes', criteriaid: 3, value: '45' },
    //     ];

    //     if (regLocations) {
    //         regLocations = regLocations.map(
    //             (item: { LocationId: any; Name: any }) => {
    //                 return {
    //                     name: item.Name,
    //                     locationid: item.LocationId,
    //                 };
    //             }
    //         );
    //         this.locations = regLocations;
    //     }

    //     if (schAppointmentCriteria) {
    //         schAppointmentCriteria = schAppointmentCriteria.map(
    //             (item: { CriteriaId: any; CriteriaName: any }) => {
    //                 return {
    //                     name: item.CriteriaName,
    //                     criteriaid: item.CriteriaId,
    //                 };
    //             }
    //         );

    //         this.criteriaId = schAppointmentCriteria;
    //     }

    //     if (regFacility) {
    //         regFacility = regFacility.map((item: { Id: number; Name: any }) => {
    //             return {
    //                 name: item.Name,
    //                 code: item.Id,
    //             };
    //         });
    //         this.facilities = regFacility;
    //         console.log(this.facilities, 'this.facilities');
    //     }

    //     if (patientNotifiedOptions) {
    //         patientNotifiedOptions = patientNotifiedOptions.map(
    //             (item: { NotifiedId: any; NotifiedOptions: any }) => {
    //                 return {
    //                     name: item.NotifiedOptions,
    //                     notifiedid: item.NotifiedId,
    //                 };
    //             }
    //         );
    //         this.notified = patientNotifiedOptions;
    //     }

    //     if (schAppointmentStatus) {
    //         schAppointmentStatus = schAppointmentStatus.map(
    //             (item: { AppStatusId: any; AppStatus: any }) => {
    //                 return {
    //                     name: item.AppStatus,
    //                     appstatusid: item.AppStatusId,
    //                 };
    //             }
    //         );

    //         this.status = schAppointmentStatus;
    //     }

    //     if (problemList) {
    //         problemList = problemList.map(
    //             (item: { ProblemId: any; ProblemName: any }) => {
    //                 return {
    //                     name: item.ProblemName,
    //                     problemid: item.ProblemId,
    //                 };
    //             }
    //         );
    //         this.purpose = problemList;
    //     }

    //     this.SchedulingApiService.getEmployeeFacilityFromCache()
    //         .then((response: any) => {
    //             if (response.cache != null) {
    //                 let jParse = JSON.parse(JSON.stringify(response)).cache;
    //                 let hremployeefacility = JSON.parse(jParse);
    //                 if (hremployeefacility) {
    //                     let facilityIds = hremployeefacility.map(
    //                         (item: { FacilityID: any }) => {
    //                             return item.FacilityID;
    //                         }
    //                     );
    //                 }
    //             }
    //         })
    //         .catch((error: any) =>
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: error.message || 'Something went wrong',
    //             })
    //         );
    // }



FillDropDown(response: any) {
    debugger
    let jParse = JSON.parse(JSON.stringify(response)).cache;

    let visitType = JSON.parse(jParse).VisitType;
    let regLocations = JSON.parse(jParse).RegLocations;
    let schAppointmentCriteria = JSON.parse(jParse).SchAppointmentCriteria;
    let provider = JSON.parse(jParse).Provider;
    let SchAppointmentType = JSON.parse(jParse).SchAppointmentType;
    let speciality = JSON.parse(jParse).providerspecialty;
    let sites = JSON.parse(jParse).RegLocationTypes;
    let regFacility = JSON.parse(jParse).RegFacility;



    // ✅ Provider
    if (provider) {
        debugger
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
}

  FillCache() {
    this.SchedulingApiService
      .getCacheItem({ entities: this.cacheItems })
      .then((response: { cache: null; }) => {
        if (response.cache != null) {
          this.FillDropDown(response);
        }
      })
      .catch((error:any) =>
        this.SchedulingApiService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        })
      );
  }


    SearchAppointmentWithpagination() {
        this.Service.SearchAppointmentDBWithPagination(
            this.FilterData,
            this.PaginationInfo
        ).subscribe(
            (appointment: any) => {
                if (appointment != null) {
                    let appointments = [];
                    for (let i = 0; i < appointment.table1.length; i++) {
                        let appointmentStatusColor = 'black'; // Default color
                        if (appointment.table1[i].appStatus === 'Cancelled') {
                            appointmentStatusColor = 'red';
                        } else if (
                            appointment.table1[i].appStatus === 'Rescheduled'
                        ) {
                            appointmentStatusColor = 'blue';
                        }
                        appointments.push({
                            appointment_Id:
                                appointment.table1[i].appointment_Id,
                            visitAccDisplay:
                                appointment.table1[i].visitAccDisplay,
                            mrNo: appointment.table1[i].mrNo,
                            patient_FName: appointment.table1[i].patient_FName,
                            appDateTime: appointment.table1[i].appDateTime,
                            appointment_SiteName:
                                appointment.table1[i].appointment_SiteName,
                            appType: appointment.table1[i].appType,
                            appStatus: appointment.table1[i].appStatus,
                            appointment_PatientStatus:
                                appointment.table1[i].appointment_PatientStatus,
                            purposeOfVisit:
                                appointment.table1[i].purposeOfVisit,
                            statusColor: appointmentStatusColor,
                        });
                    }
                    this.appointments = appointments;
                    this.totalRecord = appointment.table2[0].totalCount;
                } else {
                    this.appointments = [];
                    this.totalRecord = 0;
                }
            },
            (error: any) => {
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

    ClearFilter() {}
    ClickFilter(modalRef: TemplateRef<any>) {
        this.modalService.open(modalRef, {
            backdrop: 'static',
            size: 'xl',
            centered: true,
        });
    }

    PatientStatus(event: any, appointment: any, position: string) {
        // your logic
    }

    confirmCancel(event: any, appointment: any, position: string) {

    }

    Reschedule(event: any, appointment: any, position: string) {
        // your logic
    }
    openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
        this.modalService.open(content, options);
    }
    buttonRouter(path: string): void {
        this.router.navigate([path]);
    }
    onSubmit() {}
}
