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

  SubmitPatientProblem(object: any) {
    ;
    return this.api
      .post(`PatientProblem/SubmitPatientProblem`, object)
      .toPromise();
  }
 GetRowDataOfPatientProblem(mrno:string,userId:number) {
    return this.api.get(`PatientProblem/GetPatientProblems?MRNo=${mrno}&UserId=${userId}`).toPromise();
  }

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
  //  GetAlergyType(){
  //    // debugger;
  //   return this.api.get(`AllDropdowns/GetAlergyTypes`).toPromise();
  // }
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
  DeleteAllergy(allergyId:number){
    debugger
    return this.api.delete(`Alergy/DeleteAlergy?Id=${allergyId}`).toPromise();
  }
  // GetAllergyById(id: string): Promise<any> {
  //     const url = `Allergies/GetAllergyById?id=${id}`;
  GetSeverity() {
     // debugger;
    return this.api.get(`AllDropdowns/GetSeverityType`).toPromise();
  }

  // GetPatientAllergyData(mrno: String) {
  //    // debugger;
  //   return this.api.get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}`).toPromise();
  // }
  GetAlergyType(): Observable<any> {
    return this.api.get('AllDropdowns/GetAlergyTypes');
  } 

  GetAlergySeverity() {
    return this.api.get('AllDropdowns/GetSeverityType').toPromise();
  }
  GetAlergyStatus() {
    return this.api.get('Alergy/GetAlergyStatus').toPromise();
  }
  GetAlergyByProviderId(): Observable<any> {
    return this.api.get('Alergy/GetAlergyByProviderId');
  }
 
 GetPatientAllergyData(mrno: string): Observable<any> {
  return this.api.get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}`);
}

  
  // SubmitPatientAllergies(data: any) {
  //   return this.api.post('Alergy/SubmitPatientAlergy', data).toPromise();
  // }
  GetAlergyByMRNo(MRNo: string) {
    return this.api.get(`Alergy/GetAlergyByMRNo?MRNo=${MRNo}`).toPromise();
  }
    // getCacheItem(object: any) {
    //     return this.api.post('Cache/GetCache', object).toPromise();
    // }
  GetAlergyById(id: string): Observable<any> {
    return this.api.get(`/Alergy/GetAlergyById/${id}`);
  }
  UpdateAlergy(id: string, data: any): Observable<any> {
    return this.api.put(`/Alergy/UpdateAlergy/${id}`, data);
  }
  DeleteAlergy(id: string): Observable<any> {
    return this.api.delete(`/Alergy/DeleteAlergy/${id}`);
  }
  GetPatientProblemByMRNo(MRNo: string) {
    return this.api.get(`PatientProblem/GetPatientProblems?MRNo=${MRNo}`).toPromise();
  }
  GetPatientProblemById(id: string): Observable<any> {
    return this.api.get(`/PatientProblem/GetPatientProblemById/${id}`);
  }
  UpdatePatientProblem(id: string, data: any): Observable<any> {
    return this.api.put(`/PatientProblem/UpdatePatientProblem/${id}`, data);
  }
  DeletePatientProblem(id: string): Observable<any> {
    return this.api.delete(`/PatientProblem/DeletePatientProblem/${id}`);
  }
  GetAlertType() {
    return this.api.get('Alert/GetAlertType').toPromise();
  }
  GetAlertStatus() {
    return this.api.get('Alert/GetAlertStatus').toPromise();
  
}
// GetSeverity() {
//   return this.api.get('AllDropdowns/GetSeverityType').toPromise();
// }


}