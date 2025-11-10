import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RxJsonSchema, RxCollection, RxDocument, RxDatabase } from 'rxdb';
import { DbService } from './db.service';

export interface Facility {
  employeeId: number;
  facilityId: number;
  companyId: number;
  companyName: string;
  facilityName: string;
}

export interface SessionDocType {
  id: string; // fixed: 'current'
  token: string;
  userId: number;
  userName: string;
  empId: number;
  allowscreens: string[];
  facilities: Facility[];
  createdAt: number;
}

export type SessionDocument = RxDocument<SessionDocType>;
export type SessionCollection = RxCollection<SessionDocType>;

const sessionSchema: RxJsonSchema<SessionDocType> = {
  title: 'session',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 50 },
    token: { type: 'string' },
    userId: { type: 'number' },
    userName: { type: 'string' },
    empId: { type: 'number' },
    allowscreens: { type: 'array', items: { type: 'string' } },
    facilities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          employeeId: { type: 'number' },
          facilityId: { type: 'number' },
          companyId: { type: 'number' },
          companyName: { type: 'string' },
          facilityName: { type: 'string' }
        },
        required: ['employeeId', 'facilityId', 'companyId', 'companyName', 'facilityName']
      }
    },
    createdAt: { type: 'number' }
  },
  required: ['id', 'token', 'userId', 'userName', 'empId', 'allowscreens', 'facilities', 'createdAt']
};

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private initPromise?: Promise<RxDatabase>;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  readonly token$ = this.tokenSubject.asObservable();

  constructor(private dbService: DbService) {}

  private async ensureCollection(): Promise<SessionCollection> {
    const db = await this.initDb();
    if (!('session' in db.collections)) {
      await db.addCollections({
        session: { schema: sessionSchema }
      });
    }
    return (db as any).collections.session as SessionCollection;
  }

  private async initDb(): Promise<RxDatabase> {
    if (!this.initPromise) {
      this.initPromise = this.dbService.db;
    }
    return this.initPromise;
  }

  // Attempt to hydrate cached token on first access of the service
  private hydrated = false;
  private async ensureHydrated(): Promise<void> {
    if (this.hydrated) return;
    const session = await this.getSessionOnce();
    this.tokenSubject.next(session?.token ?? null);
    this.hydrated = true;
  }

  async saveLoginResponse(res: {
    token: string;
    userId: number;
    userName: string;
    empId: number;
    allowscreens: string[];
    facilities: Facility[];
  }): Promise<void> {
    const col = await this.ensureCollection();
    await col.upsert({
      id: 'current',
      token: res.token,
      userId: res.userId,
      userName: res.userName,
      empId: res.empId,
      allowscreens: res.allowscreens ?? [],
      facilities: res.facilities ?? [],
      createdAt: Date.now()
    });
    // Update in-memory cache for immediate synchronous access
    this.tokenSubject.next(res.token);
    this.hydrated = true;
  }

  async clearSession(): Promise<void> {
    const col = await this.ensureCollection();
    const doc = await col.findOne('current').exec();
    if (doc) {
      await doc.remove();
    }
    this.tokenSubject.next(null);
    this.hydrated = true;
  }

  async getSessionOnce(): Promise<SessionDocType | null> {
    const col = await this.ensureCollection();
    const doc = await col.findOne('current').exec();
    return doc ? (doc.toJSON() as SessionDocType) : null;
  }

  async getTokenFromDb(): Promise<string | null> {
    await this.ensureHydrated();
    const session = await this.getSessionOnce();
    return session?.token ?? null;
  }

  // Synchronous cached token for guards/components that can't await
  getTokenCached(): string | null {
    return this.tokenSubject.value;
  }
}
