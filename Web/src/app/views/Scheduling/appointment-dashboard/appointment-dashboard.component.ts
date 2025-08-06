import { Component, OnInit,inject, TemplateRef, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import moment from 'moment';
import { Router } from '@angular/router';
import { SchedulingApiService } from '../scheduling.api.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import {NgbModal, NgbModalModule, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@/app/shared/icons.module';
import Swal from 'sweetalert2';
import {FlatpickrDirective, provideFlatpickrDefaults} from 'angularx-flatpickr';
import {ColorChromeModule} from 'ngx-color/chrome';
import {ColorSketchModule} from 'ngx-color/sketch';
import {ColorSliderModule} from 'ngx-color/slider';
import {ColorTwitterModule} from 'ngx-color/twitter';
import {NgxDaterangepickerBootstrapDirective} from "ngx-daterangepicker-bootstrap";
import { FlatpickrModule } from 'angularx-flatpickr';
@Component({
  selector: 'app-appointment-dashboard',
   imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbNavModule,
    IconsModule,
    FormsModule,
    FlatpickrModule,
    FullCalendarModule,
    FlatpickrDirective,
    ColorSketchModule, 
    ColorChromeModule, 
    ColorSliderModule, 
    ColorTwitterModule, 
    // PageTitleComponent, 
    // NgIcon, 
    // NgxDaterangepickerBootstrapDirective
    // NgxDaterangepickerBootstrapDirective
    // NgxPermissionsDirective
  ],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './appointment-dashboard.component.html',
  styleUrls: ['./appointment-dashboard.component.scss']
})
export class AppointmentDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private schedulingService : SchedulingApiService,
    private modalService: NgbModal
  ) { }
  @ViewChild('appointmentModal') appointmentModal!: TemplateRef<any>;
  @ViewChild('fullWidthModal', { static: true }) fullWidthModal!: TemplateRef<HTMLElement>;
  @ViewChild('cancelAppointmentModal') cancelAppointmentModal!: TemplateRef<any>;
  @ViewChild('rescheduleAppointmentModal', { static: true }) rescheduleAppointmentModal!: TemplateRef<any>;

  actions: AppointmentActions[] = [];
  selectedAction?: AppointmentActions;
  action = false;
  filter = false;
  reschpopup = false;
  cancelpopup = false;
  dateSelected: string = '';
  appId: number = 0;
  fullName: string = '';
  appointment: string = '';
  rangeDates: Date[] = [];
  date: Date = new Date();


  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    themeSystem: 'standard',
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [
    {
      title: 'Consultation',
      start: '2025-07-30',
      color: '#ff9900' // orange event
    }
    ]
  };

  // Dropdown Options
  appointmentType: any[] = [];
  appointmentstatus: any[] = [];
  appointmentcriteria: any[] = [];
  visitType: any[] = [];
  ReschedulingReasons: any[] = [];
  facilities: any[] = [];
  speciality: any[] = [];
  provider: any[] = [];
  sites: any[] = [];
  locations: any[] = [];

  // Selected Filter Options
  selectedFacility: any;
  selectedSpeciality: any;
  selectedProviders: any;
  selectedSites: any;
  selectedLocations: any;
  selectedappointmentstatus: any;
  selectedappointmentType: any;
  selectedappointmentcriteria: any;
  selectedvisitType: any;
  selectedReschedulingReasons: any;

  cacheItems: string[] = [
    'ReschedulingReasons', 'RegLocations', 'RegLocationTypes', 'Provider',
    'providerspecialty', 'RegFacility', 'SchAppointmentStatus',
    'VisitType', 'SchAppointmentCriteria'
  ];

  ngOnInit(): void {
    this.appointmentType = [
      { name: 'All Appointments', code: '0' },
      { name: 'Schedule Appointments', code: '1' },
      { name: 'Availability Appointments', code: '2' }
    ];
    this.FillCache();
    this.SearchAppointment('', '');
  }

  handleDateClick(clickInfo: DateClickArg) {
    this.appId = 0;
    this.action = true;
    this.modalService.open(this.appointmentModal, { size: 'lg' });
    this.dateSelected = clickInfo.dateStr;
  }

  handleEventClick(clickInfo: EventClickArg) {
    const extProp: any = clickInfo.event.extendedProps;
    this.appId = extProp.appId;
    this.fullName = extProp.fullName;
    this.action = true;
    this.modalService.open(this.appointmentModal, { size: 'lg' });

  }

  FillCache() {
    this.schedulingService.getCacheItem({ entities: this.cacheItems }).then((response: any) => {
      if (response.cache) {
        this.FillDropDown(JSON.parse(JSON.stringify(response)).cache);
      }
    }).catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
          });
    });
  }

  FillDropDown(cache: any) {
    const parsed = JSON.parse(cache);
    this.locations = this.mapToDropdown(parsed.RegLocations, 'LocationId', 'Name');
    this.sites = this.mapToDropdown(parsed.RegLocationTypes, 'TypeId', 'Name');
    this.speciality = this.mapToDropdown(parsed.providerspecialty, 'SpecialtyID', 'SpecialtyName');
    this.provider = this.mapToDropdown(parsed.Provider, 'EmployeeId', 'FullName');
    this.appointmentstatus = this.mapToDropdown(parsed.SchAppointmentStatus, 'AppStatusId', 'AppStatus');
    this.appointmentcriteria = this.mapToDropdown(parsed.SchAppointmentCriteria, 'CriteriaId', 'CriteriaName');
    this.visitType = this.mapToDropdown(parsed.VisitType, 'VisitTypeId', 'VisitTypeName');
    this.ReschedulingReasons = this.mapToDropdown(parsed.ReschedulingReasons, 'ReSchId', 'Reasons');

    this.schedulingService.getEmployeeFacilityFromCache().then((res: any) => {
      const empFacilities = JSON.parse(JSON.parse(JSON.stringify(res)).cache);
      const facilityIds = empFacilities.map((item: any) => item.FacilityID);
      const allFacilities = this.mapToDropdown(parsed.RegFacility, 'Id', 'Name');
      this.facilities = allFacilities.filter((item: any) => facilityIds.includes(item.code));
    });
  }

  mapToDropdown(array: any[], codeKey: string, nameKey: string) {
    return array?.map(item => ({
      name: item[nameKey],
      code: item[codeKey]
    })) || [];
  }

  SearchAppointment(from: string, to: string, ProviderID?: number, LocationID?: number, SpecialityID?: number, SiteID?: number, FacilityID?: number, Page?: number, Size?: number) {
    const currentDate = moment().format('YYYY-MM-DD');
    to = to || currentDate;
    from = from || '2022-09-28';

    this.schedulingService.searchAppointment(from, to, ProviderID, LocationID, SpecialityID, SiteID, FacilityID, Page, Size)
      .then((appointment: any) => {
        if (appointment.table1?.length) {
          const events = appointment.table1.map((app: any) => ({
            date: app.appointment_Date,
            title: app.appType,
            color: '#ffafff',
            backgroundColor: 'red',
            extendedProps: {
              appId: app.appointment_Id,
              fullName: `${app.patient_FName} ${app.patient_MName} ${app.patient_LName}`
            }
          }));
          this.calendarOptions.events = events;
        } else {
          this.calendarOptions.events = [];
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'No Events Found',
          });
        }
      })
      .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
          });
      });
  }

  ClickFilter() {
    this.filter = true;
  }

  SubmitFilter() {
    this.filter = false;
    const fa = this.selectedFacility?.code;
    const sp = this.selectedSpeciality?.code;
    const pr = this.selectedProviders?.code;
    const site = this.selectedSites?.code;
    const loc = this.selectedLocations?.code;

    const from = this.rangeDates?.[0] ? moment(this.rangeDates[0]).format('YYYY-MM-DD') : '2020-01-01';
    const to = this.rangeDates?.[1] ? moment(this.rangeDates[1]).format('YYYY-MM-DD') : '2021-01-01';

    this.SearchAppointment(from, to, pr, loc, sp, site, fa);
  }

  SubmitAction() {
    switch (+this.appointment) {
      case 0:
        this.router.navigateByUrl(`/scheduling/appointment/create?date=${this.dateSelected}`);
        break;
      case 1:
        this.router.navigate(['/scheduling/appointment/list']);
        break;
      case 2:
        this.confirmCancel();
        break;
      case 3:
        this.reschpopup = true;
        this.modalService.open(this.rescheduleAppointmentModal, { size: 'xl', centered: true });
        break;
    }
    this.action = false;
    this.modalService.dismissAll(); 
  }

  // confirmCancel(position: string) {
  //   this.position = position;
  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to cancel?',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.cancelpopup = true;
  //     },
  //     reject: () => {
  //       Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'You have rejected',
  //         });
  //       },
  //     key: 'positionDialog'
  //   });
  // }

  confirmCancel() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to cancel the appointment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      this.cancelpopup = true;  // ✅ Open your modal or do cancel logic here
      this.modalService.open(this.cancelAppointmentModal, { size: 'lg' });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        icon: 'error',
        title: 'Cancelled',
        text: 'You have rejected',
      });
    }
  });
}

  cancelApp() {
    this.changeAppointmentStatus(this.appId, 3, false, this.selectedReschedulingReasons.code);
  }

  rescheduleApp() {
    this.changeAppointmentStatus(this.appId, 2, false, this.selectedReschedulingReasons.code, false);
  }

  changeAppointmentStatus(AppId: number, AppStatusId: number, ByProvider: boolean, RescheduledId: number, isCancel: boolean = true) {
    this.cancelpopup = false;
    this.modalService.dismissAll();
    this.reschpopup = false;
    this.modalService.dismissAll();
    this.schedulingService.cancelBooking(AppId, AppStatusId, ByProvider, RescheduledId)
      .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: isCancel ? 'Appointment Successfully Cancelled' : 'Appointment Successfully Rescheduled',
          });
      })
      .catch((error: any) => {
         Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
          });
      });
  }

  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    this.modalService.open(content, options);
  }
}

