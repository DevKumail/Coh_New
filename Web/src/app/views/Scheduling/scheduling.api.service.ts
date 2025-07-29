import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchedulingApiService {
  constructor(private api: ApiService) { }


    searchAppointment(FromDate:string,ToDate:string,ProviderID?:number,LocationID?:number,SpecialityID?:number,SiteID?:number,FacilityID?:number,Page?:number,Size?:number) {
        return this.api.get(`Appointment/SearchAppointment?FromDate=${FromDate}&ToDate=${ToDate}${ProviderID==undefined?'':(`&ProviderID=${ProviderID}`)}${LocationID==undefined?'':(`&LocationID=${LocationID}`)}${SpecialityID==undefined?'':(`&SpecialityID=${SpecialityID}`)}${SiteID==undefined?'':(`&SiteID=${SiteID}`)}${FacilityID==undefined?'':(`&FacilityID=${FacilityID}`)}${Page==undefined?'':(`&Page=${Page}`)}${Size==undefined?'':(`&Size=${Size}`)}`).toPromise();
    }
    getCacheItem(object: any) {
        return this.api.post('Cache/GetCache', object).toPromise();
    }

    getEmployeeFacilityFromCache() {
        return this.api.get('Common/GetEmployeeFacilityFromCache').toPromise();
    }

    cancelBooking(AppId:number,AppStatusId:number ,ByProvider:boolean,RescheduledId:number) {
        return this.api.get(`Appointment/CancelOrRescheduleAppointment?AppId=${AppId}&AppStatusId=${AppStatusId}&ByProvider=${ByProvider}&RescheduledId=${RescheduledId}`).toPromise();
    }

}
