import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientBannerService {
  private patientDataSource = new BehaviorSubject<any>(null);
  patientData$ = this.patientDataSource.asObservable();

  setPatientData(data: any) {
    this.patientDataSource.next(data);
  }
}
