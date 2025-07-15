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

  MyDiagnosisCodebyProvider(ProviderId:number,GroupId:number |null ,ICDVersionId:number | null) {
    return this.api.get(`ChargeCapture/MyDiagnosisCode?ProviderId=${ProviderId}&GroupId=${GroupId}&ICDVersionId=${ICDVersionId}`).toPromise();
  }

}