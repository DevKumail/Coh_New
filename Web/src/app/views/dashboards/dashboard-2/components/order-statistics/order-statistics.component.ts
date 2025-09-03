import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgIcon, NgIconComponent} from '@ng-icons/core';
import {
    NgbNav,
    NgbNavContent,
    NgbNavItem,
    NgbNavLink,
    NgbNavOutlet,
    NgbProgressbar,
    NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';
import {orderStatistics, orderStatisticsChartOptions} from '@/app/views/dashboards/dashboard-2/data';
import {EchartComponent} from '@app/components/echart.component';
import {Router, RouterLink, RouterModule} from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SchedulingApiService } from '@/app/views/Scheduling/scheduling.api.service';
import { LoaderService } from '@core/services/loader.service';
import { ChoiceSelectInputDirective } from '@core/directive/choices-select.directive';

@Component({
    selector: 'app-order-statistics',
    imports: [
        NgIcon,
        CommonModule, 
        RouterModule, 
        ReactiveFormsModule,
        GenericPaginationComponent,
        NgIconComponent,
        FormsModule,
        ChoiceSelectInputDirective,
        NgbNav,
        NgbNavItem,
        NgbNavLink,
        NgbNavContent,
        NgbNavOutlet,
        EchartComponent,
        NgbTooltip,
        NgbProgressbar, RouterLink
    ],
    templateUrl: './order-statistics.component.html',
})
export class OrderStatisticsComponent {
    orderStatisticsChartOptions = orderStatisticsChartOptions;
    Math = Math;
    orderStatistics = orderStatistics;
    AppointmentFilterForm!: FormGroup;
    NotificationFilterForm!: FormGroup;
    NotesFilterForm!: FormGroup;
    BilledFilterForm!: FormGroup;
    providers: any[] = [];
    facilities: any[] = [];
    sites: any[] = [];
    // Status filter options
    statusOptions: string[] = [
        'Not Yet Arrived',
        'Check-In',
        'Ready',
        'Seen',
        'Billed',
        'Check-Out',
    ]; 
    PaginationInfo: any = {
        Page: 1,
        RowsPerPage: 10,
    }
    
