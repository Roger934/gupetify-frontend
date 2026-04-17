import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PlaylistService } from '../../core/services/playlist.service';
import { DeezerService } from '../../core/services/deezer.service';
import { Playlist } from '../../core/interfaces/playlist.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  private playlistService = inject(PlaylistService);
  private deezer = inject(DeezerService);

  playlists: Playlist[] = [];

  // Semillas por género con IDs reales de Deezer
  generos = [
    {
      nombre: 'Pop',
      imagen:
        'https://www.mmx.com.ar/wp-content/uploads/2023/09/eaa0188c51e05377e0184465b323219a.jpg',
      seedId: 12246,
    }, // Taylor Swift
    {
      nombre: 'Rock',
      imagen:
        'https://th.bing.com/th/id/R.b0e002b48aae051b27e15beb0d391de5?rik=Q3QngDU3NbFbUA&pid=ImgRaw&r=0',
      seedId: 412,
    }, // Queen
    {
      nombre: 'Hip Hop',
      imagen: 'https://www.melarossa.it/wp-content/uploads/2021/01/hip-hop-stili.jpg?x19256',
      seedId: 13,
    }, // Eminem
    {
      nombre: 'Electrónica',
      imagen:
        'https://tse1.mm.bing.net/th/id/OIP.xDXgtlMhx1Oy-CWKhqdTewHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
      seedId: 293585,
    }, // calvin harris
    { nombre: 'Jazz', imagen: 'https://cdn.wallpapersafari.com/89/75/ZB0m3U.jpg', seedId: 2059 }, // Aretha Franklin
    {
      nombre: 'Reggaeton',
      imagen: 'https://monitorlatino.com/wp-content/uploads/2023/10/Bad-Bunny-1-1024x615.png',
      seedId: 10583405,
    }, // Bad Bunny
    {
      nombre: 'Classical',
      imagen: 'https://i.ytimg.com/vi/x_nJEZHD40U/maxresdefault.jpg',
      seedId: 6144,
    }, // Beethoven
    {
      nombre: 'R&B',
      imagen:
        'https://tse1.mm.bing.net/th/id/OIP.Q9Q2rAZp4eaCTi-dTTJQTwHaE7?w=500&h=333&rs=1&pid=ImgDetMain&o=7&rm=3',
      seedId: 4050205,
    }, // The Weeknd
  ];

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loadPlaylists();
    }
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (res) => (this.playlists = res.playlists.slice(0, 6)),
      error: () => {},
    });
  }

  // Navega a Explore con el seedId del género
  goToGenre(seedId: number, nombre: string) {
    this.router.navigate(['/explore'], {
      queryParams: { seedId, q: nombre },
    });
  }

  getCovers(covers: string[]): string[] {
    if (!covers || covers.length === 0) return [];
    const result: string[] = [];
    for (let i = 0; i < 4; i++) {
      result.push(covers[i % covers.length]);
    }
    return result;
  }
}
