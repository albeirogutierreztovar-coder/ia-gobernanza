import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Target, Cpu, ShieldAlert, CheckSquare, 
  FileBox, Files, Search, Settings, Bell, Calendar, Activity, 
  BarChart2, LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { label: 'COMMAND CENTER', icon: LayoutDashboard, path: '/' },
  { label: 'IMPLEMENTACIÓN', icon: Map, path: '/implementation' },
  { label: 'GOBERNANZA', icon: Target, path: '/governance' },
  { label: 'INTELIGENCIA ARTIFICIAL', icon: Cpu, path: '/ai-registry' },
  { label: 'RIESGOS', icon: ShieldAlert, path: '/risks' },
  { label: 'CONTROLES', icon: CheckSquare, path: '/controls' },
  { label: 'EVIDENCIAS', icon: FileBox, path: '/evidences' },
  { label: 'DOCUMENTOS', icon: Files, path: '/documents' },
  { label: 'AUDITORÍA', icon: Search, path: '/audit' },
  { label: 'DESEMPEÑO', icon: Activity, path: '/performance' },
];

export function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('mockUser'); await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Cpu className="w-6 h-6 text-teal-400 mr-2" />
        <span className="font-bold text-lg text-white tracking-wide">AIGobernanza <span className="text-teal-400">360</span></span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              isActive 
                ? "bg-slate-800 text-teal-400" 
                : "hover:bg-slate-800/50 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5 mr-3 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        <div className="mt-8 pt-4 border-t border-slate-800 space-y-1">
          <NavLink to="/reports" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-colors duration-200">
            <BarChart2 className="w-5 h-5 mr-3 shrink-0" /> REPORTES
          </NavLink>
          <NavLink to="/calendar" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-colors duration-200">
            <Calendar className="w-5 h-5 mr-3 shrink-0" /> CALENDARIO
          </NavLink>
          <NavLink to="/alerts" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-colors duration-200">
            <Bell className="w-5 h-5 mr-3 shrink-0" /> ALERTAS
          </NavLink>
          <NavLink to="/settings" className="flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 hover:text-white transition-colors duration-200">
            <Settings className="w-5 h-5 mr-3 shrink-0" /> CONFIGURACIÓN
          </NavLink>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white uppercase">
            {user?.email?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 truncate max-w-[120px]">
            <p className="text-sm font-medium text-white leading-none truncate">{user?.displayName || user?.email?.split('@')[0]}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors p-1" title="Cerrar sesión">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
