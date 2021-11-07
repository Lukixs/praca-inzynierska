import { MinimaxNode, Minimax } from "../types/minimax";
import { Pawn } from "../types/board";
import { minimaxValues } from "./BoardInfo";
import fieldHelper from "./FieldHelper";
import minimaxHelper from "./minimaxHelper";
import FieldHelper from "./FieldHelper";

export default class {
  static findBlackPawnToRemove(node: MinimaxNode, depth: number): Minimax {
    const newNode: MinimaxNode = { boardState: null };
    let maxEval = minimaxValues.MIN;
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      node.movedPawn.player,
      node.boardState
    );

    let pawnToRemove: Pawn;

    enemyPawns.forEach((pawn) => {
      newNode.boardState = JSON.parse(JSON.stringify(node.boardState));
      newNode.boardState = fieldHelper.removePawnFromBoard(
        pawn,
        newNode.boardState
      );
      const evaluation: number = minimaxHelper.minimax(
        newNode,
        depth,
        pawn.player
      ).value;
      if (evaluation > maxEval) {
        pawnToRemove = pawn;
        maxEval = evaluation;
      }
    });
    return { value: maxEval, pawnToRemove };
  }

  static findWhitePawnToRemove(node: MinimaxNode, depth: number): Minimax {
    const newNode: MinimaxNode = { boardState: null };
    let minEval = minimaxValues.MAX;
    const enemyPawns = FieldHelper.getEnemyPlayerPawnsFromBoard(
      node.movedPawn.player,
      node.boardState
    );

    let pawnToRemove: Pawn;

    enemyPawns.forEach((pawn) => {
      newNode.boardState = JSON.parse(JSON.stringify(node.boardState));
      newNode.boardState = fieldHelper.removePawnFromBoard(
        pawn,
        newNode.boardState
      );
      const evaluation: number = minimaxHelper.minimax(
        newNode,
        depth,
        pawn.player
      ).value;
      if (evaluation < minEval) {
        pawnToRemove = pawn;
        minEval = evaluation;
      }
    });
    return { value: minEval, pawnToRemove };
  }
}
