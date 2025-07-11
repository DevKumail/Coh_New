import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval, Subscription, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class HealthCheckService {
  private subscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private api: ApiService
  ) {}

  startMonitoring() {
    this.subscription = interval(2000)
      .pipe(
        switchMap(() =>
          this.api.get('ping').pipe(
            catchError(() => of(null))
          )
        )
      )
      .subscribe((res) => {
        const isOnMaintenance = this.router.url === '/maintenance';

        if (!res && !isOnMaintenance) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/maintenance']);
        } else if (res && isOnMaintenance) {
          this.router.navigate(['/']);
        }
      });
  }

  stopMonitoring() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
