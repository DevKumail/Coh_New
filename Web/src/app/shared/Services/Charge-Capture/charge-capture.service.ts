import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

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

  GetAllServiceItems(AllCode:number ,ServiceStartCode:string, DescriptionFilter:string ) {
    //debugger
    return this.api.get(`ChargeCapture/ServiceItems?AllCode=${AllCode}&ServiceStartCode=${ServiceStartCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }

    GetAllUnclassifiedService (AllCode:number ,UCStartCode:string, DescriptionFilter:string ) {
    //debugger
    return this.api.get(`ChargeCapture/UnclassifiedService?AllCode=${AllCode}&UCStartCode=${UCStartCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }
  GetAllDentalCode(AllDentalCode:number ,DentalStartCode:string, DentalEndCode:string, DescriptionFilter:string ) {
    //debugger
    return this.api.get(`ChargeCapture/DentalCode?AllDentalCode=${AllDentalCode}&DentalStartCode=${DentalStartCode}&DentalEndCode=${DentalEndCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }

  GetAllHCPCSCode(AllHCPCSCode:number ,HCPCStartCode:string, HCPCSEndCode:string, DescriptionFilter:string ) {
    //debugger
    return this.api.get(`ChargeCapture/HCPCSCode?AllHCPCSCode=${AllHCPCSCode}&HCPCStartCode=${HCPCStartCode}&HCPCSEndCode=${HCPCSEndCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }

    GetAllCPTCode(AllCPTCode:any ,CPTStartCode:any ,CPTEndCode:any, Description:any, page:any, rowsPerPage:any ) {
      //debugger
      return this.api.get(`ChargeCapture/CPTCode?AllCPTCode=${AllCPTCode}&CPTStartCode=${CPTStartCode}&CPTEndCode=${CPTEndCode}&Description=${Description}&PageNumber=${page}&PageSize=${rowsPerPage}`).toPromise();
    }

    
  
}