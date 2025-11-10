import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IvfSearchService {
  private searchSubject = new Subject<string>();

  publishSearch(mrNo: string) {
    this.searchSubject.next(mrNo);
  }

  get search$(): Observable<string> {
    return this.searchSubject.asObservable();
  }
}
