import { Coordinates, Player, BoardState, Pawn } from "../types/board";
import { dropMinimax } from "../types/minimax";
import FieldHelper from "./FieldHelper";
import { minimaxValues } from "./BoardInfo";
import MinimaxMove from "./Minimax";

export default class {
  public static dropMinimax(
    boardState: BoardState,
    depth: number,
    maximizingPlayer: Player
  ): dropMinimax {
    // const isBoardEmpty: boolean = FieldHelper.isBoardEmpty(node.boardState);
    const numberOfPawns: number = this.amountOfPlayerPawnsOnBoard(
      maximizingPlayer,
      boardState
    );

    if (numberOfPawns === 0) return this.dropEntryPhase(boardState);

    if (numberOfPawns < 12 && depth <= 2) {
      // console.log("make minimax for depth 2");
      const result = MinimaxMove.minimax(
        { boardState },
        2,
        minimaxValues.MIN,
        minimaxValues.MAX,
        maximizingPlayer
      );
      return {
        value: result.value,
        position: null,
      };
    }

    if (numberOfPawns < 12) {
      console.log("Middle");
      if (maximizingPlayer == "white")
        return this.dropWhiteMiddlePhase(boardState, depth, maximizingPlayer);
      return this.dropBlackMiddlePhase(boardState, depth, maximizingPlayer);
    }

    if (numberOfPawns == 12) {
      console.log("Odpalamy dla depth: ", depth);
      const result = MinimaxMove.minimax(
        { boardState },
        depth ? depth - 1 : 0,
        minimaxValues.MIN,
        minimaxValues.MAX,
        maximizingPlayer
      );
      return {
        value: result.value,
        position: null,
      };
      // const result = MinimaxMove.minimax(
      //   { boardState },
      //   depth,
      //   minimaxValues.MIN,
      //   minimaxValues.MAX,
      //   maximizingPlayer
      // );
      // return {
      //   value: result.value,
      //   position: null,
      // };
      // console.log("make minimax for depth > 2");
    }

    // const pawnsOnBoard = FieldHelper.getWhiteBlackPawnsFromBoard(
    //   node.boardState
    // );
    // if (!pawnsOnBoard.blackPawns && !pawnsOnBoard.whitePawns) {
    //   return { rowIndex: 2, columnIndex: 3 };
    // }
    // ============================================================
    // 1. Sprawdzić czy mamy już jakieś nasze pionki na planszy,
    //   * Jeśli ma to szukamyDostawienia()
    //   * Jeśli nie to StawiamyNaŚrodku()
    // ============================================================
    // szukamyDostawienia() {}
    // Patrzy czy mamy jakieś dwójki,Jeśli mamy, dostawiamy po rogach na ile to możliwe
    // jak nie TO dostawiamy do tego bliżej środka, staramy się również kierować na środek. |x-3|
    // WAŻNE, raczej unikamy zbitych kontrukcji, i nie dostawiamy "na 3"
    //
  }

  static dropWhiteMiddlePhase(
    boardState: BoardState,
    depth: number,
    maximizingPlayer: Player
  ): dropMinimax {
    let maxEval = minimaxValues.MIN;
    let choosenPosition: Coordinates;

    let i = 0;
    while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (!boardState[i][j].player) {
          const newBoardState = FieldHelper.deepCopyItem(boardState);
          const currentPosition: Coordinates = { rowIndex: i, columnIndex: j };
          newBoardState[i][j] = FieldHelper.createPawnForPlayer(
            currentPosition,
            this.getRoundNumber(boardState),
            maximizingPlayer
          );
          const result = this.dropMinimax(newBoardState, depth - 1, "black");
          if (result.value > maxEval) {
            maxEval = result.value;
            choosenPosition = result.position;
          }
        }
        j++;
      }
      i++;
    }

    return { value: maxEval, position: choosenPosition };
  }

  static dropBlackMiddlePhase(
    boardState: BoardState,
    depth: number,
    maximizingPlayer: Player
  ): dropMinimax {
    let minEval = minimaxValues.MAX;
    let choosenPosition: Coordinates;

    let i = 0;
    while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (!boardState[i][j].player) {
          const newBoardState = FieldHelper.deepCopyItem(boardState);
          const currentPosition: Coordinates = { rowIndex: i, columnIndex: j };
          newBoardState[i][j] = FieldHelper.createPawnForPlayer(
            currentPosition,
            this.getRoundNumber(boardState),
            maximizingPlayer
          );
          const result = this.dropMinimax(newBoardState, depth - 1, "white");
          if (result.value < minEval) {
            minEval = result.value;
            choosenPosition = currentPosition;
          }
        }
        j++;
      }
      i++;
    }

    return { value: minEval, position: choosenPosition };
  }

  static dropEntryPhase(boardState: Pawn[][]): dropMinimax {
    const emptyFields: Coordinates[] = this.getEmptyCentralFields(boardState);
    if (emptyFields.length)
      return {
        position:
          emptyFields[FieldHelper.randomIntFromInterval(0, emptyFields.length)],
        value: 0,
      };
  }

  static getEmptyCentralFields(boardState: Pawn[][]): Coordinates[] {
    const copiedBoardState: Pawn[][] = FieldHelper.deepCopyItem(boardState);

    const coordinatesToCheck: Coordinates[] = FieldHelper.boardCentralCoordinates();
    const emptyFields: Coordinates[] = [];

    coordinatesToCheck.forEach((coordinate) => {
      if (!copiedBoardState[coordinate.rowIndex][coordinate.columnIndex].player)
        emptyFields.push(coordinate);
    });
    return emptyFields;
  }

  // static dropForProfit(
  //   boardState: BoardState,
  //   depth: number,
  //   maximizingPlayer: string
  // ): void {
  //   throw new Error("Method not implemented.");
  // }

  // static isAnyPlayerPawnOnTheBoard(
  //   maximizingPlayer: Player,
  //   boardState: BoardState
  // ): boolean {
  //   const copyOfBoardState = FieldHelper.deepCopyItem(boardState);
  //   const pawnsAmounts = FieldHelper.getWhiteBlackPawnsAmounts(
  //     copyOfBoardState
  //   );
  //   if (maximizingPlayer == "white") return pawnsAmounts.whitePawns !== 0;
  //   return pawnsAmounts.blackPawns !== 0;
  // }

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

  static getRoundNumber(boardState: BoardState): number {
    const copyOfBoardState = FieldHelper.deepCopyItem(boardState);
    const pawnsAmounts = FieldHelper.getWhiteBlackPawnsAmounts(
      copyOfBoardState
    );
    return pawnsAmounts.whitePawns + pawnsAmounts.blackPawns + 1;
  }
}
