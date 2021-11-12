import { MinimaxNode, Minimax } from "../types/minimax";
import { Pawn } from "../types/board";
import { minimaxValues } from "./BoardInfo";
import fieldHelper from "./FieldHelper";
import minimaxHelper from "./minimaxHelper";
import FieldHelper from "./FieldHelper";

export default class {
  static findBlackPawnToRemove(node: MinimaxNode, depth: number): Minimax {
    let maxEval = minimaxValues.MIN;
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      node.movedPawn.player,
      node.boardState
    );

    let pawnToRemove: Pawn;

    enemyPawns.forEach((pawn) => {
       let boardState = JSON.parse(JSON.stringify(node.boardState));
       boardState = fieldHelper.removePawnFromBoard(
        pawn,
        boardState
      );
      const evaluation: number = minimaxHelper.minimaxAfterScoring(
        {boardState, movedPawn: node.movedPawn},
        depth,
        pawn.player
      ).value;
      if (evaluation > maxEval) {
        pawnToRemove = pawn;
        maxEval = evaluation;
      }
    });
    return { value: maxEval, pawnToRemove:pawnToRemove, bestMove:node.movedPawn };
  }

  static findWhitePawnToRemove(node: MinimaxNode, depth: number): Minimax {
    let minEval = minimaxValues.MAX;
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      node.movedPawn.player,
      node.boardState
    );

    let pawnToRemove: Pawn;

    enemyPawns.forEach((pawn) => {
      let boardState = JSON.parse(JSON.stringify(node.boardState));
       boardState = fieldHelper.removePawnFromBoard(
        pawn,
        boardState
      );
      const evaluation: number = minimaxHelper.minimaxAfterScoring(
        {boardState, movedPawn: node.movedPawn},
        depth,
        pawn.player
      ).value;
      if (evaluation < minEval) {
        pawnToRemove = pawn;
        minEval = evaluation;
      }
    });
    return { value: minEval, pawnToRemove, bestMove:node.movedPawn };
  }
}
