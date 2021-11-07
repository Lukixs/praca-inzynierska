import { Minimax, MinimaxNode, PawnWithAvailableMoves } from "../types/minimax";
import { Player } from "../types/board";
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

  static handlePreviousPlayerScored(node: MinimaxNode, depth: number): Minimax {
    const isTerminal = PlayerScoreHelper.isGameOver(node);
    if (isTerminal) {
      if (node.movedPawn.player == "white") return { value: 10000 };
      return { value: -10000 };
    }

    if (node.movedPawn.player == "white") {
      const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findBlackPawnToRemove(
        node,
        depth
      );
      optimalPawnToRemove.value = optimalPawnToRemove.value + 20;
      return optimalPawnToRemove;
    }
    const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findWhitePawnToRemove(
      node,
      depth
    );
    optimalPawnToRemove.value = optimalPawnToRemove.value - 20;
    return optimalPawnToRemove;
  }

  private static handleWhitePlayerTurn(
    node: MinimaxNode,
    depth: number
  ): Minimax {
    const maximizingPlayer: Player = "white";

    let result: Minimax;
    let maxEval = minimaxValues.MIN;

    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );
    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = FieldHelper.getMovablePawnWithAvailableDirections(
      playerPawns,
      node.boardState
    );

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
          result = minimaxResult;
        }
      });
    });
    return result;
  }

  private static handleBlackPlayerTurn(
    node: MinimaxNode,
    depth: number
  ): Minimax {
    const maximizingPlayer: Player = "black";

    let result: Minimax;
    let minEval = minimaxValues.MAX;

    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );
    const playerPawnsWithAvailableMoves: PawnWithAvailableMoves[] = FieldHelper.getMovablePawnWithAvailableDirections(
      playerPawns,
      node.boardState
    );

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
          result = minimaxResult;
        }
      });
    });
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
