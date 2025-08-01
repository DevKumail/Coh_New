import { credits, currentYear } from '@/app/constants';
import { Component , OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { Subscription, interval } from 'rxjs';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './maintenance.component.html',
  styles: ``
})
export class MaintenanceComponent implements OnInit, OnDestroy {
   private pingSubscription!: Subscription;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}
  currentYear = currentYear;
  credits = credits;
   ngOnInit(): void {

    this.pingSubscription = interval(5000)
      .pipe(
        switchMap(() =>
          this.api.get('ping').pipe(
            catchError(() => of(null)) 
          )
        )
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigateByUrl('/'); 
        }
      });
  }

  ngOnDestroy(): void {

    if (this.pingSubscription) {
      this.pingSubscription.unsubscribe();
    }
  }
}
