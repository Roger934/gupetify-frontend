// RÚBRICA #8 — Servicio Angular (1 de mínimo 3)
// RÚBRICA #2 — Toda inyección de dependencia con inject()
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../interfaces/user.interface';
import { PlayerService } from './player.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // RÚBRICA #2 — inject()
  private http = inject(HttpClient);
  private router = inject(Router);
  private player = inject(PlayerService);

  private readonly TOKEN_KEY = 'gupetify_token';
  private readonly USER_KEY = 'gupetify_user';

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data);
  }

  saveSession(response: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
  }

  // RÚBRICA #11d — Navegación programática tras logout
  logout() {
    // Detener reproducción al cerrar sesión
    this.player.stop();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
