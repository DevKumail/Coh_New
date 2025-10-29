import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChargeCaptureService {
  constructor(private api: ApiService) { }
  getCacheItem(object: any) {
    return this.api.post('Cache/GetCache', object).toPromise();
  }

  GetICD9CMGroupByProvider(ProviderId:number) {
	return this.api.get(`ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`).toPromise();
  }

  MyDiagnosisCodebyProvider(ProviderId:number,GroupId:number |null ,ICDVersionId:number | null, PageNumber: any ,PageSize: any, ) {
    return this.api.get(`ChargeCapture/MyDiagnosisCode?ProviderId=${ProviderId}&GroupId=${GroupId}&ICDVersionId=${ICDVersionId}&PageNumber=${PageNumber}&PageSize=${PageSize}`).toPromise();
  }

  GetCPTByProvider(ProviderId:number) {
	return this.api.get(`ChargeCapture/GetCPTByProvider?ProviderId=${ProviderId}`).toPromise();
  }
  GetHCPCSByProvider(ProviderId:number) {
    return this.api.get(`ChargeCapture/GetHCPCSByProvider?ProviderId=${ProviderId}`).toPromise();
  }
  GetDentalGroupbyProvider(ProviderId:number) {
      return this.api.get(`ChargeCapture/GetDentalGroupbyProvider?ProviderId=${ProviderId}`).toPromise();
  }
  DiagnosisCodebyProvider(
    ICDVersionId:number ,
    PageNumber:any ,
    PageSize:any,
    DiagnosisStartCode:string ,
    DiagnosisEndCode:string, 
    DescriptionFilter:string ) {
      
      return this.api.get(`ChargeCapture/DiagnosisCode?ICDVersionId=${ICDVersionId}&DiagnosisStartCode=${DiagnosisStartCode}&DiagnosisEndCode=${DiagnosisEndCode}&DescriptionFilter=${DescriptionFilter}&PageNumber=${PageNumber}&PageSize=${PageSize}`).toPromise();
  }
  MyCptCodebyProvider(ProviderId:number ,GroupId:number ) {
      //debugger
      return this.api.get(`ChargeCapture/MyCptCode?ProviderId=${ProviderId}&GroupId=${GroupId}`).toPromise();
  }



  MyHCPCSCodebyProvider(ProviderId:number ,GroupId:number, HCPCSCode:string, DescriptionFilter:string ,PairId:number) {
    //debugger
    return this.api.get(`ChargeCapture/MyHCPCSCode?ProviderId=${ProviderId}&GroupId=${GroupId}&HCPCSCode=${HCPCSCode}&DescriptionFilter=${DescriptionFilter}&PayerId=${PairId}` ).toPromise();
  }
  MyDentalCodebyProvider(ProviderId:number ,GroupId:number, ProviderDescription:string, DentalCode:string ) {
    //debugger
    return this.api.get(`ChargeCapture/MyDentalCode?ProviderId=${ProviderId}&GroupId=${GroupId}&ProviderDescription=${ProviderDescription}&DentalCode=${DentalCode}`).toPromise();
  }
  ChargeCaptureProceduresList(Id: number ,procStartCode: string | null,procEndCode: string | null,DescriptionFilter: string, ProcedureTypeId:number) {
    debugger;
    return this.api
      .get(`PatientProcedure/GetChargeCaptureProcedureList?Id=${Id}&ProcedureStartCode=${procStartCode}&ProcedureEndCode=${procEndCode}&DescriptionFilter=${DescriptionFilter}&ProcedureTypeId=${ProcedureTypeId}`)
      .toPromise();
  }
  SaveChargeCapture(values: any) {
    debugger
    return this.api.post('ChargeCapture/SaveChargeCapture', values).toPromise();
  }

  GetAllServiceItems(data: any) {
    let params = new HttpParams();  

    if (data.AllCode ) params = params.set('AllCode', data.AllCode);
    if (data.ServiceStartCode) params = params.set('ServiceStartCode', data.ServiceStartCode);
    if (data.DescriptionFilter) params = params.set('DescriptionFilter', data.DescriptionFilter);
    if (data.page) params = params.set('PageNumber', data.page);
    if (data.rowsPerPage) params = params.set('PageSize', data.rowsPerPage);

    return this.api.get('ChargeCapture/ServiceItems', params).toPromise();
  }

  GetAllUnclassifiedService(data: any) {
    let params = new HttpParams();

    if (data.AllCode ) params = params.set('AllCode', data.AllCode);
    if (data.UCStartCode) params = params.set('UCStartCode', data.UCStartCode);
    if (data.DescriptionFilter) params = params.set('DescriptionFilter', data.DescriptionFilter);
    if (data.page) params = params.set('PageNumber', data.page);
    if (data.rowsPerPage) params = params.set('PageSize', data.rowsPerPage);

    return this.api.get('ChargeCapture/UnclassifiedService', params).toPromise();
  }

  GetAllDentalCode(data: any) {
  let params = new HttpParams();

  if (data.AllDentalCode ) params = params.set('AllDentalCode', data.AllDentalCode);
  if (data.DentalStartCode) params = params.set('DentalStartCode', data.DentalStartCode);
  if (data.DentalEndCode) params = params.set('DentalEndCode', data.DentalEndCode);
  if (data.DescriptionFilter) params = params.set('DescriptionFilter', data.DescriptionFilter);
  if (data.page) params = params.set('PageNumber', data.page);
  if (data.rowsPerPage) params = params.set('PageSize', data.rowsPerPage);

  return this.api.get('ChargeCapture/DentalCode', params).toPromise();
  }

  GetAllHCPCSCode(data: any) {
    let params = new HttpParams();

    if (data.AllHCPCSCode ) params = params.set('AllHCPCSCode', data.AllHCPCSCode);
    if (data.HCPCStartCode) params = params.set('HCPCStartCode', data.HCPCStartCode);
    if (data.HCPCSEndCode) params = params.set('HCPCSEndCode', data.HCPCSEndCode);
    if (data.DescriptionFilter) params = params.set('DescriptionFilter', data.DescriptionFilter);
    if (data.page) params = params.set('PageNumber', data.page);
    if (data.rowsPerPage) params = params.set('PageSize', data.rowsPerPage);

    return this.api.get(`ChargeCapture/HCPCSCode`, params).toPromise();
  }
    
  GetAllCPTCode(data: any) {
    let params = new HttpParams();

    if (data.AllCPTCode) params = params.set('AllCPTCode', data.AllCPTCode);
    if (data.CPTStartCode) params = params.set('CPTStartCode', data.CPTStartCode);
    if (data.CPTEndCode) params = params.set('CPTEndCode', data.CPTEndCode);
    if (data.Description) params = params.set('DescriptionFilter', data.Description);
    if (data.page) params = params.set('PageNumber', data.page);
    if (data.rowsPerPage) params = params.set('PageSize', data.rowsPerPage);

    return this.api.get('ChargeCapture/CPTCode', params).toPromise();
  }
    
  
}