import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ClinicalApiService {
constructor(private api: ApiService) {}


//   submitPatientAllergy(data: any): Observable<any> {
//     return this.api.post('SubmitPatientAlergy', data);
//   }

  submitPatientAllergy(data: any): Observable<any> {
    // debugger
  return this.api.post('/Alergy/SubmitPatientAlergy', data);
}

}
