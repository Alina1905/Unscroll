import React, { useEffect, useState } from 'react';
import { TAGLINES } from '../data/content';

const SplashScreen = ({ onComplete }) => {
  const [tagline, setTagline] = useState('');
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const randomTagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
    setTagline(randomTagline);

    let i = 0;
    const type = () => {
      if (i <= randomTagline.length) {
        setDisplayText(randomTagline.slice(0, i));
        i++;
        setTimeout(type, 55);
      }
    };
    setTimeout(type, 600);

    // Create particles
    const container = document.getElementById('splash-particles');
    if (container) {
      for (let p = 0; p < 18; p++) {
        const dot = document.createElement('div');
        dot.className = 'particle';
        const size = Math.random() * 18 + 6;
        dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.15);left:${Math.random() * 100}%;animation:float linear infinite;animation-duration:${Math.random() * 8 + 6}s;animation-delay:${Math.random() * 6}s;opacity:${Math.random() * 0.4 + 0.1};`;
        container.appendChild(dot);
      }
    }
  }, []);

  return (
    <div className="screen active" id="screen-splash" style={{
      background: 'var(--splash-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.4rem',
        textAlign: 'center',
        zIndex: 2,
        position: 'relative',
        padding: '2rem',
        maxWidth: '600px'
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(3.5rem, 12vw, 6.5rem)',
          fontWeight: 800,
          letterSpacing: '-4px',
          lineHeight: 1,
          animation: 'splashPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          opacity: 0,
          transform: 'scale(0.5)'
        }}>
          <span style={{ color: '#fff' }}>Un</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Scroll</span>
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.3,
          minHeight: '2.5rem',
          animation: 'fadeUp 0.7s ease 0.5s forwards',
          opacity: 0
        }}>
          {displayText}
        </div>
        <div style={{
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.75)',
          maxWidth: '380px',
          lineHeight: 1.6,
          animation: 'fadeUp 0.7s ease 0.9s forwards',
          opacity: 0
        }}>
          Your attention is worth more than a 3-second reel.
        </div>
        <button
          onClick={onComplete}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.9rem 2.4rem',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.05rem',
            fontWeight: 800,
            background: '#fff',
            color: '#FF6B35',
            transition: 'all 0.25s',
            animation: 'fadeUp 0.7s ease 1.2s forwards',
            opacity: 0,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
          }}
        >
          <span>Let's Go</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <div id="splash-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}></div>
      </div>
      <style jsx>{`
        @keyframes splashPop {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;