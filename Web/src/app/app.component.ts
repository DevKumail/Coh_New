import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import * as tablerIcons from '@ng-icons/tabler-icons';
import * as tablerIconsFill from '@ng-icons/tabler-icons/fill';
import {provideIcons} from '@ng-icons/core';
import {Title} from '@angular/platform-browser';
import {filter, map, mergeMap} from 'rxjs/operators';
import { HealthCheckService } from '@core/services/health-check.service';
import { LoaderComponent } from "./components/loader/loader.component";
import { CommonModule } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoaderComponent , CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    viewProviders: [provideIcons({...tablerIcons, ...tablerIconsFill})]
})
export class AppComponent implements OnInit {
      private titleService = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private healthCheck = inject(HealthCheckService);
  private loadingService = inject(LoaderService);
 
      isLoading = this.loadingService.loading$; 
   
  constructor() {
    this.healthCheck.startMonitoring();
    
  }
    ngOnInit(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let route = this.activatedRoute;
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                mergeMap(route => route.data)
            )
            .subscribe(data => {
                if (data['title']) {
                    this.titleService.setTitle(data['title'] +
                        ' | INSPINIA - Angular Responsive Bootstrap 5 Admin Dashboard');
                }
            });
    }
}
