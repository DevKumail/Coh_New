// import { Injectable } from '@angular/core';
// import { ApiService } from '@/app/core/services/api.service';
// import { Observable } from 'rxjs';


// @Injectable({ providedIn: 'root' })
// export class ClinicalApiService {
// constructor(private api: ApiService) {}


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

//       return this.api.get(`PatientProblem/GetPatientProblems?MRNo=${mrno}&UserId=${userId}`).toPromise();
//     }

//     GetICD9CMGroupByProvider(ProviderId:number) {
// 	return this.api.get(`ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`).toPromise();
//   }
// }
