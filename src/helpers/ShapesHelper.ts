import { BoardState, Coordinates } from "../types/board";
import { Pawn } from "../types/board";
import FieldHelper from "./FieldHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";

export default class {
  static dropNearby(
    myPawnsOnBoard: Pawn[],
    boardState: BoardState
  ): Coordinates {
    let [xSum, ySum] = [0, 0];
    const cordsAmount = myPawnsOnBoard.length;

    myPawnsOnBoard.forEach((pawn) => {
      xSum += pawn.currentPosition.rowIndex;
      ySum += pawn.currentPosition.columnIndex;
    });

    const [xCenter, yCenter] = [
      Math.round(xSum / cordsAmount),
      Math.round(ySum / cordsAmount),
    ];

    if (!boardState[xCenter][yCenter].player)
      return { rowIndex: xCenter, columnIndex: yCenter };

    const centerRing = [
      { rowIndex: xCenter + 1, columnIndex: yCenter },
      { rowIndex: xCenter + 1, columnIndex: yCenter + 1 },
      { rowIndex: xCenter, columnIndex: yCenter + 1 },
      { rowIndex: xCenter - 1, columnIndex: yCenter + 1 },
      { rowIndex: xCenter - 1, columnIndex: yCenter },
      { rowIndex: xCenter - 1, columnIndex: yCenter - 1 },
      { rowIndex: xCenter, columnIndex: yCenter - 1 },
      { rowIndex: xCenter + 1, columnIndex: yCenter - 1 },
    ] as Coordinates[];
    const emptyFieldsOnRing = FieldHelper.findEmptyFields(
      boardState,
      centerRing
    );

    const emptyLegalFieldsOnRing = emptyFieldsOnRing.filter(
      (field) =>
        !PlayerScoreHelper.isGonnaBeThirdInRow(
          {
            rowIndex: field.rowIndex,
            columnIndex: field.columnIndex,
          } as Coordinates,
          myPawnsOnBoard[0].player,
          boardState
        )
    );

    if (emptyLegalFieldsOnRing.length == 0) {
      return FieldHelper.randomLegalEmptyFieldFromBoard(
        boardState,
        myPawnsOnBoard[0].player
      );
    }

    return emptyLegalFieldsOnRing[
      Math.floor(Math.random() * emptyLegalFieldsOnRing.length)
    ];
  }
}
