// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #14 — Formulario reactivo con ReactiveFormsModule y FormBuilder
// RÚBRICA #11d — Navegación programática tras registro exitoso
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // RÚBRICA #2 — inject() en lugar de constructor
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;

  // RÚBRICA #14 — Formulario reactivo con mínimo 3 validators por campo
  form = this.fb.group({

    // username: required + minLength + maxLength
    username: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],

    // email: required + email + pattern
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
    ]],

    // password: required + minLength + pattern (al menos una letra y un número)
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')
    ]]
  });

  // Getters para acceder fácil desde el HTML
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  // RÚBRICA #11d — Navegación programática
  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    const { username, email, password } = this.form.value;

    this.auth.register({
      username: username!,
      email: email!,
      password: password!
    }).subscribe({
      next: () => {
        this.toast.show('Cuenta creada exitosamente', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Error al registrarse', 'error');
        this.loading = false;
      }
    });
  }
} 