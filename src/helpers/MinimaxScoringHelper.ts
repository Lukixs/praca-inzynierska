import { Minimax, MinimaxNode } from "../types/minimax";
import PawnToRemoveHelper from "./PawnToRemoveHelper";
import MinimaxHelper from "./MinimaxHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";
import { Player } from "../types/board";
import FieldHelper from "./FieldHelper";

export default class {
  public static minimaxAfterScoring(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: Player
  ): Minimax {
    if (depth == 0) return this.evaluateFinalBoardState(node);

    if (maximizingPlayer == "white") {
      const result: Minimax = MinimaxHelper.handleWhitePlayerTurn(
        node,
        depth,
        alpha,
        beta
      );
      return result;
    }
    const result: Minimax = MinimaxHelper.handleBlackPlayerTurn(
      node,
      depth,
      alpha,
      beta
    );
    return result;
  }

  static handlePreviousPlayerScored(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number
  ): Minimax {
    const isTerminal = PlayerScoreHelper.isGameOver(node);
    if (isTerminal) {
      if (node.movedPawn.player == "white") return { value: 10000 };
      return { value: -10000 };
    }

    const newNode: MinimaxNode = FieldHelper.deepCopyItem(node);

    if (newNode.movedPawn.player == "white") {
      const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findBlackPawnToRemove(
        newNode,
        depth,
        alpha,
        beta
      );
      if (!optimalPawnToRemove.bestMove) return { value: -10000 };
      optimalPawnToRemove.value = optimalPawnToRemove.value + 20;
      optimalPawnToRemove.isPawnToRemoveFresh = true;
      return optimalPawnToRemove;
    }
    const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findWhitePawnToRemove(
      newNode,
      depth,
      alpha,
      beta
    );
    if (!optimalPawnToRemove.bestMove) return { value: 10000 };
    optimalPawnToRemove.value = optimalPawnToRemove.value - 20;
    optimalPawnToRemove.isPawnToRemoveFresh = true;
    return optimalPawnToRemove;
  }

  public static evaluateFinalBoardState(node: MinimaxNode): Minimax {
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
