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
  version: 3,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 50 },
    patientData: { 
      oneOf: [
        { type: 'object', properties: {}, additionalProperties: true },
        { type: 'null' }
      ]
    },
    patientIVFData: { 
      oneOf: [
        { type: 'object', properties: {}, additionalProperties: true },
        { type: 'null' }
      ]
    },
    visitAppointments: { type: 'array', items: { type: 'object', properties: {}, additionalProperties: true } },
    selectedVisit: { 
      oneOf: [
        { type: 'object', properties: {}, additionalProperties: true },
        { type: 'null' }
      ]
    },
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
  },
  2: (oldDoc: any) => {
    // Migration from v2 to v3: ensure null values are preserved
    return {
      ...oldDoc,
      patientData: oldDoc.patientData ?? null,
      patientIVFData: oldDoc.patientIVFData ?? null,
      selectedVisit: oldDoc.selectedVisit ?? null
    };
  }
} as const;

@Injectable({ providedIn: 'root' })
export class PatientBannerStoreService {
  private initPromise?: Promise<RxDatabase>;
  constructor(private dbService: DbService) {}

  private async col(): Promise<PatientBannerCollection> {
    const db = await this.db();
    console.log('🔍 Looking for patientbanner collection...');
    
    // Check if collection already exists
    if (!('patientbanner' in db.collections)) {
      console.log('📝 Creating new patientbanner collection...');
      try {
        await db.addCollections({ 
          patientbanner: { 
            schema, 
            migrationStrategies: migrationStrategies as any 
          } 
        });
        console.log('✅ Created patientbanner collection successfully');
      } catch (e) {
        console.error('❌ Error creating patientbanner collection:', e);
        throw e;
      }
    } else {
      console.log('✅ Found existing patientbanner collection');
    }
    
    return (db as any).collections.patientbanner as PatientBannerCollection;
  }

  private db(): Promise<RxDatabase> {
    if (!this.initPromise) this.initPromise = this.dbService.db;
    return this.initPromise;
  }


  async get(): Promise<PatientBannerDocType | null> {
    try {
      const col = await this.col();
      const doc = await col.findOne('current').exec();
      return doc ? (doc.toJSON() as PatientBannerDocType) : null;
    } catch (error) {
      console.error('❌ Failed to get patient banner from RxDB:', error);
      return null;
    }
  }

  async set(partial: Partial<Omit<PatientBannerDocType, 'id' | 'updatedAt'>>): Promise<void> {
    try {
      const existing = (await this.get()) || { 
        id: 'current', 
        patientData: null, 
        patientIVFData: null,
        visitAppointments: [], 
        selectedVisit: null, 
        payerInfo: [], 
        updatedAt: Date.now() 
      };
      const next = { ...existing, ...partial, updatedAt: Date.now() } as PatientBannerDocType;
      const col = await this.col();
      await col.upsert(next);
      console.log('✅ Patient banner saved to RxDB successfully');
    } catch (error) {
      console.error('❌ Failed to save patient banner to RxDB:', error);
      console.warn('⚠️ Data will not persist across page refreshes');
      // Continue without throwing - app should work without persistence
    }
  }

  async clear(): Promise<void> {
    try {
      const col = await this.col();
      const doc = await col.findOne('current').exec();
      if (doc) await doc.remove();
      console.log('✅ Patient banner cleared from RxDB');
    } catch (error) {
      console.error('❌ Failed to clear patient banner from RxDB:', error);
      // Continue without throwing
    }
  }
}
