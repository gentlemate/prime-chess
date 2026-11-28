import { describe, it, expect } from "vitest";
import { Chess } from "../src/chess/Chess";

const play = (fen: string, from: string, to: string): string | undefined => new Chess(fen).tryMove(from, to)?.algebraic;

describe("Standard algebraic notation", () => {
    it("should write a pawn push", () => {
        expect(new Chess().tryMove("e2", "e4")?.algebraic).toBe("e4");
    });

    it("should write a pawn capture with the file of the pawn", () => {
        expect(play("7k/8/8/8/3p4/4P3/8/4K3 w - - 0 1", "e3", "d4")).toBe("exd4");
    });

    it("should write an en passant capture", () => {
        expect(play("7k/8/8/3pP3/8/8/8/4K3 w - d6 0 1", "e5", "d6")).toBe("exd6");
    });

    it("should write a promotion", () => {
        expect(play("7k/4P3/8/8/8/8/8/4K3 w - - 0 1", "e7", "e8")).toBe("e8=Q+");
    });

    it("should write a capture with promotion", () => {
        expect(play("3r3k/4P3/8/8/8/8/8/4K3 w - - 0 1", "e7", "d8")).toBe("exd8=Q+");
    });

    it("should write a check", () => {
        expect(play("7k/8/8/8/8/8/8/R3K3 w Q - 0 1", "a1", "a8")).toBe("Ra8+");
    });

    it("should write a checkmate", () => {
        expect(play("6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1", "a1", "a8")).toBe("Ra8#");
    });

    it("should write a castling", () => {
        expect(play("4k3/8/8/8/8/8/8/4K2R w K - 0 1", "e1", "g1")).toBe("O-O");
    });

    it("should disambiguate by file", () => {
        expect(play("7k/8/8/8/8/8/8/1N2KN2 w - - 0 1", "b1", "d2")).toBe("Nbd2");
    });

    it("should disambiguate by rank", () => {
        expect(play("7k/8/8/8/R7/8/8/R3K3 w - - 0 1", "a1", "a2")).toBe("R1a2");
    });

    it("should disambiguate by file and rank", () => {
        expect(play("8/7k/8/8/8/Q1Q5/8/Q3K3 w - - 0 1", "a3", "b2")).toBe("Qa3b2");
    });
});
