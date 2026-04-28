import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Users, Shield, Calendar, BarChart3, Menu, Sun, Moon, LogOut, LogIn, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLightMode(true);
    }
  };

  const navItems = isAdmin 
    ? [
        { id: 'leaderboard', label: 'Classificação', icon: Trophy },
        { id: 'matches', label: 'Jogos & Rodadas', icon: Calendar },
        { id: 'teams', label: 'Equipes', icon: Shield },
        { id: 'players', label: 'Jogadores', icon: Users },
        { id: 'reports', label: 'Relatórios', icon: BarChart3 },
      ]
    : [
        { id: 'leaderboard', label: 'Classificação', icon: Trophy },
        { id: 'matches', label: 'Jogos & Rodadas', icon: Calendar },
        { id: 'reports', label: 'Estatísticas', labelOverride: 'Desempenho', icon: BarChart3 },
      ];

  // Helper for label display
  const getNavItemLabel = (item: any) => item.labelOverride || item.label;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Sidebar Mobile Header */}
      <div className="md:hidden glow-panel p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight accent-cyan">
          <Trophy className="text-brand-cyan" />
          <span>Top Champions</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            <Menu />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} 
        md:flex flex-col w-full md:w-64 glow-panel border-r border-[#30363d] shrink-0 min-h-screen
      `}>
        <div className="p-6 hidden md:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-cyan rounded-lg flex items-center justify-center border-glow">
              <Trophy className="text-black" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight accent-cyan">TOP CHAMPIONS</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-4">
          <div className="text-xs uppercase text-gray-500 font-bold tracking-widest pl-4 mb-2 flex justify-between items-center pr-2">
            Painel de Controle
            <button onClick={toggleTheme} className="p-1.5 hidden md:flex text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors" title={isLightMode ? "Ativar Modo Escuro" : "Ativar Modo Claro"}>
              {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-1.5 text-sm font-medium transition-colors rounded-lg ${
                  isActive 
                    ? 'text-brand-cyan bg-brand-cyan/10' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon size={18} />
                {getNavItemLabel(item)}
              </button>
            )
          })}
        </nav>
        
        <div className="mt-auto border-t border-gray-800 p-4">
          {user ? (
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors rounded-lg group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              <span>Sair da Conta</span>
            </button>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-brand-cyan bg-brand-cyan/10 hover:bg-brand-cyan/20 transition-all rounded-lg border border-brand-cyan/20"
            >
              <LogIn size={18} />
              <span>Acessar Painel</span>
              <ChevronRight size={14} className="ml-auto" />
            </button>
          )}

          <div className="mt-6 text-[10px] text-gray-600 px-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan/50"></div>
              <span>Modo: {user ? (isAdmin ? 'Administrador' : 'Visualizador Autenticado') : 'Visitante'}</span>
            </div>
            <div className="opacity-40 leading-tight mt-1">
              Created by Luiz Felipe Santos;<br/>Abril - 2026
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto overflow-hidden">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
