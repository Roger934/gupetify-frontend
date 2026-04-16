// RÚBRICA #4 — Componente standalone
// RÚBRICA #2 — inject() para dependencias
// RÚBRICA #11d — Navegación programática con queryParams
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  // RÚBRICA #2 — inject()
  auth = inject(AuthService);
  private router = inject(Router);

  generos = [
    { nombre: 'Pop',         imagen: 'https://www.mmx.com.ar/wp-content/uploads/2023/09/eaa0188c51e05377e0184465b323219a.jpg', genreId: 132 },
    { nombre: 'Rock',        imagen: 'https://th.bing.com/th/id/R.b0e002b48aae051b27e15beb0d391de5?rik=Q3QngDU3NbFbUA&pid=ImgRaw&r=0', genreId: 152 },
    { nombre: 'Hip Hop',     imagen: 'https://www.melarossa.it/wp-content/uploads/2021/01/hip-hop-stili.jpg?x19256', genreId: 116 },
    { nombre: 'Electrónica', imagen: 'https://tse1.mm.bing.net/th/id/OIP.xDXgtlMhx1Oy-CWKhqdTewHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', genreId: 106 },
    { nombre: 'Jazz',        imagen: 'https://cdn.wallpapersafari.com/89/75/ZB0m3U.jpg', genreId: 129 },
    { nombre: 'Reggaeton',   imagen: 'https://monitorlatino.com/wp-content/uploads/2023/10/Bad-Bunny-1-1024x615.png', genreId: 144 },
    { nombre: 'Classical',   imagen: 'https://i.ytimg.com/vi/x_nJEZHD40U/maxresdefault.jpg', genreId: 98 },
    { nombre: 'R&B',         imagen: 'https://tse1.mm.bing.net/th/id/OIP.Q9Q2rAZp4eaCTi-dTTJQTwHaE7?w=500&h=333&rs=1&pid=ImgDetMain&o=7&rm=3', genreId: 165 },
  ];

  // RÚBRICA #11d — Navegación programática con queryParams
goToGenre(nombre: string) {
  this.router.navigate(['/explore'], {
    queryParams: { q: nombre }
  });
}
}