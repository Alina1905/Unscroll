import React, { useState, useEffect } from 'react';
import { logIntention } from '../utils/storage';

const IntentionModal = ({ card, onClose }) => {
  const [hint, setHint] = useState('Pause for a second. What are you here for?');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHint('Choose with intention, then the link opens.');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (reason) => {
    logIntention(reason, card.title, card.url);
    window.open(card.url, '_blank', 'noopener');
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(0,0,0,0.56)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div style={{
        width: 'min(100%, 460px)',
        background: 'var(--modal-bg)',
        border: '1.5px solid var(--card-border)',
        borderRadius: '22px',
        padding: '1.4rem',
        boxShadow: '0 24px 70px rgba(0,0,0,0.24)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--chip-bg)',
            border: '1.5px solid var(--card-border)',
            color: 'var(--text)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }}
        >
          ✕
        </button>
        <div style={{
          fontFamily: "var(--font-head)",
          fontSize: '0.68rem',
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: 'var(--muted)',
          marginBottom: '0.45rem'
        }}>
          Pause before you open
        </div>
        <div style={{
          fontFamily: "var(--font-head)",
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.25
        }}>
          Why are you opening <span style={{ color: 'var(--accent)' }}>{card.title}</span>?
        </div>
        <div style={{
          minHeight: '1.2rem',
          marginTop: '0.55rem',
          marginBottom: '1rem',
          color: 'var(--text2)',
          fontSize: '0.8rem',
          transition: 'opacity 0.2s'
        }}>
          {hint}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.7rem'
        }}>
          {['Learning', 'Entertainment', 'Research', 'Just curious'].map(reason => (
            <button
              key={reason}
              onClick={() => handleChoice(reason)}
              style={{
                border: '1.5px solid var(--card-border)',
                background: 'var(--chip-bg)',
                color: 'var(--text)',
                borderRadius: '16px',
                padding: '0.9rem 0.8rem',
                fontFamily: "var(--font-head)",
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntentionModal;