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
}