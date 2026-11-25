import { describe, it, expect } from "vitest";
import { Chess } from "../src/chess/Chess";
import { Chessboard } from "../src/board/Chessboard";
import { MoveDTO } from "../src/dto/MoveDTO";
import { PieceDTO } from "../src/dto/PieceDTO";

describe("Chessboard", () => {
    const chessboard: Chessboard = new Chessboard("5kr1/pppppppp/8/8/8/8/PPPPPPPP/5KR1");
    const king: PieceDTO = { color: "w", name: "k" };
    const rook: PieceDTO = { color: "w", name: "r" };
    const move: MoveDTO = {
        fromSquare: "f1",
        toSquare: "g1",
        piece: king,
        nestedMove: {
            fromSquare: "g1",
            toSquare: "f1",
            piece: rook,
        },
    };
    chessboard.carryoutMove(move);

    it("should carryout a nested move without overwriting", () => {
        expect(chessboard.getSquareByName("g1")?.piece?.serialize()).toMatchObject(king);
        expect(chessboard.getSquareByName("f1")?.piece?.serialize()).toMatchObject(rook);
    });

    it("should undo a nested move without overwriting", () => {
        chessboard.undoMove(move);

        expect(chessboard.getSquareByName("g1")?.piece?.serialize()).toMatchObject(rook);
        expect(chessboard.getSquareByName("f1")?.piece?.serialize()).toMatchObject(king);
    });
});
