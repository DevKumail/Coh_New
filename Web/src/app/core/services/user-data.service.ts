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

  constructor(private rxdbHelper: RxDBHelperService) {
    this.initializeCollection();
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

  // ==================== SAVE USER ====================

  /**
   * Save current user to RxDB (called after login)
   * @param userData User data from login response
   */
  async setCurrentUser(userData: Omit<CurrentUser, 'id' | 'createdAt'>): Promise<CurrentUser | null> {
    try {
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
   * Get current user from RxDB
   * @returns Current user or null
   */
  async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      const user = await this.rxdbHelper.getById<CurrentUser>(
        this.COLLECTION_NAME, 
        this.CURRENT_USER_ID
      );
      
      if (user) {
        console.log('👤 Current user from RxDB:', user.userName);
      } else {
        console.log('⚠️ No user found in RxDB');
      }
      
      return user;
    } catch (error) {
      console.error('❌ Failed to get user from RxDB:', error);
      return null;
    }
  }

  /**
   * Get user name for audit fields (createdBy, updatedBy)
   * @returns User name or empty string
   */
  async getUserName(): Promise<string> {
    const user = await this.getCurrentUser();
    return user?.userName || '';
  }

  /**
   * Get user ID
   * @returns User ID or empty string
   */
  async getUserId(): Promise<string> {
    const user = await this.getCurrentUser();
    return user?.userId || '';
  }

  // ==================== UPDATE USER ====================

  /**
   * Update current user information
   * @param updates Partial user data to update
   */
  async updateCurrentUser(updates: Partial<CurrentUser>): Promise<CurrentUser | null> {
    try {
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
