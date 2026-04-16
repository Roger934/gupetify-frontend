// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #13 — Formulario template-driven
// RÚBRICA #11d — Navegación programática tras login exitoso
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // RÚBRICA #2 — inject()
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  // RÚBRICA #13 — Modelo del formulario template-driven
  // RÚBRICA #7 — Two-way binding con [(ngModel)]
  email: string = '';
  password: string = '';
  loading: boolean = false;

  // RÚBRICA #11d — Navegación programática tras login
  onSubmit() {
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.auth.saveSession(res);
        this.toast.show(`Bienvenido ${res.user.username}`, 'success');
        // RÚBRICA #11d — Navegación programática
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Credenciales incorrectas', 'error');
        this.loading = false;
      }
    });
  }
}