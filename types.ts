
export interface User {
  id: string;
  fullName: string | null;
  imageUrl: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  author_id: string;
  author?: User; // Populated after fetch
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  author?: User; // Populated after fetch
  text: string;
  created_at: string;
}
