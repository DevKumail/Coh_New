import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class SharedApiService {
    add(arg0: { severity: string; summary: string; detail: any; }) {
        throw new Error('Method not implemented.');
    }
constructor(private api: ApiService) {}




  submitPatientAllergy(data: any): Observable<any> {
    debugger
  return this.api.post('/Alergy/SubmitPatientAlergy', data);
}



GetCoverageAndRegPatient(filterData: any): Observable<any> {
    //console.log('GetCoverageAndRegPatient called with:', filterData);
    return this.api.post('/Common/GetCoverageAndRegPatient', filterData);
  }

}
