import { Injectable } from '@angular/core';
import { RxDatabase, RxCollection, RxJsonSchema } from 'rxdb';
import { DbService } from './db.service';

/**
 * Generic RxDB Helper Service
 * Provides CRUD operations for any RxDB collection
 */
@Injectable({
  providedIn: 'root'
})
export class RxDBHelperService {
  private initPromise?: Promise<RxDatabase>;

  constructor(private dbService: DbService) {}

  private async db(): Promise<RxDatabase> {
    if (!this.initPromise) this.initPromise = this.dbService.db;
    return this.initPromise;
  }

  // ==================== COLLECTION MANAGEMENT ====================

  /**
   * Get or create a collection
   * @param collectionName Name of the collection
   * @param schema RxDB schema for the collection
   * @param migrationStrategies Optional migration strategies
   */
  async getCollection<T = any>(
    collectionName: string,
    schema?: RxJsonSchema<T>,
    migrationStrategies?: any
  ): Promise<RxCollection<T>> {
    const db = await this.db();

    // If collection exists, return it
    if (collectionName in db.collections) {
      console.log(`✅ Found existing collection: ${collectionName}`);
      return db.collections[collectionName] as RxCollection<T>;
    }

    // Create new collection if schema provided
    if (!schema) {
      throw new Error(`Collection '${collectionName}' does not exist and no schema provided`);
    }

    console.log(`📝 Creating new collection: ${collectionName}`);
    await db.addCollections({
      [collectionName]: {
        schema,
        migrationStrategies
      }
    });

    console.log(`✅ Collection '${collectionName}' created successfully`);
    return db.collections[collectionName] as RxCollection<T>;
  }

  // ==================== CREATE OPERATIONS ====================

