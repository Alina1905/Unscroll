import React, { useState } from 'react';
import { THEME_META } from '../data/content';

const THEMES = [
  { id: '', name: 'Default Bright', icon: '✨', note: 'Warm, vivid & welcoming', class: 'tc-default' },
  { id: 'theme-conspiracy', name: 'Conspiracy Dark', icon: '🕵️', note: 'Shadowy, occult & cursed', class: 'tc-conspiracy' },
  { id: 'theme-neon', name: 'Neon Gamer', icon: '⚡', note: 'Electric green grid on black', class: 'tc-neon' },
  { id: 'theme-bookworm', name: 'Bookworm', icon: '📚', note: 'Warm parchment & aged ink', class: 'tc-bookworm' },
  { id: 'theme-ocean', name: 'Ocean Focus', icon: '🌊', note: 'Refreshing sky blue calm', class: 'tc-ocean' },
  { id: 'theme-forest', name: 'Forest Calm', icon: '🌿', note: 'Bright leafy summer green', class: 'tc-forest' },
  { id: 'theme-kpop', name: 'K-Pop Glow', icon: '💖', note: 'Bubblegum, sparkle & idol energy', class: 'tc-kpop' },
  { id: 'theme-study', name: 'Study Core', icon: '📓', note: 'Clean academic blue-white', class: 'tc-study' },
  { id: 'theme-street', name: 'Streetwear Drop', icon: '🧢', note: 'Dark mono with fire orange edge', class: 'tc-street' },
  { id: 'theme-matcha', name: 'Matcha Chill', icon: '🍵', note: 'Sage ritual energy', class: 'tc-matcha' },
  { id: 'theme-vapor', name: 'Vaporwave', icon: '🌈', note: 'Neon retro synthwave dream', class: 'tc-vapor' },
  { id: 'theme-creator', name: 'Creator Mode', icon: '🎥', note: 'Warm magenta creative energy', class: 'tc-creator' },
];

const ThemeScreen = ({ onNext, initialTheme = '' }) => {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);

  const pickTheme = (themeId) => {
    setSelectedTheme(themeId);
    document.body.className = themeId;
  };

  const handleNext = () => {
    onNext(selectedTheme);
  };

  return (
    <div className="screen active" style={{
      padding: '2rem 2rem 2.5rem',
      gap: '1.2rem',
      alignItems: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "var(--font-head)",
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-2px',
          color: 'var(--accent)',
          lineHeight: 1
        }}>
          Un<span style={{ color: 'var(--accent3)' }}>Scroll</span>
        </div>
        <div style={{
          color: 'var(--text2)',
          fontSize: '0.95rem',
          marginTop: '0.4rem',
          lineHeight: 1.5
        }}>
          Pick a vibe. Your whole dashboard changes around it.
        </div>
      </div>
      <div style={{
        fontFamily: "var(--font-head)",
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        color: 'var(--muted)'
      }}>
        Choose your vibe
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.9rem',
        width: '100%',
        maxWidth: '1100px'
      }}>
        {THEMES.map(theme => (
          <div
            key={theme.id}
            className={`th-card ${theme.class} ${selectedTheme === theme.id ? 'sel' : ''}`}
            onClick={() => pickTheme(theme.id)}
            style={{
              padding: '1.4rem 1rem',
              borderRadius: '18px',
              cursor: 'pointer',
              border: `2.5px solid ${selectedTheme === theme.id ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.25s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.45rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '130px',
              justifyContent: 'center',
              background: `var(--${theme.class.replace('tc-', '')})`,
              color: 'inherit'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{theme.icon}</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, lineHeight: 1.2 }}>{theme.name}</span>
            <span style={{ fontSize: '0.67rem', opacity: 0.85, lineHeight: 1.4 }}>{theme.note}</span>
          </div>
        ))}
      </div>
      <button
        className="go-btn"
        onClick={handleNext}
        style={{
          padding: '0.85rem 2.6rem',
          borderRadius: '50px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "var(--font-head)",
          fontSize: '1rem',
          fontWeight: 800,
          letterSpacing: '0.5px',
          transition: 'all 0.22s',
          background: 'var(--accent)',
          color: 'var(--btn-text)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
        }}
      >
        Next: Pick Interests →
      </button>
    </div>
  );
};

export default ThemeScreen;