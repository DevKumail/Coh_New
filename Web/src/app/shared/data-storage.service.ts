import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private storageKeyPrefix = 'myApp_';

  private showSubject = new BehaviorSubject<boolean>(false);
  show$ = this.showSubject.asObservable();

  private searchDataSubject = new BehaviorSubject<any>(null);
  searchData$ = this.searchDataSubject.asObservable();

  constructor() {}

  // Data set karna + sessionStorage mein save karna
  setData(key: string, value: any): void {
    const dataString = JSON.stringify(value);
    sessionStorage.setItem(this.storageKeyPrefix + key, dataString);
  }

  // sessionStorage se data get karna
  getData(key: string): any {
    const dataString = sessionStorage.getItem(this.storageKeyPrefix + key);
    try {
      return dataString ? JSON.parse(dataString) : null;
    } catch (e) {
      console.error('Invalid JSON in sessionStorage', e);
      return null;
    }
  }

  // Ek specific key ka data remove karna
  clearData(key: string): void {
    sessionStorage.removeItem(this.storageKeyPrefix + key);
  }

  // Saara sessionStorage clear karna (sirf app-specific keys)
  clearAll(): void {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(this.storageKeyPrefix)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  setSearchData(data: any): void {
    this.searchDataSubject.next(data);
  }

  toggleShow(value: boolean) {
    this.showSubject.next(value);
  }
}
