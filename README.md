# Nothing Chess Analysis

![screenshot](/screenshot.png)

A mobile-first chess analysis tool featuring the distinctive "Nothing OS" design aesthetic. Powered by Stockfish 17 via Chess-API, it provides deep game analysis, move classification, and seamless Chess.com integration.

## 🔴 Features

### 🧠 Advanced Analysis

- **Full Game Review**: Automatically analyzes every move of an imported game.
- **Move Classification**: Classifies moves as **Brilliant**, **Great**, **Best**, **Excellent**, **Good**, **Inaccuracy**, **Mistake**, **Blunder**, or **Miss** based on engine evaluation changes.
- **Stockfish 17 Integration**: Uses the latest engine for accurate centipawn evaluations and mate detection.
- **Visual Evaluation Bar**: Real-time bar showing the current advantage (White vs. Black) and Mate sequences.

### ♟️ Board & Gameplay

- **Interactive Board**: Built with `react-chessboard`, styled with a custom dark monochrome theme and Nothing Red highlights.
- **Smart Navigation**: Jump to any move, step forward/backward, or flip the board orientation.
- **Move History**:
  - **Desktop**: Vertical, scrollable move list with detailed analysis icons.
  - **Mobile**: Compact, horizontal scrollable timeline for easy thumb navigation.
- **Legal Move Validation**: Handles all chess rules including castling, en passant, and promotion.

### 📥 Import System

- **Chess.com Sync**: Fetch recent games directly by username.
- **Smart Load**: Automatically detects and loads **FEN** (positions) or **PGN** (full games) from text input.
- **Game Metadata**: Displays player names, Elo ratings, and game results.

### 🎨 Design (Nothing OS)

- **Aesthetic**: Strictly monochrome (Black #000, White #fff, Gray #808080) with high-contrast Red (#D71921) accents.
- **Typography**: Uses `Space Mono` for a raw, terminal-like feel.
- **UI Elements**: Dot matrix backgrounds, brutalist borders, and pixel-perfect spacing.
- **Responsive**: Fully optimized for mobile devices (`dvh` support) while offering a rich desktop experience.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Logic**: [Chess.js](https://github.com/jhlywa/chess.js) (Move validation & generation)
- **UI Components**:
  - [Lucide React](https://lucide.dev/) (Icons)
  - [React Chessboard](https://github.com/Clariity/react-chessboard)
- **APIs**:
  - [Chess-API](https://chess-api.com/) (Stockfish 17 Analysis)
  - [Chess.com Public API](https://www.chess.com/news/view/published-data-api) (Game retrieval)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/nothing-chess.git
   cd nothing-chess
   ```

2. **Install dependencies**

   ```bash
   npm i
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

---

## 📖 Usage Guide

### Analyzing a Game

1. Click the **IMPORT** button (Top header on Desktop, Top-right on Mobile).
2. **Option A (Chess.com)**: Enter a username and click "FETCH". Select a game from the list.
3. **Option B (Paste)**: Switch to the "Paste" tab and insert a PGN or FEN string.
4. The app will automatically start the "Processing Game" sequence, analyzing moves one by one.

### Understanding the UI

- **Eval Bar**: The bar on the left of the board shows who is winning. White bar up = White advantage. Full bar = Mate.
- **Analysis Box**:
  - **EVAL**: The engine score (e.g., `+1.50` or `M3`).
  - **BEST**: The best move suggested by Stockfish.
  - **Lines**: The calculated continuation line.
- **Move Colors**:
  - 🟢 **Green**: Best/Excellent moves.
  - 🔵 **Blue/Teal**: Great/Brilliant moves.
  - 🟡 **Yellow**: Inaccuracies.
  - 🟠 **Orange**: Mistakes.
  - 🔴 **Red**: Blunders.

---

## 📂 Project Structure

```
App.tsx (Main Component)
│
├── State Management
│   ├── useGameState() → gameState object
│   └── useAnalysisState() → analysisState object
│
├── UI Layers
│   │
│   ├── Overlays
│   │   ├── ImportGame (existing)
│   │   └── AnalysisOverlay
│   │
│   ├── Left Panel (Board Area)
│   │   ├── Mobile Header (mobile only)
│   │   └── Board Container
│   │       ├── MobileHistory (mobile)
│   │       ├── PlayerInfo (top/opponent)
│   │       ├── BoardDisplay
│   │       │   ├── EvalBar (existing)
│   │       │   └── Chessboard (react-chessboard)
│   │       └── PlayerInfo (bottom/player)
│   │
│   └── Right Panel (Analysis & Controls)
│       ├── Desktop Header (desktop only)
│       ├── Analysis Section
│       │   ├── AnalysisBox
│       │   ├── MoveClassificationBadge
│       │   └── EngineContinuation
│       ├── DesktopHistory (desktop only)
│       └── NavigationControls
│           └── NavButton (×4)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

> _Designed with <3 for the Nothing community._
