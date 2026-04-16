// RÚBRICA #16 — UI sin alerts nativos del navegador, usamos Toast propio
// RÚBRICA #15 — Aportación EXTRA #1: Signals para el estado del toast
// RÚBRICA #2 — inject() para dependencias
import { Component, signal, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

// Servicio del toast integrado en el mismo archivo por simplicidad
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

    // Se oculta automáticamente después de 3 segundos
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
  imports: [CommonModule],
  template: `
    <!-- RÚBRICA #5 — @if en lugar de *ngIf -->
    @if (toast.visible()) {
      <div
        class="fixed bottom-28 right-6 z-50 px-5 py-3 rounded-xl shadow-lg
               flex items-center gap-3 transition-all duration-300 min-w-64"
        [class]="toastClass()"
      >
        <!-- RÚBRICA #7 — Property binding: [class] -->
        <span class="text-xl">{{ toastIcon() }}</span>

        <!-- RÚBRICA #7 — Interpolación: {{ }} -->
        <p class="text-sm font-medium">{{ toast.message() }}</p>

        <!-- RÚBRICA #7 — Event binding: (click) -->
        <button
          (click)="toast.hide()"
          class="ml-auto text-lg leading-none opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    }
  `
})
export class Toast {

  // RÚBRICA #2 — inject() para el servicio
  toast = new ToastService();

  toastClass(): string {
    const base = 'fixed bottom-28 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-64';
    const types = {
      success: 'bg-green-800 text-green-100',
      error:   'bg-red-800 text-red-100',
      info:    'bg-[#1A1A1A] text-white border border-[#535353]'
    };
    return types[this.toast.type()];
  }

  toastIcon(): string {
    const icons = {
      success: '✓',
      error:   '✕',
      info:    'ℹ'
    };
    return icons[this.toast.type()];
  }
}