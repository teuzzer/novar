
import { Video } from './types';

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'The Future of Neural Networks',
    description: 'Exploring the depths of generative AI and its impact on creativity.',
    thumbnail: 'https://picsum.photos/seed/ai/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    author: 'TechNexus',
    views: '1.2M',
    timestamp: '2 days ago',
    category: 'Science',
    duration: '12:45',
    mood: 'Focus'
  },
  {
    id: 'v2',
    title: 'Interstellar Travel: Physics vs Reality',
    description: 'Can we ever reach the stars? A deep dive into warp drives and relativity.',
    thumbnail: 'https://picsum.photos/seed/space/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    author: 'AstroMind',
    views: '850K',
    timestamp: '1 week ago',
    category: 'Education',
    duration: '22:10',
    mood: 'Calm'
  },
  {
    id: 'v3',
    title: 'Urban Cyberpunk Photography Guide',
    description: 'Capturing neon-drenched cityscapes at midnight.',
    thumbnail: 'https://picsum.photos/seed/cyber/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    author: 'NeonVisuals',
    views: '340K',
    timestamp: '5 hours ago',
    category: 'Art',
    duration: '08:15',
    mood: 'Dark'
  },
  {
    id: 'v4',
    title: 'Extreme Parkour: Tokyo Rooftops',
    description: 'High energy stunts in the heart of Shinjuku.',
    thumbnail: 'https://picsum.photos/seed/parkour/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    author: 'AdrenaLine',
    views: '2.1M',
    timestamp: '1 month ago',
    category: 'Sports',
    duration: '10:30',
    mood: 'Energetic'
  },
  {
    id: 'v5',
    title: 'Top 10 AI Fails 2024',
    description: 'Hilarious moments when the machines got it wrong.',
    thumbnail: 'https://picsum.photos/seed/fails/800/450',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    author: 'ComedyHub',
    views: '5.4M',
    timestamp: '2 days ago',
    category: 'Entertainment',
    duration: '15:00',
    mood: 'Funny'
  }
];

export const CATEGORIES = ['All', 'Science', 'Education', 'Art', 'Sports', 'Entertainment', 'Music', 'Gaming'];
export const MOODS = ['Energetic', 'Calm', 'Focus', 'Dark', 'Funny'];
