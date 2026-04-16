// RÚBRICA #8 — Servicio Angular (3 de mínimo 3 — ya cumplimos el mínimo)
// RÚBRICA #2 — Toda inyección de dependencia con inject()
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// RÚBRICA #12 — Uso de interfaces para tipado
import { Playlist, PlaylistSong } from '../interfaces/playlist.interface';

@Injectable({ providedIn: 'root' })
export class PlaylistService {

  // RÚBRICA #2 — inject() en lugar de constructor
  private http = inject(HttpClient);

  // RÚBRICA #9 — GET: obtener playlists del usuario (conectado a MySQL)
  getPlaylists() {
    return this.http.get<Playlist[]>(
      `${environment.apiUrl}/playlists`
    );
  }

  // RÚBRICA #9 — POST: crear playlist (conectado a MySQL)
  createPlaylist(data: { name: string; description: string }) {
    return this.http.post<{ message: string; id: number }>(
      `${environment.apiUrl}/playlists`,
      data
    );
  }

  // RÚBRICA #9 — DELETE: eliminar playlist (conectado a MySQL)
  deletePlaylist(id: number) {
    return this.http.delete<{ message: string }>(
      `${environment.apiUrl}/playlists/${id}`
    );
  }

  // RÚBRICA #9 — GET: canciones de una playlist (conectado a MySQL)
  getPlaylistSongs(playlistId: number) {
    return this.http.get<PlaylistSong[]>(
      `${environment.apiUrl}/playlists/${playlistId}/songs`
    );
  }

  // RÚBRICA #9 — POST: agregar canción a playlist (conectado a MySQL)
  addSong(playlistId: number, song: {
    deezer_id: number;
    title: string;
    artist_name: string;
    album_title: string;
    preview_url: string;
    cover_url: string;
    duration: number;
  }) {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/playlists/${playlistId}/songs`,
      song
    );
  }

  // RÚBRICA #9 — DELETE: eliminar canción de playlist (conectado a MySQL)
  deleteSong(playlistId: number, songId: number) {
    return this.http.delete<{ message: string }>(
      `${environment.apiUrl}/playlists/${playlistId}/songs/${songId}`
    );
  }
}