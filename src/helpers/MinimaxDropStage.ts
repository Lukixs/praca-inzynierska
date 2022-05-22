import { Coordinates, Player, BoardState, Pawn } from "../types/board";
import { dropMinimax } from "../types/minimax";
import FieldHelper from "./FieldHelper";
import { minimaxValues } from "./BoardInfo";
import MinimaxMove from "./Minimax";
import MinimaxScoringHelper from "./MinimaxScoringHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";

export default class {
  public static dropMinimax(
    boardState: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: Player
  ): dropMinimax {
    // const isBoardEmpty: boolean = FieldHelper.isBoardEmpty(node.boardState);
    const numberOfPawns: number = FieldHelper.amountOfPlayerPawnsOnBoard(
      maximizingPlayer,
      boardState
    );

    if (numberOfPawns === 0) return this.dropEntryPhase(boardState);

    if (numberOfPawns < 12) {
      if (depth <= 2) {
        const result = MinimaxMove.minimax(
          { boardState },
          2,
          minimaxValues.MIN,
          minimaxValues.MAX,
          maximizingPlayer
        );

        if (result.value == 0)
          return MinimaxScoringHelper.returnNumberOfFreeMovesAsValue(
            maximizingPlayer,
            boardState
          );

        return {
          value: result.value,
          position: null,
        };
      }

      if (maximizingPlayer == "white")
        return this.dropWhiteMiddlePhase(
          boardState,
          depth,
          alpha,
          beta,
          maximizingPlayer
        );
      return this.dropBlackMiddlePhase(
        boardState,
        depth,
        alpha,
        beta,
        maximizingPlayer
      );
    }

    if (numberOfPawns == 12) {
      const result = MinimaxMove.minimax(
        { boardState },
        depth ? depth - 1 : 0,
        minimaxValues.MIN,
        minimaxValues.MAX,
        maximizingPlayer
      );
      if (result.value == 0)
        return MinimaxScoringHelper.returnNumberOfFreeMovesAsValue(
          maximizingPlayer,
          boardState
        );
      return {
        value: result.value,
        position: null,
      };
    }
  }

  static dropWhiteMiddlePhase(
    boardState: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: Player
  ): dropMinimax {
    let currentAlpha = alpha;
    const currentBeta = beta;
    let maxEval = minimaxValues.MIN;
    let choosenPosition: Coordinates;

    let i = 0;
    moves: while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (!boardState[i][j].player) {
          const gonnaBeThirdInRow = PlayerScoreHelper.isGonnaBeThirdInRow(
            { rowIndex: i, columnIndex: j } as Coordinates,
            "white" as Player,
            boardState
          );
          if (!gonnaBeThirdInRow) {
            const newBoardState = FieldHelper.deepCopyItem(boardState);
            const currentPosition: Coordinates = {
              rowIndex: i,
              columnIndex: j,
            };
            newBoardState[i][j] = FieldHelper.createPawnForPlayer(
              currentPosition,
              this.getRoundNumber(boardState),
              maximizingPlayer
            );
            const result = this.dropMinimax(
              newBoardState,
              depth - 1,
              currentAlpha,
              currentBeta,
              "black"
            );
            if (result.value > maxEval) {
              maxEval = result.value;
              choosenPosition = result.position;
              if (maxEval > currentAlpha) {
                currentAlpha = maxEval;
              }
              if (currentBeta <= currentAlpha) break moves;
            }
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
    alpha: number,
    beta: number,
    maximizingPlayer: Player
  ): dropMinimax {
    const currentAlpha = alpha;
    let currentBeta = beta;
    let minEval = minimaxValues.MAX;
    let choosenPosition: Coordinates;

    let i = 0;
    moves: while (i < boardState.length) {
      let j = 0;
      while (j < boardState[i].length) {
        if (!boardState[i][j].player) {
          const gonnaBeThirdInRow = PlayerScoreHelper.isGonnaBeThirdInRow(
            { rowIndex: i, columnIndex: j } as Coordinates,
            "black" as Player,
            boardState
          );
          if (!gonnaBeThirdInRow) {
            const newBoardState = FieldHelper.deepCopyItem(boardState);
            const currentPosition: Coordinates = {
              rowIndex: i,
              columnIndex: j,
            };
            newBoardState[i][j] = FieldHelper.createPawnForPlayer(
              currentPosition,
              this.getRoundNumber(boardState),
              maximizingPlayer
            );
            const result = this.dropMinimax(
              newBoardState,
              depth - 1,
              currentAlpha,
              currentBeta,
              "white"
            );
            if (result.value < minEval) {
              minEval = result.value;
              choosenPosition = currentPosition;
              if (minEval < currentBeta) {
                currentBeta = minEval;
              }
              if (currentBeta <= currentAlpha) break moves;
            }
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

  static getRoundNumber(boardState: BoardState): number {
    const copyOfBoardState = FieldHelper.deepCopyItem(boardState);
    const pawnsAmounts = FieldHelper.getWhiteBlackPawnsAmounts(
      copyOfBoardState
    );
    return pawnsAmounts.whitePawns + pawnsAmounts.blackPawns + 1;
  }
}
