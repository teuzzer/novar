
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Video } from './types';
import { MOCK_VIDEOS, CATEGORIES, MOODS } from './constants';
import Layout from './components/Layout';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import CreateModal from './components/CreateModal';
import { Sparkles, Brain, BarChart3, Radio } from 'lucide-react';
import { semanticSearch } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.Home);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [allVideos, setAllVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setActiveView(AppView.Watch);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredVideos(allVideos);
      return;
    }
    
    setIsSearching(true);
    setActiveView(AppView.Home);
    const rankedIds = await semanticSearch(query, allVideos);
    const sorted = [...allVideos].sort((a, b) => {
      const idxA = rankedIds.indexOf(a.id);
      const idxB = rankedIds.indexOf(b.id);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
    setFilteredVideos(sorted);
    setIsSearching(false);
  };

  const handlePublish = (newVideo: Video) => {
    const updated = [newVideo, ...allVideos];
    setAllVideos(updated);
    setFilteredVideos(updated);
    setActiveView(AppView.Home);
  };

  const displayVideos = useMemo(() => {
    return filteredVideos.filter(v => {
      const categoryMatch = activeCategory === 'All' || v.category === activeCategory;
      const moodMatch = !activeMood || v.mood === activeMood;
      return categoryMatch && moodMatch;
    });
  }, [filteredVideos, activeCategory, activeMood]);

  return (
    <div className="relative">
      <Layout 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onSearch={handleSearch}
        onOpenCreate={() => setIsCreateModalOpen(true)}
      >
        {activeView === AppView.Home && (
          <div className="space-y-8 pb-20">
            {/* Hero Discovery Section */}
            <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1920" 
                className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
                alt="Feature Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Nova Daily Feature</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Reimagining the Universe through Artificial Eyes
                </h1>
                <p className="text-slate-300 mb-6 line-clamp-2">
                  Join our live global synthesis where AI agents analyze the collective consciousness in real-time.
                </p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-500 animate-pulse" /> Watch Now
                  </button>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl py-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {isSearching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-video bg-slate-900 rounded-2xl"></div>
                    <div className="h-4 bg-slate-900 rounded w-3/4"></div>
                  </div>
                ))
              ) : displayVideos.length > 0 ? (
                displayVideos.map(video => (
                  <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <Brain className="w-12 h-12 text-slate-800 mx-auto" />
                  <p className="text-slate-500">No videos match your neural filters.</p>
                  <button onClick={() => {setActiveCategory('All'); setActiveMood(null); handleSearch('');}} className="text-indigo-400 font-bold">Reset Filters</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === AppView.Watch && selectedVideo && (
          <VideoPlayer video={selectedVideo} />
        )}

        {activeView === AppView.Discovery && (
          <div className="max-w-4xl mx-auto py-12 space-y-12">
             <div className="text-center space-y-4">
                <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
                  AI Discovery Engine
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                  Nova uses quantum semantic analysis to predict your next favorite obsession.
                </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[3rem] space-y-4 hover:border-indigo-500/30 transition-all group">
                  <BarChart3 className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold">Trend Synthesis</h3>
                  <p className="text-sm text-slate-500">Real-time mapping of global interests.</p>
                </div>
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[3rem] space-y-4 hover:border-purple-500/30 transition-all group">
                  <Radio className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold">Direct Mindstream</h3>
                  <button className="w-full py-3 bg-purple-600 rounded-2xl font-bold text-white mt-4">Initialize Stream</button>
                </div>
             </div>
          </div>
        )}
      </Layout>

      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onPublish={handlePublish}
      />
    </div>
  );
};

export default App;
