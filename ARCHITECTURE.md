# Architecture Overview

## Component Hierarchy

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

## Data Flow

```
User Interaction
    ↓
App.tsx Handlers
    ├─ onMove() → updates gameState
    ├─ handleSmartImport() → loadFenHelper/loadPgnHelper → analyzeFullGame
    ├─ navigateTo() → updates gameState
    └─ handleResetBoard() → resets gameState & analysisState
    ↓
State Updates (via hooks)
    ├─ gameState.fen → triggers effect → analysis fetch
    ├─ gameState.currentMoveIndex → scrolls history
    └─ analysisState.analysis → UI updates
    ↓
Component Re-renders
    ├─ BoardDisplay (re-renders on FEN change)
    ├─ MoveClassificationBadge (re-renders on move index change)
    ├─ PlayerInfo (re-renders on game status change)
    └─ History components (re-renders on move list change)
```

## Module Dependencies

```
App.tsx
├── imports: useGameState, useAnalysisState (from hooks/)
├── imports: All component exports
├── imports: chessApiService (from services/)
├── imports: loadFenHelper, loadPgnHelper, analyzeGameMoves (from utils/)
│
hooks/
├── useGameState.ts → imports: GameHeader, AnalyzedMove (from types/)
├── useAnalysisState.ts → imports: AnalysisState (from types/)
│
components/
├── analysis/ → imports: getMoveStyle (from utils/moveStyles)
├── history/ → imports: getMoveStyle, AnalyzedMove
├── controls/ → imports: lucide-react
├── board/ → imports: EvalBar, BoardDisplay dependencies
│
utils/
├── moveStyles.tsx → imports: MoveClassification (from types/)
├── gameHelpers.ts → imports: chessApiService, types
│
types.ts (central type definitions)
```

## State Structure

### gameState (from useGameState)

```typescript
{
  gameId: number
  fen: string                              // Current position
  startFen: string                         // Game starting position
  fullHistory: string[]                    // All moves
  currentMoveIndex: number                 // Current move in history
  orientation: "white" | "black"           // Board perspective
  gameHeader: GameHeader                   // Player info
  analyzedMoves: AnalyzedMove[]            // Analysis cache
  // Methods:
  setGameId, setFen, setStartFen, ...      // Setters
  resetGame()                              // Reset all
}
```

### analysisState (from useAnalysisState)

```typescript
{
  analysis: AnalysisState                  // Current analysis
  {
    isAnalyzing: boolean
    bestMove: string | null
    bestMoveSan: string | null
    evaluation: number | null
    mate: number | null
    continuation: string[]
    depth: number
    winChance: number
  }
  isProcessingGame: boolean                // Full game analysis
  processingProgress: number               // 0-100
  // Methods:
  setAnalysis, setIsProcessingGame, ...    // Setters
  resetAnalysis()                          // Reset all
}
```

## Component Prop Interfaces

### AnalysisBox

```typescript
{
  analysis: AnalysisState;
}
```

### BoardDisplay

```typescript
{
  fen: string;
  onPieceDrop: (source: string, target: string) => boolean;
  boardOrientation: "white" | "black";
  isProcessing: boolean;
  evaluation: AnalysisState;
  isGameOver: boolean;
  gameOverReason: string;
}
```

### PlayerInfo

```typescript
{
  name: string
  elo: string
  color: "w" | "b"
  isActive: boolean
  isCheckmate: boolean
  isCheck: boolean
  isTopPlayer?: boolean
  onFlip?: () => void
}
```

### History Components

```typescript
// MobileHistory
{
  moves: string[]
  currentMoveIndex: number
  onNavigate: (index: number) => void
  scrollRef: React.RefObject<HTMLDivElement>
}

// DesktopHistory
{
  moves: string[]
  analyzedMoves: AnalyzedMove[]
  currentMoveIndex: number
  onNavigate: (index: number) => void
  scrollRef: React.RefObject<HTMLDivElement>
}
```

### Controls

```typescript
// NavButton
{
  icon: ReactNode
  onClick: () => void
  disabled: boolean
}

// NavigationControls
{
  canGoFirst: boolean
  canGoPrev: boolean
  canGoNext: boolean
  canGoLast: boolean
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
}
```

## Performance Considerations

1. **State Separation**: Game state and analysis state are separate for focused updates
2. **Memoization**: Use `useMemo` for gameStatus calculations
3. **Ref Usage**: Direct DOM manipulation for scrolling instead of state-based
4. **Component Composition**: Each component renders independently
5. **Event Handler Memoization**: Key handlers use `useCallback`

## Future Optimization Opportunities

1. Split App.tsx further if it grows beyond 500 lines
2. Add React.memo to pure components (MoveClassificationBadge, etc.)
3. Use Context API for deeply nested prop drilling
4. Implement code-splitting for lazy loading components
5. Add error boundaries for robustness
6. Performance monitoring with React DevTools Profiler
