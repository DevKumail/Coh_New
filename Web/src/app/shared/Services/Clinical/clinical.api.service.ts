import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClinicalApiService {

    // getCacheItem(arg0: { entities: string[]; }) {
    //     throw new Error('Method not implemented.');
    // }

    GetAlergyByProviderId(): Observable<any> {
    return this.api.get('Alergy/GetAlergyByProviderId');
  }

    add(arg0: { severity: string; summary: string; detail: string; }) {
        throw new Error('Method not implemented.');
    }
    constructor(private api: ApiService) {}

    submitPatientAllergy(data: any): Observable<any> {
        return this.api.post('/Alergy/SubmitPatientAlergy', data);
    }

    getCacheItem(object: any) {
    return this.api.post('Cache/GetCache', object).toPromise();
    }

    // SubmitPatientProblem(object: any) {
    // ;
    // return this.api
    //   .post(`PatientProblem/SubmitPatientProblem`, object)
    //   .toPromise();
    // }
    GetRowDataOfPatientProblem(mrno: string, userId: number) {
        return this.api
            .get(
                `PatientProblem/GetPatientProblems?MRNo=${mrno}&UserId=${userId}`
            )
            .toPromise();
    }

    GetICD9CMGroupByProvider(ProviderId: number) {
        return this.api
            .get(
                `ChargeCapture/GetICD9CMGroupByProvider?ProviderId=${ProviderId}`
            )
            .toPromise();
    }
    SummarySheet(MRNo: string) {
         ;
        return this.api
            .get(`SummarySheet/GetSummarySheet?mrNo=${MRNo}`)
            .toPromise();
    }

    VitalSignGet(Id: string, appointmentId: number) {
         ;
        return this.api
            .get(
                `SummarySheet/VitalSignGet?id=${Id}&visitaccountNo=${appointmentId}`
            )
            .toPromise();
    }

    VitalSignInsert(object: any) {
        return this.api
            .post(`SummarySheet/VitalSignInsert`, object)
            .toPromise();
    }
      VitalSignUpdate(object: any) {
        return this.api
            .put(`SummarySheet/VitalSignUpdate`, object)
            .toPromise();
    }

    SubmitPatientProblem(object: any) {
         ;
        return this.api
            .post(`PatientProblem/SubmitPatientProblem`, object)
            .toPromise();
    }

    DeletePatientProblem(Id: number) {
         ;
        return this.api
            .delete(`PatientProblem/DeletePatientProblem?Id=${Id}`)
            .toPromise();
    }

    GetAlergyType() {
         ;
        return this.api.get(`AllDropdowns/GetAlergyTypes`).toPromise();
    }

    GetSeverity() {
         ;
        return this.api.get(`AllDropdowns/GetSeverityType`).toPromise();
    }

    SubmitPatientAllergies(object: any) {
         ;
        return this.api.post(`Alergy/SubmitPatientAlergy`, object).toPromise();
    }

    GetPatientAllergyData(mrno: String , page: number, pageSize: number) {
        return this.api
            .get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}&PageNumber=${page}&PageSize=${pageSize}`)
            .toPromise();
    }

    DeleteAllergy(allergyId: number) {
         ;
        return this.api
            .delete(`Alergy/DeleteAlergy?Id=${allergyId}`)
            .toPromise();
    }

    GetSocialHistory() {
         ;
        return this.api.get(`AllDropdowns/GetSocialHistory`).toPromise();
    }

    //Social History API
    SubmitSocialHistory(object: any) {
         ;
        return this.api
            .post(`PatientChartFamilyHistory/CreateSocialHistory`, object)
            .toPromise();
    }

    GetAllSocialHistory() {
         ;
        return this.api
            .get(`PatientChartFamilyHistory/GetAllSocialHistory`)
            .toPromise();
    }

    GetFamilyProblemHistory() {
         ;
        return this.api.get(`AllDropdowns/GetFamilyProblemHistory`).toPromise();
    }

    CreateFamilyHistory(object: any) {
         ;
        return this.api
            .post(`PatientChartFamilyHistory/CreateFamilyHistory`, object)
            .toPromise();
    }

    GetAllFamilyHistory() {
         ;
        return this.api
            .get(`PatientChartFamilyHistory/GetAllFamilyHistory`)
            .toPromise();
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

    SubmitPrescription(object: any) {
         ;
        return this.api
            .post(`Prescription/InsertOrUpdatePrescriptions`, object)
            .toPromise();
    }

    GetAll_Past_CurrentPrescriptions(mrno: string) {
         ;
        return this.api
            .get(`Prescription/GetAllPrescriptions?mrno=${mrno}`)
            .toPromise();
    }

    DeletePrescription(MedicationId: number) {
         ;
        return this.api
            .delete(`Prescription/DeletePrescriptions?Id=${MedicationId}`)
            .toPromise();
    }

    SubmitPatientProcedure(object: any) {
         ;
        return this.api
            .post(`PatientProcedure/InsertOrUpdatePatientProcedure`, object)
            .toPromise();
    }
        SearchByPrescription(keyword: string) {

        return this.api
            .get(`Prescription/SearchByPrescriptions?keyword=${keyword}`)
            .toPromise();
    }

    GetPatientProceduresList(MRNo: string) {
        return this.api
            .get(`PatientProcedure/GetPatientProcedure?&MRNo=${MRNo}`)
            .toPromise();
    }
    DeletePatientProcedure(Id: number) {
         ;
        return this.api
            .delete(`PatientProcedure/DeletePatientProcedure?Id=${Id}`)
            .toPromise();
    }
    ProceduresList(
        Id: number,
        procStartCode: string | null,
        procEndCode: string | null,
        DescriptionFilter: string
    ) {
         ;
        return this.api
            .get(
                `PatientProcedure/GetProcedureList?Id=${Id}&ProcedureStartCode=${procStartCode}&ProcedureEndCode=${procEndCode}&DescriptionFilter=${DescriptionFilter}`
            )
            .toPromise();
    }
    GetSite() {
         ;
        return this.api.get(`AllDropdowns/GetEMRSite`).toPromise();
    }
    GetRoute() {
         ;
        return this.api.get(`AllDropdowns/GetEMRRoute`).toPromise();
    }
    GetImmunizationType() {
         ;
        return this.api.get(`AllDropdowns/GetImmunizationList`).toPromise();
    }
    InsertOrUpdatePatientImmunization(object: any) {
         ;
        return this.api
            .post(
                `PatientImmunization/InsertOrUpdatePatientImmunization`,
                object
            )
            .toPromise();
    }
    GetPatientImmunizationData(mrno: string) {
         ;
        return this.api
            .get(`PatientImmunization/GetPatientImmunizationList?mrno=${mrno}`)
            .toPromise();
    }
    DeleteImmunization(Id: number) {
         ;
        return this.api
            .delete(`PatientImmunization/DeletePatientImmunization?Id=${Id}`)
            .toPromise();
    }

    GetMedicationsList(MRNo: number) {
         ;
        return this.api
            .get(`SummarySheet/GetMedicationsList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetAllergiesList(MRNo: number) {
         ;
        return this.api
            .get(`SummarySheet/GetAllergiesList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetMedHistoryList(MRNo: number) {
         ;
        return this.api
            .get(`SummarySheet/GetMedicalHistoryList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetPatientProblemList(MRNo: number) {
         ;
        return this.api
            .get(`SummarySheet/GetPatientProblemList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetPatientProcedureList(MRNo: number) {
         ;
        return this.api
            .get(`SummarySheet/GetPatientProcedureList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetPatientImmunizationList(MRNo: number) {
         ;
        return this.api
            .get(`SummarySheet/GetPatientImmunizationList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetAlertType() {
         ;
        return this.api.get(`AllDropdowns/GetAlertType`).toPromise();
    }

    SubmitAlertType(object: any) {
         ;
        return this.api.post(`Alert/SubmitAlertType`, object).toPromise();
    }

    GetPatientAlertsData(mrno: string) {
         ;
        return this.api.get(`Alert/GetAlertDeatilsDB?mrno=${mrno}`).toPromise();
    }

    DeleteAlert(Id: number) {
        return this.api.delete(`Alert/DeleteAlert?Id=${Id}`).toPromise();
    }

    ChargeCaptureProceduresList(
        Id: number,
        procStartCode: string | null,
        procEndCode: string | null,
        DescriptionFilter: string,
        ProcedureTypeId: number
    ) {
         ;
        return this.api
            .get(
                `PatientProcedure/GetChargeCaptureProcedureList?Id=${Id}&ProcedureStartCode=${procStartCode}&ProcedureEndCode=${procEndCode}&DescriptionFilter=${DescriptionFilter}&ProcedureTypeId=${ProcedureTypeId}`
            )
            .toPromise();
    }


      SpeechtoText(MRNo:string, currentPage?: number, pageSize?: number) {
    return this.api.get(`Appointment/SpeechtoText?mrNo=${MRNo}&PageNumber=${currentPage}&PageSize=${pageSize}`).toPromise();
  }
}
