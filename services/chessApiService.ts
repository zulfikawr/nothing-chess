import { ChessApiResponse } from "../types";

const API_URL = "https://chess-api.com/v1";

export class ChessApiService {
  private abortController: AbortController | null = null;

  /**
   * Sends a POST request to the Chess API.
   * Returns a promise that resolves with the analysis data.
   * Automatically aborts any previous pending requests.
   */
  async analyze(
    fen: string,
    options: { variants?: number; depth?: number } = {},
  ): Promise<ChessApiResponse> {
    // Cancel previous pending request
    if (this.abortController) {
      this.abortController.abort();
    }

    // Create new controller for this request
    this.abortController = new AbortController();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fen,
          variants: options.variants || 1,
          depth: options.depth || 16,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: ChessApiResponse = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error; // Re-throw to let caller handle aborts specifically
      }
      console.error("Chess API fetch error:", error);
      throw error;
    }
  }
}

export const chessApiService = new ChessApiService();
