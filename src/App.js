import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ThemeScreen from './components/ThemeScreen';
import InterestsScreen from './components/InterestsScreen';
import DashboardScreen from './components/DashboardScreen';
import { loadPrefs, savePrefs, clearPrefs } from './utils/storage';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [theme, setTheme] = useState('');
  const [interests, setInterests] = useState(new Set());

  useEffect(() => {
    const savedPrefs = loadPrefs();
    if (savedPrefs && savedPrefs.interests && savedPrefs.interests.length >= 3) {
      setTheme(savedPrefs.theme || '');
      setInterests(new Set(savedPrefs.interests));
      document.body.className = savedPrefs.theme || '';
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleSplashComplete = () => {
    setCurrentScreen('theme');
  };

  const handleThemeSelected = (selectedTheme) => {
    setTheme(selectedTheme);
    setCurrentScreen('interests');
  };

  const handleInterestsComplete = (selectedInterests) => {
    setInterests(selectedInterests);
    savePrefs(theme, selectedInterests);
    setCurrentScreen('dashboard');
  };

  const handleReset = () => {
    clearPrefs();
    setTheme('');
    setInterests(new Set());
    setCurrentScreen('splash');
    window.location.reload();
  };

  const handleChangeTheme = () => {
    setCurrentScreen('theme');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentScreen === 'theme') {
    return <ThemeScreen onNext={handleThemeSelected} initialTheme={theme} />;
  }

  if (currentScreen === 'interests') {
    return (
      <InterestsScreen
        onComplete={handleInterestsComplete}
        initialInterests={interests}
        onBack={() => setCurrentScreen('theme')}
      />
    );
  }

  if (currentScreen === 'dashboard') {
    return (
      <DashboardScreen
        theme={theme}
        interests={interests}
        onReset={handleReset}
        onChangeTheme={handleChangeTheme}
      />
    );
  }

  return null;
}

export default App;