// Interfaces
export interface AppointmentActions {
  name: string;
  code: number;
}

export interface Patient {
  memberId: string;
  payerName: string;
  plan: string;
}

export interface RegPatient {
  mrNo: string;
  patientBirthDate: string;
  patientPicture: string;
  personCellPhone: string;
  personFirstName: string;
  personSex: string;
  personEmail: string;
  personSocialSecurityNo: string;
  personZipCode: string;
}

export interface History {
  mrno: number;
  personFullName: string;
  personTitleId: string;
  personSex: string;
  personEmail: string;
  personAddress1: string;
  employmentCompanyName: string;
}

export interface Family {
  mrno: number;
  personfirstname: string;
  personsex: string;
  relationship: string;
  personAddress1: string;
  passportNo: string;
}

export interface AppointmentHistory {
  appId: number;
  providerId: number;
  provider: string;
  mrNo: number;
  appDateTime: string | Date;
  appStatusId: number;
  appStatus: string;
  patientStatusId: number;
  patientStatus: string;
  rescheduleId: number;
  reasons: string;
  visitStatusId: number;
  visitAccountNo: number;
  visitTypeId: number;
  duration: number;
  siteId: number;
  purposeOfVisit: string;
  viewPatientName: string;
  appCriteriaId: number;
  appTypeId: number;
  isConsultationVisit: string;
  patientNotifiedId: string;
  caseId: string;
}
