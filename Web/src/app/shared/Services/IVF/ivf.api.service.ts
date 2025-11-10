import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IVFApiService {
  constructor(private api: ApiService) {}

  getCoupleData(mrno: string): Observable<any> {
    return this.api.get(`IVFDashboard/GetCoupleData?mrno=${mrno}`);
  }
}