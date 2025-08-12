import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientBannerService {
  private patientDataSource = new BehaviorSubject<any>(null);
  patientData$ = this.patientDataSource.asObservable();

  private visitAppointmentsSource = new BehaviorSubject<any[]>([]);
  visitAppointments$ = this.visitAppointmentsSource.asObservable();

  private selectedVisit = new BehaviorSubject<any>(null);
  selectedVisit$ = this.selectedVisit.asObservable();

  data = new Subject<boolean>() 

  setPatientData(data: any) {
    this.patientDataSource.next(data);
  }

  setVisitAppointments(appointments: any) {
    this.visitAppointmentsSource.next(appointments);
  }

  setSelectedVisit(visit: any) {
    this.selectedVisit.next(visit);
  }
}
