import { Injectable } from '@angular/core';
import { RxDBHelperService } from './rxdb-helper.service';
import { RxJsonSchema } from 'rxdb';

/**
 * Example: Patient Data Service using RxDB Helper
 * Demonstrates how to use RxDBHelperService for specific domain
 */

// Patient Type Interface
export interface Patient {
  id: string;
  mrNo: string;
  name: string;
  dob?: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: 'active' | 'inactive' | 'deceased';
  createdAt: number;
  updatedAt?: number;
}

// Patient Collection Schema
const patientSchema: RxJsonSchema<Patient> = {
  title: 'patient schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    mrNo: { type: 'string', maxLength: 50 },
    name: { type: 'string' },
    dob: { type: 'string' },
    age: { type: 'number', minimum: 0, maximum: 150 },
    gender: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    address: { type: 'string' },
    status: { type: 'string', enum: ['active', 'inactive', 'deceased'] },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'mrNo', 'name', 'status', 'createdAt'],
  indexes: ['mrNo', 'status', 'name']
};

@Injectable({
  providedIn: 'root'
})
export class PatientDataService {
  private readonly COLLECTION_NAME = 'patients';

  constructor(private rxdbHelper: RxDBHelperService) {
    this.initializeCollection();
  }

  // Initialize collection with schema
  private async initializeCollection(): Promise<void> {
    try {
      await this.rxdbHelper.getCollection(this.COLLECTION_NAME, patientSchema);
      console.log('✅ Patients collection initialized');
    } catch (error) {
      console.error('❌ Failed to initialize patients collection:', error);
    }
  }

  // ==================== CREATE ====================

  /**
   * Register a new patient
   */
  async registerPatient(patientData: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient | null> {
    try {
      const patient: Patient = {
        id: `P${Date.now()}`,
        ...patientData,
        createdAt: Date.now()
      };

      return await this.rxdbHelper.insert<Patient>(this.COLLECTION_NAME, patient);
    } catch (error) {
      console.error('❌ Failed to register patient:', error);
      return null;
    }
  }

  /**
   * Register multiple patients
   */
  async registerMultiplePatients(patientsData: Omit<Patient, 'id' | 'createdAt'>[]): Promise<Patient[]> {
    const patients: Patient[] = patientsData.map(data => ({
      id: `P${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: Date.now()
    }));

    return await this.rxdbHelper.bulkInsert<Patient>(this.COLLECTION_NAME, patients);
  }

  // ==================== READ ====================

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<Patient | null> {
    return await this.rxdbHelper.getById<Patient>(this.COLLECTION_NAME, id);
  }

  /**
   * Get patient by MR Number
   */
  async getPatientByMRNo(mrNo: string): Promise<Patient | null> {
    const patients = await this.rxdbHelper.getByMrNo<Patient>(this.COLLECTION_NAME, mrNo);
    return patients.length > 0 ? patients[0] : null;
  }

  /**
   * Search patients by name
   */
  async searchPatientsByName(name: string): Promise<Patient[]> {
    return await this.rxdbHelper.search<Patient>(this.COLLECTION_NAME, 'name', name);
  }

  /**
   * Get all active patients
   */
  async getActivePatients(): Promise<Patient[]> {
    return await this.rxdbHelper.find<Patient>(this.COLLECTION_NAME, {
      status: 'active'
    }, {
      sort: { name: 'asc' }
    });
  }

  /**
   * Get patients with pagination
   */
  async getPatientsPaginated(page: number = 1, pageSize: number = 10): Promise<{
    data: Patient[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  }> {
    const skip = (page - 1) * pageSize;

    const data = await this.rxdbHelper.find<Patient>(
      this.COLLECTION_NAME,
      { status: 'active' },
      {
        sort: { name: 'asc' },
        limit: pageSize,
        skip: skip
      }
    );

    const totalCount = await this.rxdbHelper.count(this.COLLECTION_NAME, { status: 'active' });

    return {
      data,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount
    };
  }

  /**
   * Get patients by age range
   */
  async getPatientsByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    return await this.rxdbHelper.find<Patient>(this.COLLECTION_NAME, {
      age: { $gte: minAge, $lte: maxAge },
      status: 'active'
    });
  }

  /**
   * Get patient count
   */
  async getTotalPatients(): Promise<number> {
    return await this.rxdbHelper.count(this.COLLECTION_NAME);
  }

  /**
   * Get active patient count
   */
  async getActivePatientCount(): Promise<number> {
    return await this.rxdbHelper.count(this.COLLECTION_NAME, { status: 'active' });
  }

  // ==================== UPDATE ====================

  /**
   * Update patient information
   */
  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    return await this.rxdbHelper.updateById<Patient>(this.COLLECTION_NAME, id, {
      ...updates,
      updatedAt: Date.now()
    });
  }

  /**
   * Update patient by MR Number
   */
  async updatePatientByMRNo(mrNo: string, updates: Partial<Patient>): Promise<number> {
    return await this.rxdbHelper.updateByMrNo<Patient>(this.COLLECTION_NAME, mrNo, {
      ...updates,
      updatedAt: Date.now()
    });
  }

  /**
   * Mark patient as inactive
   */
  async deactivatePatient(id: string): Promise<Patient | null> {
    return await this.updatePatient(id, { status: 'inactive' });
  }

  /**
   * Mark patient as active
   */
  async activatePatient(id: string): Promise<Patient | null> {
    return await this.updatePatient(id, { status: 'active' });
  }

  // ==================== DELETE ====================

  /**
   * Delete patient by ID
   */
  async deletePatient(id: string): Promise<boolean> {
    return await this.rxdbHelper.deleteById(this.COLLECTION_NAME, id);
  }

  /**
   * Delete patient by MR Number
   */
  async deletePatientByMRNo(mrNo: string): Promise<number> {
    return await this.rxdbHelper.deleteByMrNo(this.COLLECTION_NAME, mrNo);
  }

  /**
   * Delete all inactive patients
   */
  async deleteInactivePatients(): Promise<number> {
    return await this.rxdbHelper.deleteMany(this.COLLECTION_NAME, {
      status: 'inactive'
    });
  }

  /**
   * Clear all patients
   */
  async clearAllPatients(): Promise<number> {
    return await this.rxdbHelper.clearCollection(this.COLLECTION_NAME);
  }

  // ==================== UTILITY ====================

  /**
   * Check if patient exists by MR Number
   */
  async patientExists(mrNo: string): Promise<boolean> {
    const patient = await this.getPatientByMRNo(mrNo);
    return patient !== null;
  }

  /**
   * Export all patients
   */
  async exportPatients(): Promise<Patient[]> {
    return await this.rxdbHelper.exportCollection<Patient>(this.COLLECTION_NAME);
  }

  /**
   * Import patients from backup
   */
  async importPatients(patients: Patient[]): Promise<void> {
    return await this.rxdbHelper.importCollection<Patient>(this.COLLECTION_NAME, patients);
  }

  /**
   * Get collection statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    deceased: number;
  }> {
    const total = await this.rxdbHelper.count(this.COLLECTION_NAME);
    const active = await this.rxdbHelper.count(this.COLLECTION_NAME, { status: 'active' });
    const inactive = await this.rxdbHelper.count(this.COLLECTION_NAME, { status: 'inactive' });
    const deceased = await this.rxdbHelper.count(this.COLLECTION_NAME, { status: 'deceased' });

    return { total, active, inactive, deceased };
  }

  /**
   * Get recent patients
   */
  async getRecentPatients(limit: number = 10): Promise<Patient[]> {
    return await this.rxdbHelper.find<Patient>(
      this.COLLECTION_NAME,
      {},
      {
        sort: { createdAt: 'desc' },
        limit
      }
    );
  }
}
