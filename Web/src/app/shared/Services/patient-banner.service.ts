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
  } as const;

  private patientDataSource = new BehaviorSubject<any>(null);
  patientData$ = this.patientDataSource.asObservable();

  private visitAppointmentsSource = new BehaviorSubject<any[]>([]);
  visitAppointments$ = this.visitAppointmentsSource.asObservable();

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
}
