import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import moment from 'moment';
import { Router } from '@angular/router';
import { SchedulingApiService } from '../scheduling.api.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {FlatpickrDirective, provideFlatpickrDefaults} from 'angularx-flatpickr';
import { FlatpickrModule } from 'angularx-flatpickr';
@Component({
  selector: 'app-appointment-dashboard',
   imports: [
    CommonModule,
    NgbNavModule,
    FormsModule,
    FlatpickrModule,
    FullCalendarModule,
    FlatpickrDirective,
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
  @ViewChild('eventDetailsModal') eventDetailsModal!: TemplateRef<any>;

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
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: 3,
    themeSystem: 'standard',
    
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      startTime: '08:00',
      endTime: '20:00'
    },
    nowIndicator: true,
    stickyHeaderDates: true,
    height: 'auto',
    expandRows: true,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    slotDuration: '00:30:00',
    slotEventOverlap: false,
    eventOverlap: false,
    eventMaxStack: 2,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: true },
    eventDisplay: 'block',
    moreLinkClick: 'popover',
    eventClassNames: (arg) => ['appt-orange'],
    datesSet: (_arg) => {
      this.slotGroups.clear();
    },
    eventContent: (arg) => {
      const xp: any = arg.event.extendedProps || {};
      const mrno = xp.mrno || xp.MRNo || xp.mrNo || '';
      const provider = xp.provider || xp.providerName || xp.ProviderName || xp.provider_name || '';
      // const patient = xp.fullName || xp.patientName || xp.PatientName || '';
      const viewType = (arg.view as any)?.type as string;

      // Build content per view
      let inner = '';
      if (viewType === 'dayGridMonth' || viewType === 'listWeek') {
        // Month/List: MRNO | Provider
        inner = `
          <div class="fc-event-inner fc-chip fc-chip--month">
            <span class="fc-chip-icon" title="Details" style="cursor: pointer;">👁️</span>
            <span class="fc-event-meta">
              <span class="fc-mrno"><b>${mrno || 'N/A'}</b></span>
              <span class="fc-sep">|</span>
              <span class="fc-provider">${provider || 'N/A'}</span>
            </span>
          </div>`;
      } else if (viewType === 'timeGridWeek') {
        // Week: MRNO | Patient Name
        inner = `
          <div class="fc-event-inner fc-chip fc-chip--week" >
            <span class="fc-chip-icon" title="Details" style="cursor: pointer;">👁️</span>
            <span class="fc-event-meta">
              <span class="fc-mrno"><b>${mrno || 'N/A'}</b></span>
      
            </span>
          </div>`;
      } else if (viewType === 'timeGridDay') {
        // Day: MRNO only
        inner = `
          <div class="fc-event-inner fc-chip">
            <span class="fc-chip-icon" title="Details" style="cursor: pointer;" >👁️</span>
            <span class="fc-event-meta" >
              <span class="fc-mrno"><b>${mrno || 'N/A'}</b></span>
              <span class="fc-sep">|</span>
              <span class="fc-provider">${provider || 'N/A'}</span>
            </span>
          </div>`;
      } else {
        // Fallback
        inner = `
          <div class="fc-event-inner fc-chip">
            <span class="fc-chip-icon" title="Details" style="cursor: pointer;">👁️</span>
            <span class="fc-event-meta">
              <span class="fc-mrno"><b>${mrno || 'N/A'}</b></span>
              <span class="fc-sep">|</span>
              <span class="fc-provider">${provider || 'N/A'}</span>
            </span>
          </div>`;
      }
      return { html: inner } as any;
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: (info) => {
      const xp: any = info.event.extendedProps || {};
      const mrno = xp.mrno || xp.MRNo || xp.mrNo || '';
      const provider = xp.provider || xp.providerName || xp.ProviderName || xp.provider_name || '';
      const patient = xp.fullName || xp.patientName || xp.PatientName || '';
      const viewType = (info.view as any)?.type as string;
      const time = info.timeText ? `\n${info.timeText}` : '';
      // Tooltip per view
      let tip = '';
      if (viewType === 'dayGridMonth' || viewType === 'listWeek') {
        tip = `${mrno || ''}${mrno && provider ? ' | ' : ''}${provider || ''}`;
      } else if (viewType === 'timeGridWeek') {
        tip = `${mrno || ''}${mrno && provider ? ' | ' : ''}${provider || ''}`;
      } else if (viewType === 'timeGridDay') {
        tip = `${mrno || ''}${mrno && provider ? ' | ' : ''}${provider || ''}`;
      } else {
        tip = `${mrno || ''}${mrno && provider ? ' | ' : ''}${provider || ''}`;
      }
      info.el.setAttribute('title', `${tip}${time}`);
      const icon = info.el.querySelector('.fc-chip-icon');
      if (icon) {
        icon.addEventListener('click', (e: Event) => {
          e.stopPropagation();
          this.openEventDetails(info.event);
        });
      }

      // Custom top-2 inline for Week view only
      if (viewType === 'timeGridWeek') {
        const start = info.event.start as Date | null;
        if (start) {
          // Bucket by 30-minute slot so near starts align in one row
          const slotMs = 30 * 60 * 1000; // keep in sync with slotDuration '00:30:00'
          const bucket = new Date(Math.floor(start.getTime() / slotMs) * slotMs);
          const key = `${viewType}|${bucket.toISOString()}`;
          let group = this.slotGroups.get(key);
          if (!group) {
            group = { expanded: false, events: [], moreEl: null };
            this.slotGroups.set(key, group);
          }
          group.events.push(info.el as HTMLElement);

          // Hide beyond top 2 if not expanded
          if (!group.expanded && group.events.length > 2) {
            (info.el as HTMLElement).style.display = 'none';
          }

          // Apply pack classes to visible items to control content density
          const applyPackClasses = () => {
            const visibleCount = group!.expanded ? group!.events.length : Math.min(2, group!.events.length);
            // Determine baseline top from first visible element
            let baseTop: string | null = null;
            group!.events.forEach((el, idx) => {
              el.classList.remove('fc-pack-1', 'fc-pack-2', 'fc-pack-3');
              if (group!.expanded) {
                // when expanded, keep default (no pack) for readability
                el.style.display = '';
                return;
              }
              if (idx < visibleCount) {
                el.style.display = '';
                el.classList.add(`fc-pack-${visibleCount}`);
                // establish common baseline top
                if (!baseTop) {
                  const cs = (el.ownerDocument.defaultView || window).getComputedStyle(el);
                  baseTop = cs.top || el.style.top || '0px';
                }
                el.style.top = baseTop as string; // align to same row
                // natural height for better readability
                el.style.height = '';
                // el.style.width = '100px';
              } else {
                // hide everything beyond top-2 when collapsed
                (el as HTMLElement).style.display = 'none';
              }
            });
          };
          applyPackClasses();

          // Ensure a '+N more' chip within the same harness container
          const container = info.el.parentElement as HTMLElement | null;
          if (container) {
            const ensureMoreEl = () => {
              const hiddenCount = Math.max(0, group!.events.length - 2);
              const anchorEl = group!.events[0] as HTMLElement | undefined;
              // Always enforce top-2 visibility when collapsed
              if (!group!.expanded) {
                group!.events.forEach((el, idx) => {
                  (el as HTMLElement).style.display = idx > 1 ? 'none' : '';
                });
              }
              if (hiddenCount <= 0) {
                if (group!.moreEl) { group!.moreEl.remove(); group!.moreEl = null; }
                return;
              }
              if (!anchorEl) return;
              if (!group!.moreEl) {
                const more = document.createElement('span');
                more.className = 'fc-slot-more-badge';
                more.textContent = `+${hiddenCount}`;
                more.addEventListener('click', (e) => {
                  e.stopPropagation();
                  group!.expanded = !group!.expanded;
                  if (group!.expanded) {
                    group!.events.forEach((el) => (el.style.display = ''));
                    more.textContent = '−';
                  } else {
                    group!.events.forEach((el, idx) => (el.style.display = idx > 1 ? 'none' : ''));
                    more.textContent = `+${Math.max(0, group!.events.length - 2)}`;
                  }
                  applyPackClasses();
                });
                anchorEl.style.position = anchorEl.style.position || 'relative';
                anchorEl.appendChild(more);
                group!.moreEl = more as unknown as HTMLElement;
              } else {
                group!.moreEl.textContent = `+${hiddenCount}`;
              }
            };
            ensureMoreEl();
          }
        }
      }
    },
    events: []
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

  // UI State for details
  selectedEvent: any = null;

  // TimeGrid overflow groups (week/day): key = ISO start time
  private slotGroups = new Map<string, { expanded: boolean; events: HTMLElement[]; moreEl: HTMLElement | null }>();

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
    this.fullName = 'N/A'
    this.appointment = ''
    this.action = true;
    this.modalService.open(this.appointmentModal, { size: 'lg' });
    this.dateSelected = clickInfo.dateStr;
  }

  handleEventClick(clickInfo: EventClickArg) {
    const extProp: any = clickInfo.event.extendedProps;
    this.appointment = ''
    this.appId = extProp.appId || 0;
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
          console.log('appointment.table1', appointment.table1);
          const events = appointment.table1.map((app: any) => ({
            start: app.appointment_Date,
            title: app.appType,
            extendedProps: {
              appId: app.appointment_Id,
              mrno: app.mrNo ?? '',
              provider: app.fullName ?? '',
              purposeOfVisit: app.purposeOfVisit ?? '',
              fullName: `${app.patient_FName ?? ''} ${app.patient_MName ?? ''} ${app.patient_LName ?? ''}`.trim(),
              PatientStatus: app.appointment_PatientStatus ?? '',
              visitStatusName: app.visitStatusName ?? '',
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
        this.modalService.dismissAll();
        break;
      case 1:
        this.router.navigate(['/scheduling/appointment/list']);
        this.modalService.dismissAll();
        break;
      case 2:
        this.confirmCancel();
        // this.modalService.dismissAll();
        break;
      case 3:
        this.reschpopup = true;
        this.modalService.open(this.rescheduleAppointmentModal, { size: 'xl', centered: true });
        break;
    }
    this.action = false;
  }

  openEventDetails(event: any) {
    this.selectedEvent = null;
    const evtDate: any = event?.start || (event as any)?.date || null;
    this.selectedEvent = {
      title: event?.title,
      date: evtDate,
      timeText: (event as any)?._context?.viewApi?.calendar?.formatDate
        ? (event as any)?._context.viewApi.calendar.formatDate(evtDate, { hour: '2-digit', minute: '2-digit', hour12: true })
        : '',
      fullName: event?.extendedProps?.fullName,
      appId: event?.extendedProps?.appId,
      mrno: event?.extendedProps?.mrno,
      provider: event?.extendedProps?.provider,
      purposeOfVisit: event?.extendedProps?.purposeOfVisit,
      PatientStatus: event?.extendedProps?.PatientStatus,
      visitStatusName: event?.extendedProps?.visitStatusName,
    };
    this.modalService.open(this.eventDetailsModal, { size: 'lg' });
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
    this.changeAppointmentStatus(this.appId, 2, false, this.selectedReschedulingReasons?.code || 0, false);
  }

  changeAppointmentStatus(AppId: number, AppStatusId: number, ByProvider: boolean, RescheduledId: number, isCancel: boolean = true) {
    this.cancelpopup = false;
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
    this.appId = 0;
    this.fullName = 'N/A';
  }
}

// Interfaces

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
