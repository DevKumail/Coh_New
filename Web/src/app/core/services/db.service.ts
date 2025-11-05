// e.g., in a service: src/app/core/db.service.ts
import { Injectable } from '@angular/core';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

@Injectable({ providedIn: 'root' })
export class DbService {
  private dbPromise?: Promise<any>;

  get db() {
    if (!this.dbPromise) {
      this.dbPromise = createRxDatabase({
        name: 'coherent',
        storage: getRxStorageDexie(),
      });
    }
    return this.dbPromise;
  }
}