export interface Artist {
  id: number;
  name: string;
  picture_medium: string;
  picture_xl: string;
  nb_fan?: number;
  nb_album?: number;
}

export interface ArtistSearchResponse {
  data: Artist[];
  total: number;
}

export interface Genre {
  id: number;
  name: string;
  picture_medium: string;
  picture_big: string;
}