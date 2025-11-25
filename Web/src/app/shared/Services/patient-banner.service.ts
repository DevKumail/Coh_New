import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PatientBannerStoreService } from '@core/services/patient-banner-store.service';

@Injectable({
  providedIn: 'root',
})
export class PatientBannerService {
  // Storage keys
  private readonly STORAGE_KEYS = {
    patientData: 'pb_patientData',
    visitAppointments: 'pb_visitAppointments',
    selectedVisit: 'pb_selectedVisit',
    payerInfo: 'pb_payerInfo',
  } as const;

  private isHydrated = false;
  private hydrationPromise!: Promise<void>;

  private isLoadingSource = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSource.asObservable();

  private patientDataSource = new BehaviorSubject<any>(null);
  // Use shareReplay to ensure late subscribers get the last emitted value
  patientData$ = this.patientDataSource.asObservable();
  
  private patientIVFDataSource = new BehaviorSubject<any>(null);
  patientIVFData$ = this.patientIVFDataSource.asObservable();

  private visitAppointmentsSource = new BehaviorSubject<any[]>([]);
  visitAppointments$ = this.visitAppointmentsSource.asObservable();

  private payerInfo = new BehaviorSubject<any[]>([]);
  payerInfo$ = this.payerInfo.asObservable();

  private selectedVisit = new BehaviorSubject<any>(null);
  selectedVisit$ = this.selectedVisit.asObservable();

  
  private Isbanneropen = new BehaviorSubject<any>(true);
  Isbanneropen$ = this.Isbanneropen.asObservable();

  data = new Subject<boolean>() 

  constructor(
    private store: PatientBannerStoreService
  ) {
    console.log('🔄 PatientBannerService: Constructor started');
    // Rehydrate from RxDB or localStorage on service initialization
    this.isLoadingSource.next(true);
    this.hydrationPromise = this.store.get().then((doc) => {
      console.log('📦 RxDB Data Retrieved:', doc ? 'Found' : 'Empty');
      if (!doc) {
        console.log('⚠️ No existing data in RxDB, trying sessionStorage...');
        this.loadFromSessionStorage();
        this.isHydrated = true;
        this.isLoadingSource.next(false);
        return;
      }
      if (doc.patientData !== undefined) {
        console.log('👤 Loading Patient Data from RxDB:', doc.patientData?.table2?.[0]?.mrNo || 'No MR');
        this.patientDataSource.next(doc.patientData);
      }
      if (doc.patientIVFData !== undefined) this.patientIVFDataSource.next(doc.patientIVFData);
      if (doc.visitAppointments !== undefined) this.visitAppointmentsSource.next(doc.visitAppointments);
      if (doc.selectedVisit !== undefined) this.selectedVisit.next(doc.selectedVisit);
      const payerInfo = (doc as any)?.payerInfo;
      if (payerInfo !== undefined) this.payerInfo.next(payerInfo);
      this.isHydrated = true;
      this.isLoadingSource.next(false);
      console.log('✅ RxDB Hydration Complete');
    }).catch((error) => {
      console.error('❌ Failed to rehydrate patient banner from RxDB:', error);
      console.warn('⚠️ Falling back to sessionStorage');
      this.loadFromSessionStorage();
      this.isHydrated = true;
      this.isLoadingSource.next(false);
    });
  }

  private loadFromSessionStorage(): void {
    try {
      const patientData = sessionStorage.getItem(this.STORAGE_KEYS.patientData);
      const visitAppointments = sessionStorage.getItem(this.STORAGE_KEYS.visitAppointments);
      const selectedVisit = sessionStorage.getItem(this.STORAGE_KEYS.selectedVisit);
      const payerInfo = sessionStorage.getItem(this.STORAGE_KEYS.payerInfo);

      if (patientData) {
        const data = JSON.parse(patientData);
        this.patientDataSource.next(data);
        console.log('✅ Loaded patient data from sessionStorage:', data?.table2?.[0]?.mrNo);
      }
      if (visitAppointments) this.visitAppointmentsSource.next(JSON.parse(visitAppointments));
      if (selectedVisit) this.selectedVisit.next(JSON.parse(selectedVisit));
      if (payerInfo) this.payerInfo.next(JSON.parse(payerInfo));
    } catch (error) {
      console.error('❌ Failed to load from sessionStorage:', error);
    }
  }

  private saveToSessionStorage(key: string, data: any): void {
    try {
      if (data === null || data === undefined) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('❌ Failed to save to sessionStorage:', error);
    }
  }

