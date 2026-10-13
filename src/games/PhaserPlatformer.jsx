import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from './PlatformerScene';

const PlatformerGame = ({ upgrades, onComplete }) => {
    const gameContainerRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 600 },
                    debug: false
                }
            },
            scene: [MainScene]
        };

        // Pass upgrades to the scene
        const game = new Phaser.Game(config);

        // We use the scene data system to pass React props into Phaser
        const scene = game.scene.scenes[0];
        if (scene) {
            scene.setData('upgrades', upgrades);
            scene.setData('onComplete', onComplete);
        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            backgroundColor: '#0f0f1b', 
            color: 'white', 
            fontFamily: '"Courier New", Courier, monospace' 
        }}>
            <h1 style={{ color: '#00ffcc', textShadow: '0 0 10px #00ffcc', marginBottom: '10px' }}>
                PHASER NEON LEAP
            </h1>
            <div 
                ref={gameContainerRef} 
                style={{ 
                    border: '4px solid #00ffcc', 
                    borderRadius: '8px', 
                    boxShadow: '0 0 20px #00ffcc',
                    overflow: 'hidden' 
                }} 
            />
            <p style={{ marginTop: '10px' }}>Use ARROWS or WASD to move & jump!</p>
        </div>
    );
};

export default PlatformerGame;

