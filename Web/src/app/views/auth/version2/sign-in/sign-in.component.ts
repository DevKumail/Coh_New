import { credits, currentYear } from '@/app/constants';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIcon } from '@ng-icons/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-sign-in',
    host: { 'data-component-id': 'auth2-sign-in' },
    standalone : true,
    imports: [RouterLink,NgIcon,HttpClientModule ,CommonModule],
    templateUrl: './sign-in.component.html',
    styles: ``,

})
export class SignInComponent {
    currentYear = currentYear
    credits = credits
      username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

    constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}


  onLogin(username: string, password: string): void {

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(username, password).subscribe({
    next: () => {
      this.isLoading = false;

      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/dashboards/dashboard-2']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = 'Login failed';

      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: err.error?.message || 'Invalid username or password'
      });
    }
  });
}


}
