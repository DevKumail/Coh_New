import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbCollapseModule, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {NgIcon} from '@ng-icons/core';
import { AuthService } from '../../../../../core/services/auth.service'; // Adjust path
import { Router } from '@angular/router';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

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
    private patientBannerService: PatientBannerService
  ) {}

  async handleAction(action: string): Promise<void> {
    if (action === 'logout') {
      // Clear patient banner data from RxDB
      try {
        await this.patientBannerService.clearAll();
        console.log('✅ RxDB cleared on logout');
      } catch (error) {
        console.error('⚠️ Failed to clear RxDB:', error);
      }
      
      this.authService.logout();
      this.router.navigate(['/login']); // or your login route
    }
  }
}
