import { Injectable } from '@angular/core';
import { RxJsonSchema, RxCollection, RxDatabase } from 'rxdb';
import { DbService } from './db.service';

export type UiDir = 'ltr' | 'rtl';
export type UiLang = 'en' | 'ar';

export interface UiPrefsDocType {
  id: string; // 'current'
  uiDir: UiDir;
  uiLang: UiLang;
  updatedAt: number;
}

export type UiPrefsCollection = RxCollection<UiPrefsDocType>;

const uiPrefsSchema: RxJsonSchema<UiPrefsDocType> = {
  title: 'ui_prefs',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 50 },
    uiDir: { type: 'string', enum: ['ltr', 'rtl'] },
    uiLang: { type: 'string', enum: ['en', 'ar'] },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'uiDir', 'uiLang', 'updatedAt']
};

@Injectable({ providedIn: 'root' })
export class UiPrefsStoreService {
  private initPromise?: Promise<RxDatabase>;

  constructor(private dbService: DbService) {}

  private async col(): Promise<UiPrefsCollection> {
    const db = await this.db();
    if (!('ui_prefs' in db.collections)) {
      await db.addCollections({ ui_prefs: { schema: uiPrefsSchema } });
    }
    return (db as any).collections.ui_prefs as UiPrefsCollection;
  }

  private db(): Promise<RxDatabase> {
    if (!this.initPromise) this.initPromise = this.dbService.db;
    return this.initPromise;
  }

  async get(): Promise<UiPrefsDocType | null> {
    const col = await this.col();
    const doc = await col.findOne('current').exec();
    return doc ? (doc.toJSON() as UiPrefsDocType) : null;
  }

  async set(prefs: Partial<Pick<UiPrefsDocType, 'uiDir' | 'uiLang'>>): Promise<void> {
    const existing = (await this.get()) || { id: 'current', uiDir: 'ltr' as UiDir, uiLang: 'en' as UiLang, updatedAt: Date.now() };
    const next = {
      ...existing,
      ...prefs,
      updatedAt: Date.now()
    } as UiPrefsDocType;
    const col = await this.col();
    await col.upsert(next);
  }

  async setDir(dir: UiDir): Promise<void> { await this.set({ uiDir: dir }); }
  async setLang(lang: UiLang): Promise<void> { await this.set({ uiLang: lang }); }

  async applyToDocument(): Promise<void> {
    let prefs = await this.get();
    if (!prefs) {
      // seed from sessionStorage if present (backward compatibility)
      const ssLang = (sessionStorage.getItem('uiLang') as UiLang) || 'en';
      const ssDir = (sessionStorage.getItem('uiDir') as UiDir) || (ssLang === 'ar' ? 'rtl' : 'ltr');
      await this.set({ uiDir: ssDir, uiLang: ssLang });
      prefs = await this.get();
    }
    const dir = prefs!.uiDir;
    const lang = prefs!.uiLang;
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.toggle('rtl', dir === 'rtl');
  }
}
