import {Component} from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {userDropdownItems} from '@layouts/components/data';
import {RouterLink} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import Swal from 'sweetalert2';

import { AuthService } from '@core/services/auth.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

@Component({
  selector: 'app-user-profile-topbar',
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    NgIcon,
    TranslatePipe
  ],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
  userName: string = '';
  menuItems = userDropdownItems;

  constructor(
    public authService: AuthService,
    private patientBannerService: PatientBannerService
  ){}

  displayName: string = '';

  ngOnInit() {
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {

    const userData = sessionStorage.getItem('userName');
    if (userData) {

      this.userName = userData;
      this.displayName =  userData;
    }
  }

    handleItemClick(item: any) {
    if (item.action === 'logout') {
        this.showLogoutConfirmation();
    }
  }

  showLogoutConfirmation() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of the system',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false
    }).then(async (result) => {
        if (result.isConfirmed) {
          // Clear browser caches
          caches.keys().then(names => {
            return Promise.all(
              names.map(name => caches.delete(name))
            );
          });
          
          // Clear IndexedDB
          try {
            await indexedDB.deleteDatabase('coherent');
            console.log('✅ IndexedDB cleared');
          } catch (error) {
            console.error('⚠️ Failed to clear IndexedDB:', error);
          }
          
          this.executeLogout();
        }
    });
}

private async executeLogout() {
    // Clear patient banner data from RxDB
    try {
        await this.patientBannerService.clearAll();
        console.log('✅ RxDB cleared on logout');
    } catch (error) {
        console.error('⚠️ Failed to clear RxDB:', error);
    }

    const logout$ = this.authService.logout();

    Swal.fire({
        title: 'Logging out...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    logout$.subscribe({
        next: () => {
            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        },
        error: (err) => {
            Swal.fire({
                title: 'Logged Out',
                text: 'You have been logged out (API may not have completed)',
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
            console.error('Logout error:', err);
        }
    });
}

}
