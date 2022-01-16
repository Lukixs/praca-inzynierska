import { BoardState, Coordinates, Pawn, Player } from "../types/board";
import { MinimaxNode, PawnWithAvailableMoves } from "../types/minimax";
import { boardStats } from "./BoardInfo";
import FieldHelper from "./FieldHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";

export default class {
  static isFieldSuitableToDrop(
    coordinates: Coordinates,
    player: Player,
    boardState: BoardState
  ) {
    if (this.isCoordinateOutOfBounds(coordinates)) return false;
    const targetedField =
      boardState[coordinates.rowIndex][coordinates.columnIndex];
    if (targetedField.player) return false;

    const isGonnaBeThirdinRow = PlayerScoreHelper.isGonnaBeThirdInRow(
      coordinates,
      player,
      boardState
    );
    if (isGonnaBeThirdinRow) return false;

    return true;
  }
  static isThisFieldEmpty(position: Coordinates, board: BoardState): boolean {
    if (this.isCoordinateOutOfBounds(position)) {
      return false;
    }
    const field: Pawn = board[position.rowIndex][position.columnIndex];
    return !field.player;
  }

  static manhattanDistance(first: Coordinates, second: Coordinates): number {
    const distance =
      Math.abs(first.rowIndex - second.rowIndex) +
      Math.abs(first.columnIndex - second.columnIndex);
    return distance;
  }
  static randomLegalEmptyFieldFromBoard(
    boardState: BoardState,
    player: Player
  ): Coordinates {
    const emptyFields = [] as Coordinates[];
    boardState.forEach((column, rowIndex) => {
      column.forEach((field, columnIndex) => {
        if (!field.player) {
          const gonnaBeThirdInRow = PlayerScoreHelper.isGonnaBeThirdInRow(
            { rowIndex: rowIndex, columnIndex: columnIndex } as Coordinates,
            player,
            boardState
          );
          if (!gonnaBeThirdInRow)
            emptyFields.push({ rowIndex: rowIndex, columnIndex: columnIndex });
        }
      });
    });

    return emptyFields[Math.floor(Math.random() * emptyFields.length)];
  }

  static findEmptyFields(
    boardstate: any,
    centerRing: Coordinates[]
  ): Coordinates[] {
    const emptyFields = centerRing.filter((coordinate) => {
      if (this.isCoordinateOutOfBounds(coordinate)) return false;
      return !boardstate[coordinate.rowIndex][coordinate.columnIndex].player;
    });
    return emptyFields;
  }

  static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static createPawnForPlayer(
    position: Coordinates,
    moveCounter: number,
    player: Player
  ): Pawn {
    return {
      player: player,
      index: moveCounter,
      currentPosition: {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex,
      },
    };
  }

  static boardCentralCoordinates(): Coordinates[] {
    const centralCoordinates: Coordinates[] = [];
    let centralColumns;
    const areColumnsEven: boolean = boardStats.columnsNumber % 2 == 0;
    if (areColumnsEven)
      centralColumns = [
        boardStats.columnsNumber / 2,
        boardStats.columnsNumber / 2 - 1,
      ];
    else centralColumns = [Math.floor(boardStats.columnsNumber / 2)];

    let centralRows;
    const rowsEven: boolean = boardStats.rowsNumber % 2 == 0;
    if (rowsEven)
      centralRows = [boardStats.rowsNumber / 2, boardStats.rowsNumber / 2 - 1];
    else centralRows = [Math.floor(boardStats.rowsNumber / 2)];

    let i = 0;
    while (i < centralRows.length) {
      let j = 0;
      while (j < centralColumns.length) {
        centralCoordinates.push({
          rowIndex: centralRows[i],
          columnIndex: centralColumns[j],
        });
        j++;
      }
      i++;
    }

    return centralCoordinates;
  }

  static isBoardEmpty(boardState: Pawn[][]): boolean {
    let i = 0;
    while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (boardState[i][j].player) return false;
        j++;
      }
      i++;
    }

    return true;
  }

  static getWhiteBlackPawnsAmounts(
    boardState: Pawn[][]
  ): { whitePawns: number; blackPawns: number } {
    let whitePawns = 0;
    let blackPawns = 0;

    let i = 0;
    while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (boardState[i][j].player == "white") whitePawns++;
        else if (boardState[i][j].player == "black") blackPawns++;
        j++;
      }
      i++;
    }

    return { whitePawns, blackPawns };
  }

  static getWhiteBlackPawnsFromBoard(
    givenBoard: Pawn[][]
  ): { whitePawns: Pawn[]; blackPawns: Pawn[] } {
    const boardState = FieldHelper.deepCopyItem(givenBoard);

    const whitePawns: Pawn[] = [];
    const blackPawns: Pawn[] = [];

    let i = 0;
    while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (boardState[i][j].player == "white")
          whitePawns.push(boardState[i][j]);
        else if (boardState[i][j].player == "black")
          blackPawns.push(boardState[i][j]);
        j++;
      }
      i++;
    }

    return { whitePawns, blackPawns };
  }

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

  public static countAvailableDirections(
    pawns: Pawn[],
    boardState: BoardState
  ): number {
    let availableMoves = 0;

    pawns.forEach((pawn) => {
      const directions = this.getAvailableDirectionsForPawn(pawn, boardState);
      availableMoves += directions.length;
    });
    return availableMoves;
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
    const newBoardState = this.deepCopyItem(boardState);
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

  // eslint-disable-next-line
  public static deepCopyItem(item: any): any {
    return JSON.parse(JSON.stringify(item));
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

  static amountOfPlayerPawnsOnBoard(
    maximizingPlayer: Player,
    boardState: BoardState
  ): number {
    const copyOfBoardState = FieldHelper.deepCopyItem(boardState);
    const pawnsAmounts = FieldHelper.getWhiteBlackPawnsAmounts(
      copyOfBoardState
    );
    if (maximizingPlayer == "white") return pawnsAmounts.whitePawns;
    return pawnsAmounts.blackPawns;
  }
}
