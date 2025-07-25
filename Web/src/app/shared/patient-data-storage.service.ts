import { Injectable } from '@angular/core';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  lastVisited: Date;
}

interface PatientLog {
  patientId: number;
  searchDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
    private patients: Patient[] = []
    private patientLogs: PatientLog[] = [];
  constructor() { }

  // Function to get all patients
  getAllPatients(): Patient[] {
    return this.patients;
  }

  // Function to search patients based on filter criteria
searchPatients(filter: Partial<Patient>): Patient[] {
  return this.patients.filter((patient: Patient) => {
    let matches = true;
    for (let key in filter) {
      const typedKey = key as keyof Patient;
      if (filter[typedKey] && patient[typedKey] !== filter[typedKey]) {
        matches = false;
      }
    }
    return matches;
  });
}


  // Function to save search log
  saveSearchLog(patientId: number) {
    const log: PatientLog = {
      patientId,
      searchDate: new Date()
    };
    this.patientLogs.push(log);
  }

  // Function to save patient details
  savePatientDetails(patient: Patient) {
    this.patients.push(patient);
  }

  // Function to get search logs for a patient
  getSearchLogs(patientId: number): PatientLog[] {
    return this.patientLogs.filter((log: any) => log.patientId === patientId);
  }

}