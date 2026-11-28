import { describe, it, expect } from "vitest";
import { Chess } from "../src/chess/Chess";
import { FischerRandomChess } from "../src/chess/FischerRandomChess";
import { Chessboard } from "../src/board/Chessboard";
import { chess } from "../src/api/chess";

describe("Castling", () => {
    it("should not share castling squares between games", () => {
        FischerRandomChess.fromId(0);
        const game: Chess = new Chess("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        expect(Chessboard.WhitesCastlingSquares.queenside.king.from).toBe("e1");
        expect(Chessboard.WhitesCastlingSquares.queenside.rook.from).toBe("a1");
        expect(game.isLegalMove("e1", "a1")).toBe(true);
        game.tryMove("e1", "c1");
        expect(game.toFen()).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");
    });

    it("should revoke the castling right when the rook is captured on its square", () => {
        const game: Chess = new Chess("r3k2r/pppppp1p/6p1/8/8/8/1B6/4K3 w kq - 0 1");
        game.tryMove("b2", "h8");
        expect(game.toFen()).toBe("r3k2B/pppppp1p/6p1/8/8/8/8/4K3 b q - 0 1");
        expect(game.isLegalMove("e8", "g8")).toBe(false);
        expect(game.isLegalMove("e8", "c8")).toBe(true);
    });

    it("should restore the castling rights when cancelling the capture", () => {
        const game: Chess = new Chess("r3k2r/pppppp1p/6p1/8/8/8/1B6/4K3 w kq - 0 1");
        game.tryMove("b2", "h8");
        game.cancelLastMove();
        expect(game.players[1].castlingRights).toEqual({ kingside: true, queenside: true });
        game.tryMove("e1", "e2");
        expect(game.isLegalMove("e8", "g8")).toBe(true);
    });

    it("should not castle when the rook is missing", () => {
        const game: Chess = new Chess("r3k3/8/8/8/8/8/8/4K3 b kq - 0 1");
        expect(game.isLegalMove("e8", "g8")).toBe(false);
        expect(game.isLegalMove("e8", "c8")).toBe(true);
    });

    it("should keep Fischer Random castling when the game is created from a FEN record", () => {
        const game = chess.fischerRandomFromFen("1r4kr/pppppppp/8/8/8/8/PPPPPPPP/1R4KR w KQkq - 0 1");
        expect(game.isLegalMove("g1", "b1")).toBe(true);
        game.tryMove("g1", "b1");
        expect(game.toFen()).toBe("1r4kr/pppppppp/8/8/8/8/PPPPPPPP/2KR3R b kq - 1 1");
    });
});
