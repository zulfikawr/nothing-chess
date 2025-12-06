import React, { useState } from "react";
import { fetchRecentGames } from "../services/chessComService";
import { ChessComGame } from "../types";
import {
  Download,
  X,
  Loader2,
  Play,
  User,
  Calendar,
  Trophy,
  AlertCircle,
  FileText,
  Globe,
} from "lucide-react";

interface ImportGameProps {
  onImport: (content: string) => void;
  onClose: () => void;
}

const ImportGame: React.FC<ImportGameProps> = ({ onImport, onClose }) => {
  const [activeTab, setActiveTab] = useState<"chesscom" | "paste">("chesscom");

  // Chess.com State
  const [username, setUsername] = useState("");
  const [games, setGames] = useState<ChessComGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paste State
  const [pasteContent, setPasteContent] = useState("");

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedGames = await fetchRecentGames(username);
      setGames(fetchedGames);
      if (fetchedGames.length === 0)
        setError("No games found in the last archive.");
    } catch (err) {
      setError("Could not fetch games. Check username.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasteImport = () => {
    if (!pasteContent.trim()) return;
    onImport(pasteContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-black border border-white/20 p-0 relative max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-neutral-900/50">
          <h2 className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2">
            <Download className="text-nothing-red" size={20} />
            Import Game
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setActiveTab("chesscom")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === "chesscom" ? "bg-white text-black" : "bg-black text-neutral-500 hover:text-white"}`}
          >
            <Globe size={14} /> Chess.com
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === "paste" ? "bg-white text-black" : "bg-black text-neutral-500 hover:text-white"}`}
          >
            <FileText size={14} /> Paste PGN / FEN
          </button>
        </div>

        {/* Tab Content: Chess.com */}
        {activeTab === "chesscom" && (
          <>
            <div className="p-6 bg-black border-b border-neutral-800">
              <form onSubmit={handleFetch} className="flex gap-2">
                <div className="flex-1 relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Chess.com Username"
                    className="w-full bg-neutral-900 border border-neutral-800 p-4 pl-12 text-white focus:border-white outline-none font-mono text-sm placeholder:text-neutral-600 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-8 font-bold hover:bg-neutral-200 disabled:opacity-50 flex items-center gap-2 text-sm tracking-wide transition-colors"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "FETCH"}
                </button>
              </form>
              {error && (
                <div className="flex items-center gap-2 text-nothing-red mt-4 font-mono text-xs p-2 bg-nothing-red/10 border border-nothing-red/20">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black p-4 space-y-1 min-h-[300px]">
              {games.length === 0 && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-neutral-700 font-mono text-xs uppercase tracking-widest gap-2">
                  <Globe size={32} className="opacity-20 mb-2" />
                  Enter username to fetch recent games
                </div>
              )}

              {games.map((game, idx) => {
                const date = new Date(
                  game.end_time * 1000,
                ).toLocaleDateString();
                const isWin =
                  game.white.username.toLowerCase() === username.toLowerCase()
                    ? game.white.result === "win"
                    : game.black.result === "win";

                return (
                  <div
                    key={idx}
                    className="group border border-transparent hover:border-neutral-700 bg-neutral-900/30 p-4 transition-all flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3 text-sm font-bold font-mono">
                        <span
                          className={`${game.white.result === "win" ? "text-green-500" : "text-neutral-400"}`}
                        >
                          {game.white.username}
                        </span>
                        <span className="text-neutral-700 text-xs">VS</span>
                        <span
                          className={`${game.black.result === "win" ? "text-green-500" : "text-neutral-400"}`}
                        >
                          {game.black.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy size={10} /> {game.time_control}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 ${isWin ? "bg-green-500/20 text-green-500" : "bg-neutral-800 text-neutral-400"}`}
                        >
                          {isWin ? "WON" : "LOST/DRAW"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onImport(game.pgn)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-black py-2 px-4 hover:bg-nothing-red hover:text-white transition-all transform translate-x-4 group-hover:translate-x-0 font-bold text-xs tracking-wider flex items-center gap-2"
                    >
                      <Play size={12} fill="currentColor" /> IMPORT
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Tab Content: Paste */}
        {activeTab === "paste" && (
          <div className="p-6 flex flex-col gap-4 min-h-[400px]">
            <div className="flex-1 relative">
              <textarea
                className="w-full h-full bg-neutral-900 border border-neutral-800 p-4 text-white font-mono text-xs focus:border-white outline-none resize-none custom-scrollbar"
                placeholder="Paste PGN or FEN string here..."
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
              />
            </div>
            <button
              onClick={handlePasteImport}
              disabled={!pasteContent.trim()}
              className="w-full bg-white text-black py-4 font-bold hover:bg-nothing-red hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Download size={16} /> Load Game / Position
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportGame;
