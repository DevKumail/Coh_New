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

  constructor(private store: PatientBannerStoreService) {
    // Rehydrate from RxDB on service initialization
    this.store.get().then((doc) => {
      if (!doc) return;
      if (doc.patientData !== undefined) this.patientDataSource.next(doc.patientData);
      if (doc.visitAppointments !== undefined) this.visitAppointmentsSource.next(doc.visitAppointments);
      if (doc.selectedVisit !== undefined) this.selectedVisit.next(doc.selectedVisit);

    });
    // Legacy sessionStorage rehydration (commented)
    // try {
    //   const pdRaw = sessionStorage.getItem(this.STORAGE_KEYS.patientData);
    //   if (pdRaw) this.patientDataSource.next(JSON.parse(pdRaw));
    // } catch {}
    // try {
    //   const vaRaw = sessionStorage.getItem(this.STORAGE_KEYS.visitAppointments);
    //   if (vaRaw) this.visitAppointmentsSource.next(JSON.parse(vaRaw));
    // } catch {}
    // try {
    //   const svRaw = sessionStorage.getItem(this.STORAGE_KEYS.selectedVisit);
    //   if (svRaw) this.selectedVisit.next(JSON.parse(svRaw));
    // } catch {}
  }

  setPatientData(data: any) {
    this.patientDataSource.next(data);
    void this.store.set({ patientData: data });
    // Legacy sessionStorage (commented)
    // try {
    //   if (data === null || data === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.patientData);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.patientData, JSON.stringify(data));
    // } catch {}
  }

  getIVFPatientData(): any | null {
    try {
      const raw = {};
      //  sessionStorage.getItem(this.STORAGE_KEYS.patientIVFData);     
       return raw;
    } catch {
      return null;
    }
  }

  setIVFPatientData(data: any) {
    this.patientIVFDataSource.next(data);
    void this.store.set({ patientIVFData: data });
    // Legacy sessionStorage (commented)
    // try {
    //   if (data === null || data === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.patientData);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.patientData, JSON.stringify(data));
    // } catch {}
  }

  setVisitAppointments(appointments: any) {
    this.visitAppointmentsSource.next(appointments);
    void this.store.set({ visitAppointments: appointments });
    // Legacy sessionStorage (commented)
    // try {
    //   if (appointments === null || appointments === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.visitAppointments);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.visitAppointments, JSON.stringify(appointments));
    // } catch {}
  }

  setSelectedVisit(visit: any) {
    this.selectedVisit.next(visit);
    void this.store.set({ selectedVisit: visit });
    // Legacy sessionStorage (commented)
    // try {
    //   if (visit === null || visit === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.selectedVisit);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.selectedVisit, JSON.stringify(visit));
    // } catch {}
  }

  // Getters: read directly from sessionStorage (safe JSON parsing)
  getPatientData(): any | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEYS.patientData);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getVisitAppointments(): any[] | any | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEYS.visitAppointments);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getSelectedVisit(): any | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEYS.selectedVisit);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getPayerInfo(): any[] | any | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEYS.payerInfo);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

    setIsbanneropen(isOpen: boolean = true) {
      this.Isbanneropen.next(isOpen);
  }
}

