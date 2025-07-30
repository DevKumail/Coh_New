import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientBannerService {
  private patientDataSource = new BehaviorSubject<any>(null);
  patientData$ = this.patientDataSource.asObservable();

  data = new Subject<boolean>() 

  setPatientData(data: any) {
    this.patientDataSource.next(data);
  }
}
