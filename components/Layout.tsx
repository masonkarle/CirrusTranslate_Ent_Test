
import React from 'react';
import { User, UserRole } from '../types';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeView, setActiveView }) => {
  const menuItems = {
    [UserRole.MANAGER]: [
      { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
      { id: 'clients', label: 'Clients', icon: '🏢' },
      { id: 'translators', label: 'Translators', icon: '👥' },
      { id: 'projects', label: 'Projects', icon: '📁' },
    ],
    [UserRole.TRANSLATOR]: [
      { id: 'dashboard', label: 'My Jobs', icon: '🏠' },
      { id: 'queue', label: 'Job Queue', icon: '🌍' },
      { id: 'history', label: 'History', icon: '📜' },
    ],
    [UserRole.CLIENT]: [
      { id: 'dashboard', label: 'Active Projects', icon: '📊' },
      { id: 'billing', label: 'Billing & Invoices', icon: '💰' },
    ],
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-sm">
        <div className="p-8">
          <Logo className="h-10" />
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems[user.role].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                activeView === item.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
            <img src={user.avatar} className="w-10 h-10 rounded-full border border-white shadow-sm" alt="avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Platform</span>
            <span className="text-slate-300">/</span>
            <h2 className="font-bold text-slate-800 capitalize tracking-tight">
              {activeView.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-[#fbfcfd]">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
