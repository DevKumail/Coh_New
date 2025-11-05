import { Injectable } from '@angular/core';
import { RxCollection, RxDatabase, RxJsonSchema } from 'rxdb';
import { DbService } from './db.service';
import { LayoutState } from '@/app/types/layout';

export interface LayoutConfigDocType {
  id: string; // 'current'
  state: LayoutState;
  updatedAt: number;
}

export type LayoutConfigCollection = RxCollection<LayoutConfigDocType>;

const schema: RxJsonSchema<LayoutConfigDocType> = {
  title: 'layout_config',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 50 },
    state: { type: 'object' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'state', 'updatedAt']
};

@Injectable({ providedIn: 'root' })
export class LayoutConfigStoreService {
  private initPromise?: Promise<RxDatabase>;
  constructor(private dbService: DbService) {}

  private async col(): Promise<LayoutConfigCollection> {
    const db = await this.db();
    if (!('layout_config' in db.collections)) {
      await db.addCollections({ layout_config: { schema } });
    }
    return (db as any).collections.layout_config as LayoutConfigCollection;
  }

  private db(): Promise<RxDatabase> {
    if (!this.initPromise) this.initPromise = this.dbService.db;
    return this.initPromise;
  }

  async get(): Promise<LayoutConfigDocType | null> {
    const col = await this.col();
    const doc = await col.findOne('current').exec();
    return doc ? (doc.toJSON() as LayoutConfigDocType) : null;
  }

  async set(state: LayoutState): Promise<void> {
    const col = await this.col();
    await col.upsert({ id: 'current', state, updatedAt: Date.now() });
  }
}
