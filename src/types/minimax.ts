import { Coordinates, Pawn } from "./board";

export interface MinimaxNode {
  movedPawn?: Pawn;
  removedPawn?: Pawn;
  boardState: Pawn[][];
}

export interface Minimax {
  value: number;
  bestMove?: Pawn;
  pawnToRemove?: Pawn;
  isPawnToRemoveFresh?: boolean;
}

export interface PawnWithAvailableMoves {
  pawn: Pawn;
  directions?: Coordinates[];
}
// node = {
//   movedPawn = {
//     pawn: pawn
//     from:{
//       rowIndex,
//       columnIndex
//     },
//     to:{
//       rowIndex,
//       columnIndex
//     }
//   },
//   removedPawn =  pawn|null,
//   boardState:{value[][]:{pawn}}
// }

export interface dropMinimax {
  value: number;
  position: Coordinates;
}
