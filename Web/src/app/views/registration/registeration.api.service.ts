// import { Injectable } from '@angular/core';
// import { ApiService } from '@/app/core/services/api.service';
// import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { AlertType } from '@/app/shared/Models/Clinical/alert-type.model';
// import { AlertDTO } from '@/app/shared/Models/Clinical/alert.model';


// @Injectable({ providedIn: 'root' })
// export class RegistrationApiService {
//     constructor(private api: ApiService, private http: HttpClient) { }

//     getAllPatients(): Observable<any> {
//         return this.api.get('/api/patients');
//     }

//     getPatientById(id: string): Observable<any> {
//         return this.api.get(`/api/patients/${id}`);
//     }

//     createPatient(data: any): Observable<any> {
//         return this.api.post('/api/patients', data);
//     }

//     updatePatient(id: string, data: any): Observable<any> {
//         return this.api.put(`/api/patients/${id}`, data);
//     }

//     deletePatient(id: string): Observable<any> {
//         return this.api.delete(`/api/patients/${id}`);
//     }
//     SubmitAlertType(data: any): Observable<any> {
//         // debugger
//          // debugger
//         return this.api.post(`Alert/SubmitAlertType`, data);
//     }


//    getAlertType(): Promise<{ result: AlertType[] } | undefined> {
//     debugger
//   return this.api.get<{ result: AlertType[] }>(`AllDropdowns/GetAlertType`).toPromise();
// }

//     // GetAlertDetailsDb(mrno: string): Promise<any> {
//     //     const url = `Alert/GetAlertDeatilsDB?mrno=${mrno}`;
//     //     return this.api.get(url).toPromise();
//     // }
// getAlertDetailsDb(mrno: string): Promise<{ alert: { table1: AlertDTO[] } } | undefined> {
//   return this.api.get<{ alert: { table1: AlertDTO[] } }>(`Alert/GetAlertDeatilsDB?mrno=${mrno}`).toPromise();
// }


// }
