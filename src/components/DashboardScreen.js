import React, { useState, useEffect, useCallback } from 'react';
import MoodSection from './MoodSection';
import TimerSection from './TimerSection';
import CardsGrid from './CardsGrid';
import IntentionModal from './IntentionModal';
import ProfileModal from './ProfileModal';
import { THEME_META, CONTENT } from '../data/content';
import MoodChatbot from './MoodChatbot';
import { getStreak, seededShuffle, getDailySeed, getSeenCards, markSeen } from '../utils/storage';

const DashboardScreen = ({ theme, interests, onReset, onChangeTheme }) => {
  const [streak, setStreak] = useState(1);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [showIntentionModal, setShowIntentionModal] = useState(false);
  const [pendingCard, setPendingCard] = useState(null);
  const [focusModeEnabled, setFocusModeEnabled] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const themeMeta = THEME_META[theme] || THEME_META[''];

 const pickCards = useCallback((forceRefresh = false) => {
  console.log('Interests selected:', [...interests]);
  console.log('CONTENT keys available:', Object.keys(CONTENT));
  
  const seen = forceRefresh ? new Set() : getSeenCards();
  const seed = getDailySeed();
  let all = [];
  
  interests.forEach(id => {
    console.log(`Looking for content with id: ${id}`);
    if (CONTENT[id]) {
      console.log(`Found ${CONTENT[id].length} cards for ${id}`);
      all = all.concat(CONTENT[id]);
    } else {
      console.warn(`No content found for interest: ${id}`);
    }
  });
  
  console.log('Total cards collected:', all.length);
  
  if (all.length === 0) {
    console.error('No cards found! Check if interests match CONTENT keys');
    return [];
  }
  
  const unseen = all.filter(c => !seen.has(c.title?.slice(0, 30) || c.title));
  const seenCards = all.filter(c => seen.has(c.title?.slice(0, 30) || c.title));
  
  console.log(`Unseen: ${unseen.length}, Seen: ${seenCards.length}`);
  
  const shuffledUnseen = seededShuffle(unseen, seed);
  const shuffledSeen = seededShuffle(seenCards, seed + 1);
  
  const result = [...shuffledUnseen, ...shuffledSeen].slice(0, 9);
  console.log('Final cards to display:', result.length);
  
  return result;
}, [interests]);

  const loadCards = useCallback((forceRefresh = false) => {
    const newCards = pickCards(forceRefresh);
    setCards(newCards);
  }, [pickCards]);

  const refreshCards = () => {
    const currentCards = pickCards(false);
    currentCards.forEach(c => markSeen(c.title.slice(0, 30)));
    loadCards(false);
  };

  useEffect(() => {
    setStreak(getStreak());
    loadCards();

    const bumpElement = document.getElementById('streak-el');
    if (bumpElement) {
      bumpElement.classList.add('streak-bump');
      setTimeout(() => bumpElement.classList.remove('streak-bump'), 500);
    }
  }, [loadCards]);

  const handleCardClick = (card) => {
    if (focusModeEnabled && isTimerRunning) {
      // Show locked message
      const overlay = document.getElementById('focus-lock-overlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('hidden'), 2000);
      }
      return;
    }
    markSeen(card.title.slice(0, 30));
    setPendingCard(card);
    setShowIntentionModal(true);
  };

  const handleReset = () => {
    if (window.confirm('Reset all your preferences, streak and seen cards? This cannot be undone.')) {
      onReset();
    }
  };

  return (
    <div className="screen active" style={{
      padding: '1.5rem',
      gap: '1.2rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          fontFamily: "var(--font-head)",
          fontSize: '1.4rem',
          fontWeight: 800,
          color: 'var(--accent)'
        }}>
          UnScroll
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginLeft: 'auto'
        }}>
          <div id="streak-el" style={{
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: 'var(--streak-bg)',
            color: 'var(--streak-color)',
            border: '1.5px solid var(--streak-color)',
            transition: 'all 0.3s'
          }}>
            🔥 Day {streak}
          </div>
          <button
            className="save-profile-btn"
            onClick={() => setShowProfileModal(true)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1.5px solid var(--card-border)',
              background: 'var(--surface)',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☁️
          </button>
        </div>
      </div>

      <div style={{
        borderRadius: '16px',
        padding: '1.1rem 1.3rem',
        background: 'var(--banner-bg)',
        border: '1.5px solid var(--card-border)',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          fontSize: '0.62rem',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: '0.2rem'
        }}>
          Current vibe
        </div>
        <div style={{
          fontFamily: "var(--font-head)",
          fontSize: '1.1rem',
          fontWeight: 800,
          color: 'var(--accent)'
        }}>
          {themeMeta.name}
        </div>
        <div style={{
          fontSize: '0.83rem',
          color: 'var(--text2)',
          lineHeight: 1.5,
          marginTop: '0.15rem'
        }}>
          {themeMeta.copy}
        </div>
      </div>

      <MoodSection onMoodChange={setCurrentMood} />
      {/* Chatbot Button */}
<button
  onClick={() => setShowChatbot(true)}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: showChatbot ? 'auto' : '20px',
    right: showChatbot ? 'auto' : '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, var(--accent), #9b59b6)`,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    zIndex: 999,
    transition: 'transform 0.2s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
>
  <span style={{ fontSize: '28px' }}>🤗</span>
</button>

{/* Chatbot Component */}
{showChatbot && (
  <MoodChatbot
    currentMood={currentMood}
    onClose={() => setShowChatbot(false)}
  />
)}
      <TimerSection
        onTimerRunningChange={setIsTimerRunning}
        focusModeEnabled={focusModeEnabled}
        setFocusModeEnabled={setFocusModeEnabled}
      />

      <div style={{
        fontFamily: "var(--font-head)",
        fontSize: '0.72rem',
        textTransform: 'uppercase',
        letterSpacing: '2.5px',
        color: 'var(--muted)',
        paddingLeft: '2px'
      }}>
        For you today ✦
      </div>

      <div style={{ position: 'relative' }}>
        <CardsGrid cards={cards} onCardClick={handleCardClick} />
        <div
          id="focus-lock-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            borderRadius: '18px',
            background: 'rgba(120, 120, 120, 0.18)',
            backdropFilter: 'blur(1.5px)',
            display: focusModeEnabled && isTimerRunning ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            pointerEvents: focusModeEnabled && isTimerRunning ? 'auto' : 'none'
          }}
        >
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.7)',
            color: 'var(--text2)',
            fontFamily: "var(--font-head)",
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.3px',
            border: '1px solid rgba(255,255,255,0.75)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            Cards locked during focus session.
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0 1rem',
        marginBottom: '1rem'
      }}>
        <button
          onClick={refreshCards}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: '12px',
            border: '2px solid var(--accent)',
            background: 'transparent',
            color: 'var(--accent)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          🔄 Refresh Cards
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '12px',
            border: '2px solid var(--muted)',
            background: 'transparent',
            color: 'var(--muted)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          🗑️ Reset Everything
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0.5rem 0 1rem'
      }}>
        <button
          onClick={onChangeTheme}
          style={{
            padding: '0.75rem 1.8rem',
            borderRadius: '50px',
            border: '2px solid var(--card-border)',
            background: 'var(--chip-bg)',
            color: 'var(--text2)',
            fontFamily: "var(--font-head)",
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.22s',
            letterSpacing: '0.3px'
          }}
        >
          🎨 Change Theme / Interests
        </button>
      </div>

      {showProfileModal && (
        <ProfileModal
          theme={theme}
          interests={interests}
          onClose={() => setShowProfileModal(false)}
          onReset={handleReset}
        />
      )}

      {showIntentionModal && pendingCard && (
        <IntentionModal
          card={pendingCard}
          onClose={() => setShowIntentionModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardScreen;