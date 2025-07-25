import { Api } from 'datatables.net';
import { TemporaryPatientDemographicListComponent } from './../../../views/registration/Temporary Patient Demographics/temporary-patient-demographic-list/temporary-patient-demographic-list.component';
import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TemporaryPatientDemographicApiServices {
    FillCache() {
        throw new Error('Method not implemented.');
    }

 constructor(private api: ApiService, private http: HttpClient) {}

  submitTempDemographic(object: any) {
    debugger
    return this.api.post('TempDemographic/InsertTempPatientRecord', object).toPromise();
  }


  getTempDemographics(TempId?:number,  Name?:string,  Address?:string,  PersonEthnicityTypeId?:number,  Mobile?:string,  DOB?:string, Gender?:string,  Country?:number, State?:number,  City?:number,  ZipCode?:string,InsuredId?:number,  CarrierId?:number ,Page?:number, Size?:number,SortColumn?:string,SortOrder?:string) {
    return this.api.get(`TempDemographic/GetTempDemographics_new?${TempId==undefined?'':(`TempId=${TempId}`)}${Name==undefined?'':(`&Name=${Name}`)}${Address==undefined?'':(`&Address=${Address}`)}${PersonEthnicityTypeId==undefined?'':(`&PersonEthnicityTypeId=${PersonEthnicityTypeId}`)}

    ${Mobile==undefined?'':(`&Mobile=${Mobile}`)}
    ${DOB==undefined?'':(`&DOB=${DOB}`)}
    ${Gender==undefined?'':(`&Gender=${Gender}`)}
    ${Country==undefined?'':(`&Country=${Country}`)}

    ${State==undefined?'':(`&State=${State}`)}
    ${City==undefined?'':(`&City=${City}`)}


    ${ZipCode==undefined?'':(`&ZipCode=${ZipCode}`)}
    ${InsuredId==undefined?'':(`&InsuredId=${InsuredId}`)}

    ${CarrierId==undefined?'':(`&CarrierId=${CarrierId}`)}
    ${Page==undefined?'':(`&Page=${Page}`)}
    ${Size==undefined?'':(`&Size=${Size}`)}
    ${SortColumn==undefined?'':(`&SortColumn=${SortColumn}`)}
    ${SortOrder==undefined?'':(`&SortOrder=${SortOrder}`)}


    `).toPromise();
  }

  GetTempDemographicsByTempId(TempId:number) {
    return this.api.get(`TempDemographic/GetTempDemographicsByTempId?TempId=${TempId}`).toPromise();
  }

  deleteTempdemographics(Tempdemoid:any){
    return this.api.delete(`TempDemographic/deleteTempDemographicByTemptId?TempId=${Tempdemoid}`).toPromise();
  }
  getTempDemographics_pagination(TempListReq:any,PaginationInfo:any) {
    const obj={TempListReq,PaginationInfo}
    return this.api.post(`TempDemographic/GetTempDemographics_new_with_pagination`,obj).toPromise();
  }

GetStateByCountryId(countryId:any) {

  return this.api.get(`AllDropdowns/GetStateByCountry?countryId=${countryId}`).toPromise();
}

GetCityByState(ProviderId:any) {

  return this.api.get(`AllDropdowns/GetCityByState?ProviderId=${ProviderId}`).toPromise();
}

getCacheItem(object: any) {
        return this.api.post('Cache/GetCache', object).toPromise();
    }

}