    appointments: any = [
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },

    ];

    other: any = [
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'Doe',
            mrNo: '1007',
            appointment_PatientStatus: 'Check-Out',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Insurance related query',
            sender: 'Application Admin',
        },
        {
            appDateTime: '2022-01-01',
            patient_FName: 'John',
            mrNo: '1006',
            appointment_PatientStatus: 'Check-up',
            purposeOfVisit: 'N/A',
            appointment_SiteName: 'Womens Health Center',
            subject: 'Normal Report',
            sender: 'Application Admin',
        },
    ];


    cacheItems: string[] = [
        'Provider',
        'RegFacility',
        'RegLocationTypes',
        // 'ReschedulingReasons',
        // 'RegLocations',
        // 'providerspecialty',
        // 'SchAppointmentStatus',
        // 'VisitType',
        // 'SchAppointmentCriteria',
        // 'HREmployee',
      ];

      // Backups for clearing filters
    appointmentsAll: any[] = [];
    otherAll: any[] = [];

    // Filter state flags (control blinking icons)
    isNotificationFiltered = false;
    isNotesFiltered = false;
    isBilledFiltered = false;
    isAppointmentFiltered = false;

    // Accordion toggler references for programmatic collapse
    @ViewChild('notificationToggler') notificationToggler?: ElementRef<HTMLButtonElement>;
    @ViewChild('notesToggler') notesToggler?: ElementRef<HTMLButtonElement>;
    @ViewChild('billedToggler') billedToggler?: ElementRef<HTMLButtonElement>;
    @ViewChild('appointmentToggler') appointmentToggler?: ElementRef<HTMLButtonElement>;
    @ViewChild('statusesSel') statusesSel?: ElementRef<HTMLSelectElement>;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private Service: SchedulingApiService,
        private loader: LoaderService
    ) {}

    ngOnInit(): void {
        this.FillCache();
        // Initialize backups
        this.appointmentsAll = [...this.appointments];
        this.otherAll = [...this.other];
        this.AppointmentFilterForm = this.fb.group({
            providerId: [''],
            sitesId: [''],
            facility: [''],
            appDate: [''],
            // multiple select of statuses
            statuses: [[]],
            showScheduledAppointmentOnly: [false],
            showChargeCapturePending: [false]
        });

        this.NotificationFilterForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
        });
        this.NotesFilterForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
        });
        this.BilledFilterForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
        });
    }


    FillDropDown(response: any) {
        debugger
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;
        let sites = JSON.parse(jParse).RegLocationTypes;
        let regFacility = JSON.parse(jParse).RegFacility;
        let visitType = JSON.parse(jParse).VisitType;
        let regLocations = JSON.parse(jParse).RegLocations;
        let schAppointmentCriteria = JSON.parse(jParse).SchAppointmentCriteria;
        let SchAppointmentType = JSON.parse(jParse).SchAppointmentType;
        let speciality = JSON.parse(jParse).providerspecialty;
        let ReschedulingReasons = JSON.parse(jParse).ReschedulingReasons;
    
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

      async onappointmentsPageChanged(page: number) {
        this.PaginationInfo.Page = page;
        }

    // Helpers
    private collapseIfOpen(toggler?: ElementRef<HTMLButtonElement>) {
        if (!toggler) return;
        // Clicking the toggler will toggle collapse state. We only want to close.
        // If it's expanded (aria-expanded="true"), click to close.
        const btn = toggler.nativeElement;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            btn.click();
        }
    }

    // Notification filters (date range)
    onSearchNotification() {
        const { fromDate, toDate } = this.NotificationFilterForm.value;
        // this.other = this.filterByDate(this.otherAll, fromDate, toDate);
        this.isNotificationFiltered = !!(fromDate || toDate);
        this.collapseIfOpen(this.notificationToggler);
    }
    onClearNotification() {
        this.NotificationFilterForm.reset({ fromDate: '', toDate: '' });
        this.other = [...this.otherAll];
        this.isNotificationFiltered = false;
        this.collapseIfOpen(this.notificationToggler);
    }

    // Notes filters (date range)
    onSearchNotes() {
        const { fromDate, toDate } = this.NotesFilterForm.value;
        // this.other = this.filterByDate(this.otherAll, fromDate, toDate);
        this.isNotesFiltered = !!(fromDate || toDate);
        this.collapseIfOpen(this.notesToggler);
    }
    onClearNotes() {
        this.NotesFilterForm.reset({ fromDate: '', toDate: '' });
        this.other = [...this.otherAll];
        this.isNotesFiltered = false;
        this.collapseIfOpen(this.notesToggler);
    }

    // Billed filters (date range)
    onSearchBilled() {
        const { fromDate, toDate } = this.BilledFilterForm.value;
        // this.other = this.filterByDate(this.otherAll, fromDate, toDate);
        this.isBilledFiltered = !!(fromDate || toDate);
        this.collapseIfOpen(this.billedToggler);
    }
    onClearBilled() {
        this.BilledFilterForm.reset({ fromDate: '', toDate: '' });
        this.other = [...this.otherAll];
        this.isBilledFiltered = false;
        this.collapseIfOpen(this.billedToggler);
    }

    // Appointment filters (provider/facility/site) - sample local filtering
    onSearchAppointment() {
        const { providerId, facility, sitesId, appDate, statuses, showScheduledAppointmentOnly, showChargeCapturePending } = this.AppointmentFilterForm.value;
        const selStatuses: string[] = Array.isArray(statuses) ? statuses : [];

        // this.appointments = this.appointmentsAll
        //     .filter((a: any) => {
        //         // Provider/facility/site not in demo data; passthrough for now
        //         return true;
        //     })
        //     .filter((a: any) => {
        //         // Statuses filter (case-insensitive match against appointment_PatientStatus)
        //         if (!selStatuses.length) return true;
        //         const st = (a.appointment_PatientStatus || '').toLowerCase();
        //         return selStatuses.some(s => String(s).toLowerCase() === st);
        //     })
        //     .filter((a: any) => {
        //         // Date filter: compare YYYY-MM-DD part
        //         if (!appDate) return true;
        //         const d = String(a.appDateTime || '').slice(0, 10);
        //         return d === appDate;
        //     })
            // Hooks for future data-backed filters
            // .filter((a: any) => !showScheduledAppointmentOnly || a.isScheduled === true)
            // .filter((a: any) => !showChargeCapturePending || a.chargeCapturePending === true)
        ;

        this.isAppointmentFiltered = !!(providerId || facility || sitesId || appDate || selStatuses.length || showScheduledAppointmentOnly || showChargeCapturePending);
        this.collapseIfOpen(this.appointmentToggler);
    }
    onClearAppointment() {
        this.AppointmentFilterForm.reset({ 
            providerId: '', 
            facility: '', 
            sitesId: '', 
            appDate: '',
            statuses: [],
            showScheduledAppointmentOnly: false,
            showChargeCapturePending: false,
        });
        // Notify Choices to refresh UI after clearing selections
        setTimeout(() => {
            const el = this.statusesSel?.nativeElement as any;
            if (el) {
                // Clear through Choices API if available
                const inst = el.__choices as { removeActiveItems: () => void } | undefined;
                if (inst && typeof inst.removeActiveItems === 'function') {
                    inst.removeActiveItems();
                } else {
                    // Fallback: clear selected and trigger change
                    Array.from(el.options as HTMLOptionsCollection).forEach((o: HTMLOptionElement) => (o.selected = false));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        });
        this.appointments = [...this.appointmentsAll];
        this.isAppointmentFiltered = false;
        this.collapseIfOpen(this.appointmentToggler);
    }

}
