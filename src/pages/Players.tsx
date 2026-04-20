import React, { useState } from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import { Users, Plus, Trash2 } from 'lucide-react';

export function Players() {
  const { players, teams, addPlayer, removePlayer } = useChampionship();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teamId) return;
    addPlayer({ name, teamId, number });
    setName('');
    setNumber('');
    setIsModalOpen(false);
  };

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Sem Time';
  const getTeamColor = (id: string) => teams.find(t => t.id === id)?.color || '#cbd5e1';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jogadores</h1>
          <p className="text-gray-400 mt-1">Elenco e atletas cadastrados nas equipes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={teams.length === 0}
          className="flex items-center gap-2 bg-brand-cyan hover:bg-[#00b0d4] disabled:bg-gray-700 disabled:text-gray-400 text-black px-4 py-2.5 rounded-lg font-bold transition-all border-glow"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Cadastrar Jogador</span>
          <span className="sm:hidden">Cadastrar</span>
        </button>
      </div>

      <div className="glow-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800/50">
            <tr className="text-xs uppercase text-gray-400 border-b border-gray-700">
              <th className="p-4">Nome</th>
              <th className="p-4">Número</th>
              <th className="p-4">Equipe</th>
              <th className="p-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {players.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Nenhum jogador cadastrado.
                </td>
              </tr>
            ) : (
              players.map(player => (
                <tr key={player.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group">
                  <td className="p-4 font-bold">{player.name}</td>
                  <td className="p-4 text-gray-400">{player.number || '-'}</td>
                  <td className="p-4">
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border"
                      style={{ 
                        backgroundColor: `${getTeamColor(player.teamId)}20`,
                        borderColor: `${getTeamColor(player.teamId)}50`,
                        color: '#fff'
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getTeamColor(player.teamId) }} />
                      {getTeamName(player.teamId)}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <button 
                      onClick={() => removePlayer(player.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glow-panel rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold accent-cyan">Cadastrar Jogador</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none"
                  placeholder="Nome do Atleta"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Equipe *</label>
                  <select
                    value={teamId}
                    onChange={e => setTeamId(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none"
                    required
                  >
                    <option value="" disabled>Selecione uma equipe</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Nº Camisa</label>
                  <input
                    type="text"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none"
                    placeholder="Ex: 10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !teamId}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-black hover:bg-[#00b0d4] disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg font-bold border-glow"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
