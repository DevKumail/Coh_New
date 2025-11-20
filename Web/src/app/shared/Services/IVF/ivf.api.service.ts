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
}