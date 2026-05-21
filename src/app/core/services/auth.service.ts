import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserRole } from '@core/enums/user-role.enum';
import { JwtDecoded, LoginResponse, RegisterData } from '@core/models/auth.interface';
import { environment } from '@env';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

  private readonly _apiUrl = environment.apiURL;

  private _authToken = signal<string>('');
  authToken = this._authToken.asReadonly();
  private _role = signal<UserRole | null>(null);
  role = this._role.asReadonly();

  isAdmin = computed<boolean>(() => {
    return this.role() === UserRole.Admin;
  });
  isConnected = computed<boolean>(() => !!this.authToken());

  constructor() {
    effect(() => {
      const token = this._authToken();
      if (!token) {
        localStorage.removeItem('token');
        this._role.set(null);
        return;
      }
      localStorage.setItem('token', token);

      const decoded = jwtDecode<JwtDecoded>(token);
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        this._role.set((decoded.role as UserRole) ?? UserRole.Client);
      } else {
        this._authToken.set('');
      }
    });

    const localToken = localStorage.getItem('token');
    if (localToken) {
      this._authToken.set(localToken);
    }
  }

  async login(username: string, password: string, reCAPTCHAToken: string): Promise<void> {
    // appel API
    const response = await firstValueFrom(
      this._httpClient.post<LoginResponse>(this._apiUrl + '/auth/login', {
        username: username,
        password: password,
        reCAPTCHAToken,
      }),
    );

    this._authToken.set(response.accessToken);
  }

  async register(userData: RegisterData): Promise<void> {
    await firstValueFrom(this._httpClient.post(this._apiUrl + '/auth/register', userData));
  }

  logout() {
    this._authToken.set('');
  }
}
