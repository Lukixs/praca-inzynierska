import { MinimaxNode, Minimax } from "../types/minimax";
import { Pawn } from "../types/board";
import { minimaxValues } from "./BoardInfo";
import ScoringHelper from "./MinimaxScoringHelper";
import FieldHelper from "./FieldHelper";

export default class {
  static findBlackPawnToRemove(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number
  ): Minimax {
    let currentAlpha = alpha;
    const currentBeta = beta;
    let maxEval = minimaxValues.MIN;
    let pawnToRemove: Pawn;

    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      "white",
      node.boardState
    );

    moves: for (const pawn of enemyPawns) {
      const copiedNode: MinimaxNode = JSON.parse(JSON.stringify(node));
      FieldHelper.removePawnFromBoard(pawn, copiedNode.boardState);
      const evaluation: number = ScoringHelper.minimaxAfterScoring(
        copiedNode,
        depth,
        currentAlpha,
        currentBeta,
        "black"
      ).value;
      if (evaluation > maxEval) {
        pawnToRemove = pawn;
        maxEval = evaluation;

        if (maxEval > currentAlpha) {
          currentAlpha = maxEval;
        }
        if (currentBeta <= currentAlpha) break moves;
      }
    }
    return {
      value: maxEval,
      pawnToRemove: pawnToRemove,
      bestMove: node.movedPawn,
    };
  }

  static findWhitePawnToRemove(
    node: MinimaxNode,
    depth: number,
    alpha: number,
    beta: number
  ): Minimax {
    const currentAlpha = alpha;
    let currentBeta = beta;
    let minEval = minimaxValues.MAX;
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      "black",
      node.boardState
    );

    let pawnToRemove: Pawn;

    moves: for (const pawn of enemyPawns) {
      const copiedNode: MinimaxNode = JSON.parse(JSON.stringify(node));
      FieldHelper.removePawnFromBoard(pawn, copiedNode.boardState);
      const evaluation: number = ScoringHelper.minimaxAfterScoring(
        copiedNode,
        depth,
        currentAlpha,
        currentBeta,
        "white"
      ).value;
      if (evaluation < minEval) {
        pawnToRemove = pawn;
        minEval = evaluation;

        if (minEval < currentBeta) {
          currentBeta = minEval;
        }
        if (currentBeta <= currentAlpha) break moves;
      }
    }
    return { value: minEval, pawnToRemove, bestMove: node.movedPawn };
  }
}
