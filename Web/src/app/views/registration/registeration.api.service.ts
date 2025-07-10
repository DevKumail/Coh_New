import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistrationApiService {
    constructor(private api: ApiService) { }

    getAllPatients(): Observable<any> {
        return this.api.get('/api/patients');
    }

    getPatientById(id: string): Observable<any> {
        return this.api.get(`/api/patients/${id}`);
    }

    createPatient(data: any): Observable<any> {
        return this.api.post('/api/patients', data);
    }

    updatePatient(id: string, data: any): Observable<any> {
        return this.api.put(`/api/patients/${id}`, data);
    }

    deletePatient(id: string): Observable<any> {
        return this.api.delete(`/api/patients/${id}`);
    }
    SubmitAlertType(data: any): Observable<any> {
        debugger
        return this.api.post(`Alert/SubmitAlertType`, data);
    }
    GetPatientAlertsData(mrno: string): Promise<any> {
        debugger
        return this.api.get(`Alert/GetPatientAlertsData?mrno=${mrno}`).toPromise();

    }
    GetAlertType(): Promise<any> {
        return this.api.get('AllDropdowns/GetAlertType').toPromise(); // ✅ No /api
    }


}