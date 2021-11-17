import { Minimax, MinimaxNode, PawnWithAvailableMoves } from "../types/minimax";
import { Coordinates, Pawn, Player } from "../types/board";

import { minimaxValues } from "./BoardInfo";
import FieldHelper from "./FieldHelper";
import MinimaxFunction from "./Minimax";

export default class {
  public static handleWhitePlayerTurn(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number
  ): Minimax {
    let currentAlpha = alpha;
    const currentBeta = beta;
    const maximizingPlayer: Player = "white";

    let givenResult: Minimax;
    let pawnToMove: Pawn;
    let intoDirection: Coordinates;
    let maxEval = minimaxValues.MIN;

    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );

    if (playerPawns.length < 3)
      return {
        value: maxEval,
      };

    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = FieldHelper.getMovablePawnWithAvailableDirections(
      playerPawns,
      node.boardState
    );

    if (playerPawnsWithAvailableMoves.length == 0)
      return {
        value: maxEval,
      };

    moves: for (let i = 0; i < playerPawnsWithAvailableMoves.length; i++) {
      for (
        let j = 0;
        j < playerPawnsWithAvailableMoves[i].directions.length;
        j++
      ) {
        if (!playerPawnsWithAvailableMoves[i].pawn)
          console.error("Coś poszło bardzo nie tak");

        const newBoardState: Pawn[][] = FieldHelper.deepCopyItem(
          node.boardState
        );
        const pawnAfterMove: Pawn = FieldHelper.deepCopyItem(
          playerPawnsWithAvailableMoves[i].pawn
        );
        pawnAfterMove.lastPosition = pawnAfterMove.currentPosition;
        pawnAfterMove.currentPosition =
          playerPawnsWithAvailableMoves[i].directions[j];

        newBoardState[playerPawnsWithAvailableMoves[i].directions[j].rowIndex][
          playerPawnsWithAvailableMoves[i].directions[j].columnIndex
        ] = pawnAfterMove;
        newBoardState[
          playerPawnsWithAvailableMoves[i].pawn.currentPosition.rowIndex
        ][playerPawnsWithAvailableMoves[i].pawn.currentPosition.columnIndex] =
          FieldHelper.emptyField;

        const newNode: MinimaxNode = {
          movedPawn: pawnAfterMove,
          boardState: newBoardState,
        };
        const minimaxResult: Minimax = MinimaxFunction.minimax(
          newNode,
          depth - 1,
          currentAlpha,
          currentBeta,
          "black"
        );
        if (minimaxResult.value > maxEval) {
          maxEval = minimaxResult.value;
          givenResult = minimaxResult;
          pawnToMove = playerPawnsWithAvailableMoves[i].pawn;
          intoDirection = playerPawnsWithAvailableMoves[i].directions[j];

          if (maxEval > currentAlpha) {
            currentAlpha = maxEval;
          }
          if (currentBeta <= currentAlpha) break moves;
        }
      }
    }

    if (!pawnToMove)
      return {
        value: -10000,
      };

    const resultBoardState: Pawn[][] = JSON.parse(
      JSON.stringify(node.boardState)
    );

    const resultNode: MinimaxNode = FieldHelper.nodeAfterPawnMoveIntoDirection(
      pawnToMove,
      intoDirection,
      resultBoardState
    );

    const result: Minimax = {
      bestMove: resultNode.movedPawn,
      value: maxEval,
      pawnToRemove: givenResult.isPawnToRemoveFresh
        ? givenResult.pawnToRemove
        : undefined,
    };
    return result;
  }

  public static handleBlackPlayerTurn(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number
  ): Minimax {
    const currentAlpha = alpha;
    let currentBeta = beta;
    const maximizingPlayer: Player = "black";

    let givenResult: Minimax;
    let pawnToMove: Pawn;
    let intoDirection: Coordinates;
    let minEval = minimaxValues.MAX;

    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );

    if (playerPawns.length < 3)
      return {
        value: minEval,
      };

    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = FieldHelper.getMovablePawnWithAvailableDirections(
      playerPawns,
      node.boardState
    );

    if (playerPawnsWithAvailableMoves.length == 0)
      return {
        value: minEval,
      };

    moves: for (let i = 0; i < playerPawnsWithAvailableMoves.length; i++) {
      for (
        let j = 0;
        j < playerPawnsWithAvailableMoves[i].directions.length;
        j++
      ) {
        if (!playerPawnsWithAvailableMoves[i].pawn)
          console.error("Coś poszło bardzo nie tak");
        const newBoardState: Pawn[][] = FieldHelper.deepCopyItem(
          node.boardState
        );
        const pawnAfterMove: Pawn = FieldHelper.deepCopyItem(
          playerPawnsWithAvailableMoves[i].pawn
        );
        pawnAfterMove.lastPosition = pawnAfterMove.currentPosition;
        pawnAfterMove.currentPosition =
          playerPawnsWithAvailableMoves[i].directions[j];

        newBoardState[playerPawnsWithAvailableMoves[i].directions[j].rowIndex][
          playerPawnsWithAvailableMoves[i].directions[j].columnIndex
        ] = pawnAfterMove;
        newBoardState[
          playerPawnsWithAvailableMoves[i].pawn.currentPosition.rowIndex
        ][playerPawnsWithAvailableMoves[i].pawn.currentPosition.columnIndex] =
          FieldHelper.emptyField;

        const newNode: MinimaxNode = {
          movedPawn: pawnAfterMove,
          boardState: newBoardState,
        };
        const minimaxResult: Minimax = MinimaxFunction.minimax(
          newNode,
          depth - 1,
          currentAlpha,
          currentBeta,
          "white"
        );
        if (minimaxResult.value < minEval) {
          minEval = minimaxResult.value;
          givenResult = minimaxResult;
          pawnToMove = playerPawnsWithAvailableMoves[i].pawn;
          intoDirection = playerPawnsWithAvailableMoves[i].directions[j];

          if (minEval < currentBeta) {
            currentBeta = minEval;
          }
          if (currentBeta <= currentAlpha) break moves;
        }
      }
    }

    if (!pawnToMove)
      return {
        value: 10000,
      };

    const resultBoardState: Pawn[][] = JSON.parse(
      JSON.stringify(node.boardState)
    );
    const resultNode: MinimaxNode = FieldHelper.nodeAfterPawnMoveIntoDirection(
      pawnToMove,
      intoDirection,
      resultBoardState
    );
    const result: Minimax = {
      bestMove: resultNode.movedPawn,
      value: minEval,
      pawnToRemove: givenResult.isPawnToRemoveFresh
        ? givenResult.pawnToRemove
        : undefined,
    };
    return result;
  }
}
