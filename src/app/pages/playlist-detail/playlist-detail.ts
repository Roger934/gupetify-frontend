// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11b — paramMap para leer :id de la URL
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../core/services/playlist.service';
import { PlayerService } from '../../core/services/player.service';
import { ToastService } from '../../shared/toast/toast';
import { TrackCard } from '../../shared/track-card/track-card';
import { Playlist, PlaylistSong } from '../../core/interfaces/playlist.interface';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [TrackCard],
  templateUrl: './playlist-detail.html',
  styleUrl: './playlist-detail.css'
})
export class PlaylistDetail implements OnInit {

  // RÚBRICA #2 — inject()
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playlistService = inject(PlaylistService);
  private toast = inject(ToastService);
  player = inject(PlayerService);

  playlist: Playlist | null = null;
  songs: PlaylistSong[] = [];
  loading = false;

  ngOnInit() {
    // RÚBRICA #11b — paramMap: lee :id de la URL /playlists/:id
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.loadPlaylist(id);
    });
  }

  loadPlaylist(id: number) {
    this.loading = true;

    // Cargamos playlists del usuario para encontrar la actual
    this.playlistService.getPlaylists().subscribe({
      next: (res) => {
        this.playlist = res.playlists.find(p => p.id === id) || null;
        this.loadSongs(id);
      },
      error: () => {
        this.toast.show('Error al cargar playlist', 'error');
        this.loading = false;
      }
    });
  }

  loadSongs(playlistId: number) {
  this.playlistService.getPlaylistSongs(playlistId).subscribe({
    next: (res) => {
      this.songs = res.songs;
      this.loading = false;
    },
    error: () => {
      this.toast.show('Error al cargar canciones', 'error');
      this.loading = false;
    }
  });
}

  // Reproduce toda la playlist desde una canción
  // Aquí implementamos el autoplay queue
  playFromIndex(index: number) {
    if (this.songs.length === 0) return;
    const song = this.songs[index];

    // Cargamos la queue completa en el PlayerService
    this.player.setQueue(this.songs, index);
    this.player.play(song);
  }

  deleteSong(songId: number) {
    const playlistId = Number(this.route.snapshot.paramMap.get('id'));

    this.playlistService.deleteSong(playlistId, songId).subscribe({
      next: () => {
        this.toast.show('Canción eliminada', 'success');
        this.loadSongs(playlistId);
      },
      error: () => {
        this.toast.show('Error al eliminar canción', 'error');
      }
    });
  }

  // Rellena hasta 4 portadas repitiendo las existentes
getCovers(covers: string[]): string[] {
  if (covers.length === 0) return [];
  const result: string[] = [];
  for (let i = 0; i < 4; i++) {
    result.push(covers[i % covers.length]);
  }
  return result;
}

  // RÚBRICA #11d — Navegación programática
  goBack() {
    this.router.navigate(['/playlists']);
  }

  get coverImage(): string | null {
  return this.songs.length > 0 ? this.songs[0].cover_url : null;
}
}