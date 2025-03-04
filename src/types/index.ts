export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isGuest?: boolean;
}

export interface Component {
  id: string;
  type: 'header' | 'text' | 'image' | 'gallery' | 'contact' | 'about' | 'skills' | 'projects';
  content: any;
  style: Record<string, string>;
}

export interface Section {
  id: string;
  name: string;
  components: Component[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  theme: string;
  pages: Page[];
  published: boolean;
  publishedUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DragItem {
  id: string;
  type: string;
  index: number;
}