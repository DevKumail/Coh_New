import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PatientBannerStoreService } from '@core/services/patient-banner-store.service';

@Injectable({
  providedIn: 'root',
})
export class PatientBannerService {
  private isHydrated = false;
  private hydrationPromise!: Promise<void>;

  private isLoadingSource = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSource.asObservable();

  private patientDataSource = new BehaviorSubject<any>(null);
  patientData$ = this.patientDataSource.asObservable();
  
  private patientIVFDataSource = new BehaviorSubject<any>(null);
  patientIVFData$ = this.patientIVFDataSource.asObservable();

  private visitAppointmentsSource = new BehaviorSubject<any[]>([]);
  visitAppointments$ = this.visitAppointmentsSource.asObservable();

  private payerInfo = new BehaviorSubject<any[]>([]);
  payerInfo$ = this.payerInfo.asObservable();

  private selectedVisit = new BehaviorSubject<any>(null);
  selectedVisit$ = this.selectedVisit.asObservable();

  
  private Isbanneropen = new BehaviorSubject<any>(null);
  Isbanneropen$ = this.Isbanneropen.asObservable();

  data = new Subject<boolean>() 

  constructor(
    // private store: PatientBannerStoreService
  ) {
    console.log('🔄 PatientBannerService: Constructor started');
    // Rehydrate from RxDB on service initialization
    this.isLoadingSource.next(true);
    this.hydrationPromise = this.store.get().then((doc) => {
      console.log('📦 RxDB Data Retrieved:', doc ? 'Found' : 'Empty');
      if (!doc) {
        console.log('⚠️ No existing data in RxDB');
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
      this.isHydrated = true;
      this.isLoadingSource.next(false);
    });
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
    // const isSwitch = prevMrNo && nextMrNo && prevMrNo !== nextMrNo;
    this.patientDataSource.next(data);
    // if (isSwitch) {
    //   this.visitAppointmentsSource.next([]);
    //   this.selectedVisit.next(null);
    //   this.payerInfo.next([]);
    //   // void this.store.set({ patientData: data, visitAppointments: [], selectedVisit: null, payerInfo: [] } as any);
    // } else {
    //   // void this.store.set({ patientData: data });
    // }
    // Legacy sessionStorage (commented)
    // try {
    //   if (data === null || data === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.patientData);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.patientData, JSON.stringify(data));
    // } catch {}
  }

  getIVFPatientData(): any | null {
  return this.patientIVFData$ ?? null; 
  }

  setIVFPatientData(data: any) {
    this.patientIVFDataSource.next(data);
    //void this.store.set({ patientIVFData: data });
    // Legacy sessionStorage (commented)
    // try {
    //   if (data === null || data === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.patientData);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.patientData, JSON.stringify(data));
    // } catch {}
  }

  setVisitAppointments(appointments: any) {
    this.visitAppointmentsSource.next(appointments);
    // void this.store.set({ visitAppointments: appointments });
    // Legacy sessionStorage (commented)
    // try {
    //   if (appointments === null || appointments === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.visitAppointments);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.visitAppointments, JSON.stringify(appointments));
    // } catch {}
  }

  setSelectedVisit(visit: any) {
    this.selectedVisit.next(visit);
    // void this.store.set({ selectedVisit: visit });
    // Legacy sessionStorage (commented)
    // try {
    //   if (visit === null || visit === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.selectedVisit);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.selectedVisit, JSON.stringify(visit));
    // } catch {}
  }

  setPayerInfo(payerInfo: any[]) {
    this.payerInfo.next(payerInfo ?? []);
    // void this.store.set({ payerInfo: payerInfo ?? [] } as any);
    // Legacy sessionStorage (commented)
    // try {
    //   if (!payerInfo || payerInfo.length === 0) sessionStorage.removeItem(this.STORAGE_KEYS.payerInfo);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.payerInfo, JSON.stringify(payerInfo));
    // } catch {}
  }

  // Getters: read directly from observables
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
    this.visitAppointmentsSource.next([]);
    this.selectedVisit.next(null);
    this.payerInfo.next([]);
    // await this.store.clear();
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


}

