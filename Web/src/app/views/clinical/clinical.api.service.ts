import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ClinicalApiService {

  constructor(private api: ApiService,private http: HttpClient) { }
private question = 'assets/question.json';

  // //   submitPatientAllergy(data: any): Observable<any> {
  // //     return this.api.post('SubmitPatientAlergy', data);
  // //   }

  //   submitPatientAllergy(data: any): Observable<any> {

  //   return this.api.post('/Alergy/SubmitPatientAlergy', data);
  // }

  SubmitPatientProblem(object: any) {

    return this.api
      .post(`PatientProblem/SubmitPatientProblem`, object)
      .toPromise();
  }
  MyCptCodebyProvider(ProviderId: number, GroupId: number) {
    //
    return this.api.get(`ChargeCapture/MyCptCode?ProviderId=${ProviderId}&GroupId=${GroupId}`).toPromise();
  }
  UnclassifiedServicebyProvider(AllCode: number, UCStartCode: string, DescriptionFilter: string) {
    //
    return this.api.get(`ChargeCapture/UnclassifiedService?AllCode=${AllCode}&UCStartCode=${UCStartCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }
  ServiceItemsbyProvider(AllCode: number, ServiceStartCode: string, DescriptionFilter: string) {
    //
    return this.api.get(`ChargeCapture/ServiceItems?AllCode=${AllCode}&ServiceStartCode=${ServiceStartCode}&DescriptionFilter=${DescriptionFilter}`).toPromise();
  }


  CPTCodebyProvider(AllCPTCode: number, CPTStartCode: string, CPTEndCode: string, Description: string) {
    //
    return this.api.get(`ChargeCapture/CPTCode?AllCPTCode=${AllCPTCode}&CPTStartCode=${CPTStartCode}&CPTEndCode=${CPTEndCode}&Description=${Description}`).toPromise();
  }
  MyHCPCSCodebyProvider(ProviderId: number, GroupId: number, HCPCSCode: string, DescriptionFilter: string, PairId: number) {
    //
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
    //
    return this.api.post('/Alergy/SubmitPatientAlergy', data);
  }

  GetRowDataOfPatientProblem(IsMedicalHistory: boolean, mrno: string, userId: number, pageNumber: number = 1, pageSize: number = 10) {
    return this.api.get(`PatientProblem/GetPatientProblems?IsMedicalHistory=${IsMedicalHistory}&MRNo=${mrno}&UserId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`).toPromise();
  }
  GetPatientProblemData(IsMedicalHistory: boolean, mrno: string, userId: number, pageNumber: number, pageSize: number) {
    // Unified to PatientProblem endpoint (Problem/GetProblemDetailsDB does not exist)
    return this.api.get(`PatientProblem/GetPatientProblems?IsMedicalHistory=${IsMedicalHistory}&MRNo=${mrno}&UserId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`).toPromise();
  }

  MyDiagnosisCodebyProvider(ProviderId: number, GroupId: number | null, ICDVersionId: number | null) {

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
  //    //  ;
  //   return this.api.get(`AllDropdowns/GetAlergyTypes`).toPromise();
  // }
  SubmitPatientAllergies(object: any) {

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
    //  ;
    return this.api.get(`AllDropdowns/GetSeverityType`).toPromise();
  }


    GetPatientAllergyData(mrno: String , page: number, pageSize: number) {
        return this.api
            .get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}&PageNumber=${page}&PageSize=${pageSize}`)
            .toPromise();
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
  DeletePatientProblem(Id: number) {
    return this.api.delete(`PatientProblem/DeletePatientProblem?Id=${Id}`).toPromise();;
  }


  GetAlertType() {
    return this.api.get('Alert/GetAlertType').toPromise();
  }
  GetAlertStatus() {
    return this.api.get('Alert/GetAlertStatus').toPromise();

  }


  GetEMRRoute() {
    ;
    return this.api.get(`AllDropdowns/GetEMRRoute`).toPromise();
  }

  GetComments() {
    ;
    return this.api.get(`AllDropdowns/GetComments`).toPromise();
  }

  GetFrequency() {
    ;
    return this.api.get(`AllDropdowns/GetFrequency`).toPromise();
  }

  // GetAll_Past_CurrentPrescriptions(mrno: string) {
  //   return this.api.get(`Prescription/GetAllPrescriptions?mrno=${mrno}`).toPromise();
  // }

  GetAllCurrentPrescriptions(mrno: string, pageNumber: number, pageSize: number) {
    return this.api.get(`Prescription/GetCurrentPrescriptions?mrno=${mrno}&PageNumber=${pageNumber}&PageSize=${pageSize}`).toPromise();
  }

  GetAllPastPrescriptions(mrno: string, pageNumber: number, pageSize: number) {
    return this.api.get(`Prescription/GetPastPrescriptions?mrno=${mrno}&PageNumber=${pageNumber}&PageSize=${pageSize}`).toPromise();
  }

  SearchByPrescription(keyword: string, pageNumber: number, pageSize: number) {
    return this.api.get(`Prescription/SearchByPrescriptions?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`).toPromise();
  }

  DeletePrescription(id: number) {
    return this.api.delete(`Prescription/DeletePrescriptions?Id=${id}`).toPromise();
  }

  SubmitPrescription(object: any) {
    return this.api.post(`Prescription/InsertOrUpdatePrescriptions`, object).toPromise();
  }

  GetPatientProceduresList(status: string, mrno: string, pageNumber: number, pageSize: number){
    return this.api.get(`SummarySheet/GetPatientProcedureList?status=${status}&mrno=${mrno}&PageNumber=${pageNumber}&PageSize=${pageSize}`).toPromise();
  }

// ProceduresList(
//   pageNumber: number,
//   pageSize: number,
//   procStartCode: string,
//   procEndCode: string,
//   descriptionFilter: string
// ) {
//   const pn = pageNumber || 1;
//   const ps = pageSize || 5;
//   const psc = procStartCode || '0';
//   const pec = procEndCode || '0';
//   const df = descriptionFilter || '0';

//   return this.api.get(
//     `PatientProcedure/GetProcedureList?PageNumber=${pn}&PageSize=${ps}&ProcedureStartCode=${psc}&ProcedureEndCode=${pec}&DescriptionFilter=${df}`
//   ).toPromise();
// }


  ProceduresList(
    procStartCode: string,
    procEndCode: string,
    descriptionFilter: string,
    PageNumber: any,
    PageSize: any,
  ) {
    return this.api.get(`PatientProcedure/GetProcedureList?ProcedureStartCode=${procStartCode}&ProcedureEndCode=${procEndCode}&DescriptionFilter=${descriptionFilter}&PageNumber=${PageNumber}&PageSize=${PageSize}`).toPromise();
  }

    SubmitPatientProcedure(object: any) {
    return this.api
      .post(`PatientProcedure/InsertOrUpdatePatientProcedure`, object)
      .toPromise();
  }
    EMRNotesGetByEmpId(EmpId: any) {
    return this.api.get(`EMRNotes/EMRNotesGetByEmpId?EmpId=${EmpId}`).toPromise();
  }
  GetNotesTemplate(PathId: any) {
    return this.api.get(`EMRNotes/GetNoteQuestionBYPathId?pathId=${PathId}`).toPromise();
  }
  getDataquestion(): Observable<any[]> {
    return this.http.get<any[]>(this.question);
  }
    InsertSpeech(note: any) {
    debugger
    return this.api.post(`Appointment/InsertSpeech`, note).toPromise();
  }
  GetSocialHistory(){
    return this.api.get(`AllDropdowns/GetSocialHistory`).toPromise();
  }

    DeletePatientProcedure(id: number){
    return this.api.delete(`PatientProcedure/DeletePatientProcedure?Id=${id}`).toPromise();
  }

  GetAllSocialHistory(MRNo: string, pageNumber: number, pageSize: number){
    return this.api.get(`PatientChartFamilyHistory/GetAllSocialHistory?MRNo=${MRNo}&PageNumber=${pageNumber}&PageSize=${pageSize}`).toPromise();
  }

  SubmitSocialHistory(object:any){
    return this.api.post(`PatientChartFamilyHistory/CreateSocialHistory`,object).toPromise();
  }


  DeleteSocialHistory(id: number){
    return this.api.delete(`PatientChartFamilyHistory/DeleteSocialHistoryByShId?shid=${id}`).toPromise();
  }
  // GetSeverity() {
  //   return this.api.get('AllDropdowns/GetSeverityType').toPromise();
  // }
  CreateFamilyHistory(object:any){
    return this.api.post(`PatientChartFamilyHistory/CreateFamilyHistory`,object).toPromise();
  }

  GetFamilyProblemHistory(){
  return this.api.get(`AllDropdowns/GetFamilyProblemHistory`).toPromise();
 }

   GetAllFamilyHistory(MRNo: string, pageNumber: number, pageSize: number){
    return this.api.get(`PatientChartFamilyHistory/GetAllFamilyHistory?MRNo=${MRNo}&PageNumber=${pageNumber}&PageSize=${pageSize}`).toPromise();
  }

  DeleteFamilyHistoryByFHID(id: number){
    return this.api.delete(`PatientChartFamilyHistory/DeleteFamilyHistoryByFHID?fhid=${id}`).toPromise();
  }

      GetAlertDetailsDb(mrno: string, pageNumber: number, pageSize: number ): Promise<any> {
        const url = `Alert/GetAlertDeatilsDB?mrno=${mrno}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
        return this.api.get(url).toPromise();
    }

      GetPatientImmunizationData(mrno: string, page: number, pageSize: number, status: any) {
        return this.api
            .get(`PatientImmunization/GetPatientImmunizationList?mrno=${mrno}&PageNumber=${page}&PageSize=${pageSize}&Status=${status}`)
            .toPromise();
    }

        GetAppointmentByMRNO(MRNo:any,currentPage:any,pageSize:any) {
	return this.api.get(`Common/GetAppointmentInfoByMRNo?PageNumber=${currentPage}&PageSize=${pageSize}&MRNo=${MRNo}`);

  }

}
