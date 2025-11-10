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
import { IvfSearchService } from '@/app/shared/Services/IVF/ivf-search.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { AdvanceSearchModalComponent } from "./components/advance-search-modal/advance-search-modal.component";
import Swal from 'sweetalert2';
import { LoaderService } from '@core/services/loader.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';

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
    AdvanceSearchModalComponent,
    TranslatePipe
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
  private ivfSearch = inject(IvfSearchService);

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
  }

  ngOnInit() {
    this.patientBannerService.patientData$.subscribe(data => {
      this.patientData = data;
    });
    this.mrNo = this.patientData?.table2?.[0]?.mrNo;
  }

  mrNo: any;

  onSearchClick() {
    if (this.mrNo && this.mrNo.length >= 3) {
      // If we are on an IVF route, treat the search as coming from the IVF dashboard
      const isIvfRoute = !!(this.router && this.router.url && this.router.url.indexOf('/ivf') !== -1);
      if (isIvfRoute) {
        // Publish IVF search event and do not open the patient banner here.
        this.ivfSearch.publishSearch(this.mrNo);
        this.searchAppointment(this.mrNo);
      } else {
        this.searchPatient(this.mrNo);
        this.searchAppointment(this.mrNo);
      }
    } else {
      this.patientBannerService.setPatientData(null);
      this.patientBannerService.setVisitAppointments(null);
    }
  }

  // onClearInput() {
  //   this.mrNo = "";
  //   this.showPatientBanner = false;
  //   this.onSearchClick();
  // }

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
          console.log('topbar Patient Data:', res);
              if(this.router.url != '/ivf/dashboard' ){
              this.showPatientBanner = true;
              }
    this.demographicapi
        } else {
          this.patientBannerService.setPatientData(null);
          this.showPatientBanner = false;
          Swal.fire('Error', 'No patient found with the provided MRNO.', 'error');
        }
      },
      error: err => {
        this.patientBannerService.setPatientData(null);
      }
    });
  }

  paginationInfo: any={
    currentPage: 1,
    pageSize: 10,
  };

  async searchAppointment(mrNo: any){
    this.loader.show();
    if(mrNo){
      await this.demographicapi.GetAppointmentByMRNO(mrNo,this.paginationInfo.currentPage,this.paginationInfo.pageSize).subscribe((Response: any)=>{
      console.log("topbar Load Visit =>", Response);
      if (Response?.table1?.length > 0){
        this.patientBannerService.setVisitAppointments(Response?.table1);
        this.patientBannerService.setSelectedVisit(Response?.table1[0]);
        this.loader.hide();
      } else{
        this.patientBannerService.setVisitAppointments(null);
        this.patientBannerService.setSelectedVisit(null);
        this.loader.hide();
      }
    })
    }
  }

  // Layout helper: true when current document is RTL
  get isRtl(): boolean {
    try {
      return (document?.documentElement?.getAttribute('dir') || '') === 'rtl';
    } catch { return false; }
  }

}