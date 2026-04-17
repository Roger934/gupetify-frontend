// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #13 — Formulario template-driven
// RÚBRICA #11d — Navegación programática tras login exitoso
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // RÚBRICA #2 — inject()
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private player = inject(PlayerService);

  // RÚBRICA #13 — Modelo del formulario template-driven
  // RÚBRICA #7 — Two-way binding con [(ngModel)]
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  // RÚBRICA #11d — Navegación programática tras login
  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveSession(res);
        this.player.stop();
        this.toast.show(`Bienvenido ${res.user.username}`, 'success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        // ← error inline, sin toast
        this.errorMessage = err.error?.message || 'Credenciales incorrectas';
        this.loading = false;
      },
    });
  }
}
