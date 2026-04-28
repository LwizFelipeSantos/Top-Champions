import React from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
  const { leaderboard } = useChampionship();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classificação em Tempo Real</h1>
          <p className="text-gray-400 mt-1">Top Champions</p>
        </div>
        <div className="h-12 w-12 bg-brand-cyan text-black rounded-lg flex items-center justify-center border-glow">
          <Trophy size={24} />
        </div>
      </div>

      <div className="glow-panel rounded-2xl overflow-hidden mt-8 relative group min-h-[400px]">
        {/* Background Watermark SVG Logo - Robust and visible on all devices */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <div className="w-[60%] h-[60%] md:w-[40%] md:h-[40%] opacity-[0.09] md:opacity-[0.05] transition-all duration-700 group-hover:opacity-[0.15] text-brand-cyan">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
              {/* Ball structure formed by stars */}
              <path d="M100 20L108 45L135 45L113 62L122 88L100 72L78 88L87 62L65 45L92 45L100 20Z" transform="translate(0, -10)" />
              <path d="M100 20L108 45L135 45L113 62L122 88L100 72L78 88L87 62L65 45L92 45L100 20Z" transform="rotate(72, 100, 100) translate(0, -10)" />
              <path d="M100 20L108 45L135 45L113 62L122 88L100 72L78 88L87 62L65 45L92 45L100 20Z" transform="rotate(144, 100, 100) translate(0, -10)" />
              <path d="M100 20L108 45L135 45L113 62L122 88L100 72L78 88L87 62L65 45L92 45L100 20Z" transform="rotate(216, 100, 100) translate(0, -10)" />
              <path d="M100 20L108 45L135 45L113 62L122 88L100 72L78 88L87 62L65 45L92 45L100 20Z" transform="rotate(288, 100, 100) translate(0, -10)" />
              
              {/* Central Text Area */}
              <text x="100" y="115" textAnchor="middle" className="text-[12px] font-serif font-bold uppercase tracking-[0.2em] fill-current">Top</text>
              <text x="100" y="135" textAnchor="middle" className="text-[14px] font-serif font-bold uppercase tracking-[0.1em] fill-current">Champions</text>
              <text x="100" y="152" textAnchor="middle" className="text-[10px] font-serif font-light uppercase tracking-[0.3em] fill-current opacity-70">League</text>
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800/50">
              <tr className="text-xs uppercase text-gray-400 border-b border-gray-700">
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Equipe</th>
                <th className="p-4 accent-cyan font-bold" title="Pontos">P</th>
                <th className="p-4" title="Jogos">J</th>
                <th className="p-4" title="Vitórias">V</th>
                <th className="p-4" title="Empates">E</th>
                <th className="p-4" title="Derrotas">D</th>
                <th className="p-4" title="Gols Pró">GP</th>
                <th className="p-4" title="Gols Contra">GC</th>
                <th className="p-4" title="Saldo de Gols">SG</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500">
                    Nenhuma equipe cadastrada ainda.
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.teamId} 
                    className={`border-b border-gray-800/50 ${index === 0 ? 'bg-cyan-900/10' : 'hover:bg-gray-800/30'}`}
                  >
                    <td className={`p-4 text-center ${index === 0 ? 'font-bold accent-cyan' : index < 4 ? 'text-brand-blue' : index >= leaderboard.length - 4 && leaderboard.length > 8 ? 'text-red-500' : 'text-gray-500'}`}>
                      {index + 1}
                    </td>
                    <td className="p-4 font-semibold flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-white/10" style={!entry.imageUrl ? { backgroundColor: entry.color || '#cbd5e1' } : undefined}>
                        {entry.imageUrl && <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                      </div>
                      {entry.teamName}
                    </td>
                    <td className={`p-4 font-bold ${index === 0 ? 'accent-cyan' : ''}`}>{entry.points}</td>
                    <td className="p-4">{entry.played}</td>
                    <td className="p-4">{entry.won}</td>
                    <td className="p-4">{entry.drawn}</td>
                    <td className="p-4">{entry.lost}</td>
                    <td className="p-4">{entry.goalsFor}</td>
                    <td className="p-4">{entry.goalsAgainst}</td>
                    <td className="p-4 font-medium">
                      {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-cyan rounded-full"/> Campeão</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-blue rounded-full"/> Classificação Superior</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"/> Zona de Rebaixamento</div>
      </div>
    </div>
  );
}