  /**
   * Insert a single document
   * @param collectionName Name of the collection
   * @param document Document to insert
   */
  async insert<T = any>(collectionName: string, document: T): Promise<T> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const result = await collection.insert(document);
      console.log(`✅ Document inserted in '${collectionName}':`, result.primary);
      return result.toJSON() as T;
    } catch (error) {
      console.error(`❌ Failed to insert document in '${collectionName}':`, error);
      throw error;
    }
  }

  /**
   * Insert multiple documents
   * @param collectionName Name of the collection
   * @param documents Array of documents to insert
   */
  async bulkInsert<T = any>(collectionName: string, documents: T[]): Promise<T[]> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const result = await collection.bulkInsert(documents);
      console.log(`✅ ${result.success.length} documents inserted in '${collectionName}'`);
      return result.success.map(doc => doc.toJSON() as T);
    } catch (error) {
      console.error(`❌ Failed to bulk insert in '${collectionName}':`, error);
      throw error;
    }
  }

  /**
   * Upsert (insert or update) a document
   * @param collectionName Name of the collection
   * @param document Document to upsert
   */
  async upsert<T = any>(collectionName: string, document: T): Promise<T> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const result = await collection.upsert(document);
      console.log(`✅ Document upserted in '${collectionName}':`, result.primary);
      return result.toJSON() as T;
    } catch (error) {
      console.error(`❌ Failed to upsert document in '${collectionName}':`, error);
      throw error;
    }
  }

  // ==================== READ OPERATIONS ====================

  /**
   * Get a single document by primary key
   * @param collectionName Name of the collection
   * @param id Primary key value
   */
  async getById<T = any>(collectionName: string, id: string | number): Promise<T | null> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const doc = await collection.findOne(id as any).exec();
      return doc ? (doc.toJSON() as T) : null;
    } catch (error) {
      console.error(`❌ Failed to get document by ID in '${collectionName}':`, error);
      return null;
    }
  }

  /**
   * Get document(s) by MR Number
   * @param collectionName Name of the collection
   * @param mrNo MR Number to search for
   * @param fieldPath Path to MR number field (e.g., 'mrNo' or 'patient.mrNo')
   */
  async getByMrNo<T = any>(
    collectionName: string,
    mrNo: string,
    fieldPath: string = 'mrNo'
  ): Promise<T[]> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const docs = await collection.find({
        selector: {
          [fieldPath]: mrNo
        } as any
      }).exec();

      console.log(`📦 Found ${docs.length} documents with MR: ${mrNo}`);
      return docs.map(doc => doc.toJSON() as T);
    } catch (error) {
      console.error(`❌ Failed to get documents by MR in '${collectionName}':`, error);
      return [];
    }
  }

  /**
   * Get all documents from a collection
   * @param collectionName Name of the collection
   * @param limit Optional limit
   */
  async getAll<T = any>(collectionName: string, limit?: number): Promise<T[]> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      let query = collection.find();

      if (limit) {
        query = query.limit(limit);
      }

      const docs = await query.exec();
      console.log(`📦 Retrieved ${docs.length} documents from '${collectionName}'`);
      return docs.map(doc => doc.toJSON() as T);
    } catch (error) {
      console.error(`❌ Failed to get all documents from '${collectionName}':`, error);
      return [];
    }
  }

  /**
   * Find documents by custom query
   * @param collectionName Name of the collection
   * @param selector MongoDB-style query selector
   * @param options Optional query options (sort, limit, skip)
   */
  async find<T = any>(
    collectionName: string,
    selector: any,
    options?: { sort?: any; limit?: number; skip?: number }
  ): Promise<T[]> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      let query = collection.find({ selector: selector as any });

      if (options?.sort) query = query.sort(options.sort);
      if (options?.limit) query = query.limit(options.limit);
      if (options?.skip) query = query.skip(options.skip);

      const docs = await query.exec();
      console.log(`📦 Found ${docs.length} documents in '${collectionName}'`);
      return docs.map(doc => doc.toJSON() as T);
    } catch (error) {
      console.error(`❌ Failed to find documents in '${collectionName}':`, error);
      return [];
    }
  }

  /**
   * Find one document by custom query
   * @param collectionName Name of the collection
   * @param selector MongoDB-style query selector
   */
  async findOne<T = any>(collectionName: string, selector: any): Promise<T | null> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const doc = await collection.findOne({ selector: selector as any }).exec();
      return doc ? (doc.toJSON() as T) : null;
    } catch (error) {
      console.error(`❌ Failed to find document in '${collectionName}':`, error);
      return null;
    }
  }

  /**
   * Count documents in a collection
   * @param collectionName Name of the collection
   * @param selector Optional query selector
   */
  async count(collectionName: string, selector?: any): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName);
      if (selector) {
        const docs = await collection.find({ selector: selector as any }).exec();
        const count = docs.length;
        console.log(`📊 Count in '${collectionName}':`, count);
        return count;
      } else {
        const docs = await collection.find().exec();
        const count = docs.length;
        console.log(`📊 Count in '${collectionName}':`, count);
        return count;
      }
    } catch (error) {
      console.error(`❌ Failed to count documents in '${collectionName}':`, error);
      return 0;
    }
  }

  // ==================== UPDATE OPERATIONS ====================

  /**
   * Update a document by primary key
   * @param collectionName Name of the collection
   * @param id Primary key value
   * @param updateData Partial data to update
   */
  async updateById<T = any>(
    collectionName: string,
    id: string | number,
    updateData: Partial<T>
  ): Promise<T | null> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const doc = await collection.findOne(id as any).exec();

      if (!doc) {
        console.warn(`⚠️ Document with ID '${id}' not found in '${collectionName}'`);
        return null;
      }

      await doc.patch(updateData);
      console.log(`✅ Document updated in '${collectionName}':`, id);
      return doc.toJSON() as T;
    } catch (error) {
      console.error(`❌ Failed to update document in '${collectionName}':`, error);
      return null;
    }
  }

  /**
   * Update documents by query
   * @param collectionName Name of the collection
   * @param selector Query selector
   * @param updateData Data to update
   */
  async updateMany<T = any>(
    collectionName: string,
    selector: any,
    updateData: Partial<T>
  ): Promise<number> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const docs = await collection.find({ selector: selector as any }).exec();

      let updated = 0;
      for (const doc of docs) {
        await doc.patch(updateData);
        updated++;
      }

      console.log(`✅ Updated ${updated} documents in '${collectionName}'`);
      return updated;
    } catch (error) {
      console.error(`❌ Failed to update documents in '${collectionName}':`, error);
      return 0;
    }
  }

  /**
   * Update document by MR Number
   * @param collectionName Name of the collection
   * @param mrNo MR Number
   * @param updateData Data to update
   * @param fieldPath Path to MR number field
   */
  async updateByMrNo<T = any>(
    collectionName: string,
    mrNo: string,
    updateData: Partial<T>,
    fieldPath: string = 'mrNo'
  ): Promise<number> {
    return this.updateMany(collectionName, { [fieldPath]: mrNo }, updateData);
  }

  // ==================== DELETE OPERATIONS ====================

  /**
   * Delete a document by primary key
   * @param collectionName Name of the collection
   * @param id Primary key value
   */
  async deleteById(collectionName: string, id: string | number): Promise<boolean> {
    try {
      const collection = await this.getCollection(collectionName);
      const doc = await collection.findOne(id as any).exec();

      if (!doc) {
        console.warn(`⚠️ Document with ID '${id}' not found in '${collectionName}'`);
        return false;
      }

      await doc.remove();
      console.log(`✅ Document deleted from '${collectionName}':`, id);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete document from '${collectionName}':`, error);
      return false;
    }
  }

  /**
   * Delete documents by query
   * @param collectionName Name of the collection
   * @param selector Query selector
   */
  async deleteMany(collectionName: string, selector: any): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName);
      const docs = await collection.find({ selector: selector as any }).exec();

      let deleted = 0;
      for (const doc of docs) {
        await doc.remove();
        deleted++;
      }

      console.log(`✅ Deleted ${deleted} documents from '${collectionName}'`);
      return deleted;
    } catch (error) {
      console.error(`❌ Failed to delete documents from '${collectionName}':`, error);
      return 0;
    }
  }

  /**
   * Delete documents by MR Number
   * @param collectionName Name of the collection
   * @param mrNo MR Number
   * @param fieldPath Path to MR number field
   */
  async deleteByMrNo(
    collectionName: string,
    mrNo: string,
    fieldPath: string = 'mrNo'
  ): Promise<number> {
    return this.deleteMany(collectionName, { [fieldPath]: mrNo });
  }

  /**
   * Clear all documents from a collection
   * @param collectionName Name of the collection
   */
  async clearCollection(collectionName: string): Promise<number> {
    try {
      const collection = await this.getCollection(collectionName);
      const docs = await collection.find().exec();

      let deleted = 0;
      for (const doc of docs) {
        await doc.remove();
        deleted++;
      }

      console.log(`✅ Cleared ${deleted} documents from '${collectionName}'`);
      return deleted;
    } catch (error) {
      console.error(`❌ Failed to clear collection '${collectionName}':`, error);
      return 0;
    }
  }

  // ==================== UTILITY OPERATIONS ====================

  /**
   * Check if a document exists by ID
   * @param collectionName Name of the collection
   * @param id Primary key value
   */
  async exists(collectionName: string, id: string | number): Promise<boolean> {
    const doc = await this.getById(collectionName, id);
    return doc !== null;
  }

  /**
   * Export all data from a collection
   * @param collectionName Name of the collection
   */
  async exportCollection<T = any>(collectionName: string): Promise<T[]> {
    return this.getAll<T>(collectionName);
  }

  /**
   * Import data into a collection (bulk upsert)
   * @param collectionName Name of the collection
   * @param documents Array of documents
   */
  async importCollection<T = any>(collectionName: string, documents: T[]): Promise<void> {
    try {
      const collection = await this.getCollection<T>(collectionName);

      for (const doc of documents) {
        await collection.upsert(doc);
      }

      console.log(`✅ Imported ${documents.length} documents to '${collectionName}'`);
    } catch (error) {
      console.error(`❌ Failed to import to '${collectionName}':`, error);
      throw error;
    }
  }

  /**
   * Remove entire collection (including schema)
   * @param collectionName Name of the collection
   */
  async removeCollection(collectionName: string): Promise<void> {
    try {
      const db = await this.db();

      if (!(collectionName in db.collections)) {
        console.warn(`⚠️ Collection '${collectionName}' does not exist`);
        return;
      }

      await db.collections[collectionName].remove();
      console.log(`✅ Collection '${collectionName}' removed`);
    } catch (error) {
      console.error(`❌ Failed to remove collection '${collectionName}':`, error);
      throw error;
    }
  }

  /**
   * Get collection statistics
   * @param collectionName Name of the collection
   */
  async getStats(collectionName: string): Promise<{
    name: string;
    count: number;
    exists: boolean;
  }> {
    try {
      const db = await this.db();
      const exists = collectionName in db.collections;

      if (!exists) {
        return { name: collectionName, count: 0, exists: false };
      }

      const count = await this.count(collectionName);
      return { name: collectionName, count, exists: true };
    } catch (error) {
      console.error(`❌ Failed to get stats for '${collectionName}':`, error);
      return { name: collectionName, count: 0, exists: false };
    }
  }

  /**
   * Search documents with text search (if field is indexed)
   * @param collectionName Name of the collection
   * @param field Field to search in
   * @param searchText Text to search for
   */
  async search<T = any>(
    collectionName: string,
    field: string,
    searchText: string
  ): Promise<T[]> {
    try {
      const collection = await this.getCollection<T>(collectionName);
      const docs = await collection.find({
        selector: {
          [field]: {
            $regex: new RegExp(searchText, 'i')
          }
        } as any
      }).exec();

      console.log(`🔍 Search found ${docs.length} results in '${collectionName}'`);
      return docs.map(doc => doc.toJSON() as T);
    } catch (error) {
      console.error(`❌ Search failed in '${collectionName}':`, error);
      return [];
    }
  }
}
