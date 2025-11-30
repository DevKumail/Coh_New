import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { IvfCreateLabOrderDto } from './dtos/ivf-lab-orders.dto';

@Injectable({ providedIn: 'root' })
export class IVFApiService {
  constructor(private api: ApiService) {}

  getCoupleData(mrno: string): Observable<any> {
    return this.api.get(`IVFDashboard/GetCoupleData?mrno=${mrno}`);
  }

  getLabTestsTree(investigationTypeId: number): Observable<any> {
    return this.api.get('IVFLabTests/Tree', { investigationTypeId });
  }

  createLabOrder(payload: IvfCreateLabOrderDto): Observable<any> {
    return this.api.post('IVFLabOrders', payload);
  }

  GetStorageDetails(payload: any): Observable<any> {
  return this.api.post('IVFMaleCryoPreservation/storage-details', payload);
}
  getLabOrdersByMrNo(mrno: string | number, view: 'grid' | 'list' = 'grid'): Observable<any> {
    return this.api.get(`IVFLabOrders/by-mrno/${mrno}`, { view });
  }

  deleteLabOrder(orderSetId: number | string, hard: boolean = false): Observable<any> {
    return this.api.delete(`IVFLabOrders/${orderSetId}?hard=${hard}`);
  }

  getLabOrderById(orderSetId: number | string): Observable<any> {
    return this.api.get(`IVFLabOrders/${orderSetId}`);
  }

  getRefPhysicians(employeeTypeId: number = 1): Observable<any> {
    return this.api.get('IVFLabOrders/ref-physicians', { employeeTypeId });
  }

  createOrUpdateMaleFertilityHistory(payload: any): Observable<any> {
    return this.api.post('IVFFertilityHistory/CreateUpdateMaleFertilityHistory', payload);
  }

  getMaleFertilityHistory(ivfMainId: number, page: number = 1, rowsPerPage: number = 10): Observable<any> {
    return this.api.get('IVFFertilityHistory/GetAllMaleFertilityHistory', {
      ivfmainid: ivfMainId,
      page,
      rowsPerPage,
    });
  }

  getFertilityHistoryById(ivfMaleFHId: number): Observable<any> {
    return this.api.get('IVFFertilityHistory/GetMaleFertilityHistoryById', { IVFMaleFHId: ivfMaleFHId });
  }


  deleteFertilityHistoryMale(ivfMaleFHId: number): Observable<any> {
    return this.api.delete(`IVFFertilityHistory/DeleteMaleFertilityHistory/${ivfMaleFHId}`);
  }

  getNotifyRoles(): Observable<any> {
    return this.api.get('IVFLabOrders/notify-roles');
  }

  GetOppositeGenderPatients(payload: any, currentPage: number, pageSize: number): Observable<any> {
    return this.api.get(`IVFDashboard/GetOppositeGenderPatients?gender=${payload.gender}&page=${currentPage}&rowsPerPage=${pageSize}&mrno=${payload.mrno}&phone=${payload.phone}&emiratesId=${payload.emiratesId}&name=${payload.name}`);
  }

  InsertPatientRelation(payload: any): Observable<any> {
    return this.api.post('IVFDashboard/InsertPatientRelation', payload);
  }

  GenerateIVFMain(payload: any): Observable<any> {
    return this.api.post('IVFDashboard/GenerateIVFMain', payload);
  }

  InsertOrUpdateMaleSemenAnalysis(payload: any): Observable<any> {
    return this.api.post('IVFMaleSemanAnalysis/InsertOrUpdate', payload);
  }

  GetAllMaleSemenAnalysis(ivfMainId: number, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.api.get('IVFMaleSemanAnalysis/GetAll', { ivfMainId, page, pageSize });
  }

  GetMaleSemenSampleById(sampleId: number): Observable<any> {
    return this.api.get(`IVFMaleSemanAnalysis/GetSampleById/${sampleId}`);
  }

  DeleteMaleSemenSample(sampleId: number): Observable<any> {
    // Backend endpoint: IVFMaleSemanAnalysis/DeleteSample/{id}
    return this.api.delete(`IVFMaleSemanAnalysis/DeleteSample/${sampleId}`);
  }


    GetAllFemaleMedicalHistory(ivfMainId: number, page: number = 1, rowsPerPage: number = 10): Observable<any> {
    return this.api.get('IVFFertilityHistory/GetAllFemaleFertilityHistory', {
      ivfmainid: ivfMainId,
      page,
      rowsPerPage,
    });
  }

  CreateUpdateFemaleFertilityHistory(payload: any): Observable<any> {
    return this.api.post('IVFFertilityHistory/CreateUpdateFemaleFertilityHistory', payload);
  }

  GetFemaleFertilityHistoryById(ivfFemaleFHId: number): Observable<any> {
    return this.api.get('IVFFertilityHistory/GetFemaleFertilityHistoryById', { IVFFemaleFHId: ivfFemaleFHId });
  }

  DeleteFemaleFertilityHistory(ivfFemaleFHId: number): Observable<any> {
    return this.api.delete(`IVFFertilityHistory/DeleteFemaleFertilityHistory/${ivfFemaleFHId}`);
  }

  GetAllStrawColors(): Observable<any> {
    return this.api.get('IVFMaleCryoPreservation/GetAllStrawColors');
  }

  GetNextAvailableStorageSlot(): Observable<any> {
    return this.api.get('IVFMaleCryoPreservation/GetNextAvailableStorageSlot');
  }

  // Cryo Management dropdowns
  GetCryoContainersDropdown(): Observable<any> {
    return this.api.get('CryoManagement/containers/dropdown');
  }

  GetCryoLevelADropdown(containerId: number): Observable<any> {
    return this.api.get(`CryoManagement/levela/dropdown/${containerId}`);
  }

