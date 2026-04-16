// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #4 — Componente standalone
// RÚBRICA #15 — Aportación EXTRA #1: consume Signals del PlayerService
import { Component, inject } from '@angular/core';
import { PlayerService } from '../../core/services/player.service';
import { DurationPipe } from '../../core/pipes/duration.pipe';


@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [DurationPipe],
  templateUrl: './player-bar.html',
  styleUrl: './player-bar.css'
})
export class PlayerBar {
  // RÚBRICA #2 — inject()
  player = inject(PlayerService);
}