type player = "white" | "black";

export interface Coordinates {
  rowIndex: number;
  columnIndex: number;
}

export interface BoardDimensions {
  columnsNumber: number;
  rowsNumber: number;
}

export interface BoardField {
  player: player;
  pawnIndex: number;
  currentPosition: Coordinates;
  lastPosition?: Coordinates;
}

export interface Pawn {
  player: string;
  pawnIndex: number;
  currentPosition: Coordinates;
  lastPosition?: Coordinates;
}
