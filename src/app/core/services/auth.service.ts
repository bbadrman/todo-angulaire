import { inject, Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface AuthUser {
  id: number | string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private API = 'http://127.0.0.1:8000/auth';

  // état utilisateur
  private _user = signal<AuthUser | null>(null);

  user = computed(() => this._user());
  isLoggedIn = computed(() => this._user() !== null);

  // pour plus tard : on pourrait charger depuis localStorage ici
  constructor() {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.API}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res.success && res.user) {
            this._user.set(res.user);
            // pour persister : localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
      );
  }

  logout() {
    this._user.set(null);
    // localStorage.removeItem('user');
  }
}
