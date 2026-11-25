import { Position } from "../coordinates/Position";
import { PieceDTO } from "./PieceDTO";

export type MoveDTO = {
    algebraic?: string;
    fromPosition?: Position;
    toPosition?: Position;
    fromSquare: string;
    toSquare: string;
    piece: PieceDTO | null;
    captureSquare?: string | null;
    capturedPiece?: PieceDTO | null;
    nestedMove?: MoveDTO | null;
    isPromoting?: boolean;
};
