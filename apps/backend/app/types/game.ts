import { type Chess } from "@primechess/chess-lib";
import { type ChessVariant } from "@primechess/types";

export interface Game {
    id: string;
    variant: ChessVariant;
    chess: Chess;
    uids: string[];
}
