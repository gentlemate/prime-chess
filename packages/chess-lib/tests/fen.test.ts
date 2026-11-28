import { describe, it, expect } from "vitest";
import { Fen } from "../src/fen/Fen";
import { Chess } from "../src/chess/Chess";

describe("Fen", () => {
    it("should parse FEN string rightly", () => {
        const fen: Fen = Fen.fromString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        expect(fen.position).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
        expect(fen.activePlayer).toBe("w");
        expect(fen.castlingRecord).toEqual({
            w: { kingside: true, queenside: true },
            b: { kingside: true, queenside: true },
        });
        expect(fen.enPassantTarget).toBe("-");
        expect(fen.halfmoveClock).toBe(0);
        expect(fen.fullmoveNumber).toBe(1);
    });
    it("should fill missing fields with default values", () => {
        const fen: Fen = Fen.fromString("4k3/8/8/8/8/8/8/4K3");
        expect(fen.toString()).toBe("4k3/8/8/8/8/8/8/4K3 w - - 0 1");
    });

    it("should replace invalid counters with default values", () => {
        const fen: Fen = Fen.fromString("4k3/8/8/8/8/8/8/4K3 b - - x -3");
        expect(fen.halfmoveClock).toBe(0);
        expect(fen.fullmoveNumber).toBe(1);
    });

    it("should create a game from an incomplete FEN record", () => {
        const chess: Chess = new Chess("4k3/8/8/8/8/8/8/4K3 w - -");
        chess.tryMove("e1", "e2");
        expect(chess.toFen()).toBe("4k3/8/8/8/8/8/4K3/8 b - - 1 1");
    });
});
