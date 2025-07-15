import {Component} from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {userDropdownItems} from '@layouts/components/data';
import {RouterLink} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import Swal from 'sweetalert2';

import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-user-profile-topbar',
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    NgIcon
  ],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
  userName: string = ''; 
  menuItems = userDropdownItems;
  
  constructor(
    public authService : AuthService
  ){}

  displayName: string = '';

  ngOnInit() {
    this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage() {
     // debugger
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
    }).then((result) => {
        if (result.isConfirmed) {
            this.executeLogout();
        }
    });
}

private executeLogout() {
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
