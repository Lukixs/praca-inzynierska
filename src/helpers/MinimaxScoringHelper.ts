import { dropMinimax, Minimax, MinimaxNode } from "../types/minimax";
import PawnToRemoveHelper from "./PawnToRemoveHelper";
import MinimaxHelper from "./MinimaxHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";
import { BoardState, Player } from "../types/board";
import FieldHelper from "./FieldHelper";
import { minimaxValues } from "./BoardInfo";

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
    const amountOf: {
      whitePawns: number;
      blackPawns: number;
    } = FieldHelper.getWhiteBlackPawnsAmounts(node.boardState);

    if (node.movedPawn.player == "white") {
      if (amountOf.blackPawns - 1 < 3) {
        const pawnsFromBoard = FieldHelper.getWhiteBlackPawnsFromBoard(
          node.boardState
        );

        return {
          value: minimaxValues.MAX,
          pawnToRemove: pawnsFromBoard.blackPawns[0],
          isPawnToRemoveFresh: true,
        };
      }
    } else {
      if (amountOf.whitePawns - 1 < 3) {
        const pawnsFromBoard = FieldHelper.getWhiteBlackPawnsFromBoard(
          node.boardState
        );
        return {
          value: minimaxValues.MIN,
          pawnToRemove: pawnsFromBoard.whitePawns[0],
          isPawnToRemoveFresh: true,
        };
      }
    }

    const newNode: MinimaxNode = FieldHelper.deepCopyItem(node);
    if (newNode.movedPawn.player == "white") {
      const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findBlackPawnToRemove(
        newNode,
        depth,
        alpha,
        beta
      );
      if (!optimalPawnToRemove.bestMove) {
        const amounts = FieldHelper.getWhiteBlackPawnsAmounts(
          newNode.boardState
        );
        const isDrawBetterForWhitePlayer =
          amounts.whitePawns > amounts.blackPawns - 1;
        return { value: isDrawBetterForWhitePlayer ? +1000 : -1000 };
      }
      optimalPawnToRemove.isPawnToRemoveFresh = true;
      return optimalPawnToRemove;
    }
    const optimalPawnToRemove: Minimax = PawnToRemoveHelper.findWhitePawnToRemove(
      newNode,
      depth,
      alpha,
      beta
    );
    if (!optimalPawnToRemove.bestMove) {
      const amounts = FieldHelper.getWhiteBlackPawnsAmounts(newNode.boardState);
      const isDrawBetterForBlackPlayer =
        amounts.blackPawns > amounts.whitePawns - 1;
      return { value: isDrawBetterForBlackPlayer ? +1000 : -1000 };
    }
    optimalPawnToRemove.isPawnToRemoveFresh = true;
    return optimalPawnToRemove;
  }

  public static evaluateFinalBoardState(node: MinimaxNode): Minimax {
    if (!node.movedPawn) return { value: 0 };
    const hasPlayerScored = PlayerScoreHelper.hasPlayerScored(
      node.movedPawn,
      node.boardState
    );

    const amountOfPawns: {
      whitePawns: number;
      blackPawns: number;
    } = FieldHelper.getWhiteBlackPawnsAmounts(node.boardState);

    if (hasPlayerScored) {
      if (node.movedPawn.player == "white") amountOfPawns.blackPawns--;
      else amountOfPawns.whitePawns--;
    }

    const differenceInPawns =
      (amountOfPawns.whitePawns - amountOfPawns.blackPawns) * 20;

    const isTerminal = PlayerScoreHelper.isGameOver(node);

    if (node.movedPawn.player == "white")
      return {
        value: isTerminal ? minimaxValues.MAX : differenceInPawns,
        bestMove: node.movedPawn,
      };

    return {
      value: isTerminal ? minimaxValues.MIN : differenceInPawns,
      bestMove: node.movedPawn,
    };
  }

  public static returnNumberOfFreeMovesAsValue(
    maximizingPlayer: Player,
    boardState: BoardState
  ): dropMinimax {
    const field = FieldHelper.deepCopyItem(boardState);
    const playerPawns = FieldHelper.getPlayerPawnsFromBoard(
      maximizingPlayer,
      field
    );
    const numberOfAvailableMoves = FieldHelper.countAvailableDirections(
      playerPawns,
      field
    );
    if (!numberOfAvailableMoves)
      return {
        value: 0,
        position: null,
      };

    return {
      value:
        maximizingPlayer == "white"
          ? numberOfAvailableMoves
          : numberOfAvailableMoves * -1,
      position: null,
    };
  }
}
