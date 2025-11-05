import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { AlertDTO } from '@/app/shared/models/alert.model';
// import { AlertType } from '@/app/shared/models/alert-type.model';


@Injectable({ providedIn: 'root' })
export class RegistrationApiService {
    constructor(private api: ApiService, private http: HttpClient) { }

     getAllPatients(): Observable<any> {
        return this.api.get('/api/patients');
    }

    getPatientById(id: string): Observable<any> {
        return this.api.get(`/api/patients/${id}`);
    }

    createPatient(data: any): Observable<any> {
        return this.api.post('/api/patients', data);
    }

    updatePatient(id: string, data: any): Observable<any> {
        return this.api.put(`/api/patients/${id}`, data);
    }

    // deletePatient(id: string): Observable<any> {
    //     return this.api.delete(/api/patients/${id});
    // }
    // SubmitAlertType(data: any): Observable<any> {
    //     //  
    //     return this.api.post(Alert/SubmitAlertType, data);
    // }
    deletePatient(id: string): Observable<any> {
        return this.api.delete(`/api/patients/${id}`);
    }
    SubmitAlertType(data: any): Observable<any> {

        return this.api.post(`Alert/SubmitAlertType`, data);
    }


    GetAlertType(): Promise<any> {
        return this.api.get('AllDropdowns/GetAlertType').toPromise();
    }

    GetAlertDetailsDb(mrno: string): Promise<any> {
        const url = `Alert/GetAlertDeatilsDB?mrno=${mrno}`;
        return this.api.get(url).toPromise();
    }

  GetSearch( CompanyOrIndividual?:any,  LastName?:string, SSN?: string, InsuredIDNo? : string, MRNo?:any,   PageNumber?:number, PageSize?:number) {

     


    return this.api.get(`Coverages/GetSearch?CompanyOrIndividual=${CompanyOrIndividual}&LastName=${LastName}&SSN=${SSN}&InsuredIDNo=${InsuredIDNo}&MRNo=${MRNo}&PageNumber=${PageNumber}&PageSize=${PageSize}`).toPromise();

  }

  GetSubscriberDatails(InsuredIDNo:string='') {
    return this.api.get(`Coverages/GetSubscriberDatails?InsuredIDNo=${InsuredIDNo}`).toPromise();
  }


  GetCoverage(MRNo:string) {
     
    return this.api.get(`Coverages/GetCoverage?MRNo=${MRNo}`).toPromise();
  }


  GetCoverageList(CoverageListReq:any,PaginationInfo:any) {
const obj={CoverageListReq,PaginationInfo}
    return this.api.post('/Coverages/GetCoveragesList',obj).toPromise();
  }

  InsertSubscriber(object: any) {

    return this.api.post('Coverages/InsertSubscriber', object).toPromise();
  }



  InsertCoverage(object: any) {
    return this.api.post('Coverages/InsertCoverage', object).toPromise();
  }
//   FetchImageData(obj:FormData) {
//     //  
//   return this.api.imagepost(`Coverages/GetImageData`,obj).toPromise();
//   }

GetInsuranceRelation() {
  return this.api.get('Coverages/GetInsuranceRelation')
}

getCityByState(ProviderId:any) {
//  

  return this.api.get(`AllDropdowns/GetCityByState?ProviderId=${ProviderId}`).toPromise();
}

getStateByCountry(countryId:any) {

  return this.api.get(`AllDropdowns/GetStateByCountry?countryId=${countryId}`).toPromise();
}

 getCacheItem(object: any) {
  debugger
        return this.api.post('Cache/GetCache', object).toPromise();
    }

//    getAlertType(): Promise<{ result: AlertType[] } | undefined> {
//      
//   return this.api.get<{ result: AlertType[] }>(`AllDropdowns/GetAlertType`).toPromise();
// }
}
