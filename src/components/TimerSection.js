import React, { useState, useEffect, useRef } from 'react';
import { addFocusMinutes } from '../utils/storage';

const TimerSection = ({ onTimerRunningChange, focusModeEnabled, setFocusModeEnabled }) => {
  const [totalSecs, setTotalSecs] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [activeDuration, setActiveDuration] = useState(25);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playCompletionSound = () => {
    try {
      const ctx = ensureAudioContext();
      const start = ctx.currentTime + 0.03;
      [523.25, 659.25, 783.99].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, start + index * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.12, start + index * 0.16 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.16 + 0.42);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start + index * 0.16);
        osc.stop(start + index * 0.16 + 0.45);
      });
    } catch (e) {}
  };

  const onTimerComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    const addedMinutes = Math.round(totalSecs / 60);
    addFocusMinutes(addedMinutes);
    playCompletionSound();
    // Show toast
    const toast = document.createElement('div');
    toast.textContent = `Session complete! ${addedMinutes} minutes of intentional focus added to your stats.`;
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--accent); color: var(--btn-text); padding: 0.75rem 1.5rem;
      border-radius: 50px; font-family: var(--font-head); font-size: 0.88rem;
      font-weight: 700; box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 999;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            onTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  useEffect(() => {
    onTimerRunningChange?.(running);
  }, [running, onTimerRunningChange]);

  const setTimer = (mins) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setTotalSecs(mins * 60);
    setRemaining(mins * 60);
    setActiveDuration(mins);
  };

  const toggleTimer = () => {
    if (running) {
      setRunning(false);
    } else {
      ensureAudioContext().resume();
      setRunning(true);
    }
  };

  const formatTime = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 1 - remaining / totalSecs;
  const circumference = 314;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div style={{
      borderRadius: '18px',
      padding: '1.3rem',
      background: 'var(--card)',
      border: '1.5px solid var(--card-border)',
      textAlign: 'center',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{
        fontSize: '0.65rem',
        letterSpacing: '2.5px',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        marginBottom: '0.5rem'
      }}>
        focus session
      </div>
      <div style={{
        width: '118px',
        height: '118px',
        margin: '0 auto 0.9rem',
        position: 'relative'
      }}>
        <svg viewBox="0 0 110 110" style={{ width: '118px', height: '118px', transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r="47" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="9" />
          <circle
            cx="55" cy="55" r="47"
            fill="none"
            stroke="var(--timer-stroke)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "var(--font-head)",
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text)'
        }}>
          {formatTime()}
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {[5, 15, 25, 45].map(mins => (
          <button
            key={mins}
            onClick={() => setTimer(mins)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '50px',
              border: '2px solid var(--card-border)',
              background: activeDuration === mins ? 'var(--accent)' : 'transparent',
              color: activeDuration === mins ? 'var(--btn-text)' : 'var(--text2)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            {mins}m
          </button>
        ))}
        <button
          onClick={toggleTimer}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '50px',
            border: '2px solid var(--card-border)',
            background: 'var(--accent)',
            color: 'var(--btn-text)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s',
            minWidth: '60px'
          }}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => setFocusModeEnabled(!focusModeEnabled)}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '50px',
            border: '2px solid var(--card-border)',
            background: focusModeEnabled ? 'var(--accent3)' : 'var(--chip-bg)',
            color: focusModeEnabled ? 'var(--btn-text)' : 'var(--text2)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          Focus Mode {focusModeEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

export default TimerSection;