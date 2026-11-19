# 🌱 Garden Clash 🧟

> **A portfolio-quality, retro pixel-art garden defense Tic-Tac-Toe web application built with modern JavaScript, React 19, Next.js, and Tailwind CSS.**

![Garden Clash](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.3-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-96%20tests%20passing-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-18%20E2E%20passing-2EAD33?logo=playwright)
![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(ES6+)-F7DF1E?logo=javascript)

---

## 🌻 Overview

**Garden Clash** reimagines classic Tic-Tac-Toe through an original pixel-art garden-defense aesthetic. Two opposing factions—**Plants** and **Zombies**—clash on a 3×3 lawn grid.

- **Plants**: Cheerful sunflowers defending the lawn with bouncy animations.
- **Zombies**: Goofy, ragged undead invaders with crooked teeth and crimson neckties.
- **Traditional Rules**: The theme elevates the presentation without altering traditional Tic-Tac-Toe rules—align three matching characters horizontally, vertically, or diagonally to win.

---

## ✨ Features

- **🎮 Game Modes**:
  - **👥 2-Player Local (PvP)**: Two players share the same device with alternating turns.
  - **🤖 Player vs. Computer (PvE)**: Challenge an AI opponent with selectable factions (play as Plants or Zombies).
- **🧠 3 AI Difficulty Levels**:
  - **Easy**: Random available move selection.
  - **Medium**: Tactical heuristic prioritization (wins immediately, blocks threats, controls center & corners).
  - **Hard (Minimax)**: Mathematically optimal decision-tree AI that is **unbeatable** (guaranteed win or draw).
- **↩ Mode-Aware Smart Undo**:
  - In **PvP**: Pops the latest move.
  - In **PvE**: Atomically rolls back both the computer's response and the player's move together.
- **🏆 Persistent Scoreboard**: Tracks Plant wins, Zombie wins, and draws across sessions using browser LocalStorage. Includes reset confirmation.
- **📜 Match History Log**: Collapsible drawer recording the last 50 completed matches with outcome badges, game modes, and timestamps.
- **🔊 Procedural 8-Bit Web Audio API Sound**: Synthesized on-the-fly without external audio files—plant pops, zombie chomps, victory fanfare, draw buzzers, and undo chirps with persistent mute toggle.
- **☀️/🌙 Day & Night Themes**: Dynamic celestial lighting, drifting fireflies, and persistent theme selection.
- **♿ Accessibility & Responsiveness**: Full keyboard navigation (`Tab` / `Enter` / `Space`), visible high-contrast focus rings, `prefers-reduced-motion` compliance, and responsive layouts for mobile and desktop.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js (App Router) | React server rendering, static optimization, bundling |
| **UI Library** | React 19 | Functional components, hooks (`useReducer`, `useSyncExternalStore`) |
| **Styling** | Tailwind CSS v4 + Custom CSS | CSS-first custom design tokens, pixelated rendering |
| **State Management** | Pure `useReducer` | Deterministic, side-effect-free central state machine |
| **Audio** | Native Web Audio API | Zero-latency procedural sound generation |
| **Persistence** | Browser LocalStorage | Safe schema-versioned client storage |
| **Unit & Component Testing** | Vitest + React Testing Library | 96 unit and component tests |
| **End-to-End Testing** | Playwright | 18 cross-device browser tests (Desktop & Mobile) |

> [!NOTE]
> **Strict JavaScript Restriction**: This project is written **100% in modern JavaScript (ES6+)** with `.jsx` for React components and `.js` for pure logic. No TypeScript or backend server dependencies.

---

## 🚀 Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ (tested on Node v24)
- npm v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/EzekielAbug/Tic-Tac-Toe.git
cd Tic-Tac-Toe

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
# Run all 96 unit and component tests (Vitest)
npm test

# Run tests in interactive watch mode
npm run test:watch

# Run all 18 end-to-end tests (Playwright)
npm run test:e2e
```

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
Tic-Tac-Toe/
├── public/
│   └── sprites/
│       ├── plants/plant.svg       # 24×24 pixel-art Plant vector
│       └── zombies/zombie.svg     # 24×24 pixel-art Zombie vector
├── src/
│   ├── app/
│   │   ├── globals.css            # Pixel typography, themes, animations
│   │   ├── layout.jsx             # Root HTML shell
│   │   └── page.jsx               # Main application container
│   ├── components/
│   │   ├── game/
│   │   │   ├── Board.jsx          # 3×3 lawn grid container
│   │   │   ├── Cell.jsx           # Individual interactive garden cell
│   │   │   ├── GameControls.jsx   # Mode, difficulty, faction, undo buttons
│   │   │   ├── PlantSprite.jsx    # Plant character component
│   │   │   ├── ZombieSprite.jsx   # Zombie character component
│   │   │   ├── TurnIndicator.jsx  # Active turn & thinking banner
│   │   │   └── ResultOverlay.jsx  # Victory/draw celebration modal
│   │   ├── garden/
│   │   │   └── GardenDecorations.jsx # Picket fence, fireflies, lawn flowers
│   │   ├── history/
│   │   │   └── MatchHistory.jsx   # Collapsible match log drawer
│   │   └── scoreboard/
│   │       └── Scoreboard.jsx     # Score cards with reset confirmation
│   ├── constants/
│   │   ├── game.js                # Factions, statuses, modes, win lines
│   │   └── theme.js               # Day/Night palettes & design tokens
│   ├── hooks/
│   │   ├── useAudio.js            # Sound controller & mute persistence
│   │   ├── useGameReducer.js      # React hook wrapping the pure reducer
│   │   ├── useLocalStorage.js     # SSR-safe storage via useSyncExternalStore
│   │   └── useTheme.js            # Day/Night theme switcher & persistence
│   └── lib/
│       ├── audio/
│       │   └── audioService.js    # Web Audio API procedural sound engine
│       ├── game/
│       │   ├── gameEngine.js      # Pure game rules (no React, zero DOM)
│       │   ├── gameReducer.js     # Deterministic state machine
│       │   └── ai/
│       │       ├── easy.js        # Random selection AI
│       │       ├── medium.js      # 5-tier tactical heuristic AI
│       │       ├── hard.js        # Unbeatable Minimax algorithm
│       │       └── index.js       # AI strategy dispatcher
│       └── storage/
│           └── localStorage.js    # Safe JSON parse/serialize wrapper
├── tests/
│   ├── unit/                      # Engine, AI, reducer, audio tests
│   ├── components/                # RTL component tests
│   └── e2e/                       # Playwright browser journeys
├── ARCHITECTURE.md                # Detailed architecture document
├── GAME_LOGIC.md                  # Comprehensive game logic & AI guide
├── TESTING.md                     # Complete testing documentation
└── README.md
```

---

## 📚 Documentation Links

- [Architecture Guide](ARCHITECTURE.md) — Deep dive into state management, data flow, and separation of concerns.
- [Game Logic & AI](GAME_LOGIC.md) — Detailed explanation of winning algorithms, Minimax, and smart undo.
- [Testing Guide](TESTING.md) — Overview of the 114 automated tests and verification methodologies.

---

## 📄 License

MIT License. Designed and developed by Ezekiel Abug.
