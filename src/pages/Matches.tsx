import React, { useState } from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import { Calendar, Plus, Trash2, CheckCircle2, ChevronDown, ListEnd } from 'lucide-react';
import { Match } from '../types';

export function Matches() {
  const { matches, teams, addMatch, addMatchesBulk, updateMatchDetails, deleteMatch } = useChampionship();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Generator state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [genRounds, setGenRounds] = useState(1);
  const [genRandom, setGenRandom] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // New match state
  const [round, setRound] = useState(1);
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [date, setDate] = useState('');

  // Status de placares em edição
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [tempScores, setTempScores] = useState({ home: '', away: '', date: '' });
  
  // Custom toast/error messages for iframe sandbox safety
  const [uiMessage, setUiMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const showMessage = (type: 'error' | 'success', text: string) => {
    setUiMessage({type, text});
    setTimeout(() => setUiMessage(null), 5000); // clear after 5s
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) return;
    addMatch({
      round,
      homeTeamId,
      awayTeamId,
      date,
      status: 'scheduled',
      homeScore: null,
      awayScore: null
    });
    setIsModalOpen(false);
    setHomeTeamId('');
    setAwayTeamId('');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      // Logic inside remains the same...
      let t = [...teams];
      if (genRandom) {
          t = t.sort(() => Math.random() - 0.5);
      }
      const hasGhost = t.length % 2 !== 0;
      if (hasGhost) t.push({ id: 'ghost', name: 'BYE', color: '' } as any);
      
      const matchesToCreate: Omit<Match, 'id'>[] = [];
      const n = t.length;
      
      for (let r = 0; r < genRounds; r++) {
          for (let i = 0; i < n / 2; i++) {
              let home = t[i];
              let away = t[n - 1 - i];
              
              if (home.id !== 'ghost' && away.id !== 'ghost') {
                  const isEvenTurn = Math.floor(r / (n - 1)) % 2 === 1;
                  if (isEvenTurn || (i === 0 && r % 2 === 1)) {
                      [home, away] = [away, home]; 
                  }
                  
                  matchesToCreate.push({
                      round: r + 1,
                      homeTeamId: home.id,
                      awayTeamId: away.id,
                      homeScore: null,
                      awayScore: null,
                      status: 'scheduled',
                      date: ''
                  });
              }
          }
          t.splice(1, 0, t.pop()!); // Rotaciona as equipes
      }
      
      await addMatchesBulk(matchesToCreate);
      setIsGenerateModalOpen(false);
      showMessage('success', 'A tabela foi gerada com sucesso!');
    } catch (err: any) {
      console.error(err);
      showMessage('error', "Erro na lógica de geração: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScore = (matchId: string) => {
    const hs = tempScores.home === '' ? null : parseInt(tempScores.home);
    const as = tempScores.away === '' ? null : parseInt(tempScores.away);
    updateMatchDetails(matchId, hs, as, tempScores.date);
    setEditingScore(null);
  };

  const startEditing = (match: any) => {
    setEditingScore(match.id);
    setTempScores({
      home: match.homeScore !== null ? String(match.homeScore) : '',
      away: match.awayScore !== null ? String(match.awayScore) : '',
      date: match.date || ''
    });
  };

  // Agrupar partidas por rodada
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) acc[match.round] = [];
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, typeof matches>);

  const sortedRounds = Object.keys(matchesByRound).map(Number).sort((a, b) => b - a); // Mostrar as mais recentes primeiro

  return (
    <div className="space-y-6 relative">
      {uiMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl font-bold shadow-2xl transition-all border ${uiMessage.type === 'error' ? 'bg-red-950/90 text-red-400 border-red-900/50' : 'bg-green-950/90 text-green-400 border-green-900/50'}`}>
          {uiMessage.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jogos</h1>
          <p className="text-gray-400 mt-1">Gere rodadas e registre os resultados das partidas.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (teams.length < 2) {
                showMessage('error', "Você precisa cadastrar pelo menos 2 equipes na aba 'Times' primeiro.");
                return;
              }
              if (matches.length > 0) {
                showMessage('error', "Já existem jogos na tabela. Vá em Relatórios > Apagar Tudo primeiro.");
                return;
              }
              setGenRounds(teams.length > 0 ? (teams.length % 2 === 0 ? teams.length - 1 : teams.length) : 1);
              setIsGenerateModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all"
          >
            <ListEnd size={18} />
            <span className="hidden sm:inline">Gerar Tabela</span>
            <span className="sm:hidden">Gerar</span>
          </button>
          <button
            onClick={() => {
              if (teams.length < 2) {
                showMessage('error', "Você precisa cadastrar pelo menos 2 equipes primeiro.");
                return;
              }
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-brand-cyan hover:bg-[#00b0d4] text-black px-4 py-2.5 rounded-lg font-bold transition-all border-glow"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nova Partida</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </div>

      {teams.length < 2 && (
         <div className="p-4 bg-amber-900/20 text-amber-500 rounded-lg border border-amber-900/50 text-sm font-bold">
           Aviso: Você precisa de pelo menos 2 equipes cadastradas para criar partidas.
         </div>
      )}

      {matches.length === 0 ? (
        <div className="py-16 text-center glow-panel rounded-2xl">
          <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-white font-bold text-lg">Nenhum jogo agendado</h3>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">Comece agendando os confrontos entre as equipes registradas.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedRounds.map(r => (
            <div key={r} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4 border-b border-gray-800 pb-2 flex-1">
                  Rodada {r}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchesByRound[r].map(match => {
                  const home = getTeam(match.homeTeamId);
                  const away = getTeam(match.awayTeamId);
                  const isEditing = editingScore === match.id;

                  if (!home || !away) return null;

                  return (
                    <div key={match.id} className="glow-panel rounded-2xl p-6 relative group border border-gray-700 hover:border-gray-500 transition-colors">
                      <button 
                        onClick={() => deleteMatch(match.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Deletar jogo"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex justify-center mb-4 min-h-[30px]">
                        {isEditing ? (
                          <input
                            type="date"
                            value={tempScores.date}
                            onChange={e => setTempScores(prev => ({...prev, date: e.target.value}))}
                            className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1 outline-none focus:border-brand-cyan [color-scheme:dark]"
                          />
                        ) : (
                          <div className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-1">
                            {match.date ? new Date(match.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'DATA A DEFINIR'}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between px-2 gap-4">
                        {/* Time Casa */}
                        <div className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden bg-gray-800" style={!home.imageUrl ? { backgroundColor: home.color || '#cbd5e1' } : undefined}>
                            {home.imageUrl ? (
                              <img src={home.imageUrl} alt={home.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="font-bold text-white text-xs">{home.name.substring(0,3).toUpperCase()}</span>
                            )}
                          </div>
                          <span className="font-bold text-gray-300 text-sm text-center line-clamp-1">{home.name}</span>
                        </div>

                        {/* Placar Central */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          {isEditing ? (
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900 border border-gray-700">
                              <input 
                                type="number" 
                                min="0" 
                                value={tempScores.home} 
                                onChange={e => setTempScores(prev => ({...prev, home: e.target.value}))}
                                className="w-10 text-center font-bold bg-black border border-gray-700 rounded text-white"
                                placeholder="-"
                              />
                              <span className="text-gray-500 font-bold">X</span>
                              <input 
                                type="number" 
                                min="0" 
                                value={tempScores.away} 
                                onChange={e => setTempScores(prev => ({...prev, away: e.target.value}))}
                                className="w-10 text-center font-bold bg-black border border-gray-700 rounded text-white"
                                placeholder="-"
                              />
                            </div>
                          ) : (
                            <div 
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-mono text-xl 
                                ${match.status === 'finished' ? 'bg-gray-900 text-white border border-gray-700' : 'bg-transparent text-gray-500'}`}
                            >
                              <span className={match.status === 'finished' ? 'accent-cyan' : ''}>{match.status === 'finished' ? match.homeScore : '-'}</span>
                              <span className="text-sm font-normal opacity-50">VS</span>
                              <span className={match.status === 'finished' ? 'accent-cyan' : ''}>{match.status === 'finished' ? match.awayScore : '-'}</span>
                            </div>
                          )}
                        </div>

                        {/* Time Fora */}
                        <div className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden bg-gray-800" style={!away.imageUrl ? { backgroundColor: away.color || '#cbd5e1' } : undefined}>
                            {away.imageUrl ? (
                              <img src={away.imageUrl} alt={away.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="font-bold text-white text-xs">{away.name.substring(0,3).toUpperCase()}</span>
                            )}
                          </div>
                          <span className="font-bold text-gray-300 text-sm text-center line-clamp-1">{away.name}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-center">
                        {isEditing ? (
                          <button 
                            onClick={() => handleSaveScore(match.id)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-cyan hover:text-white bg-brand-cyan/10 border border-brand-cyan/30 px-4 py-2 rounded-lg transition-colors"
                          >
                            <CheckCircle2 size={16} /> Salvar
                          </button>
                        ) : (
                          <button 
                            onClick={() => startEditing(match)}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            {match.status === 'finished' ? 'Editar Partida' : 'Lançar Partida'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Gerar Tabela */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glow-panel rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold accent-cyan flex items-center gap-2">
                <ListEnd size={24} /> Gerar Campeonato
              </h2>
            </div>
            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                O formato pontos corridos exige (N-1) rodadas por turno. Ex: Para {teams.length} equipes, 1 turno leva {teams.length % 2 === 0 ? teams.length - 1 : teams.length} rodadas.
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Total de Rodadas</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={genRounds}
                  onChange={e => setGenRounds(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Defina o número exato de rodadas a serem preenchidas.</p>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
                <input
                   type="checkbox"
                   checked={genRandom}
                   onChange={e => setGenRandom(e.target.checked)}
                   className="w-5 h-5 rounded border-gray-700 text-brand-cyan focus:ring-brand-cyan bg-black"
                />
                <div>
                  <div className="text-sm font-bold text-white">Sorteio Aleatório</div>
                  <div className="text-xs text-gray-500">Embaralha as equipes garantindo ordem aleatória na tabela ao invés da ordem de registro.</div>
                </div>
              </label>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || genRounds < 1}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-black hover:bg-[#00b0d4] disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg font-bold border-glow flex items-center justify-center"
                >
                  {isGenerating ? 'Gerando...' : 'Criar Partidas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Partida */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glow-panel rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold accent-cyan">Agendar Partida</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                 <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Rodada</label>
                  <input
                    type="number"
                    min="1"
                    value={round}
                    onChange={e => setRound(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none"
                    required
                  />
                 </div>
                 <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Data (Opcional)</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none [color-scheme:dark]"
                  />
                 </div>
              </div>

              <div className="space-y-3 relative py-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Mandante</label>
                  <select
                    value={homeTeamId}
                    onChange={e => setHomeTeamId(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    {teams.filter(t => t.id !== awayTeamId).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-gray-900 px-2 text-xs font-bold text-gray-500 border border-gray-700 rounded-full w-8 h-8 flex items-center justify-center">VS</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Visitante</label>
                  <select
                    value={awayTeamId}
                    onChange={e => setAwayTeamId(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    {teams.filter(t => t.id !== homeTeamId).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
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
                  disabled={!homeTeamId || !awayTeamId || homeTeamId === awayTeamId}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-black hover:bg-[#00b0d4] disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg font-bold border-glow"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
