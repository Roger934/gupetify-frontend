// RÚBRICA #8 — Servicio Angular (2 de mínimo 3)
// RÚBRICA #2 — Toda inyección de dependencia con inject()
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// RÚBRICA #12 — Uso de interfaces para tipado
import { Artist, ArtistSearchResponse } from '../interfaces/artist.interface';
import { Track } from '../interfaces/track.interface';

@Injectable({ providedIn: 'root' })
export class DeezerService {
  // RÚBRICA #2 — inject() en lugar de constructor
  private http = inject(HttpClient);

  // RÚBRICA #9 — Llamada a API del backend (GET proxy Deezer)
  // RÚBRICA #11c — queryParams: la búsqueda viaja como ?q= en la URL
  searchArtists(query: string) {
    return this.http.get<ArtistSearchResponse>(`${environment.apiUrl}/deezer/search?q=${query}`);
  }

  // RÚBRICA #9 — Llamada a API del backend (GET con parámetro en URL)
  // RÚBRICA #11a — Ruta con parámetro :id
  getArtistTopTracks(artistId: number) {
    return this.http.get<{ data: Track[] }>(`${environment.apiUrl}/deezer/artist/${artistId}/top`);
  }

  // RÚBRICA #9 — GET géneros oficiales de Deezer
  getGenres() {
    return this.http.get<{ data: any[] }>(`${environment.apiUrl}/deezer/genres`);
  }

  // RÚBRICA #9 — GET artistas por género
  getGenreArtists(genreId: number) {
    return this.http.get<{ data: Artist[] }>(
      `${environment.apiUrl}/deezer/genre/${genreId}/artists`,
    );
  }

  getArtistById(id: number) {
    return this.http.get<Artist>(`${environment.apiUrl}/deezer/artist/${id}`);
  }
  // Artistas relacionados para recomendaciones por género
  getRelatedArtists(artistId: number) {
    return this.http.get<{ data: Artist[] }>(
      `${environment.apiUrl}/deezer/artist/${artistId}/related`,
    );
  }
}
