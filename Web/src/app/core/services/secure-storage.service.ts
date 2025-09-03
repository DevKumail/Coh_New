import { Injectable } from '@angular/core';

// Lightweight obfuscation for sessionStorage. This is NOT cryptographically strong,
// but hides values from casual inspection in DevTools. For stronger security,
// integrate Web Crypto (AES-GCM) and adjust callers to async APIs.
@Injectable({ providedIn: 'root' })
export class SecureStorageService {
  private readonly prefix = 'coh_secure_';
  private readonly key: string;

  constructor() {
    // Derive a simple per-origin key. You can replace with an env-based secret if desired.
    this.key = (location?.origin || 'coh') + '|v1';
  }

  // Public API
  setItem(key: string, value: string | null | undefined): void {
    const storageKey = this.prefix + key;
    try {
      if (value === null || value === undefined) {
        sessionStorage.removeItem(storageKey);
        return;
      }
      const enc = this.encode(String(value));
      sessionStorage.setItem(storageKey, enc);
    } catch {
      // Fallback to plain if anything goes wrong
      sessionStorage.setItem(storageKey, String(value));
    }
  }

  getItem(key: string): string | null {
    const storageKey = this.prefix + key;
    const raw = sessionStorage.getItem(storageKey);
    if (raw === null) return null;
    try {
      return this.decode(raw);
    } catch {
      return raw; // if previously stored plain
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    // Only clear our own keys to avoid wiping unrelated sessionStorage entries.
    const toRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(this.prefix)) toRemove.push(k);
    }
    toRemove.forEach((k) => sessionStorage.removeItem(k));
  }

  // JSON helpers
  setJson(key: string, obj: any): void {
    this.setItem(key, JSON.stringify(obj));
  }

  getJson<T = any>(key: string): T | null {
    const s = this.getItem(key);
    if (!s) return null;
    try {
      return JSON.parse(s) as T;
    } catch {
      return null;
    }
  }

  // Simple XOR + base64 obfuscation
  private encode(plain: string): string {
    const xored = this.xorStrings(plain, this.key);
    return btoa(unescape(encodeURIComponent(xored)));
  }

  private decode(obf: string): string {
    const xored = decodeURIComponent(escape(atob(obf)));
    return this.xorStrings(xored, this.key);
  }

  private xorStrings(input: string, key: string): string {
    let out = '';
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      out += String.fromCharCode(code);
    }
    return out;
  }
}
