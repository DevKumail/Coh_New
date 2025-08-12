import { Component, EventEmitter, inject, OnInit, Output, TemplateRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { LayoutStoreService } from '@core/services/layout-store.service';
import { LucideAngularModule, Search, Sliders, X } from 'lucide-angular';
import { MegaMenuComponent } from '@layouts/components/topbar/components/mega-menu/mega-menu.component';
import { ThemeTogglerComponent } from '@layouts/components/topbar/components/theme-toggler/theme-toggler.component';
import { UserProfileComponent } from '@layouts/components/topbar/components/user-profile/user-profile.component';
import { NotificationDropdownComponent } from '@layouts/components/topbar/components/notification-dropdown/notification-dropdown.component';
import { IconsModule } from '@/app/shared/icons.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientHeaderPanelComponent } from "../patient-header-panel/patient-header-panel.component";
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemographicApiServices } from '@/app/shared/Services/Demographic/demographic.api.serviec';
import { NavbarComponent } from "../navbar/navbar.component";
import { AdvanceSearchModalComponent } from "./components/advance-search-modal/advance-search-modal.component";
import { LoaderService } from '@core/services/loader.service';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MegaMenuComponent,
    ThemeTogglerComponent,
    UserProfileComponent,
    NotificationDropdownComponent,
    IconsModule,
    NgbModalModule, NgIcon,
    PatientHeaderPanelComponent,
    FormsModule,
    NavbarComponent,
    AdvanceSearchModalComponent
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  animations: [
    trigger('bannerAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class TopbarComponent implements OnInit {
  constructor(
    public layout: LayoutStoreService,
    private modalService: NgbModal,
    private patientBannerService: PatientBannerService,
    private loader: LoaderService,
    private router: Router,
  ) { }

  SearchIcon = Search;
  SliderIcon = Sliders;
  XIcon = X;

  patientData: any = null;
  showPatientPanel: boolean = false;

  @Output() patientBannerToggle = new EventEmitter<boolean>();
  showPatientBanner = true;
  private demographicapi = inject(DemographicApiServices);

  toggleSidebar() {
    const html = document.documentElement;
    const currentSize = html.getAttribute('data-sidenav-size');
    const savedSize = this.layout.sidenavSize;

    if (currentSize === 'offcanvas') {
      html.classList.toggle('sidebar-enable');
      this.layout.showBackdrop();
    } else if (savedSize === 'compact') {
      this.layout.setSidenavSize(
        currentSize === 'compact' ? 'condensed' : 'compact',
        false
      );
    } else {
      this.layout.setSidenavSize(
        currentSize === 'condensed' ? 'default' : 'condensed'
      );
    }
  }

  togglePatientBanner(content: TemplateRef<HTMLElement>) {
    const loadedPatient = sessionStorage.getItem('loadedPatientName');

    if (loadedPatient) {
      // Just toggle patient banner
      this.showPatientBanner = !this.showPatientBanner;
      this.patientBannerToggle.emit(this.showPatientBanner);
    } else {
      // No patient loaded, open modal
      this.modalService.open(content, { size: 'lg' });
    }
  }

  allPatients: any[] = [];

  handleSearchResults(results: any[]) {
    this.allPatients = results;
    console.log('Patients received from modal:', results);
  }

  ngOnInit() {
    this.patientBannerService.patientData$.subscribe(data => {
      this.patientData = data;
    });
  }

  mrNo: any;

  onSearchClick() {
    if (this.mrNo && this.mrNo.length >= 3) {
      this.searchPatient(this.mrNo);
      this.searchAppointment(this.mrNo);
    } else {
      this.patientBannerService.setPatientData(null);
      this.patientBannerService.setVisitAppointments(null);
      console.log("data becomes null")
    }
  }

  onClearInput() {
    this.mrNo = "";
    this.showPatientBanner = false;
    this.onSearchClick();
  }

  searchPatient(mrNo: string, context?: string) {
    if (context === 'patient-summary') {
      const sub = this.patientBannerService.patientData$.subscribe(data => {
        if (data) {
          this.router.navigate(['/patient-summary']);
          sub.unsubscribe();
        }
      });
    }

    this.demographicapi.getPatientByMrNo(mrNo).subscribe({
      next: (res: any) => {
        if (res?.table2?.length > 0) {
          this.patientBannerService.setPatientData(res);
          this.showPatientBanner = true;
    this.demographicapi
        } else {
          this.patientBannerService.setPatientData(null);
          this.showPatientBanner = false;
        }
      },
      error: err => {
        console.error('API Error:', err);
        this.patientBannerService.setPatientData(null);
      }
    });
  }

  async searchAppointment(mrNo: any){
    this.loader.show();
      await this.demographicapi.GetAppointmentByMRNO(mrNo).subscribe((Response: any)=>{
      console.log("Load Visit new work =>", Response);
      if (Object.keys(Response).length > 0){
        this.patientBannerService.setVisitAppointments(Response);
        this.patientBannerService.setSelectedVisit(Response?.table[0]);
        this.loader.hide();
      } else{
        this.patientBannerService.setVisitAppointments(null);
        this.patientBannerService.setSelectedVisit(null);
        this.loader.hide();
      }
      // this.dropdownOptions =  Response.table.map((item: any) => {
      // this.dateOfBirth =  Response.table[0].age.slice(0,8)
      // const formattedDate = this.datePipe.transform(item.appDateTime, 'dd-MM-yyyy');
      // const providerName = formattedDate + ' - ' + item.fullName ;
      // return { label: providerName, value: item.appointmentId }
      // });
      // if (this.dropdownOptions.length > 0){
      //   this.selectedAppointmentId = this.dropdownOptions[0].value;
      //   this.AppointmentDetail();
      // }
    })
  }

}