import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbCollapseModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {NgIcon} from '@ng-icons/core';
import { AuthService } from '../../../../../core/services/auth.service'; // Adjust path
import { Router } from '@angular/router';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { UserDataService } from '@core/services/user-data.service';

import {userDropdownItems} from '@layouts/components/data';

@Component({
  selector: 'app-user-profile',
  imports: [
    RouterLink,
    NgbCollapseModule,
    NgbDropdown,
    //NgbDropdownToggle,
    NgbDropdownMenu,
    NgIcon
  ],

  templateUrl: './user-profile.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserProfileComponent {
  menuItems = userDropdownItems
  constructor(
    private authService: AuthService,
    private router: Router,
    private patientBannerService: PatientBannerService,
    private userDataService: UserDataService
  ) {}

  async handleAction(action: string): Promise<void> {
    if (action === 'logout') {
      // Clear patient banner data from RxDB
      try {
        await this.patientBannerService.clearAll();
        console.log('✅ Patient banner cleared from RxDB');
      } catch (error) {
        console.error('⚠️ Failed to clear patient banner:', error);
      }

      // Clear user data from RxDB
      try {
        await this.userDataService.clearCurrentUser();
        console.log('✅ User data cleared from RxDB');
      } catch (error) {
        console.error('⚠️ Failed to clear user data:', error);
      }
      
      this.authService.logout();
      this.router.navigate(['/login']); // or your login route
    }
  }
}
