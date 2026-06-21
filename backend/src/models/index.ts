export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  cover: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Moment {
  id: number;
  content: string;
  images: string[];
  likes: number;
  created_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  cover?: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  cover?: string;
}

export interface CreateMomentRequest {
  content: string;
  images?: string[];
}

export interface UpdateMomentRequest {
  content?: string;
  images?: string[];
}
