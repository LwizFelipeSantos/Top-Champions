import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from './AuthContext';
import { handleFirestoreError } from '../lib/firebaseErrors';
import { Team, Player, Match, LeaderboardEntry } from '../types';

interface ChampionshipContextType {
  teams: Team[];
  players: Player[];
  matches: Match[];
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  removeTeam: (id: string) => Promise<void>;
  addPlayer: (player: Omit<Player, 'id'>) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
  addMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  addMatchesBulk: (matches: Omit<Match, 'id'>[]) => Promise<void>;
  updateMatchDetails: (id: string, homeScore: number | null, awayScore: number | null, date: string) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  leaderboard: LeaderboardEntry[];
  resetData: () => Promise<void>;
}

const ChampionshipContext = createContext<ChampionshipContextType | undefined>(undefined);

export function ChampionshipProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  // Sincronizar Teams
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'teams'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Team[] = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() } as Team));
      setTeams(data);
    }, (err) => handleFirestoreError(err, 'list', '/teams'));
    return unsubscribe;
  }, [user]);

  // Sincronizar Players
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'players'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Player[] = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() } as Player));
      setPlayers(data);
    }, (err) => handleFirestoreError(err, 'list', '/players'));
    return unsubscribe;
  }, [user]);

  // Sincronizar Matches
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'matches'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Match[] = [];
      snapshot.forEach(d => data.push({ id: d.id, ...d.data() } as Match));
      setMatches(data);
    }, (err) => handleFirestoreError(err, 'list', '/matches'));
    return unsubscribe;
  }, [user]);

  const addTeam = async (team: Omit<Team, 'id'>) => {
    if (!user) return;
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'teams', id), {
        ...team,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, 'create', '/teams');
      throw err;
    }
  };

  const removeTeam = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'teams', id));
      // Delete associated players and matches using client side filter for simplicity
      // In a real app we might batch this or cloud function.
      const teamPlayers = players.filter(p => p.teamId === id);
      for (const p of teamPlayers) {
        await deleteDoc(doc(db, 'players', p.id));
      }
      const teamMatches = matches.filter(m => m.homeTeamId === id || m.awayTeamId === id);
      for (const m of teamMatches) {
        await deleteDoc(doc(db, 'matches', m.id));
      }
    } catch (err) {
      handleFirestoreError(err, 'delete', `/teams/${id}`);
    }
  };

  const addPlayer = async (player: Omit<Player, 'id'>) => {
    if (!user) return;
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'players', id), {
        ...player,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, 'create', '/players');
    }
  };

  const removePlayer = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'players', id));
    } catch (err) {
      handleFirestoreError(err, 'delete', `/players/${id}`);
    }
  };

  const addMatch = async (match: Omit<Match, 'id'>) => {
    if (!user) return;
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, 'matches', id), {
        ...match,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, 'create', '/matches');
    }
  };

  const addMatchesBulk = async (newMatches: Omit<Match, 'id'>[]) => {
    if (!user) return;
    try {
      if (newMatches.length === 0) return;
      
      // Divide arrays maiores que 450 para garantir não esbarrar no limite de 500 de Firestore WriteBatch
      const chunkSize = 450;
      for (let i = 0; i < newMatches.length; i += chunkSize) {
        const chunk = newMatches.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        chunk.forEach(match => {
          const id = crypto.randomUUID();
          const matchRef = doc(db, 'matches', id);
          batch.set(matchRef, {
            ...match,
            userId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
        await batch.commit();
      }
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, 'write', '/matches');
      throw err;
    }
  };

  const updateMatchDetails = async (id: string, homeScore: number | null, awayScore: number | null, date: string) => {
    if (!user) return;
    const match = matches.find(m => m.id === id);
    if (!match) return;

    try {
      await updateDoc(doc(db, 'matches', id), {
        homeScore,
        awayScore,
        date,
        status: (homeScore !== null && awayScore !== null) ? 'finished' : 'scheduled',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, 'update', `/matches/${id}`);
    }
  };

  const deleteMatch = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'matches', id));
    } catch (err) {
      handleFirestoreError(err, 'delete', `/matches/${id}`);
    }
  };

  const resetData = async () => {
    if (!user) return;
    try {
      const refsToDelete = [
        ...players.map(p => doc(db, 'players', p.id)),
        ...matches.map(m => doc(db, 'matches', m.id)),
        ...teams.map(t => doc(db, 'teams', t.id))
      ];

      if (refsToDelete.length === 0) {
        console.warn("Não há dados para deletar no servidor.");
        return;
      }

      for (let i = 0; i < refsToDelete.length; i += 500) {
        const batch = writeBatch(db);
        refsToDelete.slice(i, i + 500).forEach(ref => {
          batch.delete(ref);
        });
        await batch.commit();
      }
    } catch (err) {
      console.error("Erro ao resetar os dados: ", err);
      handleFirestoreError(err, 'delete', '/resetData');
      throw err;
    }
  };

  // Calcula a classificação em tempo real
  const leaderboard = React.useMemo(() => {
    const table: Record<string, LeaderboardEntry> = {};

    // Inicializa a tabela com todos os times
    teams.forEach(team => {
      table[team.id] = {
        teamId: team.id,
        teamName: team.name,
        color: team.color,
        imageUrl: team.imageUrl,
        played: 0, won: 0, drawn: 0, lost: 0,
        points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0
      };
    });

    // Processa os jogos finalizados
    matches.filter(m => m.status === 'finished').forEach(match => {
      const home = table[match.homeTeamId];
      const away = table[match.awayTeamId];

      if (!home || !away) return; // Ignora se o time não existir mais

      home.played += 1;
      away.played += 1;
      
      home.goalsFor += match.homeScore || 0;
      home.goalsAgainst += match.awayScore || 0;
      home.goalDifference = home.goalsFor - home.goalsAgainst;

      away.goalsFor += match.awayScore || 0;
      away.goalsAgainst += match.homeScore || 0;
      away.goalDifference = away.goalsFor - away.goalsAgainst;

      if ((match.homeScore || 0) > (match.awayScore || 0)) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if ((match.homeScore || 0) < (match.awayScore || 0)) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    });

    // Ordenação: Pontos > Vitórias > Saldo de Gols > Gols Pró
    return Object.values(table).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.won !== a.won) return b.won - a.won;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }, [teams, matches]);

  return (
    <ChampionshipContext.Provider value={{
      teams, players, matches,
      addTeam, removeTeam, addPlayer, removePlayer,
      addMatch, addMatchesBulk, updateMatchDetails, deleteMatch,
      leaderboard, resetData
    }}>
      {children}
    </ChampionshipContext.Provider>
  );
}

export function useChampionship() {
  const context = useContext(ChampionshipContext);
  if (context === undefined) {
    throw new Error('useChampionship must be used within a ChampionshipProvider');
  }
  return context;
}
