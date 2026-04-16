// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11d — Navegación programática al detalle de playlist
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../core/services/playlist.service';
import { ToastService } from '../../shared/toast/toast';
import { Playlist } from '../../core/interfaces/playlist.interface';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './playlists.html',
  styleUrl: './playlists.css'
})
export class Playlists implements OnInit {

  // RÚBRICA #2 — inject()
  private playlistService = inject(PlaylistService);
  private router = inject(Router);
  private toast = inject(ToastService);

  playlists: Playlist[] = [];
  loading = false;
  showCreateModal = false;

  // RÚBRICA #7 — Two-way binding [(ngModel)]
  newName: string = '';
  newDescription: string = '';

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
  this.loading = true;
  this.playlistService.getPlaylists().subscribe({
    next: (res) => {
      this.playlists = res.playlists;
      this.loading = false;
    },
    error: () => {
      this.toast.show('Error al cargar playlists', 'error');
      this.loading = false;
    }
  });
}

  // RÚBRICA #9 — POST: crear playlist en MySQL
  createPlaylist() {
    if (!this.newName.trim()) return;

    this.playlistService.createPlaylist({
      name: this.newName,
      description: this.newDescription
    }).subscribe({
      next: () => {
        this.toast.show('Playlist creada', 'success');
        this.newName = '';
        this.newDescription = '';
        this.showCreateModal = false;
        this.loadPlaylists();
      },
      error: () => {
        this.toast.show('Error al crear playlist', 'error');
      }
    });
  }

  // RÚBRICA #9 — DELETE: eliminar playlist de MySQL
  deletePlaylist(id: number, event: Event) {
    event.stopPropagation();
    this.playlistService.deletePlaylist(id).subscribe({
      next: () => {
        this.toast.show('Playlist eliminada', 'success');
        this.loadPlaylists();
      },
      error: () => {
        this.toast.show('Error al eliminar playlist', 'error');
      }
    });
  }

  // RÚBRICA #11d — Navegación programática
  goToPlaylist(id: number) {
    this.router.navigate(['/playlists', id]);
  }

  closeModal() {
    this.showCreateModal = false;
    this.newName = '';
    this.newDescription = '';
  }


  // Genera un color único por playlist basado en su ID
// Rellena hasta 4 portadas repitiendo las existentes
getCovers(covers: string[]): string[] {
  if (covers.length === 0) return [];
  const result: string[] = [];
  for (let i = 0; i < 4; i++) {
    result.push(covers[i % covers.length]);
  }
  return result;
}
}