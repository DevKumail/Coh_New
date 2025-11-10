import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, switchMap } from "rxjs";
import { AuthStoreService } from "@core/services/auth-store.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authStore: AuthStoreService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Legacy localStorage approach (commented):
    // const token = localStorage.getItem('access_token') || this.authService.getToken();
    // if (token) { req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }); }
    // return next.handle(req);

    return from(this.authStore.getTokenFromDb()).pipe(
      switchMap((token) => {
        if (token) {
          const cloned = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
