import React, { useState } from 'react';
import { generateProfileCode, applyProfileCode } from '../utils/storage';

const ProfileModal = ({ theme, interests, onClose, onReset }) => {
  const [code, setCode] = useState(generateProfileCode(theme, interests));
  const [restoreInput, setRestoreInput] = useState('');
  const [restoreMsg, setRestoreMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRestore = () => {
    if (!restoreInput.trim()) {
      setRestoreMsg('Paste a code first.');
      return;
    }
    const result = applyProfileCode(restoreInput.trim());
    if (!result) {
      setRestoreMsg('That code could not be decoded.');
      return;
    }
    setRestoreMsg('Profile restored. Reloading...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.58)',
        zIndex: 99,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{
        background: 'var(--modal-bg)',
        borderRadius: '22px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '1.7rem',
        position: 'relative',
        marginTop: '2rem',
        border: '1.5px solid var(--card-border)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.3s ease'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.1rem',
            right: '1.1rem',
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
          fontSize: '1.3rem',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: '0.25rem'
        }}>
          ☁️ Save Profile
        </div>
        <div style={{
          color: 'var(--text2)',
          fontSize: '0.83rem',
          marginBottom: '1.1rem'
        }}>
          Copy this code to restore your theme and interests on another browser.
        </div>

        <div style={{
          background: 'var(--modal-item)',
          border: '1.5px solid var(--card-border)',
          borderRadius: '16px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            fontFamily: "var(--font-head)",
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--muted)',
            marginBottom: '0.6rem'
          }}>
            Your profile code
          </div>
          <div style={{
            background: 'var(--surface)',
            border: '1.5px dashed var(--card-border)',
            borderRadius: '12px',
            padding: '0.85rem 0.95rem',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            lineHeight: 1.5,
            wordBreak: 'break-all',
            color: 'var(--text)'
          }}>
            {code}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0.75rem'
          }}>
            <button
              onClick={copyCode}
              style={{
                borderRadius: '12px',
                border: '1.5px solid var(--card-border)',
                background: 'var(--accent)',
                color: 'var(--btn-text)',
                padding: '0.75rem 1rem',
                fontFamily: "var(--font-head)",
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>
        </div>

        <div style={{
          background: 'var(--modal-item)',
          border: '1.5px solid var(--card-border)',
          borderRadius: '16px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{
            fontFamily: "var(--font-head)",
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--muted)',
            marginBottom: '0.6rem'
          }}>
            Restore from code
          </div>
          <div style={{
            display: 'flex',
            gap: '0.6rem',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              value={restoreInput}
              onChange={(e) => setRestoreInput(e.target.value)}
              placeholder="Paste code here"
              style={{
                flex: 1,
                minWidth: '180px',
                borderRadius: '12px',
                border: '1.5px solid var(--card-border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                padding: '0.75rem 0.9rem',
                fontFamily: 'monospace',
                fontSize: '0.78rem'
              }}
            />
            <button
              onClick={handleRestore}
              style={{
                borderRadius: '12px',
                border: '1.5px solid var(--card-border)',
                background: 'var(--accent)',
                color: 'var(--btn-text)',
                padding: '0.75rem 1rem',
                fontFamily: "var(--font-head)",
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Restore
            </button>
          </div>
          {restoreMsg && (
            <div style={{
              fontSize: '0.78rem',
              color: 'var(--text2)',
              marginTop: '0.55rem'
            }}>
              {restoreMsg}
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1rem'
        }}>
          <button
            onClick={onReset}
            style={{
              borderRadius: '12px',
              border: '1.5px solid var(--card-border)',
              background: 'transparent',
              color: 'var(--accent)',
              padding: '0.75rem 1rem',
              fontFamily: "var(--font-head)",
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Reset everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;