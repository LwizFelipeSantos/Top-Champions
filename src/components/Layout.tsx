import React, { useEffect, useState } from 'react';
import { Trophy, Users, Shield, Calendar, BarChart3, Menu, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
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

  const navItems = [
    { id: 'leaderboard', label: 'Classificação', icon: Trophy },
    { id: 'matches', label: 'Jogos & Rodadas', icon: Calendar },
    { id: 'teams', label: 'Equipes', icon: Shield },
    { id: 'players', label: 'Jogadores', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

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
                {item.label}
              </button>
            )
          })}
        </nav>
        
        <div className="mt-auto pt-6 pb-6 border-t border-gray-800 text-xs text-gray-500 px-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="status-dot"></div>
            Armazenamento Local
          </div>
          <div className="text-[10px] opacity-40 leading-tight">
            Created by Luiz Felipe Santos;<br/>Abril - 2026
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
