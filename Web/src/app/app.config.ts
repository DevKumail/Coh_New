import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { DecimalPipe } from '@angular/common';
import { provideDaterangepickerLocale } from 'ngx-daterangepicker-bootstrap';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';
import { GlobalErrorInterceptor } from '@core/interceptors/global-error.interceptor';
import { ApiService } from '@core/services/api.service';

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
  provideAppInitializer(() => {
    console.log('test ping')
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get('/ping')
    .toPromise()
    .catch(() => {
      router.navigate(['/maintenance']);
      return Promise.resolve();
    });
})

  ],
};
