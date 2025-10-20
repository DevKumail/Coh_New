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
        debugger;
        return this.api
            .get(`SummarySheet/GetSummarySheet?mrNo=${MRNo}`)
            .toPromise();
    }

    VitalSignGet(Id: string, appointmentId: number) {
        debugger;
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
        debugger;
        return this.api
            .post(`PatientProblem/SubmitPatientProblem`, object)
            .toPromise();
    }

    DeletePatientProblem(Id: number) {
        debugger;
        return this.api
            .delete(`PatientProblem/DeletePatientProblem?Id=${Id}`)
            .toPromise();
    }

    GetAlergyType() {
        debugger;
        return this.api.get(`AllDropdowns/GetAlergyTypes`).toPromise();
    }

    GetSeverity() {
        debugger;
        return this.api.get(`AllDropdowns/GetSeverityType`).toPromise();
    }

    SubmitPatientAllergies(object: any) {
        debugger;
        return this.api.post(`Alergy/SubmitPatientAlergy`, object).toPromise();
    }

    GetPatientAllergyData(mrno: String) {
        debugger;
        return this.api
            .get(`Alergy/GetAlergyDetailsDB?mrno=${mrno}`)
            .toPromise();
    }

    DeleteAllergy(allergyId: number) {
        debugger;
        return this.api
            .delete(`Alergy/DeleteAlergy?Id=${allergyId}`)
            .toPromise();
    }

    GetSocialHistory() {
        debugger;
        return this.api.get(`AllDropdowns/GetSocialHistory`).toPromise();
    }

    //Social History API
    SubmitSocialHistory(object: any) {
        debugger;
        return this.api
            .post(`PatientChartFamilyHistory/CreateSocialHistory`, object)
            .toPromise();
    }

    GetAllSocialHistory() {
        debugger;
        return this.api
            .get(`PatientChartFamilyHistory/GetAllSocialHistory`)
            .toPromise();
    }

    GetFamilyProblemHistory() {
        debugger;
        return this.api.get(`AllDropdowns/GetFamilyProblemHistory`).toPromise();
    }

    CreateFamilyHistory(object: any) {
        debugger;
        return this.api
            .post(`PatientChartFamilyHistory/CreateFamilyHistory`, object)
            .toPromise();
    }

    GetAllFamilyHistory() {
        debugger;
        return this.api
            .get(`PatientChartFamilyHistory/GetAllFamilyHistory`)
            .toPromise();
    }

    GetEMRRoute() {
        debugger;
        return this.api.get(`AllDropdowns/GetEMRRoute`).toPromise();
    }

    GetComments() {
        debugger;
        return this.api.get(`AllDropdowns/GetComments`).toPromise();
    }

    GetFrequency() {
        debugger;
        return this.api.get(`AllDropdowns/GetFrequency`).toPromise();
    }

    SubmitPrescription(object: any) {
        debugger;
        return this.api
            .post(`Prescription/InsertOrUpdatePrescriptions`, object)
            .toPromise();
    }

    GetAll_Past_CurrentPrescriptions(mrno: string) {
        debugger;
        return this.api
            .get(`Prescription/GetAllPrescriptions?mrno=${mrno}`)
            .toPromise();
    }

    DeletePrescription(MedicationId: number) {
        debugger;
        return this.api
            .delete(`Prescription/DeletePrescriptions?Id=${MedicationId}`)
            .toPromise();
    }

    SubmitPatientProcedure(object: any) {
        debugger;
        return this.api
            .post(`PatientProcedure/InsertOrUpdatePatientProcedure`, object)
            .toPromise();
    }
    SearchByPrescription(keyword: string) {
        debugger;
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
        debugger;
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
        debugger;
        return this.api
            .get(
                `PatientProcedure/GetProcedureList?Id=${Id}&ProcedureStartCode=${procStartCode}&ProcedureEndCode=${procEndCode}&DescriptionFilter=${DescriptionFilter}`
            )
            .toPromise();
    }
    GetSite() {
        debugger;
        return this.api.get(`AllDropdowns/GetEMRSite`).toPromise();
    }
    GetRoute() {
        debugger;
        return this.api.get(`AllDropdowns/GetEMRRoute`).toPromise();
    }
    GetImmunizationType() {
        debugger;
        return this.api.get(`AllDropdowns/GetImmunizationList`).toPromise();
    }
    InsertOrUpdatePatientImmunization(object: any) {
        debugger;
        return this.api
            .post(
                `PatientImmunization/InsertOrUpdatePatientImmunization`,
                object
            )
            .toPromise();
    }
    GetPatientImmunizationData(mrno: string) {
        debugger;
        return this.api
            .get(`PatientImmunization/GetPatientImmunizationList?mrno=${mrno}`)
            .toPromise();
    }
    DeleteImmunization(Id: number) {
        debugger;
        return this.api
            .delete(`PatientImmunization/DeletePatientImmunization?Id=${Id}`)
            .toPromise();
    }

    GetMedicationsList(MRNo: number) {
        debugger;
        return this.api
            .get(`SummarySheet/GetMedicationsList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetAllergiesList(MRNo: number) {
        debugger;
        return this.api
            .get(`SummarySheet/GetAllergiesList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetMedHistoryList(MRNo: number) {
        debugger;
        return this.api
            .get(`SummarySheet/GetMedicalHistoryList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetPatientProblemList(MRNo: number) {
        debugger;
        return this.api
            .get(`SummarySheet/GetPatientProblemList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetPatientProcedureList(MRNo: number) {
        debugger;
        return this.api
            .get(`SummarySheet/GetPatientProcedureList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetPatientImmunizationList(MRNo: number) {
        debugger;
        return this.api
            .get(`SummarySheet/GetPatientImmunizationList?MRNo=${MRNo}`)
            .toPromise();
    }

    GetAlertType() {
        debugger;
        return this.api.get(`AllDropdowns/GetAlertType`).toPromise();
    }

    SubmitAlertType(object: any) {
        debugger;
        return this.api.post(`Alert/SubmitAlertType`, object).toPromise();
    }

    GetPatientAlertsData(mrno: string) {
        debugger;
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
        debugger;
        return this.api
            .get(
                `PatientProcedure/GetChargeCaptureProcedureList?Id=${Id}&ProcedureStartCode=${procStartCode}&ProcedureEndCode=${procEndCode}&DescriptionFilter=${DescriptionFilter}&ProcedureTypeId=${ProcedureTypeId}`
            )
            .toPromise();
    }
}
