export type Theme = 'light' | 'dark';
export type Language = 'en' | 'pl';

export interface NavItem {
  label: string;
  href: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}