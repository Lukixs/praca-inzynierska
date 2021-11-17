import { Player } from "../types/board";
import { Minimax, MinimaxNode } from "../types/minimax";
import MinimaxHelper from "./MinimaxHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";
import ScoringHelper from "./MinimaxScoringHelper";

export default class {
  public static minimax(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: Player
  ): Minimax {
    if (depth == 0) return ScoringHelper.evaluateFinalBoardState(node);

    if (node.movedPawn) {
      const hasPlayerScored = PlayerScoreHelper.hasPlayerScored(
        node.movedPawn,
        node.boardState
      );
      if (hasPlayerScored)
        return ScoringHelper.handlePreviousPlayerScored(
          node,
          depth,
          alpha,
          beta
        );
    }

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
}
