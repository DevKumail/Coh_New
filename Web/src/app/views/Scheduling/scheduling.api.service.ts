import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchedulingApiService {
  constructor(private api: ApiService) { }




   SearchAppointmentDBWithPagination(SchAppointmentList:any,PaginationInfo:any) {
    const obj={SchAppointmentList,PaginationInfo}
      return this.api.post('Appointment/SearchAppointmentDBWithPagination',obj);
    }
     GetSitebySpecialityId(SpecialtyId: any) {
    return this.api.get(`Appointment/GetSitebySpecialityId?SpecialtyId=${SpecialtyId}`).toPromise();
  }
   GetSpecialityByEmployeeId(EmployeeId: any) {
    return this.api.get(`Appointment/GetSpecialityByEmployeeId?EmployeeId=${EmployeeId}`).toPromise();
  }
    GetDurationOfTimeSlot(SiteId: any,ProviderId: any,FacilityId: any,Days: any) {
    return this.api.get(`ProviderSchedule/GetDurationOfTimeSlot?SiteId=${SiteId}&ProviderId=${ProviderId}&FacilityId=${FacilityId}&Days=${Days}`).toPromise();
  }
   GetSiteByProviderId(EmployeeId: any) {
    return this.api.get(`Appointment/GetSiteByProviderId?EmployeeId=${EmployeeId}`).toPromise();
  }
  GetTimeSlots(SiteId: any,ProviderId: any,FacilityId: any,Days: any) {
    return this.api.get(`Appointment/GetTimeSlots?SiteId=${SiteId}&ProviderId=${ProviderId}&FacilityId=${FacilityId}&Days=${Days}`).toPromise();
  }
   GetProviderScheduleData(ProviderId: any) {
    let SiteId = 0
    let FacilityId = 0
    let UsageId = 0
    return this.api.get(`ProviderSchedule/GetProviderScheduleByProviderId?ProviderId=${ProviderId}&SiteId=${SiteId}&FacilityId=${FacilityId}&UsageId=${UsageId}`).toPromise();
  }
    GetSpecialitybyFacilityId(facilityId: string): Observable<any> {
        return this.api.get(`Appointment/GetSpecialitybyFacilityId?facilityId=${facilityId}`);
    } 
    // getCacheItem(object: any) {
    //     return this.api.post('Cache/GetCache', object).toPromise();
    // }
    //  getEmployeeFacilityFromCache() {
    //     return this.api.get('Common/GetEmployeeFacilityFromCache').toPromise();
    // }
  GetProviderByFacilityId(FacilityId: any) {
    return this.api.get(`Appointment/GetProviderByFacilityId?FacilityId=${FacilityId}`);
  }

   GetSchAppointmentList(SiteId: any,ProviderId: any,FacilityId: any,SpecialityId:any,Date:any) {
    return this.api.get(`Appointment/GetSchAppointmentList?SiteId=${SiteId}&ProviderId=${ProviderId}&FacilityId=${FacilityId}&SpecialityId=${SpecialityId}&Date=${Date}`).toPromise();
  }
  GetAppointmentById(id: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentById/${id}`);
  }
  CreateAppointment(data: any): Observable<any> {
    return this.api.post('/Appointment/CreateAppointment', data);
  }
  UpdateAppointment(id: string, data: any): Observable<any> {
    return this.api.put(`/Appointment/UpdateAppointment/${id}`, data);
  }
  DeleteAppointment(id: string): Observable<any> {
    return this.api.delete(`/Appointment/DeleteAppointment/${id}`);
  }
  GetAppointmentTypes(): Observable<any> {
    return this.api.get('/Appointment/GetAppointmentTypes');
  }
  GetAppointmentStatus(): Observable<any> {
    return this.api.get('/Appointment/GetAppointmentStatus');
  }
  GetAppointmentDuration(): Observable<any> {
    return this.api.get('/Appointment/GetAppointmentDuration');
  }
  GetAppointmentReasons(): Observable<any> {
    return this.api.get('/Appointment/GetAppointmentReasons');
  }
  GetAppointmentByPatientId(patientId: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByPatientId/${patientId}`);
  }
  GetAppointmentByDateRange(startDate: string, endDate: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByDateRange?startDate=${startDate}&endDate=${endDate}`);
  }
  GetAppointmentByStatus(status: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByStatus?status=${status}`);
  }
  GetAppointmentByProvider(providerId: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByProvider/${providerId}`);
  }
  GetAppointmentByFacility(facilityId: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByFacility/${facilityId}`);
  }
  GetAppointmentBySpeciality(specialityId: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentBySpeciality/${specialityId}`);
  }
  GetAppointmentBySite(siteId: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentBySite/${siteId}`);
  }
  GetAppointmentByPatientAndDate(patientId: string, date: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByPatientAndDate?patientId=${patientId}&date=${date}`);
  }
  GetAppointmentByIdAndDate(id: string, date: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByIdAndDate?id=${id}&date=${date}`);
  }
  GetAppointmentByProviderAndDate(providerId: string, date: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByProviderAndDate?providerId=${providerId}&date=${date}`);
  }
  GetAppointmentByFacilityAndDate(facilityId: string, date: string): Observable<any> {
    return this.api.get(`/Appointment/GetAppointmentByFacilityAndDate?facilityId=${facilityId}&date=${date}`);
  }




    searchAppointment(FromDate:string,ToDate:string,ProviderID?:number,LocationID?:number,SpecialityID?:number,SiteID?:number,FacilityID?:number,Page?:number,Size?:number) {
        return this.api.get(`Appointment/SearchAppointment?FromDate=${FromDate}&ToDate=${ToDate}${ProviderID==undefined?'':(`&ProviderID=${ProviderID}`)}${LocationID==undefined?'':(`&LocationID=${LocationID}`)}${SpecialityID==undefined?'':(`&SpecialityID=${SpecialityID}`)}${SiteID==undefined?'':(`&SiteID=${SiteID}`)}${FacilityID==undefined?'':(`&FacilityID=${FacilityID}`)}${Page==undefined?'':(`&Page=${Page}`)}${Size==undefined?'':(`&Size=${Size}`)}`).toPromise();
    }
    getCacheItem(object: any) {
        return this.api.post('Cache/GetCache', object).toPromise();
    }

    getEmployeeFacilityFromCache() {
        return this.api.get('Common/GetEmployeeFacilityFromCache').toPromise();
    }
    
    UpdateAppointmentStatus(appId: number, PatientStatusId: number, appVisitId: number) {
    
      const body={appId:appId, patientStatusId:PatientStatusId, appVisitId:appVisitId}
      return this.api.put(`Appointment/UpdateAppointmentStatus?appId=${appId}&patientStatusId=${PatientStatusId}&appVisitid=${appVisitId}`,body).toPromise();
    }

    cancelBooking(AppId:number,AppStatusId:number ,ByProvider:boolean,RescheduledId:number) {
      if(!RescheduledId){
        return this.api.get(`Appointment/CancelOrRescheduleAppointment?AppId=${AppId}&AppStatusId=${AppStatusId}&ByProvider=${ByProvider}`).toPromise();
      }
        return this.api.get(`Appointment/CancelOrRescheduleAppointment?AppId=${AppId}&AppStatusId=${AppStatusId}&ByProvider=${ByProvider}&RescheduledId=${RescheduledId}`).toPromise();
    }

    UpdateRescheduleById( schReschedule: any) {
      
      return this.api.put(`Appointment/UpdateRescheduleById`, schReschedule).toPromise();
    }

    submitappointmentbooking(schApp: any) {
      return this.api.post('Appointment/InsertAppointment', schApp).toPromise();
    }

    UpdateByAppId(schApp: any) {
      return this.api.put(`Appointment/UpdateAppointment`,schApp).toPromise();
    }

      getEligibilitydata(mrno:any) {
    return this.api.get(`Eligibility/getEligibilityLog?mrno=${mrno}`).toPromise();
  }

}
