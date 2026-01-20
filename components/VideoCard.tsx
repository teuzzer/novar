
import React from 'react';
import { Video } from '../types';
import { Play, MoreVertical, Clock, UserCheck } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const isHuman = video.author.includes('Real Human') || video.author === 'You';

  return (
    <div 
      className="group cursor-pointer space-y-3"
      onClick={() => onClick(video)}
    >
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-lg shadow-black/40">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-7 h-7 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-950/90 backdrop-blur-md rounded-lg text-[10px] font-black text-white border border-white/10">
          {video.duration}
        </div>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/10 text-white shadow-lg ${
          video.mood === 'Energetic' ? 'bg-orange-500/80' : 
          video.mood === 'Calm' ? 'bg-blue-500/80' : 
          video.mood === 'Focus' ? 'bg-indigo-500/80' :
          video.mood === 'Funny' ? 'bg-yellow-500/80' : 'bg-slate-800/80'
        }`}>
          {video.mood}
        </div>
        {isHuman && (
          <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-md p-1.5 rounded-lg border border-green-400/30 text-white">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex gap-4 px-1">
        <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-indigo-500/50 transition-colors">
          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${video.author}`} alt={video.author} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-100 leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors text-[15px]">
            {video.title}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
            {video.author}
            {isHuman && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 mt-1">
            <span>{video.views} views</span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span>{video.timestamp}</span>
          </div>
        </div>
        <button className="h-fit p-1 text-slate-700 hover:text-slate-300 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
