import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DemographicApiServices {




    constructor(private api: ApiService, private http: HttpClient) {}

    getDemographicsByMRNo(MRNo: string) {
        return this.api
            .get(`Demographic/GetDemographicsById?PatientId=${MRNo}`)
            .toPromise();
    }

    getPatientHistoryByMRNo(MRNo: string) {
        return this.api
            .get(`Demographic/GetPatientHistory?MRNo=${MRNo}`)
            .toPromise();
    }

    getCacheItem(object: any) {
        return this.api.post('Cache/GetCache', object).toPromise();
    }

    deletedemographics(demoid: any) {
        return this.api
            .delete(
                `Demographic/deletedemographicByPatientId?PatientId=${demoid}`
            )
            .toPromise();
    }

    getAllEmirates() {
        return this.api.get('AllDropdowns/GetEmirateType');
    }

    GetGenderIdentity() {
        return this.api.get('AllDropdowns/GetGenderIdentity');
    }

    getAllFeeSchedule() {
        return this.api.get('AllDropdowns/GetFeeSchedule');
    }

    getAllFinancialClass() {
        return this.api.get('AllDropdowns/GetFinancialClass');
    }

    getAllEntityTypes() {
        return this.api.get('AllDropdowns/GetEntityTypes');
    }

    submitDemographic(object: any) {

        return this.api
            .post('Demographic/InsertPatientRecord', object)
    }


    UpdatePatientRecordByMRNo(object: any) {
        return this.api
            .put('Demographic/UpdatePatientRecordByMRNo', object)
            .toPromise();
    }

    getStateByCountry(countryId: any) {
        ;
        return this.api
            .get(`AllDropdowns/GetStateByCountry?countryId=${countryId}`)
            .toPromise();
    }

    getCityByState(ProviderId: any) {
        ;
        return this.api
            .get(`AllDropdowns/GetCityByState?ProviderId=${ProviderId}`)
            .toPromise();
    }

    GetDemographicsById(PatientId: number) {
        return this.api
            .get(`Demographic/GetDemographicsById?PatientId=${PatientId}`)
            .toPromise();
    }

    GetCoverageById(subscribedId: number) {
        ;
        return this.api
            .get(`Coverages/GetCoverage?subscribedId=${subscribedId}`)
            .toPromise();
    }

    GetAllDemographicsData(demographicList: any, PaginationInfo: any) {
        const data = { demographicList, PaginationInfo };
        return this.api.post('Demographic/GetAllDemographicsData', data);
    }
    GetRegPatientList() {
        return this.api.get(`Common/GetRegPatientList`).toPromise();
    }

 getPatientByMrNo(mrNo: string): Observable<any> {
    return this.api.get(`Common/GetCoverageAndRegPatientDBByMrNo?MRNo=${mrNo}`);
  }

    GetAppointmentByMRNO(MRNo:any) {
	return this.api.get(`Common/GetAppointmentInfoByMRNo?MRNo=${MRNo}`);

  }

}
