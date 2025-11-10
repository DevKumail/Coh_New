import { Injectable } from '@angular/core';
import { RxCollection, RxDatabase, RxJsonSchema } from 'rxdb';
import { DbService } from './db.service';

export interface PatientBannerDocType {
  id: string; // 'current'
  patientData: any | null;
  patientIVFData: any | null;
  visitAppointments: any[];
  selectedVisit: any | null;
  payerInfo: any[];
  updatedAt: number;
}

export type PatientBannerCollection = RxCollection<PatientBannerDocType>;

const schema: RxJsonSchema<PatientBannerDocType> = {
  title: 'patientbanner',
  version: 2,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 50 },
    patientData: { type: 'object', properties: {}, additionalProperties: true },
    patientIVFData: { type: 'object' },
    visitAppointments: { type: 'array', items: { type: 'object', properties: {}, additionalProperties: true } },
    selectedVisit: { type: 'object', properties: {}, additionalProperties: true },
    payerInfo: { type: 'array', items: { type: 'object', properties: {}, additionalProperties: true } },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'visitAppointments', 'updatedAt']
};

const migrationStrategies = {
  1: (oldDoc: any) => {
    return {
      ...oldDoc,
      payerInfo: Array.isArray(oldDoc.payerInfo) ? oldDoc.payerInfo : []
    };
  }
} as const;

@Injectable({ providedIn: 'root' })
export class PatientBannerStoreService {
  private initPromise?: Promise<RxDatabase>;
  constructor(private dbService: DbService) {}

  private async col(): Promise<PatientBannerCollection> {
    const db = await this.db();
    // If already exists, return it (new name)
    const existing = (db as any)?.collections?.patientbanner as PatientBannerCollection | undefined;
    if (existing) return existing;
    // Backward-compat: if old underscore name exists, use it
    const legacy = (db as any)?.collections?.patient_banner as PatientBannerCollection | undefined;
    if (legacy) return legacy;

    // Try to create and return the created instance
    try {
      const created = await db.addCollections({ patientbanner: { schema, migrationStrategies: migrationStrategies as any } });
      const direct = (created as any)?.patientbanner as PatientBannerCollection | undefined;
      if (direct) return direct;
      const afterCreate = (db as any)?.collections?.patientbanner as PatientBannerCollection | undefined;
      if (afterCreate) return afterCreate;
      const afterCreateLegacy = (db as any)?.collections?.patient_banner as PatientBannerCollection | undefined;
      if (afterCreateLegacy) return afterCreateLegacy;
    } catch (e) {
      // ignore and fall back to db.collections
    }

    // Retry once more in case of race
    try {
      const created2 = await db.addCollections({ patientbanner: { schema, migrationStrategies: migrationStrategies as any } });
      const direct2 = (created2 as any)?.patientbanner as PatientBannerCollection | undefined;
      if (direct2) return direct2;
    } catch {}
    // Try to create legacy-named collection as last resort
    try {
      const createdLegacy = await db.addCollections({ patient_banner: { schema, migrationStrategies: migrationStrategies as any } });
      const directLegacy = (createdLegacy as any)?.patient_banner as PatientBannerCollection | undefined;
      if (directLegacy) return directLegacy;
    } catch {}
    const col = (db as any)?.collections?.patientbanner as PatientBannerCollection | undefined;
    if (col) return col;
    const colLegacy = (db as any)?.collections?.patient_banner as PatientBannerCollection | undefined;
    if (colLegacy) return colLegacy;
    throw new Error('RxDB collection patientbanner is unavailable');
  }

  private db(): Promise<RxDatabase> {
    if (!this.initPromise) this.initPromise = this.dbService.db;
    return this.initPromise;
  }

  async get(): Promise<PatientBannerDocType | null> {
    const col = await this.col();
    const doc = await col.findOne('current').exec();
    return doc ? (doc.toJSON() as PatientBannerDocType) : null;
  }

  async set(partial: Partial<Omit<PatientBannerDocType, 'id' | 'updatedAt'>>): Promise<void> {
    const existing = (await this.get()) || { id: 'current', patientData: null, visitAppointments: [], selectedVisit: null, payerInfo: [], updatedAt: Date.now() };
    const next = { ...existing, ...partial, updatedAt: Date.now() } as PatientBannerDocType;
    const col = await this.col();
    await col.upsert(next);
  }

  async clear(): Promise<void> {
    const col = await this.col();
    const doc = await col.findOne('current').exec();
    if (doc) await doc.remove();
  }
}
