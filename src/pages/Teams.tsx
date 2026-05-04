import React, { useState } from 'react';
import { useChampionship } from '../context/ChampionshipContext';
import { useAuth } from '../context/AuthContext';
import { Shield, Plus, Trash2, Upload, Edit3 } from 'lucide-react';
import { Team } from '../types';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#000000', '#64748b'];

export function Teams() {
  const { teams, addTeam, updateTeam, removeTeam } = useChampionship();
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [newTeamImage, setNewTeamImage] = useState('');
  const [uiMessage, setUiMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const openAddModal = () => {
    setEditingTeam(null);
    setNewTeamName('');
    setSelectedColor(COLORS[0]);
    setNewTeamImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setNewTeamName(team.name);
    setSelectedColor(team.color || COLORS[0]);
    setNewTeamImage(team.imageUrl || '');
    setIsModalOpen(true);
  };

  const showMessage = (type: 'error' | 'success', text: string) => {
    setUiMessage({type, text});
    setTimeout(() => setUiMessage(null), 5000);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        setNewTeamImage(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    const teamObj: any = { name: newTeamName, color: selectedColor };
    teamObj.imageUrl = newTeamImage.trim() || null;
    
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, teamObj);
        showMessage('success', 'Time atualizado!');
      } else {
        await addTeam(teamObj);
        showMessage('success', 'Time adicionado!');
      }
      setNewTeamName('');
      setNewTeamImage('');
      setIsModalOpen(false);
      setEditingTeam(null);
    } catch (err: any) {
      console.error(err);
      let errorText = err.message;
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error === 'Missing or insufficient permissions.') {
          errorText = "O banco de dados recusou por Regra de Segurança do Firebase. (URL grande demais ou formato inválido).";
        }
      } catch (e) {
        // Not JSON
      }
      showMessage('error', errorText);
    }
  };

  return (
    <div className="space-y-6 relative">
      {uiMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl font-bold shadow-2xl transition-all border ${uiMessage.type === 'error' ? 'bg-red-950/90 text-red-400 border-red-900/50' : 'bg-green-950/90 text-green-400 border-green-900/50'}`}>
          {uiMessage.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipes</h1>
          <p className="text-gray-400 mt-1">{isAdmin ? 'Gerencie os times registrados no campeonato.' : 'Confira os times registrados no campeonato.'}</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-brand-cyan hover:bg-[#00b0d4] text-black px-4 py-2.5 rounded-lg font-bold transition-all border-glow"
          >
            <Plus size={18} />
            <span>Nova Equipe</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map(team => (
          <div key={team.id} className="glow-panel rounded-2xl p-5 hover:border-gray-600 transition-colors relative group">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 overflow-hidden bg-gray-800"
                style={!team.imageUrl ? { backgroundColor: team.color || '#cbd5e1' } : undefined}
              >
                {team.imageUrl ? (
                  <img src={team.imageUrl} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Shield className="text-white drop-shadow-md" size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                <h3 className="font-bold text-[11px] sm:text-xs text-white leading-tight uppercase truncate" title={team.name}>{team.name}</h3>
                <p className="text-[9px] text-gray-500 mt-0.5">Time Oficial</p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEditModal(team)}
                    className="p-2.5 text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-lg bg-gray-800/30 md:bg-transparent transition-all"
                    title="Editar time"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => removeTeam(team.id)}
                    className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg bg-gray-800/30 md:bg-transparent transition-all"
                    title="Excluir time"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="col-span-full py-12 text-center glow-panel border border-dashed border-gray-700 rounded-2xl">
            <Shield className="mx-auto text-gray-600 mb-3" size={40} />
            <h3 className="text-white font-bold">Nenhuma equipe cadastrada</h3>
            <p className="text-gray-500 text-sm mt-1">Comece adicionando equipes para o campeonato.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glow-panel rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold accent-cyan">{editingTeam ? 'Editar Equipe' : 'Cadastrar Nova Equipe'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Nome do Time</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none transition-all"
                  placeholder="Ex: Flamengo, Palmeiras..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Escudo/Logo (Opcional)</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={newTeamImage}
                      onChange={e => setNewTeamImage(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-white outline-none transition-all placeholder:text-gray-600 text-sm"
                      placeholder="Link da imagem..."
                    />
                  </div>
                  <div className="flex font-bold items-center text-sm text-gray-500 uppercase">ou</div>
                  <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-gray-600 px-4 py-2 shrink-0 rounded-lg flex items-center justify-center gap-2 transition-colors text-white font-bold text-sm">
                    <Upload size={16} />
                    <span className="hidden sm:inline">Arquivo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                {newTeamImage && (
                  <div className="mt-3 p-2 bg-gray-900/50 rounded-lg flex justify-between items-center border border-gray-800">
                    <img src={newTeamImage} alt="Preview" className="h-10 w-10 object-cover rounded-md" referrerPolicy="no-referrer" />
                    <button type="button" onClick={() => setNewTeamImage('')} className="text-red-400 hover:text-red-300 text-sm font-bold cursor-pointer px-2">Limpar</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Cor Principal</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTeam(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newTeamName.trim()}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-black hover:bg-[#00b0d4] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-colors border-glow"
                >
                  {editingTeam ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
