import { Injectable } from '@angular/core';
import { RxCollection, RxDatabase, RxJsonSchema } from 'rxdb';
import { DbService } from './db.service';

export interface PatientBannerDocType {
  id: string; // 'current'
  patientData: any | null;
  visitAppointments: any[];
  selectedVisit: any | null;
  payerInfo: any[];
  updatedAt: number;
}

export type PatientBannerCollection = RxCollection<PatientBannerDocType>;

const schema: RxJsonSchema<PatientBannerDocType> = {
  title: 'patient_banner',
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 50 },
    patientData: { type: 'object' },
    visitAppointments: { type: 'array', items: { type: 'object' } },
    selectedVisit: { type: 'object' },
    payerInfo: { type: 'array', items: { type: 'object' } },
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
    try {
      await db.addCollections({ patient_banner: { schema, migrationStrategies: migrationStrategies as any } });
    } catch (e) {
      // If collection already exists, ignore and proceed; RxDB will have the collection ready
    }
    return (db as any).collections.patient_banner as PatientBannerCollection;
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
