import { Injectable } from '@angular/core';
import { RxDBHelperService } from './rxdb-helper.service';
import { RxJsonSchema } from 'rxdb';

/**
 * User Data Service using RxDB
 * Manages current logged-in user information
 */

// User Type Interface
export interface CurrentUser {
  id: string;
  userName: string;
  userId?: string;
  email?: string;
  role?: string;
  facilityId?: string;
  facilityName?: string;
  providerId?: string;
  providerName?: string;
  lastLogin?: number;
  createdAt: number;
  updatedAt?: number;
}

// User Collection Schema
const userSchema: RxJsonSchema<CurrentUser> = {
  title: 'current user schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    userName: { type: 'string' },
    userId: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' },
    facilityId: { type: 'string' },
    facilityName: { type: 'string' },
    providerId: { type: 'string' },
    providerName: { type: 'string' },
    lastLogin: { type: 'number' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'userName', 'createdAt']
};

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly COLLECTION_NAME = 'currentuser';
  private readonly CURRENT_USER_ID = 'current';
  private initPromise?: Promise<void>;

  constructor(private rxdbHelper: RxDBHelperService) {
    this.initPromise = this.initializeCollection();
  }

  // Initialize collection with schema
  private async initializeCollection(): Promise<void> {
    try {
      await this.rxdbHelper.getCollection(this.COLLECTION_NAME, userSchema);
      console.log('✅ Current user collection initialized');
    } catch (error) {
      console.error('❌ Failed to initialize user collection:', error);
    }
  }

  // Ensure collection is ready before operations
  private async ensureReady(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  // Get user from IndexedDB session database
  private async getUserFromIndexedDB(): Promise<Omit<CurrentUser, 'id' | 'createdAt'> | null> {
    try {
      console.log('🔍 Checking IndexedDB for user data in rxdb-dexie-coherent--0--session...');
      
      return new Promise((resolve) => {
        const dbName = 'rxdb-dexie-coherent--0--session';
        const request = indexedDB.open(dbName);

        request.onerror = () => {
          console.log('⚠️ Failed to open IndexedDB:', dbName);
          resolve(null);
        };

        request.onsuccess = (event: any) => {
          const db = event.target.result;
          console.log('✅ Opened IndexedDB:', dbName);
          console.log('📦 Object stores:', Array.from(db.objectStoreNames));

          // Try to read from different possible stores
          const possibleStores = ['docs', 'current', 'session', 'user'];
          let foundData = false;

          const tryStore = (storeName: string): void => {
            if (!db.objectStoreNames.contains(storeName)) {
              return;
            }

            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
              const allData = getAllRequest.result;
              console.log(`📦 Data from '${storeName}' store:`, allData);

              if (allData && allData.length > 0) {
                // Try to find user data in the docs
                for (const doc of allData) {
                  console.log('📦 Document:', doc);
                  
                  // Check if this doc has user info
                  const userData = doc.current || doc.user || doc;
                  
                  const userName = userData.userName || userData.username || userData.UserName || userData.name || '';
                  const userId = userData.userId || userData.userid || userData.UserId || userData.id || '';

                  if (userName) {
                    console.log('✅ Found user data in IndexedDB:', userName);
                    foundData = true;
                    db.close();
                    resolve({
                      userName: userName,
                      userId: userId,
                      email: userData.email || userData.Email || '',
                      role: userData.role || userData.Role || '',
                      facilityId: userData.facilityId || userData.FacilityId || '',
                      facilityName: userData.facilityName || userData.FacilityName || '',
                      providerId: userData.providerId || userData.ProviderId || '',
                      providerName: userData.providerName || userData.ProviderName || ''
                    });
                    return;
                  }
                }
              }
            };
          };

          // Try each possible store
          for (const storeName of possibleStores) {
            tryStore(storeName);
            if (foundData) break;
          }

          // If no data found after trying all stores
          setTimeout(() => {
            if (!foundData) {
              console.log('❌ No user data found in any store');
              db.close();
              resolve(null);
            }
          }, 100);
        };
      });
    } catch (error) {
      console.error('❌ Failed to read from IndexedDB:', error);
      return null;
    }
  }

  // Get user from sessionStorage (fallback)
  private getUserFromSessionStorage(): Omit<CurrentUser, 'id' | 'createdAt'> | null {
    try {
      console.log('🔍 Checking sessionStorage for user data...');
      const sessionData = sessionStorage.getItem('coherent-0-session');
      if (!sessionData) {
        console.log('⚠️ No coherent-0-session found in sessionStorage');
        return null;
      }

      const parsedData = JSON.parse(sessionData);
      console.log('📦 SessionStorage data parsed:', parsedData);
      console.log('📦 SessionStorage current object:', parsedData?.current);
      
      const currentUser = parsedData?.current;

      if (!currentUser) {
        console.log('⚠️ No current user in sessionStorage');
        console.log('📦 Available keys:', Object.keys(parsedData || {}));
        return null;
      }

      console.log('📦 Current user object:', currentUser);
      console.log('📦 Current user keys:', Object.keys(currentUser));
      
      // Check all possible field name variations
      const userName = currentUser.userName || currentUser.username || currentUser.UserName || currentUser.name || '';
      const userId = currentUser.userId || currentUser.userid || currentUser.UserId || currentUser.id || '';

      if (!userName) {
        console.log('⚠️ No userName found in sessionStorage user object');
        console.log('📦 User object content:', JSON.stringify(currentUser, null, 2));
        return null;
      }

      console.log('✅ Found user in sessionStorage:', userName);
      
      return {
        userName: userName,
        userId: userId,
        email: currentUser.email || currentUser.Email || '',
        role: currentUser.role || currentUser.Role || '',
        facilityId: currentUser.facilityId || currentUser.FacilityId || '',
        facilityName: currentUser.facilityName || currentUser.FacilityName || '',
        providerId: currentUser.providerId || currentUser.ProviderId || '',
        providerName: currentUser.providerName || currentUser.ProviderName || ''
      };
    } catch (error) {
      console.error('❌ Failed to parse sessionStorage:', error);
      return null;
    }
  }

  // ==================== SAVE USER ====================

  /**
   * Save current user to RxDB (called after login)
   * @param userData User data from login response
   */
  async setCurrentUser(userData: Omit<CurrentUser, 'id' | 'createdAt'>): Promise<CurrentUser | null> {
    try {
      // Wait for collection to be ready
      await this.ensureReady();
      
      const user: CurrentUser = {
        id: this.CURRENT_USER_ID,
        ...userData,
        lastLogin: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const result = await this.rxdbHelper.upsert<CurrentUser>(this.COLLECTION_NAME, user);
      console.log('✅ Current user saved to RxDB:', result.userName);
      return result;
    } catch (error) {
      console.error('❌ Failed to save user to RxDB:', error);
      return null;
    }
  }

  // ==================== GET USER ====================

  /**
   * Get current user from RxDB (with sessionStorage fallback)
   * @returns Current user or null
   */
  async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      debugger
      // Wait for collection to be ready
      await this.ensureReady();
      
      console.log(`🔍 Looking for user in collection: '${this.COLLECTION_NAME}', id: '${this.CURRENT_USER_ID}'`);
      
      const user = await this.rxdbHelper.getById<CurrentUser>(
        this.COLLECTION_NAME, 
        this.CURRENT_USER_ID
      );
      
      if (user) {
        console.log('👤 Current user from RxDB:', user.userName);
        return user;
      } else {
        console.log('⚠️ No user found in RxDB, checking IndexedDB session database...');
        
        // Try IndexedDB first
        const indexedDBData = await this.getUserFromIndexedDB();
        if (indexedDBData) {
          console.log('👤 Current user from IndexedDB:', indexedDBData.userName);
          console.log('💾 Auto-saving to RxDB for future use...');
          // Auto-save to RxDB for future use
          const savedUser = await this.setCurrentUser(indexedDBData);
          if (savedUser) {
            console.log('✅ User saved to RxDB successfully');
          }
          return savedUser;
        }
        
        // Fallback to sessionStorage
        const sessionData = this.getUserFromSessionStorage();
        if (sessionData) {
          console.log('👤 Current user from sessionStorage:', sessionData.userName);
          console.log('💾 Auto-saving to RxDB for future use...');
          // Auto-save to RxDB for future use
          const savedUser = await this.setCurrentUser(sessionData);
          if (savedUser) {
            console.log('✅ User saved to RxDB successfully');
          }
          return savedUser;
        }
        
        console.log('❌ No user found in RxDB, IndexedDB, or sessionStorage');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to get user from RxDB:', error);
      
      // Try IndexedDB first
      try {
        const indexedDBData = await this.getUserFromIndexedDB();
        if (indexedDBData) {
          console.log('👤 Fallback to IndexedDB:', indexedDBData.userName);
          return {
            id: this.CURRENT_USER_ID,
            ...indexedDBData,
            createdAt: Date.now()
          };
        }
      } catch (idbError) {
        console.error('❌ IndexedDB fallback failed:', idbError);
      }
      
      // Try sessionStorage as last resort
      const sessionData = this.getUserFromSessionStorage();
      if (sessionData) {
        console.log('👤 Fallback to sessionStorage:', sessionData.userName);
        // Try to save to RxDB
        try {
          const savedUser = await this.setCurrentUser(sessionData);
          return savedUser;
        } catch (saveError) {
          console.error('❌ Failed to save to RxDB, returning sessionStorage data:', saveError);
          // Return a complete CurrentUser object
          return {
            id: this.CURRENT_USER_ID,
            ...sessionData,
            createdAt: Date.now()
          };
        }
      }
      
      return null;
    }
  }

  /**
   * Get user name for audit fields (createdBy, updatedBy)
   * @returns User name or empty string
   */
  async getUserName(): Promise<string> {
    const user = await this.getCurrentUser();
    console.log('👤 getUserName - User object:', user);
    console.log('👤 getUserName - Returning:', user?.userName || '');
    return user?.userName || '';
  }

  /**
   * Get user ID
   * @returns User ID or empty string
   */
  async getUserId(): Promise<string> {
    debugger
    const user = await this.getCurrentUser();
    console.log('🆔 getUserId - User object:', user);
    console.log('🆔 getUserId - Returning:', user?.userId || '');
    return user?.userId || '';
  }

  // ==================== UPDATE USER ====================

  /**
   * Update current user information
   * @param updates Partial user data to update
   */
  async updateCurrentUser(updates: Partial<CurrentUser>): Promise<CurrentUser | null> {
    try {
      await this.ensureReady();
      return await this.rxdbHelper.updateById<CurrentUser>(
        this.COLLECTION_NAME,
        this.CURRENT_USER_ID,
        {
          ...updates,
          updatedAt: Date.now()
        }
      );
    } catch (error) {
      console.error('❌ Failed to update user in RxDB:', error);
      return null;
    }
  }

  // ==================== CLEAR USER ====================

  /**
   * Clear current user (called on logout)
   */
  async clearCurrentUser(): Promise<boolean> {
    try {
      await this.ensureReady();
      const result = await this.rxdbHelper.deleteById(
        this.COLLECTION_NAME,
        this.CURRENT_USER_ID
      );
      
      if (result) {
        console.log('✅ Current user cleared from RxDB');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to clear user from RxDB:', error);
      return false;
    }
  }

  // ==================== UTILITY ====================

  /**
   * Check if user is logged in (exists in RxDB)
   */
  async isUserLoggedIn(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Get user info for audit trail
   * @returns Object with userName and userId
   */
  async getAuditInfo(): Promise<{ createdBy: string; updatedBy: string; userId?: string }> {
    const user = await this.getCurrentUser();
    return {
      createdBy: user?.userName || '',
      updatedBy: user?.userName || '',
      userId: user?.userId
    };
  }

  /**
   * Migrate from localStorage to RxDB (one-time migration helper)
   */
  async migrateFromLocalStorage(): Promise<void> {
    try {
      await this.ensureReady();
      const localUser = localStorage.getItem('currentUser');
      
      if (localUser) {
        const userData = JSON.parse(localUser);
        
        // Save to RxDB
        await this.setCurrentUser({
          userName: userData.userName || '',
          userId: userData.userId,
          email: userData.email,
          role: userData.role,
          facilityId: userData.facilityId,
          facilityName: userData.facilityName,
          providerId: userData.providerId,
          providerName: userData.providerName
        });

        console.log('✅ User data migrated from localStorage to RxDB');
        
        // Optionally remove from localStorage
        // localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('❌ Failed to migrate user data:', error);
    }
  }
}
