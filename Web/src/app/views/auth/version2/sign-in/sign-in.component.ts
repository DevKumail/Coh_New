import { credits, currentYear } from '@/app/constants';
import { Component, OnInit } from '@angular/core';
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
export class SignInComponent implements OnInit {
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

  // Ensure default UI is English/LTR unless user has chosen otherwise
  private readonly sessionWhitelist = new Set([
    'allowscreens',
    'empId',
    'facilities',
    'uiDict_en',
    'uiDir',
    'uiLang',
    'userId',
    'userName'
  ]);

  private cleanSessionStorage(): void {
    try {
      const keys = Object.keys(sessionStorage);
      for (const key of keys) {
        const keep = this.sessionWhitelist.has(key);
        const isBannedPrefix = key.startsWith('coh_secure_') || key.startsWith('pb.') || key.startsWith('pb_');
        if (!keep || isBannedPrefix) {
          sessionStorage.removeItem(key);
        }
      }
    } catch {}
  }

  async ngOnInit() {
    // Cleanup session storage aggressively when reaching sign-in
    this.cleanSessionStorage();
    setTimeout(() => this.cleanSessionStorage(), 300);
    const lang = (sessionStorage.getItem('uiLang') as 'en' | 'ar') || 'en';
    const dir = (sessionStorage.getItem('uiDir') as 'ltr' | 'rtl') || 'ltr';
    // Persist defaults if not present
    if (!sessionStorage.getItem('uiLang')) sessionStorage.setItem('uiLang', lang);
    if (!sessionStorage.getItem('uiDir')) sessionStorage.setItem('uiDir', dir);
    this.selectedDir = dir;
    try {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
      document.body.classList.toggle('rtl', dir === 'rtl');
      await this.i18n.load(lang);
    } catch {}
  }


  onLogin(username: string, password: string): void {

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(username, password).subscribe({
    next: () => {
      // Cleanup again on successful login before navigation
      this.cleanSessionStorage();
      setTimeout(() => this.cleanSessionStorage(), 100);
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
