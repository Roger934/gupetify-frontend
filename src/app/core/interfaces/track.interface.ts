export interface Track {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: {
    id: number;
    name: string;
  };
  album: {
    id: number;
    title: string;
    cover_medium: string;
    cover_xl: string;
  };
}