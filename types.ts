
export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  author: string;
  views: string;
  timestamp: string;
  category: string;
  duration: string;
  mood: 'Energetic' | 'Calm' | 'Focus' | 'Dark' | 'Funny';
  comments?: Comment[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export enum AppView {
  Home = 'home',
  Watch = 'watch',
  Search = 'search',
  Discovery = 'discovery'
}
