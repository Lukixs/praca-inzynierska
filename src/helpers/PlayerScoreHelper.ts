import { BoardState, Coordinates, Pawn } from "../types/board";
import { MinimaxNode } from "../types/minimax";
import { boardStats } from "./BoardInfo";
import FieldHelper from "./FieldHelper";

export default class {
  public static isGameOver(node: MinimaxNode): boolean {
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      node.movedPawn.player,
      node.boardState
    );
    if (enemyPawns.length < 3) return true;
  }

  public static hasPlayerScored(
    movedPawn: Pawn,
    boardState: BoardState
  ): boolean {
    if (
      this.checkRowsForPoint(movedPawn, boardState) ||
      this.checkColumnsForPoint(movedPawn, boardState)
    ) {
      return true;
    }
    return false;
  }

  private static checkRowsForPoint(
    movedPawn: Pawn,
    boardState: BoardState
  ): boolean {
    const rowIndex = movedPawn.currentPosition.rowIndex;
    if (rowIndex === 0) return this.checkUpperRows(movedPawn, boardState);
    if (rowIndex === boardStats.rowsNumber - 1)
      return this.checkLowerRows(movedPawn, boardState);
    return this.checkAroundRow(movedPawn, boardState);
  }

  private static checkAroundRow(pawn: Pawn, boardState: BoardState) {
    let positionUnder: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex - 1,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    let positionOver: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex + 1,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    let under = FieldHelper.isThisPlayerField(
      positionUnder,
      pawn.player,
      boardState
    );
    let over = FieldHelper.isThisPlayerField(
      positionOver,
      pawn.player,
      boardState
    );

    //Czy otaczające należą do gracza?
    if (under && over) {
      positionUnder = {
        rowIndex: pawn.currentPosition.rowIndex - 2,
        columnIndex: pawn.currentPosition.columnIndex,
      };
      positionOver = {
        rowIndex: pawn.currentPosition.rowIndex + 2,
        columnIndex: pawn.currentPosition.columnIndex,
      };
      under = FieldHelper.isThisPlayerField(
        positionUnder,
        pawn.player,
        boardState
      );
      over = FieldHelper.isThisPlayerField(
        positionOver,
        pawn.player,
        boardState
      );
      //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
      if (under || over) return false;
      return true;
    }
    if (under) return this.checkLowerRows(pawn, boardState);
    return this.checkUpperRows(pawn, boardState);
  }

  private static checkLowerRows(pawn: Pawn, boardState: BoardState) {
    const firstPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex - 1,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    const secondPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex - 2,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    const thirdPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex - 3,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    const firstNext = FieldHelper.isThisPlayerField(
      firstPosition,
      pawn.player,
      boardState
    );
    const secondNext = FieldHelper.isThisPlayerField(
      secondPosition,
      pawn.player,
      boardState
    );
    const thirdNext = FieldHelper.isThisPlayerField(
      thirdPosition,
      pawn.player,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  }

  private static checkUpperRows(pawn: Pawn, boardState: BoardState) {
    const firstPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex + 1,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    const secondPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex + 2,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    const thirdPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex + 3,
      columnIndex: pawn.currentPosition.columnIndex,
    };
    const firstNext = FieldHelper.isThisPlayerField(
      firstPosition,
      pawn.player,
      boardState
    );
    const secondNext = FieldHelper.isThisPlayerField(
      secondPosition,
      pawn.player,
      boardState
    );
    const thirdNext = FieldHelper.isThisPlayerField(
      thirdPosition,
      pawn.player,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  }

  private static checkColumnsForPoint(movedPawn: Pawn, boardState: BoardState) {
    const columnIndex = movedPawn.currentPosition.columnIndex;
    if (columnIndex === 0) return this.checkRightColumns(movedPawn, boardState);
    if (columnIndex === boardStats.columnsNumber - 1)
      return this.checkLeftColumns(movedPawn, boardState);
    return this.checkAroundColumn(movedPawn, boardState);
  }

  private static checkAroundColumn(pawn: Pawn, boardState: BoardState) {
    let rightPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex + 1,
    };
    let leftPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex - 1,
    };
    let right = FieldHelper.isThisPlayerField(
      rightPosition,
      pawn.player,
      boardState
    );
    let left = FieldHelper.isThisPlayerField(
      leftPosition,
      pawn.player,
      boardState
    );
    //Czy otaczające należą do gracza?
    if (right && left) {
      rightPosition = {
        rowIndex: pawn.currentPosition.rowIndex,
        columnIndex: pawn.currentPosition.columnIndex + 2,
      };
      leftPosition = {
        rowIndex: pawn.currentPosition.rowIndex,
        columnIndex: pawn.currentPosition.columnIndex - 2,
      };
      right = FieldHelper.isThisPlayerField(
        rightPosition,
        pawn.player,
        boardState
      );
      left = FieldHelper.isThisPlayerField(
        leftPosition,
        pawn.player,
        boardState
      );
      //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
      if (right || left) return false;
      return true;
    }
    if (right) return this.checkRightColumns(pawn, boardState);
    return this.checkLeftColumns(pawn, boardState);
  }

  private static checkRightColumns(pawn: Pawn, boardState: BoardState) {
    const firstPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex + 1,
    };
    const secondPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex + 2,
    };
    const thirdPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex + 3,
    };
    const firstNext = FieldHelper.isThisPlayerField(
      firstPosition,
      pawn.player,
      boardState
    );
    const secondNext = FieldHelper.isThisPlayerField(
      secondPosition,
      pawn.player,
      boardState
    );
    const thirdNext = FieldHelper.isThisPlayerField(
      thirdPosition,
      pawn.player,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  }

  private static checkLeftColumns(pawn: Pawn, boardState: BoardState) {
    const firstPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex - 1,
    };
    const secondPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex - 2,
    };
    const thirdPosition: Coordinates = {
      rowIndex: pawn.currentPosition.rowIndex,
      columnIndex: pawn.currentPosition.columnIndex - 3,
    };
    const firstNext = FieldHelper.isThisPlayerField(
      firstPosition,
      pawn.player,
      boardState
    );
    const secondNext = FieldHelper.isThisPlayerField(
      secondPosition,
      pawn.player,
      boardState
    );
    const thirdNext = FieldHelper.isThisPlayerField(
      thirdPosition,
      pawn.player,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  }
}
