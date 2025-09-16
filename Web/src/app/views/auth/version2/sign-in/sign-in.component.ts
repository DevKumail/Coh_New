import { credits, currentYear } from '@/app/constants';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIcon } from '@ng-icons/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { TranslationService } from '@/app/shared/i18n/translation.service';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';



@Component({
    selector: 'app-sign-in',
    host: { 'data-component-id': 'auth2-sign-in' },
    standalone : true,
    imports: [RouterLink,NgIcon,HttpClientModule ,CommonModule, TranslatePipe],
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

  // Direction selection (applies on login screen)
  selectedDir: 'ltr' | 'rtl' = (sessionStorage.getItem('uiDir') as 'ltr' | 'rtl') || 'ltr';

  setDir(dir: 'ltr' | 'rtl') {
    try {
      this.selectedDir = dir;
      sessionStorage.setItem('uiDir', dir);
      // Apply immediately so user sees effect on login screen too
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
      document.body.classList.toggle('rtl', dir === 'rtl');
    } catch {}
  }

  // Set both language and direction from flags
  async setUi(lang: 'en' | 'ar', dir: 'ltr' | 'rtl') {
    try {
      this.selectedDir = dir;
      sessionStorage.setItem('uiDir', dir);
      sessionStorage.setItem('uiLang', lang);
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
      document.body.classList.toggle('rtl', dir === 'rtl');
      await this.i18n.load(lang);
    } catch {}
  }

    constructor(
    private http: HttpClient,
    private authService: AuthService,
    private patientBanner: PatientBannerService,
    private router: Router,
    private i18n: TranslationService
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

      this.patientBanner.setPatientData(null);

      this.router.navigate(['/dashboards/dashboard']);
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
