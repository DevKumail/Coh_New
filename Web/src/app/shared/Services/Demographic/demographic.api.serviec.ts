import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DemographicApiServices {
    add(arg0: { severity: string; summary: string; detail: any }) {
        throw new Error('Method not implemented.');
    }

    constructor(private api: ApiService, private http: HttpClient) {}

    getDemographicsByMRNo(MRNo: string) {
        return this.api
            .get(`Demographic/GetDemographics?MRNo=${MRNo}`)
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
        debugger;
        return this.api
            .post('Demographic/InsertPatientRecord', object)
            .toPromise();
    }

    UpdatePatientRecordByMRNo(object: any) {
        return this.api
            .put('Demographic/UpdatePatientRecordByMRNo', object)
            .toPromise();
    }

    getStateByCountry(countryId: any) {
        debugger;
        return this.api
            .get(`AllDropdowns/GetStateByCountry?countryId=${countryId}`)
            .toPromise();
    }

    getCityByState(ProviderId: any) {
        debugger;
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
        debugger;
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
}
