import { PlayerColor } from "../types/PlayerColor";
import { CastlingRights } from "../types/CastlingRights";

export class Fen {
    static InitialFenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    position: string;
    activePlayer: string;
    castlingRecord: Record<string, CastlingRights>;
    enPassantTarget: string;
    halfmoveClock: number;
    fullmoveNumber: number;

    constructor(
        position: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
        color: PlayerColor = PlayerColor.White,
        castlingRecord: Record<string, CastlingRights> = {
            w: { kingside: true, queenside: true },
            b: { kingside: true, queenside: true },
        },
        enPassantTarget: string | null = null,
        halfmoveClock: number = 0,
        fullmoveNumber: number = 1,
    ) {
        this.position = position;
        this.activePlayer = color as string;
        this.castlingRecord = castlingRecord;
        this.enPassantTarget = enPassantTarget || "-";
        this.halfmoveClock = halfmoveClock;
        this.fullmoveNumber = fullmoveNumber;
    }

    static parseCastlingRights(fenString: string, color: PlayerColor): CastlingRights {
        return {
            kingside: fenString.includes(color === PlayerColor.Black ? "k" : "K"),
            queenside: fenString.includes(color === PlayerColor.Black ? "q" : "Q"),
        };
    }

    static serializeCastlingRights(castlingRights: CastlingRights, color: PlayerColor): string {
        const fenString: string = (castlingRights.kingside ? "K" : "") + (castlingRights.queenside ? "Q" : "");
        return color === PlayerColor.Black ? fenString.toLowerCase() : fenString;
    }

    static fromString(fenString: string): Fen {
        const [
            position,
            activePlayer = PlayerColor.White,
            castlingRights = "-",
            enPassantTarget = "-",
            halfmoveClock = "0",
            fullmoveNumber = "1",
        ] = fenString.trim().split(/\s+/);

        return new Fen(
            position,
            activePlayer as PlayerColor,
            {
                w: Fen.parseCastlingRights(castlingRights, PlayerColor.White),
                b: Fen.parseCastlingRights(castlingRights, PlayerColor.Black),
            },
            enPassantTarget,
            Fen.parseCounter(halfmoveClock, 0),
            Fen.parseCounter(fullmoveNumber, 1),
        );
    }

    static parseCounter(value: string, minimum: number): number {
        const counter: number = Number(value);
        return Number.isInteger(counter) && counter >= minimum ? counter : minimum;
    }

    toString(): string {
        const castlingRights: string =
            Object.entries(this.castlingRecord)
                .map(([color, rights]) => Fen.serializeCastlingRights(rights, color as PlayerColor))
                .join("") || "-";

        return `${this.position} ${this.activePlayer} ${castlingRights} ${this.enPassantTarget} ${this.halfmoveClock} ${this.fullmoveNumber}`;
    }
}
