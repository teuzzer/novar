
import React, { useState } from 'react';
import { Search, Bell, User, Cpu, Sparkles, Plus } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onViewChange: (view: AppView) => void;
  onOpenCreate: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onViewChange, onOpenCreate }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange(AppView.Home)}>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
          NovaTube
        </span>
      </div>

      <div className="flex-1 max-w-xl mx-4 md:mx-8">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search with AI intent..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400" />
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onOpenCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Create</span>
        </button>
        
        <button className="p-2 hover:bg-slate-900 rounded-full transition-colors relative hidden sm:block">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500 transition-colors">
          <User className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
