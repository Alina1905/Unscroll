import React, { useState } from 'react';
import { MOOD_SUGGESTIONS } from '../data/content';

const MoodSection = ({ onMoodChange }) => {
  const [activeMood, setActiveMood] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  const setMood = (emoji) => {
    setActiveMood(emoji);
    if (onMoodChange) {
      onMoodChange(emoji);
    }
    const suggestionData = MOOD_SUGGESTIONS[emoji];
    if (suggestionData) {
      setSuggestion(suggestionData);
    } else {
      setSuggestion(null);
    }
  };

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: '16px',
      padding: '1.1rem 1.2rem',
      border: '1.5px solid var(--card-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{
        fontFamily: "var(--font-head)",
        fontSize: '0.82rem',
        fontWeight: 700,
        color: 'var(--text2)',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        How are you feeling right now?
      </div>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        {['😴', '😐', '😊', '🥱', '🔥', '😤'].map(emoji => (
          <button
            key={emoji}
            onClick={() => setMood(emoji)}
            style={{
              padding: '0.4rem 0.7rem',
              borderRadius: '12px',
              border: `2px solid ${activeMood === emoji ? 'var(--accent)' : 'var(--card-border)'}`,
              background: activeMood === emoji ? 'var(--accent)' : 'var(--chip-bg)',
              fontSize: '1.3rem',
              cursor: 'pointer',
              transition: 'all 0.18s',
              lineHeight: 1,
              transform: activeMood === emoji ? 'scale(1.15)' : 'scale(1)'
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
      {suggestion && (
        <div style={{
          background: 'linear-gradient(135deg, var(--chip-bg), var(--bg))',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          borderLeft: `3px solid var(--accent)`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.7rem',
          animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{suggestion.icon}</div>
          <div style={{
            fontSize: '0.82rem',
            color: 'var(--text2)',
            lineHeight: 1.55
          }} dangerouslySetInnerHTML={{ __html: suggestion.text }} />
        </div>
      )}
    </div>
  );
};

export default MoodSection;