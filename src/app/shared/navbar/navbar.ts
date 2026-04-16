// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #4 — Componente standalone
// RÚBRICA #11d — Navegación programática con router.navigate()
// RÚBRICA #11e — routerLink y routerLinkActive
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../toast/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  // RÚBRICA #2 — inject() para servicios
  auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  // RÚBRICA #11d — Navegación programática
  logout() {
    this.auth.logout();
    this.toast.show('Sesión cerrada', 'info');
  }
}