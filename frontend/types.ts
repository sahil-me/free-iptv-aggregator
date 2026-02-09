
export interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  country: string;
  language: string;
  source: string;
  groupTitle?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Country {
  code: string;
  name: string;
}

export enum AppRoute {
  HOME = 'home',
  WATCH = 'watch',
  LEGAL = 'legal',
  BROWSE = 'browse',
  FAVORITES = 'favorites'
}
