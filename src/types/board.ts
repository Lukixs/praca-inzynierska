export type Player = "white" | "black";

export interface Coordinates {
  rowIndex: number;
  columnIndex: number;
}

export interface BoardDimensions {
  columnsNumber: number;
  rowsNumber: number;
}

// export interface BoardField {
//   player: player;
//   pawnIndex: number;
//   currentPosition: Coordinates;
//   lastPosition?: Coordinates;
// }

export interface Pawn {
  player: Player;
  index: number;
  currentPosition: Coordinates;
  lastPosition?: Coordinates;
}

export type BoardState = Pawn[][];
