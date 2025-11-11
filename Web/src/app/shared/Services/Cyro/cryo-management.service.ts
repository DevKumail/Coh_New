import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryoContainerDto } from '@/app/shared/Models/Cyro/cyro-container.model';

@Injectable({ providedIn: 'root' })
export class CryoManagementService {

  constructor(private api: ApiService, private http: HttpClient) {}

  // Insert or Update Cryo Container
  saveContainer(container: CryoContainerDto): Observable<any> {
    return this.api.post('CryoManagement/InsertOrUpdate', container);
  }

  // Get all containers (with optional pagination)
  getAllContainers(pageNumber?: number, pageSize?: number): Observable<any> {
    let query = '';
    if (pageNumber != null && pageSize != null) {
      query = `?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    }
    return this.api.get(`CryoManagement/GetAllContainers${query}`);
  }

  // Get single container by ID
  getContainerById(containerId: number): Observable<CryoContainerDto> {
    return this.api.get(`CryoManagement/GetContainerById?ID=${containerId}`);
  }

  // Delete container by ID
  deleteContainer(containerId: number): Observable<any> {
    return this.api.delete(`CryoManagement/DeleteContainer?ID=${containerId}`);
  }

  // Additional helper endpoints for levels if needed

  getLevelADetails(containerId: number): Observable<any> {
    return this.api.get(`CryoManagement/GetLevelAByContainerId?ContainerID=${containerId}`);
  }

  getLevelBDetails(levelAId: number): Observable<any> {
    return this.api.get(`CryoManagement/GetLevelBByLevelAId?LevelAID=${levelAId}`);
  }

  getLevelCDetails(levelBId: number): Observable<any> {
    return this.api.get(`CryoManagement/GetLevelCByLevelBId?LevelBID=${levelBId}`);
  }

}
