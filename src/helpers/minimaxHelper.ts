import { Minimax, MinimaxNode, PawnWithAvailableMoves } from "../types/minimax";
import { Coordinates, Pawn, Player } from "../types/board";
import PlayerScoreHelper from "./PlayerScoreHelper";
import PawnToRemoveHelper from "./PawnToRemoveHelper";
import { minimaxValues } from "./BoardInfo";
import FieldHelper from "./FieldHelper";

export default class {
  public static minimax(
    node: MinimaxNode,
    depth: number,
    maximizingPlayer: Player
  ): Minimax {
    if (depth == 0) return this.evaluateFinalBoardState(node);

    if (node.movedPawn) {
      const hasPlayerScored = PlayerScoreHelper.hasPlayerScored(
        node.movedPawn,
        node.boardState
      );
      if (hasPlayerScored) return this.handlePreviousPlayerScored(node, depth);
    }

    if (maximizingPlayer == "white") {
      const result: Minimax = this.handleWhitePlayerTurn(node, depth);
      return result;
    }
    const result: Minimax = this.handleBlackPlayerTurn(node, depth);
    return result;
  }

  public static minimaxAfterScoring(
    node: MinimaxNode,
    depth: number,
    maximizingPlayer: Player
  ): Minimax {
    if (depth == 0) return this.evaluateFinalBoardState(node);

    if (maximizingPlayer == "white") {
      const result: Minimax = this.handleWhitePlayerTurn(node, depth);
      return result;
    }
    const result: Minimax = this.handleBlackPlayerTurn(node, depth);
    return result;
  }

  static handlePreviousPlayerScored(node: MinimaxNode, depth: number): Minimax {
    const isTerminal = PlayerScoreHelper.isGameOver(node);
    if (isTerminal) {
      if (node.movedPawn.player == "white") return { value: 10000 };
      return { value: -10000 };
    }

    const newNode: MinimaxNode = node;
    newNode.boardState = JSON.parse(JSON.stringify(node.boardState));

    if (node.movedPawn.player == "white") {
      const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findBlackPawnToRemove(
        newNode,
        depth
      );
      optimalPawnToRemove.value = optimalPawnToRemove.value + 20;
      optimalPawnToRemove.isPawnToRemoveFresh = true;
      return optimalPawnToRemove;
    }
    const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findWhitePawnToRemove(
      newNode,
      depth
    );
    optimalPawnToRemove.value = optimalPawnToRemove.value - 20;
    optimalPawnToRemove.isPawnToRemoveFresh = true;
    return optimalPawnToRemove;
  }

  private static handleWhitePlayerTurn(
    node: MinimaxNode,
    depth: number
  ): Minimax {
    const maximizingPlayer: Player = "white";

    let givenResult: Minimax;
    let pawnToMove: Pawn;
    let intoDirection: Coordinates;
    let maxEval = minimaxValues.MIN;

    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );
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

    playerPawnsWithAvailableMoves.forEach((pawnWithMoves) => {
      pawnWithMoves.directions.forEach((direction) => {
        const newNode = FieldHelper.nodeAfterPawnMoveIntoDirection(
          pawnWithMoves.pawn,
          direction,
          node.boardState
        );
        const minimaxResult: Minimax = this.minimax(
          newNode,
          depth - 1,
          "black"
        );
        if (minimaxResult.value > maxEval) {
          maxEval = minimaxResult.value;
          givenResult = minimaxResult;
          pawnToMove = pawnWithMoves.pawn;
          intoDirection = direction;
        }
      });
    });
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

  private static handleBlackPlayerTurn(
    node: MinimaxNode,
    depth: number
  ): Minimax {
    const maximizingPlayer: Player = "black";

    let givenResult: Minimax;
    let pawnToMove: Pawn;
    let intoDirection: Coordinates;
    let minEval = minimaxValues.MAX;

    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );
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

    playerPawnsWithAvailableMoves.forEach((pawnWithMoves) => {
      pawnWithMoves.directions.forEach((direction) => {
        const newNode = FieldHelper.nodeAfterPawnMoveIntoDirection(
          pawnWithMoves.pawn,
          direction,
          node.boardState
        );
        const minimaxResult: Minimax = this.minimax(
          newNode,
          depth - 1,
          "white"
        );
        if (minimaxResult.value < minEval) {
          minEval = minimaxResult.value;
          givenResult = minimaxResult;
          pawnToMove = pawnWithMoves.pawn;
          intoDirection = direction;
        }
      });
    });
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

  private static evaluateFinalBoardState(node: MinimaxNode): Minimax {
    if (!node.movedPawn) return { value: 0 };
    const hasPlayerScored = PlayerScoreHelper.hasPlayerScored(
      node.movedPawn,
      node.boardState
    );
    if (!hasPlayerScored) return { value: 0, bestMove: node.movedPawn };

    const isTerminal = PlayerScoreHelper.isGameOver(node);

    if (node.movedPawn.player == "white")
      return {
        value: isTerminal ? 10000 : 20,
        bestMove: node.movedPawn,
      };
    return {
      value: isTerminal ? -10000 : -20,
      bestMove: node.movedPawn,
    };
  }
}
