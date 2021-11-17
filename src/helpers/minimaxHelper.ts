import { Minimax, MinimaxNode, PawnWithAvailableMoves } from "../types/minimax";
import { Coordinates, Pawn, Player } from "../types/board";
import PlayerScoreHelper from "./PlayerScoreHelper";

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

    if (playerPawns.length == 0)
      return {
        bestMove: undefined,
        value: maxEval,
        pawnToRemove: undefined,
      };

    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = FieldHelper.getMovablePawnWithAvailableDirections(
      playerPawns,
      node.boardState
    );

    if (playerPawnsWithAvailableMoves.length == 0)
      return {
        bestMove: undefined,
        value: maxEval,
        pawnToRemove: undefined,
      };

    moves: for (const pawnWithMoves of playerPawnsWithAvailableMoves) {
      for (const direction of pawnWithMoves.directions) {
        const newNode = FieldHelper.nodeAfterPawnMoveIntoDirection(
          pawnWithMoves.pawn,
          direction,
          node.boardState
        );
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
          pawnToMove = pawnWithMoves.pawn;
          intoDirection = direction;

          if (maxEval > currentAlpha) {
            currentAlpha = maxEval;
          }
          if (currentBeta <= currentAlpha) break moves;
        }
      }
    }
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

    if (playerPawns.length == 0)
      return {
        bestMove: undefined,
        value: minEval,
        pawnToRemove: undefined,
      };

    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = FieldHelper.getMovablePawnWithAvailableDirections(
      playerPawns,
      node.boardState
    );

    if (playerPawnsWithAvailableMoves.length == 0)
      return {
        bestMove: undefined,
        value: minEval,
        pawnToRemove: undefined,
      };

    moves: for (const pawnWithMoves of playerPawnsWithAvailableMoves) {
      for (const direction of pawnWithMoves.directions) {
        const newNode = FieldHelper.nodeAfterPawnMoveIntoDirection(
          pawnWithMoves.pawn,
          direction,
          node.boardState
        );
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
          pawnToMove = pawnWithMoves.pawn;
          intoDirection = direction;

          if (minEval < currentBeta) {
            currentBeta = minEval;
          }
          if (currentBeta <= currentAlpha) break moves;
        }
      }
    }
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
