import { BoardState, Coordinates, Pawn, Player } from "../types/board";
import { MinimaxNode, PawnWithAvailableMoves } from "../types/minimax";
import { boardStats } from "./BoardInfo";

export default class {
  public static isThisPlayerField(
    position: Coordinates,
    player: Player,
    board: BoardState
  ): boolean {
    if (this.isCoordinateOutOfBounds(position)) {
      return false;
    }
    const field: Pawn = board[position.rowIndex][position.columnIndex];
    return field && field.player === player;
  }

  public static isCoordinateOutOfBounds(position: Coordinates): boolean {
    const rowOutOfBound =
      position.rowIndex < 0 || position.rowIndex >= boardStats.rowsNumber;
    const columnOutOfBound =
      position.columnIndex < 0 ||
      position.columnIndex >= boardStats.columnsNumber;
    if (rowOutOfBound || columnOutOfBound) {
      return true;
    }
  }

  public static getEnemyPlayerPawnsFromBoard(
    player: Player,
    board: BoardState
  ): Pawn[] {
    const pawns: Pawn[] = [];
    board.forEach((row) => {
      row.forEach((field) => {
        if (field.player && field.player != player) pawns.push(field);
      });
    });
    return pawns;
  }

  public static get emptyField(): Pawn {
    return {
      player: null,
      index: null,
      currentPosition: null,
      lastPosition: null,
    };
  }

  public static removePawnFromBoard(pawn: Pawn, board: BoardState): BoardState {
    board[pawn.currentPosition.rowIndex][
      pawn.currentPosition.columnIndex
    ] = this.emptyField;
    return board;
  }

  public static getPlayerPawnsFromBoard(
    player: Player,
    board: BoardState
  ): Pawn[] {
    const pawns: Pawn[] = [];
    board.forEach((row) => {
      row.forEach((field) => {
        if (field && field.player == player) pawns.push(field);
      });
    });
    return pawns;
  }

  public static getMovablePawnWithAvailableDirections(
    pawns: Pawn[],
    boardState: BoardState
  ): PawnWithAvailableMoves[] {
    const availablePawns: PawnWithAvailableMoves[] = [];

    pawns.forEach((pawn) => {
      const directions = this.getAvailableDirectionsForPawn(pawn, boardState);
      if (directions.length) {
        availablePawns.push({ pawn, directions });
      }
    });
    return availablePawns;
  }

  public static getAvailableDirectionsForPawn(
    pawn: Pawn,
    boardState: BoardState
  ): Coordinates[] {
    const position = pawn.currentPosition;
    const availableDirections: Coordinates[] = [];
    const upDirection: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex,
    };
    const downDirection: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex,
    };
    const rightDirection: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1,
    };
    const leftDirection: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1,
    };

    if (this.isFieldSuitableForPawnToMove(upDirection, pawn, boardState))
      availableDirections.push(upDirection);
    if (this.isFieldSuitableForPawnToMove(downDirection, pawn, boardState))
      availableDirections.push(downDirection);
    if (this.isFieldSuitableForPawnToMove(rightDirection, pawn, boardState))
      availableDirections.push(rightDirection);
    if (this.isFieldSuitableForPawnToMove(leftDirection, pawn, boardState))
      availableDirections.push(leftDirection);

    return availableDirections;
  }

  public static isFieldSuitableForPawnToMove(
    direction: Coordinates,
    movingPawn: Pawn,
    boardState: BoardState
  ): boolean {
    if (this.isCoordinateOutOfBounds(direction)) return false;
    const targetedField = boardState[direction.rowIndex][direction.columnIndex];

    if (targetedField.player) return false;
    if (
      movingPawn.lastPosition &&
      this.isCoordinateEqual(direction, movingPawn.lastPosition)
    ) {
      return false;
    }
    return true;
  }

  public static isCoordinateEqual(
    firstPosition: Coordinates,
    secondPosition: Coordinates
  ): boolean {
    const columnsEqual =
      firstPosition.columnIndex === secondPosition.columnIndex;

    const rowsEqual = firstPosition.rowIndex === secondPosition.rowIndex;

    return columnsEqual && rowsEqual;
  }

  public static nodeAfterPawnMoveIntoDirection(
    pawnBeforeMove: Pawn,
    direction: Coordinates,
    boardState: Pawn[][]
  ): MinimaxNode {
    const newBoardState = this.deepCopyBoardState(boardState);
    const movedPawn: Pawn = {
      lastPosition: pawnBeforeMove.currentPosition,
      currentPosition: direction,
      player: pawnBeforeMove.player,
      index: pawnBeforeMove.index,
    };
    newBoardState[direction.rowIndex][direction.columnIndex] = movedPawn;
    newBoardState[pawnBeforeMove.currentPosition.rowIndex][
      pawnBeforeMove.currentPosition.columnIndex
    ] = this.emptyField;
    return {
      movedPawn: newBoardState[direction.rowIndex][direction.columnIndex],
      boardState: newBoardState,
    };
  }

  private static deepCopyBoardState(boardState: BoardState): BoardState {
    return JSON.parse(JSON.stringify(boardState));
  }

  public static isPlayerOutOfMoves(
    player: Player,
    boardState: Pawn[][]
  ): boolean {
    const playerPawns = this.getPlayerPawnsFromBoard(player, boardState);
    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = this.getMovablePawnWithAvailableDirections(
      playerPawns,
      boardState
    );

    if (playerPawnsWithAvailableMoves.length == 0) return true;
  }
}
