import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WorkerDashboard from './components/WorkerDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import Onboarding from './components/Onboarding';
import SettingsPage from './components/SettingsPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import type { User, UserType, WorkerProfile, EmployerProfile } from './types';
import { LocalizationProvider } from './lib/localization';
import * as db from './lib/database';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<WorkerProfile | EmployerProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('signup');
  const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    db.seedDatabase(); // Seed with initial data if DB is empty
    const sessionUser = db.getCurrentUser();
    if (sessionUser) {
        handleLoginSuccess(sessionUser.username);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleLoginSuccess = (username: string) => {
    const user = db.getUser(username);
    if (user) {
        setCurrentUser(user);
        db.setCurrentUser(user);
        const profile = db.getUserProfile(username);
        if (profile) {
            setUserProfile(profile);
            setIsOnboarded(true);
        } else {
            setUserProfile(null);
            setIsOnboarded(false);
        }
    }
  };

  const handleOnboardingComplete = (profileData: Partial<WorkerProfile & EmployerProfile>, userType: UserType) => {
    if (currentUser) {
        db.saveUserProfile(currentUser.username, profileData, userType);
        const user = db.getUser(currentUser.username);
        const profile = db.getUserProfile(currentUser.username);
        if (user && profile) {
          setCurrentUser(user); // refresh user data with type
          setUserProfile(profile);
          setIsOnboarded(true);
        }
    }
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setUserProfile(null);
    setIsOnboarded(false);
    setActiveView('dashboard');
    setAuthView('login');
  }

  const handleNavigateToSettings = () => {
    setActiveView('settings');
  };

  const handleNavigateToDashboard = () => {
    setActiveView('dashboard');
  };

  const renderDashboard = () => {
    if (!currentUser) return null;
    
    switch (currentUser.type) {
      case 'worker':
        return <WorkerDashboard username={currentUser.username} onNavigateToSettings={handleNavigateToSettings} />;
      case 'employer':
        return <EmployerDashboard username={currentUser.username} onNavigateToSettings={handleNavigateToSettings} />;
      default:
        // This case should ideally not be hit if user is onboarded,
        // but as a fallback we can direct to onboarding
        return <Onboarding currentUser={currentUser} onOnboardingComplete={handleOnboardingComplete} />;
    }
  };

  const renderContent = () => {
    if (!currentUser) {
      if (authView === 'login') {
        return <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setAuthView('signup')} />;
      }
      return <SignUp onSignUpSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthView('login')} />;
    }
    
    if (!isOnboarded || !currentUser.type) {
      return <Onboarding currentUser={currentUser} onOnboardingComplete={handleOnboardingComplete} />;
    }
    
    return (
       <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-gray-800 dark:text-slate-200 transition-colors duration-300">
          <Header 
            userProfile={userProfile} 
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
            onNavigateToSettings={handleNavigateToSettings}
          />
          <main className="container mx-auto p-4 md:p-8">
            {activeView === 'dashboard' && renderDashboard()}
            {activeView === 'settings' && <SettingsPage onBack={handleNavigateToDashboard} />}
          </main>
        </div>
    );
  }

  return (
    <LocalizationProvider>
      {renderContent()}
    </LocalizationProvider>
  );
};

export default App;
