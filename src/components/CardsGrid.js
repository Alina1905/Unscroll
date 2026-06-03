import React from 'react';

const CardsGrid = ({ cards, onCardClick }) => {
  console.log('Cards received in CardsGrid:', cards);
  console.log('Number of cards:', cards?.length);

  if (!cards || cards.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--card)',
        borderRadius: '18px',
        border: '1.5px solid var(--card-border)',
        color: 'var(--text2)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h3>No cards available</h3>
        <p>Try selecting more interests or refresh the page.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1rem'
    }}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={() => onCardClick(card)}
          style={{
            borderRadius: '18px',
            padding: '1.2rem 1.1rem',
            background: 'var(--card)',
            border: '1.5px solid var(--card-border)',
            cursor: 'pointer',
            transition: 'all 0.25s',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '140px',
            animation: `fadeIn 0.5s ease ${idx * 0.06}s both`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--card-border)';
          }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{card.icon}</div>
          <div style={{
            fontSize: '0.64rem',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>{card.cat}</div>
          <div style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            lineHeight: 1.4,
            color: 'var(--text)',
            flex: 1
          }}>{card.title}</div>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text2)',
            marginTop: 'auto'
          }}>{card.meta}</div>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--accent)',
            marginTop: '0.4rem',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>Open →</div>
        </div>
      ))}
    </div>
  );
};

export default CardsGrid;