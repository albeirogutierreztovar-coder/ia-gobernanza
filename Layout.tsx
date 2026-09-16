import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export function Topbar() {
  const data = useStore(state => state.data);

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center">
        {data && (
          <div className="flex items-center">
            <span className="font-semibold text-slate-800 mr-2">{data.organization.name}</span>
            {data.organization.standards?.map((s: string) => (
              <span key={s} className="ml-1 px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-9 pr-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-64"
          />
        </div>
        
        <Link to="/alerts" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Link>

        <button className="flex items-center px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-medium rounded-full shadow-sm hover:opacity-90 transition-opacity">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Copilot
        </button>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
