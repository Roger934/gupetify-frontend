import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./pages/explore/explore').then(m => m.Explore)
  },
  {
    path: 'artist/:id',
    loadComponent: () =>
      import('./pages/artist-detail/artist-detail').then(m => m.ArtistDetail)
  },
  {
    path: 'playlists',
    loadComponent: () =>
      import('./pages/playlists/playlists').then(m => m.Playlists),
    canActivate: [authGuard]
  },
  {
    path: 'playlists/:id',
    loadComponent: () =>
      import('./pages/playlist-detail/playlist-detail').then(m => m.PlaylistDetail),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(m => m.NotFound)
  }
];