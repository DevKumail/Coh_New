import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { DecimalPipe } from '@angular/common';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { GlobalErrorInterceptor } from '@core/interceptors/global-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    DecimalPipe,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideDaterangepickerLocale({
      separator: ' - ',
      cancelLabel: 'Cancel',
    }),
    provideHttpClient(
      withInterceptors([
        AuthInterceptor,
        GlobalErrorInterceptor
      ])
    ),
    // Disabled during active development to avoid confusion. Re-enable when needed.
    // provideAppInitializer(() => {
    //   console.log('test ping');
    //   const http = inject(ApiService);
    //   const router = inject(Router);
    //   return http.get('ping')
    //     .toPromise()
    //     .catch(() => {
    //       router.navigate(['/maintenance']);
    //       return Promise.resolve();
    //     });
    // })

  ],
};