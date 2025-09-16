import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import * as tablerIcons from '@ng-icons/tabler-icons';
import * as tablerIconsFill from '@ng-icons/tabler-icons/fill';
import { provideIcons } from '@ng-icons/core';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslationService } from '@/app/shared/i18n/translation.service';
import { HealthCheckService } from '@core/services/health-check.service';
import { LoaderComponent } from "./components/loader/loader.component";
import { CommonModule } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';
import { environment } from '../environments/environment';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoaderComponent, CommonModule, HttpClientModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    viewProviders: [provideIcons({ ...tablerIcons, ...tablerIconsFill })]
})
export class AppComponent implements OnInit {
    private titleService = inject(Title);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private healthCheck = inject(HealthCheckService);
    private loadingService = inject(LoaderService);

    isLoading = this.loadingService.loading$;

    constructor() {
        // Start periodic health monitoring only in production
        if (environment.production) {
            this.healthCheck.startMonitoring();
        }

    }
    ngOnInit(): void {
        // Apply global direction (RTL/LTR) as early as possible
        try {
            let storedLang = (sessionStorage.getItem('uiLang') as 'en' | 'ar') || 'en';
            let storedDir = (sessionStorage.getItem('uiDir') as 'rtl' | 'ltr') || '' as any;

            // If direction not set, derive from language (ar -> rtl, en -> ltr)
            if (!storedDir) {
                storedDir = storedLang === 'ar' ? 'rtl' : 'ltr';
                sessionStorage.setItem('uiDir', storedDir);
            }

            // If language not set but direction exists, derive language from dir
            if (!storedLang) {
                storedLang = storedDir === 'rtl' ? 'ar' : 'en';
                sessionStorage.setItem('uiLang', storedLang);
            }

            document.documentElement.setAttribute('dir', storedDir);
            document.documentElement.setAttribute('lang', storedLang);
            document.body.classList.toggle('rtl', storedDir === 'rtl');

            // Initialize language from storage
            const i18n = inject(TranslationService);
            // fire and forget; UI will update via pipe when loaded
            i18n.load(storedLang);
        } catch {}

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
                    this.titleService.setTitle(data['title']
                    );
                }
            });

        if (environment.production) {
            document.addEventListener('contextmenu', (event) => event.preventDefault());

            document.addEventListener('keydown', (event) => {
                if (event.key === 'F12') {
                    event.preventDefault();
                }
                if (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J')) {
                    event.preventDefault();
                }
                if (event.ctrlKey && event.key === 'U') {
                    event.preventDefault();
                }
            });
        }

    }
}
