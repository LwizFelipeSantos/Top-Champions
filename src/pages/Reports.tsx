import React, { useState } from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import { useAuth } from '../context/AuthContext';
import { Database, AlertCircle, RefreshCw, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function Reports() {
  const { leaderboard, teams, resetData, addChampion } = useChampionship();
  const { isAdmin } = useAuth();
  const [seasonName, setSeasonName] = useState(new Date().getFullYear().toString());

  // Preparar os dados para o gráfico
  const chartData = leaderboard.slice(0, 10).map(entry => ({
    name: entry.teamName,
    Pontos: entry.points,
    GolsPro: entry.goalsFor,
    fill: entry.color || '#cbd5e1'
  }));

  const [uiMessage, setUiMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const showMessage = (type: 'error' | 'success', text: string) => {
    setUiMessage({type, text});
    setTimeout(() => setUiMessage(null), 5000); // clear after 5s
  }

  const handleReset = async () => {
    try {
      await resetData();
      showMessage('success', 'Campeonato deletado com sucesso!');
    } catch (err: any) {
      console.error(err);
      showMessage('error', 'Houve um erro ao deletar: ' + err.message);
    }
  }

  const handleFinalize = async () => {
    if (leaderboard.length === 0) {
      showMessage('error', 'Não há times na classificação para definir um campeão.');
      return;
    }
    const championEntry = leaderboard[0];
    if (!seasonName.trim()) {
      showMessage('error', 'Informe o ano ou nome da temporada para salvar o campeão.');
      return;
    }

    try {
      await addChampion({
        seasonName: seasonName.trim(),
        teamId: championEntry.teamId,
        teamName: championEntry.teamName,
        imageUrl: championEntry.imageUrl || '',
        finalLeaderboard: [...leaderboard]
      });
      showMessage('success', 'Campeonato finalizado! O campeão foi salvo no histórico.');
    } catch(err: any) {
      console.error(err);
      showMessage('error', 'Houve um erro salvar o campeão: ' + err.message);
    }
  }

  return (
    <div className="space-y-8 relative">
      {uiMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold shadow-2xl transition-all border ${uiMessage.type === 'error' ? 'bg-red-950/90 text-red-400 border-red-900/50' : 'bg-green-950/90 text-green-400 border-green-900/50'}`}>
          {uiMessage.text}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios & Dados</h1>
        <p className="text-gray-400 mt-1">Estatísticas do campeonato e configurações de banco de dados.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel Estatístico */}
        <div className="glow-panel rounded-2xl p-6">
          <h2 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-6">Desempenho (Top 10)</h2>
          
          {chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363d" />
                  <XAxis dataKey="name" tick={{ fill: '#e6edf3', fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#e6edf3', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(22,27,34,0.9)', borderColor: '#30363d', color: '#e6edf3' }} />
                  <Legend wrapperStyle={{ color: '#e6edf3' }} />
                  <Bar dataKey="Pontos" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="GolsPro" fill="#58a6ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
              Sem dados suficientes para o gráfico
            </div>
          )}
        </div>

        {/* Integração de Drive / Banco DB */}
        <div className="space-y-6">
          <div className="glow-panel rounded-2xl p-6 relative overflow-hidden">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3 accent-cyan">
              <Database size={20} /> 
              Sincronização
            </h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              O seu aplicativo agora está conectado ativamente em tempo real ao <strong>Firebase</strong>. 
              Todas as modificações de times, jogadores, rodadas e placares estão garantidas na nuvem e são renderizadas sem recarregar a tela usando WebSockets nativos (onSnapshot).
            </p>
            
            <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold accent-cyan flex gap-2 items-center mb-1">
                <AlertCircle size={16} /> 
                Firebase Cloud Firestore 
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {isAdmin ? 'As regras de segurança estão aplicadas. Seus dados estão restritos apenas para o seu usuário (via Google Auth).' : 'Os dados estão em modo de apenas leitura para visitantes.'}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-col gap-6">
              <div className="glow-panel border-[#00C65E]/50 p-6 rounded-2xl bg-[#00C65E]/10">
                <h2 className="text-lg font-bold text-[#00C65E] mb-2">Finalizar Competição</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Define o clube {leaderboard.length > 0 ? <span className="text-white font-bold">{leaderboard[0].teamName}</span> : 'primeiro colocado'} como o grande campeão com base na classificação atual e salva no histórico. Salvar o campeão não apaga os times nem as partidas atuais.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={seasonName}
                    onChange={e => setSeasonName(e.target.value)}
                    placeholder="Ano / Temporada"
                    className="bg-gray-900 border border-[#00C65E]/30 text-white rounded-lg px-4 py-2.5 outline-none focus:border-[#00C65E] transition-colors w-full sm:w-1/3 text-sm font-bold placeholder-gray-500"
                  />
                  <button 
                    onClick={handleFinalize}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00C65E] hover:bg-[#00a34b] text-black px-4 py-2.5 rounded-lg text-sm font-black transition-colors"
                  >
                    <Trophy size={16} />
                    Salvar Campeão no Histórico
                  </button>
                </div>
              </div>

              <div className="glow-panel border-rose-900/50 p-6 rounded-2xl bg-rose-950/20">
                <h2 className="text-lg font-bold text-rose-500 mb-2">Zona de Perigo</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Isso irá deletar todas as equipes, jogadores e partidas da competição atual (não apaga o histórico de campeões). A ação é irreversível. (Clique 2 vezes para confirmar)
                </p>
                <button 
                  onDoubleClick={handleReset}
                  className="flex items-center justify-center gap-2 w-full bg-rose-600/20 hover:bg-rose-600 border border-rose-600/50 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
                >
                  <RefreshCw size={16} />
                  Resetar Competição Atual
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
