import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


interface Facility {
  employeeId: number;
  facilityId: number;
  companyId: number;
  companyName: string;
  facilityName: string;
}

interface LoginResponse {
  token: string;
  userId: number;
  userName: string;
  empId: number;
  success: boolean;
  allowscreens: string[];
  facilities: Facility[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  private readonly baseUrl = environment.apiUrl;



  constructor(private http: HttpClient,private router: Router) {}

   login(username: string, password: string): Observable<void> {
      // debugger
     const headers = new HttpHeaders({
  'Content-Type': 'application/json-patch+json'
});
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/AuthenticateToken/Login`, { name: username,
  password: password },
 { headers })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          sessionStorage.setItem('userName', res.userName);
          sessionStorage.setItem('userId', res.userId.toString());
          sessionStorage.setItem('empId', res.empId.toString());
          sessionStorage.setItem('facilities', JSON.stringify(res.facilities));
          sessionStorage.setItem('allowscreens', JSON.stringify(res.allowscreens));
        }),
        map(() => void 0)
      );
  }



logout(): Observable<any> {
    // debugger
     const token = localStorage.getItem(this.tokenKey);
    
    localStorage.removeItem(this.tokenKey);
    sessionStorage.clear();

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
    });

    return this.http.post(`${this.baseUrl}/AuthenticateToken/Logout`, {}, { headers }).pipe(
        tap({
            next: () => {
                console.log('Logout API call successful');
                this.forceRedirect();
            },
            error: (err) => {
                console.error('Logout API error:', err);
                this.forceRedirect();
            }
        }),
        catchError(err => {
            this.forceRedirect();
            return throwError(() => err);
        })
    );
}

private forceRedirect(): void {
    this.router.navigate(['/auth-2/sign-in']).then(() => {
        //window.location.reload();
    });
}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = payload.exp * 1000;
  return Date.now() > expiry;
}
  
  isAuthenticated(): boolean {
  const token = this.getToken();
  return !!token && !this.isTokenExpired();
}
}
