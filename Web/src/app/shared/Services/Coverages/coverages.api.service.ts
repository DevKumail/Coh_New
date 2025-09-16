import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CoveragesApiService {


    constructor(private api: ApiService, private http: HttpClient) { }

    getAllCoverages(): Observable<any> {
        return this.api.get('/api/coverages');
    }

    getCoverageById(id: string): Observable<any> {
        return this.api.get(`/api/coverages/${id}`);
    }

    createCoverage(data: any): Observable<any> {
        return this.api.post('/api/coverages', data);
    }

    updateCoverage(id: string, data: any): Observable<any> {
        return this.api.put(`/api/coverages/${id}`, data);
    }

    deleteCoverage(id: string): Observable<any> {
        return this.api.delete(`/api/coverages/${id}`);
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
    return this.api.post('Coverages/GetCoveragesList',obj).toPromise();
  }

  InsertSubscriber(object: any) {

    return this.api.post('Coverages/InsertSubscriber', object).toPromise();
  }
    GetCoverageById(subscribedId:number) {
    return this.api.get(`Coverages/GetCoveragesubscribedId?subscribedId=${subscribedId}`).toPromise();
  }

  InsertCoverage(object: any) {
    return this.api.post('Coverages/InsertCoverage', object).toPromise();
  }

GetInsuranceRelation() {
  return this.api.get('Coverages/GetInsuranceRelation')
}

  // Update coverage order/status for a specific subscriber or coverage row
  UpdateCoverageOrder(payload: { subscriberId: number; mrno: string | number | null; coverageOrder: number; }) {
    return this.api.post('Coverages/UpdateCoverageOrder', payload).toPromise();
  }

}
