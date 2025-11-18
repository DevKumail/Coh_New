import { Injectable } from '@angular/core';
import { ApiService } from '@/app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  constructor(private api: ApiService) {}


  getDropDownValuesByName(name: string): Observable<any> {
    return this.api.get(`DropDownLookUp/GetDropDownValuesByName?page=${name}`);
  }

    getCacheItem(object: any): Observable<any> {
    return this.api.post('Cache/GetCache', object);
  }


} 