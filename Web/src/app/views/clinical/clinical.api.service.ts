import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ClinicalApiService {

  constructor(private api: ApiService) { }


  // //   submitPatientAllergy(data: any): Observable<any> {
  // //     return this.api.post('SubmitPatientAlergy', data);
  // //   }

  //   submitPatientAllergy(data: any): Observable<any> {

  //   return this.api.post('/Alergy/SubmitPatientAlergy', data);
  // }

  SubmitPatientProblem(object: any) {
    debugger
    return this.api
      .post(`PatientProblem/SubmitPatientProblem`, object)
      .toPromise();
  }
  MyCptCodebyProvider(ProviderId: number, GroupId: number) {
    //debugger
    return this.api.get(`ChargeCapture/MyCptCode?ProviderId=${ProviderId}&GroupId=${GroupId}`).toPromise();
  }
  UnclassifiedServicebyProvider(AllCode: number, UCStartCode: string, DescriptionFilter: string) {
    //debugger
    return this.api.get(`ChargeCapture/UnclassifiedService?AllCode=${AllCode}&UCStartCode=${UCStartCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }
  ServiceItemsbyProvider(AllCode: number, ServiceStartCode: string, DescriptionFilter: string) {
    //debugger
    return this.api.get(`ChargeCapture/ServiceItems?AllCode=${AllCode}&ServiceStartCode=${ServiceStartCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }


  CPTCodebyProvider(AllCPTCode: number, CPTStartCode: string, CPTEndCode: string, Description: string) {
    //debugger
    return this.api.get(`ChargeCapture/CPTCode?AllCPTCode=${AllCPTCode}&CPTStartCode=${CPTStartCode}&CPTEndCode=${CPTEndCode}&Description=${Description}`).toPromise();
  }
  MyHCPCSCodebyProvider(ProviderId: number, GroupId: number, HCPCSCode: string, DescriptionFilter: string, PairId: number) {
    //debugger
    return this.api.get(`ChargeCapture/MyHCPCSCode?ProviderId=${ProviderId}&GroupId=${GroupId}&HCPCSCode=${HCPCSCode}&DescriptionFilter=${DescriptionFilter}&PayerId=${PairId}`).toPromise();
  }
  DiagnosisCodebyProvider(
    ICDVersionId: number, 
    PageNumber: any, 
    PageSize: any,
    DiagnosisStartCode: string, 
    DiagnosisEndCode: string, 
    DescriptionFilter: string 
  ) {
    return this.api.get(`ChargeCapture/DiagnosisCode?ICDVersionId=${ICDVersionId}&DiagnosisStartCode=${DiagnosisStartCode}&DiagnosisEndCode=${DiagnosisEndCode}&DescriptionFilter=${DescriptionFilter}&PageNumber=${PageNumber}&PageSize=${PageSize}`).toPromise();
  }
  submitPatientAllergy(data: any): Observable<any> {
    // debugger
    return this.api.post('/Alergy/SubmitPatientAlergy', data);
  }

  GetRowDataOfPatientProblem(IsMedicalHistory:boolean,mrno: string, userId: number, pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get(`PatientProblem/GetPatientProblems?IsMedicalHistory=${IsMedicalHistory}&MRNo=${mrno}&UserId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`).toPromise();
  }
 GetPatientProblemData(IsMedicalHistory:boolean, mrno: string, userId: number, pageNumber: number, pageSize: number) {
    // Unified to PatientProblem endpoint (Problem/GetProblemDetailsDB does not exist)
    return this.api.get(`PatientProblem/GetPatientProblems?IsMedicalHistory=${IsMedicalHistory}&MRNo=${mrno}&UserId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`).toPromise();
}

  MyDiagnosisCodebyProvider(ProviderId: number, GroupId: number | null, ICDVersionId: number | null) {
    debugger
    return this.api.get(`ChargeCapture/MyDiagnosisCode?ProviderId=${ProviderId}&GroupId=${GroupId}&ICDVersionId=${ICDVersionId}`).toPromise();
  }

  //     GetICD9CMGroupByProvider(ProviderId:number) {
  // 	return this.api.get(`ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`).toPromise();
  //   }
  // }
  GetICD9CMGroupByProvider(ProviderId: number) {
    return this.api.get(`ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`).toPromise();
  }
  getCacheItem(object: any) {
    return this.api.post('Cache/GetCache', object).toPromise();
  }
  getCacheItems(object: any) {
    return this.api.post('Cache/GetCache', object).toPromise();
  }
  // GetAlergyType(): Promise<any> {
  //     return this.api.get('AllDropdowns/GetAlergyType').toPromise();
  // }
  // GetAlergyType(mrno: string, userId: number) {
  //   return this.api.get(`AllDropdowns/GetAlergyType?mrno=${mrno}&userId=${userId}`).toPromise();
  // }
  //  GetAlergyType(){
  //    // debugger;
  //   return this.api.get(`AllDropdowns/GetAlergyTypes`).toPromise();
  // }
  SubmitPatientAllergies(object: any) {
    debugger
    return this.api.post(`Alergy/SubmitPatientAlergy`, object).toPromise();
  }
  GetAllergyDetails(mrno: string): Promise<any> {
    const url = `Allergies/GetAllergyDetails?mrno=${mrno}`;
    return this.api.get(url).toPromise();
  }
  SubmitAllergy(data: any): Promise<any> {
    return this.api.post('Allergies/SubmitAllergy', data).toPromise();
  }
  DeleteAllergy(id: string): Promise<any> {
    const url = `Allergies/DeleteAllergy?id=${id}`;
    return this.api.delete(url).toPromise();
  }
  // GetAllergyById(id: string): Promise<any> {
  //     const url = `Allergies/GetAllergyById?id=${id}`;
  GetSeverity() {
    // debugger;
    return this.api.get(`AllDropdowns/GetSeverityType`).toPromise();
  }

  GetPatientAllergyData(mrno: String) {
    // debugger;
    return this.api.get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}`).toPromise();
  }
  GetAlergyType(): Observable<any> {
    return this.api.get('AllDropdowns/GetAlergyTypes');
  }

  GetAlergySeverity() {
    return this.api.get('AllDropdowns/GetSeverityType').toPromise();
  }
  GetAlergyStatus() {
    return this.api.get('Alergy/GetAlergyStatus').toPromise();
  }
  GetAlergyByProviderId(): Observable<any> {
    return this.api.get('Alergy/GetAlergyByProviderId');
  }

  //  GetPatientAllergyData(mrno: string): Observable<any> {
  //   return this.api.get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}`);
  // }


  // SubmitPatientAllergies(data: any) {
  //   return this.api.post('Alergy/SubmitPatientAlergy', data).toPromise();
  // }
  GetAlergyByMRNo(MRNo: string) {
    return this.api.get(`Alergy/GetAlergyByMRNo?MRNo=${MRNo}`).toPromise();
  }
  // getCacheItem(object: any) {
  //     return this.api.post('Cache/GetCache', object).toPromise();
  // }
  GetAlergyById(id: string): Observable<any> {
    return this.api.get(`/Alergy/GetAlergyById/${id}`);
  }
  UpdateAlergy(id: string, data: any): Observable<any> {
    return this.api.put(`/Alergy/UpdateAlergy/${id}`, data);
  }
  DeleteAlergy(id: string): Observable<any> {
    return this.api.delete(`/Alergy/DeleteAlergy/${id}`);
  }
  GetPatientProblemByMRNo(MRNo: string) {
    return this.api.get(`PatientProblem/GetPatientProblems?MRNo=${MRNo}`).toPromise();
  }
  GetPatientProblemById(id: string): Observable<any> {
    return this.api.get(`/PatientProblem/GetPatientProblemById/${id}`);
  }
  UpdatePatientProblem(id: string, data: any): Observable<any> {
    return this.api.put(`/PatientProblem/UpdatePatientProblem/${id}`, data);
  }
 
//   DeletePatientProblem(Id: number): Observable<any> {
//   return this.api.delete(`PatientProblem/DeletePatientProblem/${Id}`);
// }
DeletePatientProblem(Id: number): Observable<any> {
  return this.api.delete(`PatientProblem/DeletePatientProblem?Id=${Id}`);
}


  GetAlertType() {
    return this.api.get('Alert/GetAlertType').toPromise();
  }
  GetAlertStatus() {
    return this.api.get('Alert/GetAlertStatus').toPromise();

  }
  // GetSeverity() {
  //   return this.api.get('AllDropdowns/GetSeverityType').toPromise();
  // }


}
