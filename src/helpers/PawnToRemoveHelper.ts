import { MinimaxNode, Minimax } from "../types/minimax";
import { Pawn } from "../types/board";
import { minimaxValues } from "./BoardInfo";
import fieldHelper from "./FieldHelper";
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
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      node.movedPawn.player,
      node.boardState
    );

    let pawnToRemove: Pawn;

    moves: for (const pawn of enemyPawns) {
      let boardState = JSON.parse(JSON.stringify(node.boardState));
      boardState = fieldHelper.removePawnFromBoard(pawn, boardState);
      const evaluation: number = ScoringHelper.minimaxAfterScoring(
        { boardState, movedPawn: node.movedPawn },
        depth,
        currentAlpha,
        currentBeta,
        pawn.player
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
      node.movedPawn.player,
      node.boardState
    );

    let pawnToRemove: Pawn;

    moves: for (const pawn of enemyPawns) {
      let boardState = JSON.parse(JSON.stringify(node.boardState));
      boardState = fieldHelper.removePawnFromBoard(pawn, boardState);
      const evaluation: number = ScoringHelper.minimaxAfterScoring(
        { boardState, movedPawn: node.movedPawn },
        depth,
        currentAlpha,
        currentBeta,
        pawn.player
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
