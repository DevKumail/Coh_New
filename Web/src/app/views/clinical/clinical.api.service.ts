import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ClinicalApiService {

  constructor(private api: ApiService) { }


// //   submitPatientAllergy(data: any): Observable<any> {
// //     return this.api.post('SubmitPatientAlergy', data);
// //   }

//   submitPatientAllergy(data: any): Observable<any> {

//   return this.api.post('/Alergy/SubmitPatientAlergy', data);
// }

//   SubmitPatientProblem(object: any) {
//     ;
//     return this.api
//       .post(`PatientProblem/SubmitPatientProblem`, object)
//       .toPromise();
//   }
//  GetRowDataOfPatientProblem(mrno:string,userId:number){

  submitPatientAllergy(data: any): Observable<any> {
    // debugger
  return this.api.post('/Alergy/SubmitPatientAlergy', data);
}

//       return this.api.get(`PatientProblem/GetPatientProblems?MRNo=${mrno}&UserId=${userId}`).toPromise();
//     }

//     GetICD9CMGroupByProvider(ProviderId:number) {
// 	return this.api.get(`ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`).toPromise();
//   }
// }
    GetICD9CMGroupByProvider(ProviderId:number) {
	return this.api.get(`ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`).toPromise();
  }
  getCacheItem(object: any) {
    return this.api.post('Cache/GetCache', object).toPromise();
  }
  // GetAlergyType(): Promise<any> {
  //     return this.api.get('AllDropdowns/GetAlergyType').toPromise();
  // }
  // GetAlergyType(mrno: string, userId: number) {
  //   return this.api.get(`AllDropdowns/GetAlergyType?mrno=${mrno}&userId=${userId}`).toPromise();
  // }
   GetAlergyType(){
     // debugger;
    return this.api.get(`AllDropdowns/GetAlergyTypes`).toPromise();
  }
   SubmitPatientAllergies(object:any){
    debugger
    return this.api.post(`Alergy/SubmitPatientAlergy`,object).toPromise();
  }
  GetAllergyDetails(mrno: string): Promise<any> {
    const url = `Allergies/GetAllergyDetails?mrno=${mrno}`;
    return this.api.get(url).toPromise();
  }
  SubmitAllergy(data: any): Promise<any> {
    return this.api.post('Allergies/SubmitAllergy', data).toPromise();
  }
  DeleteAllergy(id: string): Promise<any> {
    const url = `Allergies/DeleteAllergy?id=${id}`;
    return this.api.delete(url).toPromise();
  }
  // GetAllergyById(id: string): Promise<any> {
  //     const url = `Allergies/GetAllergyById?id=${id}`;
  GetSeverity() {
     // debugger;
    return this.api.get(`AllDropdowns/GetSeverityType`).toPromise();
  }

  GetPatientAllergyData(mrno: String) {
     // debugger;
    return this.api.get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}`).toPromise();
  }
}
