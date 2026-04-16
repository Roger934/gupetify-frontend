// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #10 — @Input y @Output en contexto lógico
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Track } from '../../core/interfaces/track.interface';
import { PlaylistSong } from '../../core/interfaces/playlist.interface';
import { PlayerService } from '../../core/services/player.service';
import { DurationPipe } from '../../core/pipes/duration.pipe';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [DurationPipe],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css'
})
export class TrackCard {

  // RÚBRICA #10 — @Input: recibe la canción desde el componente padre
  @Input() track!: Track | PlaylistSong;

  // RÚBRICA #10 — @Input: controla si muestra botón de agregar a playlist
  @Input() showAddButton: boolean = false;

  // RÚBRICA #10 — @Output: emite la canción cuando el padre quiere agregarla
  @Output() onAddToPlaylist = new EventEmitter<Track | PlaylistSong>();

  // RÚBRICA #2 — inject()
  player = inject(PlayerService);

  // Helpers para manejar ambos tipos de track
  get title(): string {
    return this.track.title;
  }

  get artistName(): string {
    return 'artist' in this.track ? this.track.artist.name : this.track.artist_name;
  }

  get cover(): string {
    return 'album' in this.track ? this.track.album.cover_medium : this.track.cover_url;
  }

  get duration(): number {
    return this.track.duration;
  }

  get isCurrentTrack(): boolean {
    return this.player.currentTrack() === this.track;
  }

  // RÚBRICA #10 — @Output: emite evento al padre
  addToPlaylist() {
    this.onAddToPlaylist.emit(this.track);
  }
}