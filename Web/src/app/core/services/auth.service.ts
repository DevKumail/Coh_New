import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError, switchMap, from, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';
import { AuthStoreService } from './auth-store.service';

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

  constructor(
    private api: ApiService,
    private router: Router,
    private permissionService: PermissionService,
    private authStore: AuthStoreService
  ) {}

  login(username: string, password: string): Observable<void> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json'
    });
    return this.api
      .post<LoginResponse>(`AuthenticateToken/Login`, { name: username, password: password })
      .pipe(
        // IMPORTANT: await RxDB save to avoid race with interceptors
        switchMap((res) => from(this.authStore.saveLoginResponse(res)).pipe(
          // Even if RxDB save fails, proceed to next to allow routing
          catchError(() => of(null)),
          tap(() => {
            // Refresh permissions regardless
            this.permissionService.refreshPermissions();
          }),
          map(() => void 0)
        ))
      );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    localStorage.removeItem(this.tokenKey);
    sessionStorage.clear();
    // Clear RxDB session (fire-and-forget)
    void this.authStore.clearSession();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });

    return this.api.post(`AuthenticateToken/Logout`, {}).pipe(
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
    // Use in-memory cached token populated by AuthStoreService
    return this.authStore.getTokenCached();
  }

  // For async callers that can await DB hydration
  async getTokenAsync(): Promise<string | null> {
    return this.authStore.getTokenFromDb();
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
