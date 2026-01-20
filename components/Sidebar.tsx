
import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Layers, Settings, Zap } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: AppView.Home, icon: Home, label: 'Home' },
    { id: AppView.Discovery, icon: Compass, label: 'Discovery' },
    { id: 'shorts', icon: Zap, label: 'Nova Shorts' },
    { id: 'subs', icon: PlaySquare, label: 'Subscriptions' },
  ];

  const libraryItems = [
    { id: 'library', icon: Layers, label: 'Library' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'liked', icon: ThumbsUp, label: 'Liked Videos' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/50 bg-slate-950 flex flex-col hidden lg:flex">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => typeof item.id === 'string' ? null : onViewChange(item.id as AppView)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeView === item.id 
                ? 'bg-slate-900 text-indigo-400 border border-slate-800' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-indigo-400' : ''}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-slate-800/50 mx-4 my-2"></div>

      <div className="p-4 space-y-2">
        <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Library</h3>
        {libraryItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-all"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto p-4">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
