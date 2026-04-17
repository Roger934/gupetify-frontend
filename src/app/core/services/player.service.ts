// RÚBRICA #8 — Servicio Angular (4to servicio, superamos el mínimo)
// RÚBRICA #2 — Toda inyección de dependencia con inject()
// RÚBRICA #15 — Aportación EXTRA #1: Angular Signals
import { Injectable, signal, computed, inject } from '@angular/core';

// RÚBRICA #12 — Uso de interfaces para tipado
import { Track } from '../interfaces/track.interface';
import { PlaylistSong } from '../interfaces/playlist.interface';
import { DeezerService } from './deezer.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  // RÚBRICA #2 — inject()
  private deezer = inject(DeezerService);
  // RÚBRICA #15 — Signals: estado reactivo global del reproductor
  // Cualquier componente que los lea se actualiza automáticamente
  currentTrack = signal<Track | PlaylistSong | null>(null);
  isPlaying = signal<boolean>(false);
  progress = signal<number>(0);
  volume = signal<number>(this.getSavedVolume());

  private getSavedVolume(): number {
    const saved = localStorage.getItem('gupetify_volume');
    return saved ? parseFloat(saved) : 0.5; // default 50%
  }

  // RÚBRICA #15 — computed(): valor derivado de otros signals
  // Se recalcula automáticamente cuando currentTrack cambia
  hasTrack = computed(() => this.currentTrack() !== null);

  // Elemento de audio nativo HTML5
  private audio = new Audio();

  constructor() {
    // Aplicar volumen guardado al iniciar
    this.audio.volume = this.getSavedVolume();
    // Actualiza el progreso en tiempo real mientras reproduce
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration) {
        this.progress.set(this.audio.currentTime / this.audio.duration);
      }
    });

    // Cuando termina la canción, pasa a la siguiente de la queue
    this.audio.addEventListener('ended', () => {
      this.playNext();
    });
  }

  // Recibe tanto Track (Deezer) como PlaylistSong (MySQL)
  play(track: Track | PlaylistSong) {
    if (this.currentTrack() === track) {
      this.togglePlay();
      return;
    }

    this.currentTrack.set(track);
    this.isPlaying.set(false);
    this.progress.set(0);

    if ('preview' in track) {
      // Track de Deezer — URL siempre fresca
      this.audio.src = track.preview;
      this.audio.volume = this.volume();
      this.audio.play();
      this.isPlaying.set(true);
    } else {
      // PlaylistSong — pedir URL fresca por deezer_id
      this.deezer.getTrackPreview(track.deezer_id).subscribe({
        next: (res) => {
          this.audio.src = res.preview;
          this.audio.volume = this.volume();
          this.audio.play();
          this.isPlaying.set(true);
        },
        error: () => {
          // Si falla, intentar con la URL guardada
          this.audio.src = track.preview_url;
          this.audio.volume = this.volume();
          this.audio.play();
          this.isPlaying.set(true);
        },
      });
    }
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying.set(!this.isPlaying());
  }

  seek(value: number) {
    if (this.audio.duration) {
      this.audio.currentTime = value * this.audio.duration;
      this.progress.set(value);
    }
  }

  setVolume(value: number) {
    this.audio.volume = value;
    this.volume.set(value);
    // Guardar preferencia en localStorage
    localStorage.setItem('gupetify_volume', value.toString());
  }

  stop() {
    this.audio.pause();
    this.audio.src = '';
    this.currentTrack.set(null);
    this.isPlaying.set(false);
    this.progress.set(0);
  }

  // Helper para obtener el título sin importar el tipo de track
  getTitle(track: Track | PlaylistSong): string {
    return track.title;
  }

  // Helper para obtener el nombre del artista sin importar el tipo
  getArtistName(track: Track | PlaylistSong): string {
    return 'artist' in track ? track.artist.name : track.artist_name;
  }

  // Helper para obtener la imagen sin importar el tipo
  getCover(track: Track | PlaylistSong): string {
    return 'album' in track ? track.album.cover_medium : track.cover_url;
  }

  // RÚBRICA #15 — Signals: queue de reproducción
  queue = signal<(Track | PlaylistSong)[]>([]);
  queueIndex = signal<number>(0);

  setQueue(songs: (Track | PlaylistSong)[], startIndex: number = 0) {
    this.queue.set(songs);
    this.queueIndex.set(startIndex);
  }

  // Autoplay — pasa a la siguiente canción automáticamente
  private playNext() {
    const songs = this.queue();
    const nextIndex = this.queueIndex() + 1;
    if (nextIndex < songs.length) {
      this.queueIndex.set(nextIndex);
      this.play(songs[nextIndex]);
    } else {
      // Fin de la queue
      this.isPlaying.set(false);
      this.progress.set(0);
    }
  }

  playPrevious() {
    const songs = this.queue();
    const prevIndex = this.queueIndex() - 1;
    if (prevIndex >= 0) {
      this.queueIndex.set(prevIndex);
      this.play(songs[prevIndex]);
    } else {
      // Si es la primera canción, reinicia desde el inicio
      this.audio.currentTime = 0;
      this.progress.set(0);
    }
  }

  playNextManual() {
    const songs = this.queue();
    const nextIndex = this.queueIndex() + 1;
    if (nextIndex < songs.length) {
      this.queueIndex.set(nextIndex);
      this.play(songs[nextIndex]);
    }
  }
}
