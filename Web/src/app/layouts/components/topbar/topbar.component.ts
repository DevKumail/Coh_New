// import {Component, EventEmitter, Output} from '@angular/core';
// import {RouterLink} from '@angular/router';
// import {NgIcon} from '@ng-icons/core';
// import {LayoutStoreService} from '@core/services/layout-store.service';
// import {LucideAngularModule, Search} from 'lucide-angular';

// import {MegaMenuComponent} from '@layouts/components/topbar/components/mega-menu/mega-menu.component';
// import {
//     LanguageDropdownComponent
// } from '@layouts/components/topbar/components/language-dropdown/language-dropdown.component';
// import {
//     MessagesDropdownComponent
// } from '@layouts/components/topbar/components/messages-dropdown/messages-dropdown.component';
// import {ThemeTogglerComponent} from '@layouts/components/topbar/components/theme-toggler/theme-toggler.component';
// import {
//     CustomizerTogglerComponent
// } from '@layouts/components/topbar/components/customizer-toggler/customizer-toggler.component';
// import {UserProfileComponent} from '@layouts/components/topbar/components/user-profile/user-profile.component';
// import {
//     NotificationDropdownComponent
// } from '@layouts/components/topbar/components/notification-dropdown/notification-dropdown.component';
// import { AccordionService } from '@core/services/accordion.service';
// import { IconsModule } from '@/app/shared/icons.module';
// import { Stethoscope } from 'lucide-angular'; // 👈 this is required

// @Component({
//     selector: 'app-topbar',
//     imports: [
//         NgIcon,
//         RouterLink,
//         MegaMenuComponent,
//         // LanguageDropdownComponent,
//         // MessagesDropdownComponent,
//         // CustomizerTogglerComponent,
//         ThemeTogglerComponent,
//         UserProfileComponent,
//         NotificationDropdownComponent,
//         IconsModule

//     ],
//      standalone: true,
//     templateUrl: './topbar.component.html'
// })
// export class TopbarComponent {
//     constructor(public layout: LayoutStoreService,
//         private accordionService: AccordionService
//     ) {
//     }

//     toggleSidebar() {

//         const html = document.documentElement;
//         const currentSize = html.getAttribute('data-sidenav-size');
//         const savedSize = this.layout.sidenavSize;

//         if (currentSize === 'offcanvas') {
//             html.classList.toggle('sidebar-enable')
//             this.layout.showBackdrop()
//         } else if (savedSize === 'compact') {
//             this.layout.setSidenavSize(currentSize === 'compact' ? 'condensed' : 'compact', false);
//         } else {
//             this.layout.setSidenavSize(currentSize === 'condensed' ? 'default' : 'condensed');
//         }
//     }

//     Search = Search;

//   @Output() patientBannerToggle = new EventEmitter<boolean>();
//   showPatientBanner = true;


//    togglePatientBanner() {
//     this.showPatientBanner = !this.showPatientBanner;
//     this.patientBannerToggle.emit(this.showPatientBanner);
//   }

// // togglePatientBanner() {
// // //   const loadedPatient = sessionStorage.getItem('loadedPatient');

// // //   if (loadedPatient) {
// // //     // Patient already loaded, just toggle banner
// // //     this.showPatientBanner = !this.showPatientBanner;
// // //     this.patientBannerToggle.emit(this.showPatientBanner);
// // //   } else {
// // //     // No patient loaded, show modal for selection
// // //     this.openPatientModal(); // <- Replace with your actual modal opening logic
// // //   }

// // }

// // openPatientModal() {
// //   // Modal open code, maybe using Angular Material or ngx-bootstrap
// //   this.showPatientSearchModal = true;

// //   // Optionally, you can call your patient list API here:
// //   this.loadPatients();
// // }

// }
import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { LayoutStoreService } from '@core/services/layout-store.service';
import { LucideAngularModule, Search } from 'lucide-angular';
import { MegaMenuComponent } from '@layouts/components/topbar/components/mega-menu/mega-menu.component';
import { ThemeTogglerComponent } from '@layouts/components/topbar/components/theme-toggler/theme-toggler.component';
import { UserProfileComponent } from '@layouts/components/topbar/components/user-profile/user-profile.component';
import { NotificationDropdownComponent } from '@layouts/components/topbar/components/notification-dropdown/notification-dropdown.component';
import { IconsModule } from '@/app/shared/icons.module';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientSearchModalComponent } from '@/app/shared/modals/patient-search-modal/patient-search-modal.component';
import { PatientHeaderPanelComponent } from "../patient-header-panel/patient-header-panel.component";



@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterLink,
    MegaMenuComponent,
    ThemeTogglerComponent,
    UserProfileComponent,
    NotificationDropdownComponent,
    IconsModule,
    NgbModalModule, NgIcon,
    PatientHeaderPanelComponent
],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  constructor(
    public layout: LayoutStoreService,
    private modalService: NgbModal
  ) {}

  Search = Search;

  @Output() patientBannerToggle = new EventEmitter<boolean>();
  showPatientBanner = true;

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


    }

