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

      <div className="glow-panel rounded-2xl overflow-hidden mt-8">
        <div className="overflow-x-auto">
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
