import type { ChessVariant } from "./ChessVariant.js";
import type { Move } from "./Move.js";

export interface GameState {
    variant: ChessVariant;
    initialFen: string | null;
    moves: Move[];
}
