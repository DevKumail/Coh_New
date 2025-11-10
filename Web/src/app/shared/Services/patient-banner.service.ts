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

  private visitAppointmentsSource = new BehaviorSubject<any[]>([]);
  visitAppointments$ = this.visitAppointmentsSource.asObservable();

  private payerInfo = new BehaviorSubject<any[]>([]);
  payerInfo$ = this.payerInfo.asObservable();

  private selectedVisit = new BehaviorSubject<any>(null);
  selectedVisit$ = this.selectedVisit.asObservable();

  data = new Subject<boolean>() 

  constructor(private store: PatientBannerStoreService) {
    // Rehydrate from RxDB on service initialization
    this.store.get().then((doc) => {
      if (!doc) return;
      if (doc.patientData !== undefined) this.patientDataSource.next(doc.patientData);
      if (doc.visitAppointments !== undefined) this.visitAppointmentsSource.next(doc.visitAppointments);
      if (doc.selectedVisit !== undefined) this.selectedVisit.next(doc.selectedVisit);
      if (doc.payerInfo !== undefined) this.payerInfo.next(doc.payerInfo);
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

  setPayerInfo(payerInfo: any[]) {
    this.payerInfo.next(payerInfo ?? []);
    void this.store.set({ payerInfo: payerInfo ?? [] });
    // Legacy sessionStorage (commented)
    // try {
    //   if (!payerInfo || payerInfo.length === 0) sessionStorage.removeItem(this.STORAGE_KEYS.payerInfo);
    //   else sessionStorage.setItem(this.STORAGE_KEYS.payerInfo, JSON.stringify(payerInfo));
    // } catch {}
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
}

