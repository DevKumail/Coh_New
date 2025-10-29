import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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

  constructor() {
    // Rehydrate from sessionStorage on service initialization
    try {
      const pdRaw = sessionStorage.getItem(this.STORAGE_KEYS.patientData);
      if (pdRaw) this.patientDataSource.next(JSON.parse(pdRaw));
    } catch {}

    try {
      const vaRaw = sessionStorage.getItem(this.STORAGE_KEYS.visitAppointments);
      if (vaRaw) this.visitAppointmentsSource.next(JSON.parse(vaRaw));
    } catch {}

    try {
      const svRaw = sessionStorage.getItem(this.STORAGE_KEYS.selectedVisit);
      if (svRaw) this.selectedVisit.next(JSON.parse(svRaw));
    } catch {}
    
    try {
      const piRaw = sessionStorage.getItem(this.STORAGE_KEYS.payerInfo);
      if (piRaw) this.payerInfo.next(JSON.parse(piRaw));
    } catch {}
  }

  setPatientData(data: any) {
    this.patientDataSource.next(data);
    try {
      if (data === null || data === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.patientData);
      else sessionStorage.setItem(this.STORAGE_KEYS.patientData, JSON.stringify(data));
    } catch {}
  }

  setVisitAppointments(appointments: any) {
    this.visitAppointmentsSource.next(appointments);
    try {
      if (appointments === null || appointments === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.visitAppointments);
      else sessionStorage.setItem(this.STORAGE_KEYS.visitAppointments, JSON.stringify(appointments));
    } catch {}
  }

  setSelectedVisit(visit: any) {
    this.selectedVisit.next(visit);
    try {
      if (visit === null || visit === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.selectedVisit);
      else sessionStorage.setItem(this.STORAGE_KEYS.selectedVisit, JSON.stringify(visit));
    } catch {}
  }

  setPayerInfo(payerInfo: any) {
    this.payerInfo.next(payerInfo);
    try {
      if (payerInfo === null || payerInfo === undefined) sessionStorage.removeItem(this.STORAGE_KEYS.payerInfo);
      else sessionStorage.setItem(this.STORAGE_KEYS.payerInfo, JSON.stringify(payerInfo));
    } catch {}
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
}

