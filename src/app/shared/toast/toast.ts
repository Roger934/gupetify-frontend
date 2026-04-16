// RÚBRICA #16 — UI sin alerts nativos del navegador, usamos Toast propio
// RÚBRICA #15 — Aportación EXTRA #1: Signals para el estado del toast
// RÚBRICA #2 — inject() para dependencias
import { Component, Injectable, inject } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {

  // RÚBRICA #15 — Signals: estado reactivo del mensaje
  message = signal<string>('');
  type = signal<'success' | 'error' | 'info'>('info');
  visible = signal<boolean>(false);

  private timer: any;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    clearTimeout(this.timer);
    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);

    this.timer = setTimeout(() => {
      this.visible.set(false);
    }, 3000);
  }

  hide() {
    this.visible.set(false);
  }
}

// RÚBRICA #4 — Componente standalone
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `
    @if (toast.visible()) {
      <div
        class="fixed bottom-28 right-6 z-50 px-5 py-3 rounded-xl shadow-lg
               flex items-center gap-3 transition-all duration-300 min-w-64"
        [class]="toastClass()">

        <!-- RÚBRICA #7 — Property binding [class] -->
        @if (toast.type() === 'success') {
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        }
        @if (toast.type() === 'error') {
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        }
        @if (toast.type() === 'info') {
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        }

        <!-- RÚBRICA #7 — Interpolación {{ }} -->
        <p class="text-sm font-medium">{{ toast.message() }}</p>

        <!-- RÚBRICA #7 — Event binding (click) -->
        <button
          (click)="toast.hide()"
          class="ml-auto opacity-70 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

      </div>
    }
  `
})
export class Toast {

  // RÚBRICA #2 — inject()
  toast = inject(ToastService);

  toastClass(): string {
    const types = {
      success: 'bg-green-800 text-green-100',
      error:   'bg-red-800 text-red-100',
      info:    'bg-[#1A1A1A] text-white border border-[#535353]'
    };
    return types[this.toast.type()];
  }
}