import React, { useState } from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Shield, Save, Edit2, Trash2, Plus, X } from 'lucide-react';
import { LeaderboardEntry } from '../types';

export function Champions() {
  const { champions, updateChampion, removeChampion, addChampion } = useChampionship();
  const { isAdmin } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ seasonName: '', teamName: '', imageUrl: '' });
  
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState({ seasonName: '', teamName: '', imageUrl: '' });

  const [selectedChampion, setSelectedChampion] = useState<any | null>(null);

  const startEdit = (e: React.MouseEvent, champion: any) => {
    e.stopPropagation();
    setEditingId(champion.id);
    setEditForm({ seasonName: champion.seasonName, teamName: champion.teamName, imageUrl: champion.imageUrl || '' });
  };

  const handleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!editForm.seasonName || !editForm.teamName) return;
    try {
      await updateChampion(id, { ...editForm });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await removeChampion(id);
  };

  const handleAdd = async () => {
    if (!addForm.seasonName || !addForm.teamName) return;
    try {
      await addChampion({
        seasonName: addForm.seasonName,
        teamName: addForm.teamName,
        imageUrl: addForm.imageUrl,
        teamId: 'manual'
      });
      setIsAdding(false);
      setAddForm({ seasonName: '', teamName: '', imageUrl: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const sortedChampions = [...champions].sort((a, b) => b.seasonName.localeCompare(a.seasonName));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Campeões</h1>
          <p className="text-gray-400 mt-1">Galeria de honra dos vencedores de todas as edições.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 bg-[#00C65E] hover:bg-[#00a34b] text-black px-4 py-2.5 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto"
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? 'Cancelar' : 'Adicionar Campeão'}
          </button>
        )}
      </div>

      {isAdding && (
         <div className="glow-panel p-6 rounded-2xl bg-gray-800/20 border border-[#00C65E]/30">
           <h3 className="text-lg font-bold text-white mb-4">Adicionar Campeão Manulamente</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div>
               <label className="block text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">Ano / Edição</label>
               <input type="text" value={addForm.seasonName} onChange={e => setAddForm(prev => ({...prev, seasonName: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-[#00C65E] transition-colors text-sm" placeholder="Ex: 2023" />
             </div>
             <div>
               <label className="block text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">Nome do Time</label>
               <input type="text" value={addForm.teamName} onChange={e => setAddForm(prev => ({...prev, teamName: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-[#00C65E] transition-colors text-sm" placeholder="Ex: Flamengo" />
             </div>
             <div>
               <label className="block text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">URL do Escudo</label>
               <input type="text" value={addForm.imageUrl} onChange={e => setAddForm(prev => ({...prev, imageUrl: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:border-[#00C65E] transition-colors text-sm" placeholder="URL da imagem (opcional)" />
             </div>
           </div>
           <div className="mt-4 flex justify-end">
             <button onClick={handleAdd} className="bg-[#00C65E] text-black px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#00a34b]">
                <Save size={16} /> Salvar Campeão
             </button>
           </div>
         </div>
      )}

      {(champions.length === 0 && !isAdding) ? (
         <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-800/30 rounded-2xl border border-gray-700/50">
           <Trophy size={64} className="text-gray-600 mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">Nenhum campeão registrado ainda</h3>
           <p className="text-gray-400">Finalize as competições na aba de Relatórios para salvar o campeão no histórico ou crie um vencedor.</p>
         </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedChampions.map(champion => (
             <div 
               key={champion.id} 
               onClick={() => champion.finalLeaderboard && setSelectedChampion(champion)}
               className={`glow-panel rounded-xl flex flex-col items-center justify-center p-4 relative group ${champion.finalLeaderboard ? 'cursor-pointer hover:border-[#00C65E]/50 transition-colors' : ''}`}
             >
               {isAdmin && (
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {editingId === champion.id ? (
                      <button onClick={(e) => handleSave(e, champion.id)} className="p-1.5 bg-brand-cyan text-black rounded hover:opacity-80">
                         <Save size={14} />
                      </button>
                    ) : (
                      <>
                        <button onClick={(e) => startEdit(e, champion)} className="p-1.5 bg-gray-700 text-white rounded hover:bg-gray-600">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={(e) => handleDelete(e, champion.id)} className="p-1.5 bg-rose-600 text-white rounded hover:bg-rose-500">
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
               )}
               
               {editingId === champion.id ? (
                  <div className="flex flex-col gap-2 w-full mt-6" onClick={(e) => e.stopPropagation()}>
                    <input type="text" value={editForm.seasonName} onChange={e => setEditForm(prev => ({...prev, seasonName: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white text-center focus:border-brand-cyan outline-none" placeholder="Ano/Edição" />
                    <input type="text" value={editForm.teamName} onChange={e => setEditForm(prev => ({...prev, teamName: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white text-center focus:border-brand-cyan outline-none" placeholder="Time" />
                    <input type="text" value={editForm.imageUrl} onChange={e => setEditForm(prev => ({...prev, imageUrl: e.target.value}))} className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white text-center focus:border-brand-cyan outline-none" placeholder="URL do escudo" />
                  </div>
               ) : (
                 <>
                   <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-[#00C65E]/20 shadow-[0_0_15px_rgba(0,198,94,0.15)] relative">
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#00C65E]/10 to-transparent"></div>
                     {champion.imageUrl ? (
                       <img src={champion.imageUrl} alt={champion.teamName} className="w-full h-full object-cover relative z-10" referrerPolicy="no-referrer" />
                     ) : (
                       <Shield size={32} className="text-[#00C65E]/50 relative z-10" />
                     )}
                   </div>
                   <div className="flex flex-col items-center w-full gap-1.5">
                     <div className="px-2 py-1 w-full bg-[#00C65E]/10 border border-[#00C65E]/20 text-[#00C65E] rounded text-center font-bold text-[10px] tracking-widest uppercase shadow-sm leading-tight break-words">
                       {champion.seasonName}
                     </div>
                     <div className="text-white text-xs font-black uppercase tracking-wide text-center line-clamp-2 leading-tight">
                       {champion.teamName}
                     </div>
                   </div>
                 </>
               )}
             </div>
          ))}
        </div>
      )}

      {/* Leaderboard Modal */}
      {selectedChampion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedChampion(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-[#00C65E]/30">
                  {selectedChampion.imageUrl ? (
                    <img src={selectedChampion.imageUrl} alt={selectedChampion.teamName} className="w-full h-full object-cover" />
                  ) : (
                    <Trophy size={20} className="text-[#00C65E]" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase">{selectedChampion.seasonName}</h2>
                  <p className="text-sm font-bold text-[#00C65E] uppercase tracking-wider">Classificação Final</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedChampion(null)}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-800/50 text-gray-400 font-bold border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Equipe</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">J</th>
                    <th className="px-4 py-3 text-center hidden sm:table-cell">V</th>
                    <th className="px-4 py-3 text-center hidden sm:table-cell">E</th>
                    <th className="px-4 py-3 text-center hidden sm:table-cell">D</th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">GP</th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">GC</th>
                    <th className="px-4 py-3 text-center">SG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {selectedChampion.finalLeaderboard.map((entry: LeaderboardEntry, index: number) => (
                    <tr key={entry.teamId} className={`${index === 0 ? 'bg-[#00C65E]/5' : 'hover:bg-gray-800/20'} transition-colors`}>
                      <td className="px-4 py-3 font-bold text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-white">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white/10"
                            style={!entry.imageUrl ? { backgroundColor: entry.color || '#cbd5e1' } : undefined}
                          >
                            {entry.imageUrl ? (
                              <img src={entry.imageUrl} alt={entry.teamName} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <Shield size={12} className="text-black/50" />
                            )}
                          </div>
                          <span className={`${index === 0 ? 'text-[#00C65E]' : ''}`}>{entry.teamName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-white">{entry.points}</td>
                      <td className="px-4 py-3 text-center text-gray-400">{entry.played}</td>
                      <td className="px-4 py-3 text-center text-gray-400 hidden sm:table-cell">{entry.won}</td>
                      <td className="px-4 py-3 text-center text-gray-400 hidden sm:table-cell">{entry.drawn}</td>
                      <td className="px-4 py-3 text-center text-gray-400 hidden sm:table-cell">{entry.lost}</td>
                      <td className="px-4 py-3 text-center text-gray-400 hidden md:table-cell">{entry.goalsFor}</td>
                      <td className="px-4 py-3 text-center text-gray-400 hidden md:table-cell">{entry.goalsAgainst}</td>
                      <td className="px-4 py-3 text-center text-gray-400 font-bold">{entry.goalDifference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
