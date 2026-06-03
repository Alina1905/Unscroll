import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const MoodChatbot = ({ currentMood, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  // Initial greeting based on mood
  useEffect(() => {
    const moodGreetings = {
      '😴': "Hey there! I see you're feeling tired. Need some gentle energy or a cozy relaxation suggestion? 💫",
      '😐': "Hi! Feeling neutral today? That's totally okay. Want to explore something interesting or just chat? 🎯",
      '😊': "Awesome! You're feeling happy! Let's ride this positive wave together. What's on your mind? 🌟",
      '🥱': "Boredom can be a creativity trigger! Want some fun suggestions or just someone to talk to? ✨",
      '🔥': "WOW! Pure energy mode! Let's channel that fire into something amazing. What excites you right now? ⚡",
      '😤': "I hear you. Sometimes we all need a break. Want to vent, get some breathing exercises, or just chill? 🫂"
    };

    const moodEmoji = currentMood || '😐';
    const greeting = moodGreetings[moodEmoji] || "Hi! I'm your emotional support buddy. How are you feeling? 💙";
    
    setMessages([{
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    }]);
  }, [currentMood]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await sendToGemini(userMessage, currentMood);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. 💙",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendToGemini = async (userMessage, mood) => {
    // If no API key, use fallback responses
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return getFallbackResponse(userMessage, mood);
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `You are an empathetic, warm, and supportive emotional wellness companion for the UnScroll app. 
              
Current user mood: ${mood || 'neutral'}

Guidelines:
- Be kind, gentle, and supportive
- Keep responses concise (2-3 sentences max)
- Offer practical suggestions when appropriate
- Use appropriate emojis occasionally
- Never give medical advice
- Focus on emotional support and mindfulness

User says: "${userMessage}"

Respond in a caring, helpful way:`
            }]
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return getFallbackResponse(userMessage, mood);
    }
  };

  const getFallbackResponse = (userMessage, mood) => {
    // Simple keyword-based fallback responses
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('sad') || lowerMsg.includes('unhappy')) {
      return "I'm sorry you're feeling sad. Remember that feelings are temporary. Would you like to try a quick breathing exercise with me? 🫂";
    }
    if (lowerMsg.includes('stressed') || lowerMsg.includes('anxious')) {
      return "Stress is tough. Let's try something: take 3 deep breaths with me. In... 2... 3... Out... 2... 3... Feel any lighter? 🌬️";
    }
    if (lowerMsg.includes('happy') || lowerMsg.includes('good')) {
      return "That's wonderful! Let's celebrate this good feeling. What's one small thing you're grateful for right now? 🌟";
    }
    if (lowerMsg.includes('tired')) {
      return "Rest is productive too. Maybe take a 5-minute break from the screen? Your mind deserves a reset. 😴💙";
    }
    if (lowerMsg.includes('bored')) {
      return "Boredom can spark creativity! Want me to suggest something fun to do? Or we can just chat about anything! ✨";
    }
    if (lowerMsg.includes('angry') || lowerMsg.includes('mad')) {
      return "I hear your frustration. It's okay to feel angry. Want to vent or try a quick grounding exercise? 🫂";
    }
    
    // Mood-specific fallbacks
    if (mood === '😴') {
      return "Take care of yourself first. Maybe a warm drink and 5 minutes of quiet? You've got this. 💫";
    }
    if (mood === '😤') {
      return "Deep breaths help reset. Want me to guide you through a quick 60-second reset? 🧘";
    }
    if (mood === '🔥') {
      return "Love that energy! What's one small action you can take right now to channel that fire? ⚡";
    }
    
    return "I'm here for you. Want to talk about what's on your mind, or shall we find something uplifting to do together? 💙";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodColor = () => {
    const colors = {
      '😴': '#9b59b6',
      '😐': '#95a5a6',
      '😊': '#f1c40f',
      '🥱': '#e67e22',
      '🔥': '#e74c3c',
      '😤': '#3498db'
    };
    return colors[currentMood] || '#FF6B35';
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, var(--accent), ${getMoodColor()})`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '28px' }}>💬</span>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '380px',
      height: '550px',
      background: 'var(--modal-bg)',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1000,
      border: `2px solid ${getMoodColor()}`,
      animation: 'slideUp 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: `linear-gradient(135deg, var(--accent), ${getMoodColor()})`,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🤗</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>Mood Buddy</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>Here for you 💙</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            −
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
              background: msg.role === 'user' ? `linear-gradient(135deg, var(--accent), ${getMoodColor()})` : 'var(--chip-bg)',
              color: msg.role === 'user' ? 'white' : 'var(--text)',
              fontSize: '14px',
              lineHeight: 1.5
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: '4px 18px 18px 18px',
              background: 'var(--chip-bg)',
              color: 'var(--text2)'
            }}>
              <span style={{ animation: 'pulse 1.5s infinite' }}>🤔 Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--card-border)',
        display: 'flex',
        gap: '8px',
        background: 'var(--surface)'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '25px',
            border: '1.5px solid var(--card-border)',
            background: 'var(--card)',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: '25px',
            border: 'none',
            background: `linear-gradient(135deg, var(--accent), ${getMoodColor()})`,
            color: 'white',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.6 : 1,
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default MoodChatbot;