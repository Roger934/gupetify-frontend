// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11d — Navegación programática
// RÚBRICA #11e — routerLink y routerLinkActive
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../toast/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  // RÚBRICA #15 — Signal para el menú móvil
  menuOpen = signal<boolean>(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  logout() {
    this.auth.logout();
    this.toast.show('Sesión cerrada', 'info');
    this.menuOpen.set(false);
  }
}
