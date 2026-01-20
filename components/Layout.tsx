
import React from 'react';
import { AppView } from '../types';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  onSearch: (query: string) => void;
  onOpenCreate: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onSearch, onOpenCreate }) => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={onViewChange} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSearch={onSearch} onViewChange={onViewChange} onOpenCreate={onOpenCreate} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
