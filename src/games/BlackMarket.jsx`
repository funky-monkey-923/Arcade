import React, { useState, useEffect } from 'react';

const BLACK_MARKET_ITEMS = [
  { 
    id: 'dash_dist', 
    name: 'Overclocked Buffer', 
    desc: 'Increases Glitch Dash distance.', 
    cost: 50, 
    maxLevel: 5, 
    stat: 'dashDuration' 
  },
  { 
    id: 'sync_cap', 
    name: 'Neural Stabilizer', 
    desc: 'Slower Sync Rate decay.', 
    cost: 80, 
    maxLevel: 3, 
    stat: 'decayRate' 
  },
  { 
    id: 'jump_boost', 
    name: 'Gravity Boots', 
    desc: 'Higher jump force.', 
    cost: 60, 
    maxLevel: 5, 
    stat: 'jumpForce' 
  },
];

const BlackMarket = ({ credits, setCredits, upgrades, setUpgrades, onBack }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const buyUpgrade = () => {
    if (!selectedItem) return;
    
    const currentLevel = upgrades[selectedItem.id] || 0;
    if (currentLevel >= selectedItem.maxLevel) return;
    
    if (credits >= selectedItem.cost) {
      setCredits(prev => prev - selectedItem.cost);
      setUpgrades(prev => ({
        ...prev,
        [selectedItem.id]: currentLevel + 1
      }));
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px', 
      color: 'white', 
      fontFamily: '"Courier New", Courier, monospace' 
    }}>
      <h1 style={{ color: '#ff00ff', textShadow: '0 0 10px #ff00ff' }}>THE BLACK MARKET</h1>
      <div style={{ marginBottom: '30px', fontSize: '1.5rem', color: '#00ffcc' }}>
        Available Credits: {credits} ⚡
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '900px' 
      }}>
        {BLACK_MARKET_ITEMS.map(item => {
          const level = upgrades[item.id] || 0;
          return (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{ 
                backgroundColor: selectedItem?.id === item.id ? '#2a2a4a' : '#161625', 
                border: selectedItem?.id === item.id ? '2px solid #ff00ff' : '2px solid #333', 
                padding: '20px', 
                borderRadius: '10px', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{item.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{item.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ color: '#00ffcc' }}>Cost: {item.cost} ⚡</span>
                <span style={{ fontSize: '0.8rem', backgroundColor: '#333', padding: '2px 8px', borderRadius: '5px' }}>
                  Lv {level}/{item.maxLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
        <button 
          onClick={onBack} 
          style={{ padding: '10px 30px', backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff', cursor: 'pointer' }}
        >
          BACK TO LOBBY
        </button>
        <button 
          onClick={buyUpgrade} 
          disabled={!selectedItem || credits < selectedItem?.cost || (upgrades[selectedItem?.id] || 0) >= selectedItem?.maxLevel}
          style={{ 
            padding: '10px 30px', 
            backgroundColor: selectedItem && credits >= selectedItem.cost ? '#ff00ff' : '#444', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          PURCHASE UPGRADE
        </button>
      </div>
    </div>
  );
};

export default BlackMarket;
