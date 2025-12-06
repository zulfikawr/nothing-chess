import { ChessComGame } from "../types";

export const fetchRecentGames = async (
  username: string,
): Promise<ChessComGame[]> => {
  try {
    // 1. Get archives list
    const archivesRes = await fetch(
      `https://api.chess.com/pub/player/${username}/games/archives`,
    );
    if (!archivesRes.ok) throw new Error("User not found");

    const archivesData = await archivesRes.json();
    const archives = archivesData.archives;

    if (!archives || archives.length === 0) return [];

    // 2. Get games from the last archive (current/last month)
    const lastArchiveUrl = archives[archives.length - 1];
    const gamesRes = await fetch(lastArchiveUrl);
    const gamesData = await gamesRes.json();

    return gamesData.games.reverse(); // Newest first
  } catch (error) {
    console.error("Error fetching chess.com games:", error);
    throw error;
  }
};
