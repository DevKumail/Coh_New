import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type UILang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<UILang>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  private dictionary: Record<string, string> = {};

  constructor(private http: HttpClient) {
    // Initialize from stored language and cached dictionary ASAP
    try {
      const lang = (sessionStorage.getItem('uiLang') as UILang) || 'en';
      const cached = sessionStorage.getItem(`uiDict_${lang}`);
      if (cached) {
        this.dictionary = JSON.parse(cached) || {};
      }
      this.currentLangSubject.next(lang);
    } catch {}
  }

  get lang(): UILang { return this.currentLangSubject.value; }

  t(key: string): string {
    return this.dictionary[key] ?? key;
  }

  async load(lang: UILang): Promise<void> {
    // 1) Prime synchronously from sessionStorage cache (avoids blank labels on reload)
    try {
      const cached = sessionStorage.getItem(`uiDict_${lang}`);
      if (cached) {
        this.dictionary = JSON.parse(cached) || {};
        this.currentLangSubject.next(lang);
      }
    } catch {}

    // 2) Persist selected language
    sessionStorage.setItem('uiLang', lang);

    // 3) Fetch latest file and update + persist to storage
    try {
      // Cache-buster to avoid stale asset cache between logins
      const cacheBust = Date.now();
      const path = `assets/language/${lang}.json?v=${cacheBust}`;  
      const data = await firstValueFrom(this.http.get<Record<string, string>>(path));
      this.dictionary = data || {};
      this.currentLangSubject.next(lang);
      try { sessionStorage.setItem(`uiDict_${lang}`, JSON.stringify(this.dictionary)); } catch {}
    } catch (e) {
      // If loading fails, keep whatever dictionary we already have (cached or previous)
      if (!Object.keys(this.dictionary || {}).length) {
        console.warn(`[i18n] Failed to load assets/language/${lang}.json and no cached dictionary found.`);
      }
      this.currentLangSubject.next(lang);
    }
  }
}
