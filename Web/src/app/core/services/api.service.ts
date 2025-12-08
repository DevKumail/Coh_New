// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class ApiService {
//   constructor(private http: HttpClient) {}

//   get<T>(url: string, params?: HttpParams | any): Observable<T> {
//     return this.http.get<T>(url, { params });
//   }

//   post<T>(url: string, body: any): Observable<T> {
//     return this.http.post<T>(url, body);
//   }

//   put<T>(url: string, body: any): Observable<T> {
//     return this.http.put<T>(url, body);
//   }

//   delete<T>(url: string): Observable<T> {
//     return this.http.delete<T>(url);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
 
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, params?: any): Observable<T> {

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }

  // Some backends expect a DELETE request with a body payload
  deleteWithBody<T>(endpoint: string, body: any): Observable<T> {
    return this.http.request<T>('DELETE', `${this.baseUrl}/${endpoint}`, { body });
  }
}
