import React from 'react';
import { Trophy, Shield, Calendar, BarChart3, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingProps {
  onLogin: () => void;
  onExplore: () => void;
}

export function Landing({ onLogin, onExplore }: LandingProps) {
  return (
    <div className="min-h-screen bg-brand-dark text-white overflow-hidden selection:bg-brand-cyan selection:text-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-cyan/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-brand-cyan rounded-xl flex items-center justify-center border-glow shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <Trophy className="text-black" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase accent-cyan">Top Champions</span>
        </motion.div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={onExplore}
            className="text-[10px] sm:text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
          >
            Apenas Visualizar
          </button>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={onLogin}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-brand-cyan hover:text-white transition-colors"
          >
            <span className="hidden xs:inline">ACESSAR CONTA</span>
            <span className="xs:hidden">LOGAR</span>
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-bold tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
              </span>
              SISTEMA OFICIAL DE GESTÃO
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Eleve o nível do <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">
                seu campeonato.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Esqueça as planilhas. Gerencie equipes, sorteie partidas e tenha uma tabela de classificação calculada automaticamente em tempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogin}
                className="w-full sm:w-auto bg-gradient-to-r from-brand-cyan to-[#009bbf] text-black font-extrabold uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(0,212,255,0.4)] flex items-center justify-center gap-3 group hover:shadow-[0_0_60px_rgba(0,212,255,0.6)]"
              >
                Gerenciar Agora
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <button 
                onClick={onExplore}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-gray-300 font-bold uppercase tracking-widest text-sm"
              >
                Ver Classificação
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <div className="glow-panel rounded-3xl p-8 border border-white/5 bg-gradient-to-b from-gray-900/80 to-black/80 hover:border-brand-cyan/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mb-6 border border-brand-cyan/20">
              <BarChart3 className="text-brand-cyan" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Tabela Inteligente</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              O sistema calcula automaticamente pontos, vitórias e saldo de gols a cada partida finalizada. Zero trabalho manual.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glow-panel md:col-span-2 rounded-3xl p-8 border border-white/5 bg-gradient-to-b from-gray-900/80 to-black/80 hover:border-brand-blue/30 transition-colors group relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 border border-brand-blue/20">
                <Calendar className="text-brand-blue" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sorteio de Partidas</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Gere rodadas completas com um clique. Acomode times de forma balanceada e adicione resultados facilmente depois.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glow-panel md:col-span-2 rounded-3xl p-8 border border-white/5 bg-gradient-to-b from-gray-900/80 to-black/80 hover:border-brand-cyan/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
              <Shield className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Identidade Visual</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Cores oficiais e escudos em alta resolução. Deixe as equipes com cara de profissionais em todos os painéis e na tabela principal.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glow-panel rounded-3xl p-8 border border-white/5 bg-gradient-to-b from-gray-900/80 to-black/80 flex flex-col justify-center text-center items-center hover:bg-gray-800/50 transition-colors">
             <Trophy className="text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" size={48} />
             <h3 className="text-lg font-bold">Quem levará<br/>a taça?</h3>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 lg:px-8 text-gray-500 text-sm relative z-10 mx-auto max-w-7xl flex flex-col md:flex-row items-center md:items-start justify-between">
        <p className="text-[10px] md:text-xs opacity-40 text-center md:text-left mb-4 md:mb-0">Created by Luiz Felipe Santos; Abril - 2026</p>
        <p className="text-center md:text-right">&copy; {new Date().getFullYear()} Top Champions. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
