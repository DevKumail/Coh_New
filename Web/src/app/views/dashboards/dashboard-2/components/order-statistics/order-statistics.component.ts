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
import { Roles } from '@/app/shared/enum/roles.enum';
import { SecureStorageService } from '@core/services/secure-storage.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';

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
        NgbProgressbar, RouterLink, TranslatePipe
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
    appointmentstotaldata: any;
    // Status filter options
    statusOptions: any[] = [
        {id: 1 , name: 'Not Yet Arrived'},
        {id: 2 , name: 'Check-In'},
        {id: 3 , name: 'Ready'},
        {id: 4 , name: 'Seen'},
        {id: 5 , name: 'Billed'},
        {id: 6 , name: 'Check-Out'},
    ]; 
    PaginationInfo: any = {
        Page: 1,
        RowsPerPage: 10,
    }
    
    tableStatus: any [] = [
       {id: 33 , name: 'Awaiting Nurse'},
       {id: 34 , name: 'With Nurse'},
       {id: 35 , name: 'Awaiting Doctor'},
       {id: 36 , name: 'With Doctor'},
       {id: 37 , name: 'Left Without Seen'},
       {id: 38 , name: 'Investigations to do'},
       {id: 39 , name: 'Seen Completed'},
    ]
   

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

    appointments: any = [];


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

    // Current role id from session storage
    currentRoleId: number = Number(sessionStorage.getItem('empId') || 0);

    // Role-based visibility helpers
    get canShowNotes(): boolean {
        return this.currentRoleId === Roles.Provider || this.currentRoleId === Roles.Nurse;
    }
    get canShowBilled(): boolean {
        return this.currentRoleId === Roles.Biller;
    }

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private Service: SchedulingApiService,
        private loader: LoaderService,
        private secureStorage: SecureStorageService
    ) {}

    async ngOnInit() {

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

        // Set default appDate to today's date in YYYY-MM-DD format (for date input)
        this.AppointmentFilterForm.patchValue({ appDate: this.toDateInputValue(new Date()) });

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

        this.FillCache();
        let UserId = sessionStorage.getItem('userId');
        let EmpId = sessionStorage.getItem('empId');
        console.log('UserId =>',UserId);
        console.log('EmpId =>',EmpId);
        debugger
        if(EmpId != null && EmpId != "" && EmpId != undefined && EmpId != "0" && EmpId == "1"){
            this.AppointmentFilterForm.patchValue({ providerId: UserId });
        }
        await this.getAllDashboardData();
        
    }


    FillDropDown(response: any) {
         
        let jParse = JSON.parse(JSON.stringify(response)).cache;
        let provider = JSON.parse(jParse).Provider;
        let sites = JSON.parse(jParse).RegLocationTypes;
        let regFacility = JSON.parse(jParse).RegFacility;
        // let visitType = JSON.parse(jParse).VisitType;
        // let regLocations = JSON.parse(jParse).RegLocations;
        // let schAppointmentCriteria = JSON.parse(jParse).SchAppointmentCriteria;
        // let SchAppointmentType = JSON.parse(jParse).SchAppointmentType;
        // let speciality = JSON.parse(jParse).providerspecialty;
        // let ReschedulingReasons = JSON.parse(jParse).ReschedulingReasons;
    
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

        this.onSearchAppointment();
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
    async onSearchAppointment() {
        this.loader.show();
        const { providerId, facility, sitesId, appDate, statuses, showScheduledAppointmentOnly, showChargeCapturePending } = this.AppointmentFilterForm.value;
        const selStatuses: string[] = Array.isArray(statuses) ? statuses : [];

        console.log( 'AppointmentFilterForm',this.AppointmentFilterForm.value);
        const body = {
            ToDate: this.AppointmentFilterForm.value.appDate,
            FromDate: this.AppointmentFilterForm.value.appDate,
            ProviderID : this.AppointmentFilterForm.value.providerId,
            FacilityID : this.AppointmentFilterForm.value.facility,
            SiteID : this.AppointmentFilterForm.value.sitesId,
            AppStatusIds : this.AppointmentFilterForm.value.statuses,
            showScheduledAppointmentOnly : this.AppointmentFilterForm.value.showScheduledAppointmentOnly,
            Page: this.PaginationInfo.Page,
            Size: this.PaginationInfo.RowsPerPage,
        }
        await this.Service.SearchDashboardAppointment(body).then((res:any)=>{
            this.appointments = res.table1 || [];
            // this.appointmentstotaldata = res.table2;

            if (res && res.table2) {
                this.appointmentstotaldata = res.table2[0].totalCount;  // total count
              }

            console.log(this.appointments,'this.appointments response');
            this.loader.hide();
        })
        this.loader.hide();
        this.isAppointmentFiltered = !!(providerId || facility || sitesId || appDate || selStatuses.length || showScheduledAppointmentOnly || showChargeCapturePending);
        this.collapseIfOpen(this.appointmentToggler);
    }
    async onClearAppointment() {
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
        await this.getAllDashboardData();
        this.isAppointmentFiltered = false;
        this.collapseIfOpen(this.appointmentToggler);
    }


    async getAllDashboardData() {
         
        this.loader.show();
        const { providerId, facility, sitesId, appDate, statuses, showScheduledAppointmentOnly, showChargeCapturePending } = this.AppointmentFilterForm.value;
        const selStatuses: string[] = Array.isArray(statuses) ? statuses : [];

        const body = {
            ToDate: this.AppointmentFilterForm.value?.appDate,
            FromDate: this.AppointmentFilterForm.value?.appDate,
            ProviderID : this.AppointmentFilterForm.value?.providerId,
            FacilityID : this.AppointmentFilterForm.value?.facility,
            SiteID : this.AppointmentFilterForm.value?.sitesId,
            AppStatusIds : this.AppointmentFilterForm.value?.statuses,
            showScheduledAppointmentOnly : this.AppointmentFilterForm.value?.showScheduledAppointmentOnly,
            Page: this.PaginationInfo.Page,
            Size: this.PaginationInfo.RowsPerPage,
        }
        await this.Service.SearchDashboardAppointment(body).then((res:any)=>{
            this.appointments = res?.table1 || [];
            if (res && res?.table2) {
                this.appointmentstotaldata = res?.table2?.[0]?.totalCount;  // total count
            }
            this.loader.hide();
        })
        this.isAppointmentFiltered = !!(providerId || facility || sitesId || appDate || selStatuses.length || showScheduledAppointmentOnly || showChargeCapturePending);

        this.loader.hide();
    }

    // Helper: format a Date to YYYY-MM-DD for input[type="date"]
    private toDateInputValue(d: Date): string {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Change appointment status from action menu
    async onChangeAppointmentStatus(appointment: any, appVisitId: number) {
        try {
            const appId: number = Number(appointment?.appointment_Id ?? appointment?.appId ?? 0);
            // Try common visit id property names, fallback to 0 if not available

            if (!appId) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Invalid appointment id.' });
                return;
            }

            const confirmRes = await Swal.fire({
                icon: 'question',
                title: 'Change Status',
                text: 'Do you want to change the status of this appointment?',
                showCancelButton: true,
                confirmButtonText: 'Yes, change',
            });
            if (!confirmRes.isConfirmed) return;

            this.loader.show();
            await this.Service.UpdateAppointmentStatus(appId, 3, appVisitId);
            this.loader.hide();
            Swal.fire({ icon: 'success', title: 'Updated', text: 'Appointment status updated successfully.' });

            // Refresh current list with same filters
            await this.onSearchAppointment();
        } catch (error: any) {
            this.loader.hide();
            Swal.fire({ icon: 'error', title: 'Error', text: error?.message || 'Failed to update status.' });
        }
    }

    onEditAppointment(appointment: any) {
        debugger 
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
