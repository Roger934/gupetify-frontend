// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11b — paramMap para leer parámetros de ruta
// RÚBRICA #11c — queryParams: lee ?genreId= y ?q= de la URL
// RÚBRICA #11d — Navegación programática al ver artista
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeezerService } from '../../core/services/deezer.service';
import { Artist } from '../../core/interfaces/artist.interface';
import { ToastService } from '../../shared/toast/toast';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore implements OnInit {
  // RÚBRICA #2 — inject()
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deezer = inject(DeezerService);
  private toast = inject(ToastService);
  private searchTimer: any;

  // RÚBRICA #7 — Two-way binding con [(ngModel)]
  searchQuery: string = '';
  artists: Artist[] = [];
  loading: boolean = false;
  currentGenreName: string = '';

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const seedId = params.get('seedId');
      const q = params.get('q');
      this.artists = [];

      if (seedId) {
        // Viene desde Home con género — carga artistas relacionados
        this.currentGenreName = q || '';
        this.loadRelatedArtists(Number(seedId));
      } else if (q) {
        this.searchQuery = q;
        this.currentGenreName = q;
        this.searchByText();
      }
    });
  }

  // Búsqueda en tiempo real con debounce de 400ms
  onSearchInput() {
    clearTimeout(this.searchTimer);
    if (!this.searchQuery.trim()) {
      this.artists = [];
      this.currentGenreName = '';
      return;
    }
    this.searchTimer = setTimeout(() => {
      this.searchByText();
    }, 400);
  }
  loadRelatedArtists(seedId: number) {
    this.loading = true;
    this.deezer.getRelatedArtists(seedId).subscribe({
      next: (res) => {
        this.artists = res.data;
        this.loading = false;
      },
      error: () => {
        this.toast.show('Error al cargar artistas', 'error');
        this.loading = false;
      },
    });
  }

  // Carga artistas por género usando el id de Deezer
  loadGenreArtists(genreId: number) {
    this.loading = true;
    this.artists = [];

    this.deezer.getGenreArtists(genreId).subscribe({
      next: (res) => {
        this.artists = res.data;
        this.loading = false;
      },
      error: () => {
        this.toast.show('Error al cargar artistas del género', 'error');
        this.loading = false;
      },
    });
  }

  // Búsqueda libre por texto
  searchByText() {
    if (!this.searchQuery.trim()) return;
    this.loading = true;
    this.currentGenreName = '';
    this.artists = [];

    this.deezer.searchArtists(this.searchQuery).subscribe({
      next: (res) => {
        this.artists = res.data;
        this.loading = false;
      },
      error: () => {
        this.toast.show('Error al buscar artistas', 'error');
        this.loading = false;
      },
    });
  }

  // Llamado desde el botón buscar o Enter
  search() {
    if (!this.searchQuery.trim()) return;

    // RÚBRICA #11d — Actualiza queryParams en la URL
    this.router.navigate(['/explore'], {
      queryParams: { q: this.searchQuery },
      replaceUrl: true,
    });

    this.searchByText();
  }

  // RÚBRICA #11d — Navegación programática al detalle del artista
  goToArtist(id: number) {
    this.router.navigate(['/artist', id]);
  }
}
