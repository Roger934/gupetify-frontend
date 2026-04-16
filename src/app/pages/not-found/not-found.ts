// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11d — Navegación programática al home
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {
  // RÚBRICA #2 — inject()
  private router = inject(Router);

  // RÚBRICA #11d — Navegación programática
  goHome() {
    this.router.navigate(['/']);
  }
}