  async setPatientData(data: any) {
    console.log('💾 setPatientData called with MR:', data?.table2?.[0]?.mrNo || 'null');
    // Wait for initial hydration to complete
    await this.hydrationPromise;
    
    this.isLoadingSource.next(true);

    try {
      const prev = this.patientDataSource.value;
      const prevMrNo = this.extractMrNo(prev);
      const nextMrNo = this.extractMrNo(data);

      console.log('🔄 Patient Switch:', { prevMrNo, nextMrNo });

      // If clearing, wipe all dependent state and RxDB doc
      if (data === null || data === undefined) {
        console.log('🗑️ Clearing patient data');
        await this.clearAll();
        return;
      }

      // If switching to a different patient, reset dependent state
      const isSwitch = prevMrNo && nextMrNo && prevMrNo !== nextMrNo;
      this.patientDataSource.next(data);
      
      if (isSwitch) {
        console.log('🔄 Switching patient, clearing dependent data');
        // Clear dependent data when patient changes
        this.visitAppointmentsSource.next([]);
        this.selectedVisit.next(null);
        this.payerInfo.next([]);
        await this.store.set({ patientData: data, visitAppointments: [], selectedVisit: null, payerInfo: [] } as any);
      } else {
        console.log('📝 Updating patient data in RxDB');
        // Just update patient data
        await this.store.set({ patientData: data });
      }
      console.log('✅ Patient data saved to RxDB');
    } finally {
      this.isLoadingSource.next(false);
    }
  }

  getIVFPatientData(): any | null {
  return this.patientIVFData$ ?? null; 
  }

  async setIVFPatientData(data: any) {
    await this.hydrationPromise;
    this.patientIVFDataSource.next(data);
    await this.store.set({ patientIVFData: data });
  }

  async setVisitAppointments(appointments: any) {
    await this.hydrationPromise;
    this.visitAppointmentsSource.next(appointments);
    await this.store.set({ visitAppointments: appointments });
  }

  async setSelectedVisit(visit: any) {
    await this.hydrationPromise;
    this.selectedVisit.next(visit);
    await this.store.set({ selectedVisit: visit });
  }

  async setPayerInfo(payerInfo: any[]) {
    await this.hydrationPromise;
    this.payerInfo.next(payerInfo ?? []);
    await this.store.set({ payerInfo: payerInfo ?? [] } as any);
  }

  // Wait for hydration to complete before reading data
  async waitForHydration(): Promise<void> {
    await this.hydrationPromise;
  }

  // Getters: read directly from sessionStorage (safe JSON parsing)
  getPatientData(): any | null {
    return this.patientDataSource.value ?? null;
  }

  getVisitAppointments(): any[] | any | null {
    return this.visitAppointmentsSource.value ?? null;
  }

  getSelectedVisit(): any | null {
    return this.selectedVisit.value ?? null;
  }

  getPayerInfo(): any[] | any | null {
    return this.payerInfo.value ?? null;
  }

  // Clear all banner-related state (in-memory and RxDB)
  async clearAll(): Promise<void> {
    this.patientDataSource.next(null);
    this.patientIVFDataSource.next(null);
    this.visitAppointmentsSource.next([]);
    this.selectedVisit.next(null);
    this.payerInfo.next([]);
    await this.store.clear();
  }

  private extractMrNo(src: any): string | null {
    try {
      return src?.table2?.[0]?.mrNo || null;
    } catch {
      return null;
    }
  }

  setIsbanneropen(isOpen: boolean = true) {
    this.Isbanneropen.next(isOpen);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Check if patient data exists in RxDB
   * @returns true if patient data is loaded
   */
  hasPatientData(): boolean {
    return this.patientDataSource.value !== null;
  }

  /**
   * Get complete snapshot of all banner data
   * @returns Object containing all banner data
   */
  getFullSnapshot() {
    return {
      patientData: this.patientDataSource.value,
      patientIVFData: this.patientIVFDataSource.value,
      visitAppointments: this.visitAppointmentsSource.value,
      selectedVisit: this.selectedVisit.value,
      payerInfo: this.payerInfo.value,
      isLoading: this.isLoadingSource.value,
      isBannerOpen: this.Isbanneropen.value
    };
  }

  /**
   * Get current patient MR number
   * @returns MR number or null
   */
  getCurrentMrNo(): string | null {
    return this.extractMrNo(this.patientDataSource.value);
  }

  /**
   * Export all data from RxDB (for debugging)
   * @returns Promise with RxDB document
   */
  async exportRxDBData(): Promise<any> {
    return await this.store.get();
  }

  /**
   * Import data directly to RxDB (for testing/migration)
   * @param data Complete PatientBannerDocType data
   */
  async importRxDBData(data: any): Promise<void> {
    await this.store.set(data);
  }


}

