import { credits, currentYear } from '@/app/constants';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOtpInputComponent } from 'ng-otp-input';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { UiPrefsStoreService } from '@core/services/ui-prefs-store.service';

@Component({
    selector: 'app-login-pin',
    host: { 'data-component-id': 'auth2-login-pin' },
    imports: [RouterLink,NgOtpInputComponent, TranslatePipe],
    templateUrl: './login-pin.component.html',
    styles: ``
})
export class LoginPinComponent {
    currentYear = currentYear
    credits = credits

    // Direction selection (applies only from login screen)
    selectedDir: 'ltr' | 'rtl' = 'ltr';

    setDir(dir: 'ltr' | 'rtl') {
        try {
            this.selectedDir = dir;
            // Persist using RxDB store
            void this.uiPrefs.setDir(dir);
            // Apply immediately so user sees effect on login screen too
            document.documentElement.setAttribute('dir', dir);
            document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
            document.body.classList.toggle('rtl', dir === 'rtl');
            // Legacy sessionStorage (commented)
            // sessionStorage.setItem('uiDir', dir);
        } catch {}
    }
    constructor(private uiPrefs: UiPrefsStoreService) {
        // Seed from RxDB
        this.uiPrefs.get().then(p => { if (p?.uiDir) this.selectedDir = p.uiDir as any; });
    }
}
