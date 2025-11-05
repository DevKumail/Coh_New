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
import { UiPrefsStoreService } from '@core/services/ui-prefs-store.service';
import { LoaderComponent } from "./components/loader/loader.component";
import { CommonModule } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';
import { environment } from '../environments/environment';
import { ChangeDetectorRef } from '@angular/core';


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
    private uiPrefs = inject(UiPrefsStoreService);

    isLoading: boolean = false;
    constructor(
        private cdr: ChangeDetectorRef
    ) {
        // Start periodic health monitoring only in production
        if (environment.production) {
            this.healthCheck.startMonitoring();
        }

    }
    ngOnInit(): void {
        this.loadingService.loading$.subscribe(val => {
            this.isLoading = val;
            this.cdr.detectChanges(); // force refresh
        });
        // Apply global direction (RTL/LTR) from RxDB-backed store
        void this.uiPrefs.applyToDocument();
        // Initialize language from store (fire and forget)
        const i18n = inject(TranslationService);
        // load chosen language (applyToDocument seeded it when empty)
        try {
            this.uiPrefs.get().then(p => i18n.load((p?.uiLang ?? 'en') as any));
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
