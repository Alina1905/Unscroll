import React, { useState } from 'react';
import { INTERESTS } from '../data/content';

const InterestsScreen = ({ onComplete, initialInterests = new Set(), onBack }) => {
  const [picked, setPicked] = useState(new Set(initialInterests));

  const toggleInterest = (id) => {
    const newPicked = new Set(picked);
    if (newPicked.has(id)) {
      newPicked.delete(id);
    } else {
      newPicked.add(id);
    }
    setPicked(newPicked);
  };

  const handleBuildDashboard = () => {
    if (picked.size >= 3) {
      onComplete(picked);
    }
  };

  return (
    <div className="screen" style={{
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '2rem 2rem 1rem',
        textAlign: 'center',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          fontFamily: "var(--font-head)",
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2
        }}>
          What lights you up? 🔥
        </div>
        <div style={{
          color: 'var(--text2)',
          fontSize: '0.9rem',
          marginTop: '0.4rem'
        }}>
          Pick 3 or more — your dashboard will be built entirely around you.
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 0,
        flex: 1,
        alignContent: 'stretch'
      }}>
        {INTERESTS.map(interest => (
          <div
            key={interest.id}
            className={`int-chip ${picked.has(interest.id) ? 'picked' : ''}`}
            onClick={() => toggleInterest(interest.id)}
            style={{
              padding: '2rem 1rem',
              border: '1px solid var(--card-border)',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: picked.has(interest.id) ? 'var(--chip-picked-bg)' : 'var(--chip-bg)',
              color: picked.has(interest.id) ? 'var(--chip-picked-text)' : 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{ fontSize: '1.8rem', display: 'block', position: 'relative', zIndex: 1 }}>{interest.icon}</span>
            <span style={{ position: 'relative', zIndex: 1 }}>{interest.label}</span>
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex',
        gap: '0.8rem',
        padding: '1.2rem 2rem',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)'
      }}>
        <button
          className="back-btn-main"
          onClick={onBack}
          style={{
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            border: '2px solid var(--card-border)',
            cursor: 'pointer',
            fontFamily: "var(--font-head)",
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'transparent',
            color: 'var(--text2)',
            transition: 'all 0.2s'
          }}
        >
          ← Back
        </button>
        <button
          className="go-btn"
          onClick={handleBuildDashboard}
          disabled={picked.size < 3}
          style={{
            flex: 1,
            padding: '0.85rem 2.6rem',
            borderRadius: '50px',
            border: 'none',
            cursor: picked.size < 3 ? 'not-allowed' : 'pointer',
            fontFamily: "var(--font-head)",
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            transition: 'all 0.22s',
            background: 'var(--accent)',
            color: 'var(--btn-text)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            opacity: picked.size < 3 ? 0.35 : 1
          }}
        >
          Build My Dashboard →
        </button>
      </div>
    </div>
  );
};

export default InterestsScreen;