import React, { useState } from 'react';
import PhaserPlatformer from './games/PhaserPlatformer';
import { GAMES } from './games/registry';

const ArcadeApp = () => {
  const [activeGameId, setActiveGameId] = useState(null);

  // Find the game config for the currently active game
  const activeGame = GAMES.find(g => g.id === activeGameId);

  // Render the Game based on the ID
  const renderGame = () => {
    if (activeGameId === 'neon-leap') return <PhaserPlatformer />;
    return <div className="error">Game not found!</div>;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a12', 
      color: 'white', 
      fontFamily: '"Courier New", Courier, monospace',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      {/* Header */}
      {!activeGame && (
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            color: '#00ffcc', 
            textShadow: '0 0 20px #00ffcc, 0 0 40px #00ffcc',
            margin: '0',
            letterSpacing: '5px'
          }}>
            CIRCUIT ARCADE
          </h1>
          <p style={{ color: '#888', fontSize: '1.2rem', marginTop: '10px' }}>
            SELECT YOUR MISSION
          </p>
        </div>
      )}

      {/* Game Selection Grid */}
      {!activeGame && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          width: '100%', 
          maxWidth: '1200px' 
        }}>
          {GAMES.map(game => (
            <div 
              key={game.id}
              onClick={() => setActiveGameId(game.id)}
              style={{ 
                backgroundColor: '#161625', 
                border: '2px solid #333', 
                borderRadius: '15px', 
                padding: '20px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00ffcc';
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 0 20px #00ffcc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
              }}
            >
              <div style={{ 
                width: '100%', 
                height: '160px', 
                backgroundColor: '#000', 
                borderRadius: '10px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                🎮
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: '0 0 10px 0' }}>{game.title}</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.4' }}>{game.description}</p>
              <div style={{ 
                display: 'inline-block', 
                marginTop: '15px', 
                padding: '5px 15px', 
                borderRadius: '20px', 
                fontSize: '0.7rem', 
                backgroundColor: '#00ffcc', 
                color: '#000', 
                fontWeight: 'bold' 
              }}>
                {game.difficulty}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game View */}
      {activeGame && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            onClick={() => setActiveGameId(null)}
            style={{ 
              marginBottom: '20px', 
              padding: '10px 20px', 
              backgroundColor: 'transparent', 
              border: '1px solid #00ffcc', 
              color: '#00ffcc', 
              cursor: 'pointer', 
              fontSize: '1rem',
              borderRadius: '5px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ffcc';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#00ffcc';
            }}
          >
            ← BACK TO MENU
          </button>
          
          <div style={{ 
            position: 'relative', 
            padding: '20px', 
            backgroundColor: '#1a1a2e', 
            borderRadius: '20px', 
            border: '8px solid #333',
            boxShadow: '0 0 50px rgba(0,0,0,0.8)'
          }}>
             {renderGame()}
          </div>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', margin: '0' }}>{activeGame.title}</h2>
            <p style={{ color: '#888' }}>{activeGame.category}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArcadeApp;
