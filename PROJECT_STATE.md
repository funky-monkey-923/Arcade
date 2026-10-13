# 📝 Project State Log: Neon-Sink / Circuit Arcade

## 🛠️ Current Technical Stack
- **Framework:** React 18 (Vite)
- **Game Engine:** Phaser 3 (Arcade Physics)
- **Styling:** CSS / Neon-Themed
- **Language:** JSX / JavaScript

## 🏗️ Architecture Map
- `src/App.jsx` $\rightarrow$ Main Lobby $\rightarrow$ Manages `activeGameId`
- `src/games/registry.js` $\rightarrow$ Config for all games in the arcade
- `src/games/PhaserPlatformer.jsx` $\rightarrow$ React Wrapper $\rightarrow$ Mounts Phaser Game
- `src/games/PlatformerScene.jsx` $\rightarrow$ The Game Logic (Phaser Scene)
- `src/games/PlayerController.js` $\rightarrow$ Logic for movement, state machine, and physics

## ✅ Implemented Features (Milestone 1 & 2)
- [x] **Arcade Shell:** Menu system and game switching.
- [x] **Player Controller:**
    - [x] Basic movement (WASD/Arrows).
    - [x] Wall Jumping.
    - [x] Glitch Dash (with particle trail and cooldown).
- [x] **Game Mechanics:**
    - [x] Sync Rate decay (Survival timer).
    - [x] Memory Core collection (Score/Sync restore).
    - [x] Exit Portal activation logic.
- [x] **Environmental Hazards:**
    - [x] Unstable Platforms (Decay/Reappear).
    - [x] Security Drones (Patrol/Penalty).
- [x] **Assets:** Industrial theme, Robot character, and SFX integrated.
- [x] **Infra:** `.gitignore`, `LICENSE`, and `README.md` configured.

## ⏳ Pending Tasks (The Roadmap)
- [ ] **Milestone 3: The Metagame**
    - [ ] Implement `localStorage` for persistent credits.
    - [ ] Build "The Black Market" (Upgrade Shop scene).
    - [ ] Create Level 2 transition logic.
- [ ] **Milestone 4: Polish**
    - [ ] Add screen shake on dash/damage.
    - [ ] Implement adaptive music (BPM increase as Sync drops).
    - [ ] Add character animations (Idle/Run/Jump).

## 🚩 Critical Notes for AI Resumption
- **Vite Requirement:** All files containing JSX MUST end in `.jsx` (e.g., `PlatformerScene.jsx`).
- **Asset Paths:** Assets are located in `public/assets/images` and `public/assets/audio`.
- **Player State:** The player uses a state machine (`IDLE`, `RUNNING`, `DASHING`, etc.)—do not bypass this with simple booleans.
