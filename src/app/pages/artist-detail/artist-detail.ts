// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11b — paramMap para leer :id de la URL
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeezerService } from '../../core/services/deezer.service';
import { PlayerService } from '../../core/services/player.service';
import { TrackCard } from '../../shared/track-card/track-card';
import { Artist } from '../../core/interfaces/artist.interface';
import { Track } from '../../core/interfaces/track.interface';
import { ToastService } from '../../shared/toast/toast';
import { PlaylistService } from '../../core/services/playlist.service';
import { Playlist } from '../../core/interfaces/playlist.interface';
import { AuthService } from '../../core/services/auth.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [TrackCard, DecimalPipe],
  templateUrl: './artist-detail.html',
  styleUrl: './artist-detail.css',
})
export class ArtistDetail implements OnInit {
  // RÚBRICA #2 — inject()
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private deezer = inject(DeezerService);
  private toast = inject(ToastService);
  private playlistService = inject(PlaylistService);
  auth = inject(AuthService);
  player = inject(PlayerService);

  artist: Artist | null = null;
  tracks: Track[] = [];
  playlists: Playlist[] = [];
  loading = false;
  loadingTracks = false;
  showPlaylistModal = false;
  selectedTrack: Track | null = null;
  relatedArtists: Artist[] = [];

  ngOnInit() {
    // RÚBRICA #11b — paramMap: lee :id de la URL /artist/:id
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadArtist(id);
        this.loadTracks(id);
        this.loadRelatedArtists(id);
      }
    });
  }

  loadArtist(id: number) {
    this.loading = true;
    // Ahora sí trae el artista correcto por ID directo
    this.deezer.getArtistById(id).subscribe({
      next: (artist) => {
        this.artist = artist;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadTracks(id: number) {
    this.loadingTracks = true;
    this.deezer.getArtistTopTracks(id).subscribe({
      next: (res) => {
        this.tracks = res.data;
        this.loadingTracks = false;
      },
      error: () => {
        this.toast.show('Error al cargar canciones', 'error');
        this.loadingTracks = false;
      },
    });
  }

  loadRelatedArtists(id: number) {
    this.deezer.getRelatedArtists(id).subscribe({
      next: (res) => (this.relatedArtists = res.data.slice(0, 6)),
      error: () => {},
    });
  }

  // Abre modal para agregar canción a playlist
  openAddToPlaylist(track: Track) {
    if (!this.auth.isLoggedIn()) {
      this.toast.show('Inicia sesión para agregar a playlist', 'info');
      this.router.navigate(['/login']);
      return;
    }
    this.selectedTrack = track;
    this.showPlaylistModal = true;
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (res) => (this.playlists = res.playlists),
      error: () => this.toast.show('Error al cargar playlists', 'error'),
    });
  }

  addToPlaylist(playlist: Playlist) {
    if (!this.selectedTrack) return;
    const track = this.selectedTrack;

    this.playlistService
      .addSong(playlist.id, {
        deezer_id: track.id,
        title: track.title,
        artist_name: track.artist.name,
        album_title: track.album.title,
        preview_url: track.preview,
        cover_url: track.album.cover_medium,
        duration: track.duration,
      })
      .subscribe({
        next: () => {
          this.toast.show(`Agregada a ${playlist.name}`, 'success');
          this.showPlaylistModal = false;
          this.selectedTrack = null;
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Error al agregar canción', 'error');
        },
      });
  }

  closeModal() {
    this.showPlaylistModal = false;
    this.selectedTrack = null;
  }

  // RÚBRICA #11d — Navegación programática
  goBack() {
    this.router.navigate(['/explore']);
  }
}
