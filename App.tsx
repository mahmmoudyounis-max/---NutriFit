import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import { getUser } from './services/storage';
import { UserProfile } from './types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadedUser = getUser();
    if (loadedUser) {
      setUser(loadedUser);
      // Stay on current view if refreshing, or default to home/dashboard logic?
      // Simple logic: if user exists, dashboard is accessible.
    }
  }, []);

  const handleAuthSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <Auth onAuthSuccess={handleAuthSuccess} />;
      case 'dashboard':
        return user ? <Dashboard user={user} setUser={setUser} /> : <Auth onAuthSuccess={handleAuthSuccess} />;
      case 'home':
      default:
        return <Home onStart={() => setCurrentView(user ? 'dashboard' : 'auth')} />;
    }
  };

  return (
    <Layout user={user} setUser={setUser} setView={setCurrentView} currentView={currentView}>
      {renderView()}
    </Layout>
  );
}

export default App;