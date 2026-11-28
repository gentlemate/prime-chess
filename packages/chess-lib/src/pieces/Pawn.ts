import { Position } from "../coordinates/Position";
import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { Piece } from "./Piece";
import { Square } from "../board/Square";
import { Player } from "../players/Player";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import { EnPassantCapture } from "../moves/EnPassantCapture";
import { Promotion } from "../moves/Promotion";
import { Chessboard } from "../board/Chessboard";

export class Pawn extends Piece {
    constructor(color: PlayerColor) {
        super(color);
    }

    getName(): PieceName {
        return PieceName.Pawn;
    }

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard, enPassantTarget: string | null): Move[] {
        let moves: Move[] = [];
        let toSquare: Square | null = fromSquare;

        toSquare = chessboard.getSquareByDirection(toSquare, player.direction);
        if (toSquare && toSquare.isEmpty()) {
            let move: Move = chessboard.getSquareByDirection(toSquare, player.direction)
                ? new Move(fromSquare, toSquare)
                : new Promotion(fromSquare, toSquare, null);
            moves.push(move);

            if (Pawn.isInitialPosition(fromSquare.position, player.direction, chessboard)) {
                const skippedSquare: Square = toSquare;
                toSquare = chessboard.getSquareByDirection(toSquare, player.direction);
                if (toSquare && toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    move.enPassantTarget = skippedSquare.name;
                    moves.push(move);
                }
            }
        }

        for (const direction of player.pawnCaptureDirections) {
            toSquare = chessboard.getSquareByDirection(fromSquare, direction);
            if (
                toSquare &&
                toSquare.isOccupiedByOpponent(player.color) &&
                !toSquare.isOccupiedByPieceName(PieceName.King)
            ) {
                let move: Move = chessboard.getSquareByDirection(toSquare, player.direction)
                    ? new Capture(fromSquare, toSquare, toSquare.piece)
                    : new Promotion(fromSquare, toSquare, toSquare.piece);
                moves.push(move);
            }
        }

        return [...moves, ...this.getEnPassantCapture(player, fromSquare, chessboard, enPassantTarget)];
    }

    getEnPassantCapture(
        player: Player,
        fromSquare: Square,
        chessboard: Chessboard,
        enPassantTarget: string | null,
    ): Move[] {
        let moves: Move[] = [];

        if (!enPassantTarget) {
            return moves;
        }

        for (const direction of player.pawnCaptureDirections) {
            const toSquare: Square | null = chessboard.getSquareByDirection(fromSquare, direction);
            if (!toSquare || toSquare.name !== enPassantTarget || !toSquare.isEmpty()) {
                continue;
            }

            const captureSquare: Square | null = chessboard.getSquareByPosition({
                x: toSquare.position.x - player.direction.dx,
                y: toSquare.position.y - player.direction.dy,
            });

            if (
                captureSquare?.piece &&
                captureSquare.isOccupiedByPieceName(PieceName.Pawn) &&
                captureSquare.isOccupiedByOpponent(player.color)
            ) {
                moves.push(new EnPassantCapture(fromSquare, toSquare, captureSquare.piece, captureSquare));
            }
        }

        return moves;
    }

    static getCaptureDirections(playerDirection: Direction): Direction[] {
        if (playerDirection.dy !== 0) {
            return playerDirection.dy > 0
                ? [Directions.UpLeft, Directions.UpRight]
                : [Directions.DownLeft, Directions.DownRight];
        }

        if (playerDirection.dx !== 0) {
            return playerDirection.dx > 0
                ? [Directions.UpRight, Directions.DownRight]
                : [Directions.UpLeft, Directions.DownLeft];
        }

        return [];
    }

    static getEnPassantCaptureDirections(playerDirection: Direction): Direction[] {
        if (playerDirection.dy !== 0) {
            return [Directions.Left, Directions.Right];
        }

        if (playerDirection.dx !== 0) {
            return [Directions.Up, Directions.Down];
        }

        return [];
    }

    static isInitialPosition(pawnPosition: Position, playerDirection: Direction, chessboard: Chessboard): boolean {
        if (playerDirection.dy !== 0) {
            return (
                (playerDirection.dy > 0 && pawnPosition.y === 1) ||
                (playerDirection.dy < 0 && pawnPosition.y === chessboard.ranks.length - 2)
            );
        }

        if (playerDirection.dx !== 0) {
            return (
                (playerDirection.dx > 0 && pawnPosition.x === 1) ||
                (playerDirection.dx < 0 && pawnPosition.x === chessboard.ranks.length - 2)
            );
        }

        return false;
    }
}
