import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { AlertDTO } from '@/app/shared/models/alert.model';
// import { AlertType } from '@/app/shared/models/alert-type.model';


@Injectable({ providedIn: 'root' })
export class SummarySheetApiService {
    constructor(private api: ApiService, private http: HttpClient) { }

  GetMedHistoryList(MRNo : number,Page : number,RowsPerPage : number){
     
    return this.api.get(`SummarySheet/GetMedicalHistoryList?MRNo=${MRNo}&PageNumber=${Page}&PageSize=${RowsPerPage}`).toPromise();
  }

  GetPatientProblemList(MRNo : number , Page : number,RowsPerPage : number){
     
    return this.api.get(`SummarySheet/GetPatientProblemList?MRNo=${MRNo}&PageNumber=${Page}&PageSize=${RowsPerPage}`).toPromise();
}

}
