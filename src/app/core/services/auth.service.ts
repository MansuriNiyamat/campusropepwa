import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const USER_TOKEN = 'USER_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedUser = new BehaviorSubject({});
  public loggedUser$ = this.loggedUser.asObservable();

  constructor(
    private readonly httpClient: HttpClient,
    private router: Router
  ) {}

  requestGoogleRedirectUri(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/auth/google/uri`);
  }

  googleSignIn(code: string): Observable<any> {
    return this.httpClient.post('api/auth/google/signin', { code });
  }

  getToken(): string {
    try {
      return localStorage.getItem(USER_TOKEN);
    } catch (e) {
      return null;
    }
  }

  setToken(token: string) {
    localStorage.setItem(USER_TOKEN, token);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  loginWithCredentials(credentials: { email: string; password: string }) {
    this.httpClient
      .post('api/auth/local', {
        identifier: credentials.email,
        password: credentials.password
      })
      .pipe(
        tap((res: any) => {
          this.setToken(res.jwt);
          this.loggedUser.next(res.user);
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
