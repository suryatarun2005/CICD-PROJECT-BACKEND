import React, { useState } from 'react';
import { AuthProvider } from './hooks/useAuth.jsx';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { MedicalHistory } from './components/MedicalHistory';
import { Appointments } from './components/Appointments';
import { Medications } from './components/Medications';
import { LabResults } from './components/LabResults';
import { Profile } from './components/Profile';
import { Navigation } from './components/Navigation';

function AppContent() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'signup', 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    // In a real app, you would validate credentials here
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleSignupSuccess = () => {
    // In a real app, you would create the account here
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    setActiveTab('dashboard');
  };

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    if (currentView === 'login') {
      return (
        <Login 
          onSwitchToSignup={() => setCurrentView('signup')}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    
    if (currentView === 'signup') {
      return (
        <Signup 
          onSwitchToLogin={() => setCurrentView('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      );
    }
    
    return (
      <LandingPage 
        onShowLogin={() => setCurrentView('login')}
        onShowSignup={() => setCurrentView('signup')}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'medical-history':
        return <MedicalHistory />;
      case 'appointments':
        return <Appointments />;
      case 'medications':
        return <Medications />;
      case 'lab-results':
        return <LabResults />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;