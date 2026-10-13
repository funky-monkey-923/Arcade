import React, { useEffect, useRef, useState } from 'react';

const PLATFORMER_CONFIG = {
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  MOVE_SPEED: 5,
  PLAYER_SIZE: { width: 30, height: 30 },
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
};

const PLATFORMS = [
  { x: 0, y: 550, width: 800, height: 50 },   // Floor
  { x: 100, y: 400, width: 200, height: 20 }, // Platform 1
  { x: 400, y: 300, width: 200, height: 20 }, // Platform 2
  { x: 600, y: 200, width: 150, height: 20 }, // Platform 3
  { x: 200, y: 150, width: 100, height: 20 }, // Platform 4
];

const PlatformerGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Game State
    const player = {
      x: 50,
      y: 500,
      vx: 0,
      vy: 0,
      width: PLATFORMER_CONFIG.PLAYER_SIZE.width,
      height: PLATFORMER_CONFIG.PLAYER_SIZE.height,
      grounded: false,
      color: '#00ffcc'
    };

    const keys = {
      left: false,
      right: false,
      up: false
    };

    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.up = true;
    };

    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') keys.up = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId;

    const update = () => {
      // 1. Horizontal Movement
      if (keys.left) player.vx = -PLATFORMER_CONFIG.MOVE_SPEED;
      else if (keys.right) player.vx = PLATFORMER_CONFIG.MOVE_SPEED;
      else player.vx *= 0.8; // Friction

      player.x += player.vx;

      // 2. Vertical Movement (Gravity)
      player.vy += PLATFORMER_CONFIG.GRAVITY;
      player.y += player.vy;
      player.grounded = false;

      // 3. Collision Detection
      for (const plat of PLATFORMS) {
        // Check if player is overlapping the platform
        if (
          player.x < plat.x + plat.width &&
          player.x + player.width > plat.x &&
          player.y < plat.y + plat.height &&
          player.y + player.height > plat.y
        ) {
          // Simple Collision Resolution:
          // If player was above the platform, snap them to the top
          if (player.vy > 0 && player.y + player.height - player.vy <= plat.y) {
            player.y = plat.y - player.height;
            player.vy = 0;
            player.grounded = true;
          }
        }
      }

      // 4. Jumping
      if (keys.up && player.grounded) {
        player.vy = PLATFORMER_CONFIG.JUMP_FORCE;
        player.grounded = false;
      }

      // 5. Bound Checks
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
      if (player.y > canvas.height) {
        setGameOver(true);
      }
    };

    const draw = () => {
      // Clear Canvas
      ctx.fillStyle = '#1a1a2e'; // Dark space background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Platforms
      ctx.fillStyle = '#4e4e6a';
      PLATFORMS.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        // Add a little "glow" to the top of platforms
        ctx.fillStyle = '#6e6e8a';
        ctx.fillRect(plat.x, plat.y, plat.width, 4);
        ctx.fillStyle = '#4e4e6a';
      });

      // Draw Player
      ctx.fillStyle = player.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0; // Reset shadow for other elements
    };

    const gameLoop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver]);

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
  };

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
      <h1 style={{ color: '#00ffcc', textShadow: '0 0 10px #00ffcc' }}>NEON LEAP</h1>
      <p>Use ARROWS or WASD to move and jump!</p>
      
      <div style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef} 
          width={PLATFORMER_CONFIG.CANVAS_WIDTH} 
          height={PLATFORMER_CONFIG.CANVAS_HEIGHT} 
          style={{ border: '4px solid #00ffcc', borderRadius: '8px', boxShadow: '0 0 20px #00ffcc' }}
        />
        
        {gameOver && (
          <div style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <h2 style={{ fontSize: '3rem', color: '#ff0055' }}>GAME OVER</h2>
            <button 
              onClick={resetGame}
              style={{ 
                padding: '10px 20px', 
                fontSize: '1.2rem', 
                backgroundColor: '#00ffcc', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformerGame;