  GetCryoLevelBDropdown(levelAId: number): Observable<any> {
    return this.api.get(`CryoManagement/levelb/dropdown/${levelAId}`);
  }

  SearchCryoStorages(payload: any): Observable<any> {
    return this.api.post('CryoManagement/search', payload);
  }

  CreateCryoPreservation(payload: any): Observable<any> {
    return this.api.post('IVFMaleCryoPreservation/CreateCryoPreservation', payload);
  }

  GetCryoPreservationsBySampleId(sampleId: number): Observable<any> {
    return this.api.get(`IVFMaleCryoPreservation/GetCryoPreservationsBySampleId/${sampleId}`);
  }

  UpdateCryoPreservation(payload: any): Observable<any> {
    return this.api.put('IVFMaleCryoPreservation/UpdateCryoPreservation', payload);
  }


    GetFertilityHistoryForDashboard(ivfmainid: string): Observable<any> {
    return this.api.get(`IVFDashboard/GetFertilityHistoryForDashboard?ivfmainid=${ivfmainid}`);
  }

  CreateUpdateDashboardTreatmentCycle(payload: any): Observable<any> {
    return this.api.post('IVFDashboard/CreateUpdateDashboardTreatmentCycle', payload);
  }

  GetAllIVFDashboardTreatmentCycle(ivfmainid: number, page: number = 1, rowsPerPage: number = 10): Observable<any> {
    return this.api.get('IVFDashboard/GetAllIVFDashboardTreatmentCycle', { ivfmainid, page, rowsPerPage });
  }

    getIVFDashboardTreatmentCycle(ivfDashboardTreatmentCycleId: number): Observable<any> {
      return this.api.get(`IVFDashboard/GetIVFDashboardTreatmentCycle?ivfDashboardTreatmentCycleId=${ivfDashboardTreatmentCycleId}`);
    }
  
    deleteIVFDashboardTreatmentCycle(ivfDashboardTreatmentCycleId: number): Observable<any> {
      // Backend expects id via body or query; using POST for delete per given endpoint
      return this.api.delete(`IVFDashboard/DeleteIVFDashboardTreatmentCycle/${ivfDashboardTreatmentCycleId}`);
    }

    getOverviewByEpisodeId(episodeId: number): Observable<any> {
      return this.api.get(`Overview/get-all-Overview/${episodeId}`);
    }

    saveOverviewEvent(payload: {
      eventId: number;
      appId: number;
      categoryId: number;
      overviewId: number;
      startdate: string;
      enddate: string;
    }): Observable<any> {
      return this.api.post('Overview/event-save', payload);
    }

     // Add observations for a specific order set detail
  addLabOrderObservations(orderSetDetailId: number | string, body: any): Observable<any> {
    debugger
    return this.api.post(`IVFLabOrders/${orderSetDetailId}/observations`, body);
  }

  getPathologyResults(mrno: string | number, search?: string): Observable<any> {
    const params: any = {};
    if (search && search.trim()) {
      params.search = search.trim();
    }
    return this.api.get(`IVFLabOrders/pathology-results/${mrno}`, params);
  }

  // Overview Drugs
  getAllDrugs(page: number = 1, rowsPerPage: number = 10): Observable<any> {
    return this.api.post('Overview/getalldrugs', { page, rowsPerPage });
  }

  // Save selected drug to prescription master
  savePrescriptionMaster(body: { ivfPrescriptionMasterId: number; overviewId: number; drugId: number }): Observable<any> {
    return this.api.post('Overview/prescription-master-save', body);
  }

  // Save prescription with dates and appointment
  savePrescription(body: {
    ivfPrescriptionMasterId: number;
    drugId: number;
    appointmentId: number;
    startDate: string;
    endDate: string;
  }): Observable<any> {
    return this.api.post('Overview/prescription-save', body);
  }

  // Create or update episode aspiration
  saveEpisodeAspiration(body: any): Observable<any> {
    return this.api.post('IVFEpisodeAspiration/CreateUpdateEpisodeAspiration', body);
  }

  // Get episode aspiration by cycle id
  getEpisodeAspirationByCycleId(ivfDashboardTreatmentCycleId: number): Observable<any> {
    return this.api.get(`IVFEpisodeAspiration/GetEpisodeAspirationByCycleId?ivfDashboardTreatmentCycleId=${ivfDashboardTreatmentCycleId}`);
  }

  // New: collect sample for an entire order set (order-level)
  collectLabOrder(orderSetId: number | string, body: { collectDate: string; userId: number }): Observable<any> {
    return this.api.post(`IVFLabOrders/${orderSetId}/collect`, body);
  }

  // New: collect sample for a specific order set detail
  collectLabOrderDetail(orderSetDetailId: number | string, body: { CollectDate: string; UserId: number }): Observable<any> {
    return this.api.post(`IVFLabOrders/${orderSetDetailId}/collect`, body);
  }

  // New: mark an order as complete (flag only, no results payload)
  // Backend expects a raw numeric userId in the body (e.g. 4)
  markLabOrderComplete(orderSetId: number | string, userId: number): Observable<any> {
    return this.api.post(`IVFLabOrders/${orderSetId}/mark-complete`, userId);
  }


  // New: get full collection details for an order (per-test names, material)
  // Proposed endpoint; adjust when your backend is ready
  getOrderCollectionDetails(orderSetId: number | string): Observable<any> {
    return this.api.get(`IVFLabOrders/${orderSetId}/collection-details`);
  }

  // Cancel a lab order
  cancelLabOrder(orderSetId: number | string): Observable<any> {
    return this.api.post(`IVFLabOrders/${orderSetId}/cancel`, {});
  }
}