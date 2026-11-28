import { describe, it, expect } from "vitest";
import { chess } from "../src/api/chess";

describe("Public API", () => {
    it("should not expose the internal history", () => {
        const game = chess.new();
        game.getHistory().pop();
        expect(game.getHistory().length).toBe(1);
        game.tryMove("e2", "e4");
        expect(game.getHistory().length).toBe(2);
    });
});
