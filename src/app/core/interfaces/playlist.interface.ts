export interface Playlist {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface PlaylistSong {
  id: number;
  playlist_id: number;
  deezer_id: number;
  title: string;
  artist_name: string;
  album_title: string;
  preview_url: string;
  cover_url: string;
  duration: number;
  added_at: string;
}