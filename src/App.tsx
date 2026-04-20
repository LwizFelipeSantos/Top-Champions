import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChampionshipProvider } from './context/ChampionshipContext';
import { Layout } from './components/Layout';
import { Leaderboard } from './pages/Leaderboard';
import { Teams } from './pages/Teams';
import { Players } from './pages/Players';
import { Matches } from './pages/Matches';
import { Reports } from './pages/Reports';
import { Landing } from './pages/Landing';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('leaderboard');
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark text-brand-text flex items-center justify-center">
        <div className="text-brand-cyan text-xl font-bold border-glow px-6 py-4 rounded-xl glow-panel">
          CARREGANDO...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Landing onLogin={signInWithGoogle} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'leaderboard': return <Leaderboard />;
      case 'teams': return <Teams />;
      case 'players': return <Players />;
      case 'matches': return <Matches />;
      case 'reports': return <Reports />;
      default: return <Leaderboard />;
    }
  };

  return (
    <ChampionshipProvider>
      <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderContent()}
      </Layout>
    </ChampionshipProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
