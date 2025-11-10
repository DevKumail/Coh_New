import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ClinicalActivity {
  timestamp: Date;
  activityType: 'create' | 'update';
  module: string; // 'Allergy', 'Procedure', 'Medication', etc.
  providerName: string;
  mrNo: string;
  patientName?: string;
  details: any; // Form data
  summary: string; // Human-readable summary
}

@Injectable({
  providedIn: 'root'
})
export class ClinicalActivityService {
  private activitiesSubject = new BehaviorSubject<ClinicalActivity[]>([]);
  public activities$: Observable<ClinicalActivity[]> = this.activitiesSubject.asObservable();

  constructor() { }

  addActivity(activity: ClinicalActivity): void {
    const current = this.activitiesSubject.value;
    this.activitiesSubject.next([activity, ...current]);
  }

  clearActivities(): void {
    this.activitiesSubject.next([]);
  }

  getActivities(): ClinicalActivity[] {
    return this.activitiesSubject.value;
  }
}
