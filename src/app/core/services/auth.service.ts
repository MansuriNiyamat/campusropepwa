import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { IUser } from '../models/user';

const USER_TOKEN = 'USER_TOKEN';

export interface AuthState {
  loggedUser: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

let _state: AuthState = {
  loggedUser: null,
  isAuthenticated: false,
  loading: false
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private store = new BehaviorSubject<AuthState>(_state);
  private state$ = this.store.asObservable();

  loggedUser$ = this.state$.pipe(
    map(state => state.loggedUser),
    distinctUntilChanged()
  );
  isAuthenticated$ = this.state$.pipe(
    map(state => state.isAuthenticated),
    distinctUntilChanged()
  );
  loading$ = this.state$.pipe(map(state => state.loading));

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  getStateSnapshot(): AuthState {
    return { ..._state };
  }

  requestGoogleRedirectUri(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/auth/google/uri`);
  }

  googleSignIn(code: string): Observable<any> {
    return this.httpClient.post('api/auth/google/signin', { code });
  }

  getToken(): string {
    try {
      return this.localStorageService.getItem(USER_TOKEN);
    } catch (e) {
      return null;
    }
  }

  setToken(token: string) {
    this.localStorageService.setItem(USER_TOKEN, token);
  }

  logout() {
    this.localStorageService.clear();
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
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }

  private updateState(state: AuthState) {
    this.store.next((_state = state));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
