import { BoardState, Coordinates, Player } from "../types/board";
import { Pawn } from "../types/board";
import { strengthCoordinate } from "../types/shapes";
import FieldHelper from "./FieldHelper";
import PlayerScoreHelper from "./PlayerScoreHelper";

export default class {
  static findDropOptions(
    myPawnsOnBoard: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): strengthCoordinate[] {
    const possiblePairs: {
      pair: Pawn[];
      distance: number;
    }[] = this.findPossiblePairs(myPawnsOnBoard);

    let allOptions: Coordinates[] = [];

    possiblePairs.forEach((prospect) => {
      switch (prospect.distance) {
        case 1: {
          const options: Coordinates[] = this.checkCloseDistancePossibilities(
            prospect.pair,
            boardState,
            currentPlayer
          );

          allOptions = allOptions.concat(options);
          break;
        }
        case 2: {
          const options: Coordinates[] = this.checkMediumDistancePossibilities(
            prospect.pair,
            boardState,
            currentPlayer
          );

          allOptions = allOptions.concat(options);
          break;
        }
        case 3: {
          const options: Coordinates[] = this.checkLongDistancePossibilities(
            prospect.pair,
            boardState,
            currentPlayer
          );

          allOptions = allOptions.concat(options);
          break;
        }
      }
    });

    const coordinatesAndTheirPowers: {
      coordinate: Coordinates;
      strength: number;
    }[] = this.sumCoordinatesPowers(allOptions);

    return coordinatesAndTheirPowers;
  }

  static sumCoordinatesPowers(
    options: Coordinates[]
  ): { coordinate: Coordinates; strength: number }[] {
    const strengths: { coordinate: Coordinates; strength: number }[] = [];

    options.forEach((option) => {
      const foundSameCord = strengths.find((cord) =>
        FieldHelper.isCoordinateEqual(cord.coordinate, option)
      );
      if (foundSameCord) {
        foundSameCord.strength += 1;
      } else {
        strengths.push({ coordinate: option, strength: 1 });
      }
    });

    return strengths;
  }

  static findPossiblePairs(
    myPawnsOnBoard: Pawn[]
  ): {
    pair: Pawn[];
    distance: number;
  }[] {
    const possiblePairs: {
      pair: Pawn[];
      distance: number;
    }[] = [];
    for (let index = 0; index < myPawnsOnBoard.length - 1; index++) {
      const currentPawn = myPawnsOnBoard[index];
      for (let pivot = index + 1; pivot < myPawnsOnBoard.length; pivot++) {
        const comparedPawn = myPawnsOnBoard[pivot];
        const distanceBetweenPawns = FieldHelper.manhattanDistance(
          currentPawn.currentPosition,
          comparedPawn.currentPosition
        );
        if (distanceBetweenPawns <= 3) {
          possiblePairs.push({
            pair: [currentPawn, comparedPawn],
            distance: distanceBetweenPawns,
          });
        }
      }
    }

    return possiblePairs;
  }

  static checkLongDistancePossibilities(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (
      pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex ||
      pair[0].currentPosition.columnIndex == pair[1].currentPosition.columnIndex
    ) {
      const options: Coordinates[] = this.checkNeedlesPositions(
        pair,
        boardState,
        currentPlayer
      );
      return options;
    }
    const options: Coordinates[] = this.checkLsPositions(
      pair,
      boardState,
      currentPlayer
    );
    return options;
  }

  static checkLsPositions(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    let leftPawn, rightPawn;
    if (
      pair[0].currentPosition.columnIndex > pair[1].currentPosition.columnIndex
    ) {
      rightPawn = pair[0];
      leftPawn = pair[1];
    } else {
      rightPawn = pair[1];
      leftPawn = pair[0];
    }

    return this.checkLsPositionsUpDown(
      leftPawn,
      rightPawn,
      boardState,
      currentPlayer
    );
  }

  static checkLsPositionsUpDown(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (
      leftPawn.currentPosition.rowIndex < rightPawn.currentPosition.rowIndex
    ) {
      return this.checkLsPositionsLeftPawnDown(
        leftPawn,
        rightPawn,
        boardState,
        currentPlayer
      );
    }
    return this.checkLsPositionsRightPawnDown(
      leftPawn,
      rightPawn,
      boardState,
      currentPlayer
    );
  }

  static checkLsPositionsRightPawnDown(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (
      rightPawn.currentPosition.columnIndex -
        leftPawn.currentPosition.columnIndex ==
      1
    ) {
      const options = this.checkVerticalRightPawnDownPositions(
        leftPawn,
        rightPawn,
        boardState,
        currentPlayer
      );
      return options;
    }
    const options = this.checkHorizontalRightPawnDownPositions(
      leftPawn,
      rightPawn,
      boardState,
      currentPlayer
    );
    return options;
  }
  static checkHorizontalRightPawnDownPositions(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const horizontalRightDownPossibilities: Coordinates[] = [];

    const topScoreFieldCords: Coordinates = {
      rowIndex: rightPawn.currentPosition.rowIndex + 1,
      columnIndex: rightPawn.currentPosition.columnIndex,
    };
    const isTopScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      topScoreFieldCords,
      boardState
    );
    if (isTopScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: rightPawn.currentPosition.rowIndex + 1,
        columnIndex: rightPawn.currentPosition.columnIndex - 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          horizontalRightDownPossibilities.push(
            possibleDropFieldCords,
            topScoreFieldCords
          );
        else horizontalRightDownPossibilities.push(possibleDropFieldCords);
    }

    const downScoreFieldCords: Coordinates = {
      rowIndex: leftPawn.currentPosition.rowIndex - 1,
      columnIndex: leftPawn.currentPosition.columnIndex,
    };
    const isDownScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      downScoreFieldCords,
      boardState
    );
    if (isDownScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: leftPawn.currentPosition.rowIndex - 1,
        columnIndex: leftPawn.currentPosition.columnIndex + 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          horizontalRightDownPossibilities.push(
            possibleDropFieldCords,
            downScoreFieldCords
          );
        else horizontalRightDownPossibilities.push(possibleDropFieldCords);
    }

    return horizontalRightDownPossibilities;
  }
  static checkVerticalRightPawnDownPositions(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const verticalRightDownPossibilities: Coordinates[] = [];

    const leftScoreFieldCords: Coordinates = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex - 1,
    };
    const isLeftScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      leftScoreFieldCords,
      boardState
    );
    if (isLeftScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: rightPawn.currentPosition.rowIndex + 1,
        columnIndex: rightPawn.currentPosition.columnIndex - 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          verticalRightDownPossibilities.push(
            possibleDropFieldCords,
            leftScoreFieldCords
          );
        else verticalRightDownPossibilities.push(possibleDropFieldCords);
    }

    const rightScoreFieldCords: Coordinates = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex + 1,
    };
    const isRightScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      rightScoreFieldCords,
      boardState
    );
    if (isRightScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: leftPawn.currentPosition.rowIndex - 1,
        columnIndex: leftPawn.currentPosition.columnIndex + 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          verticalRightDownPossibilities.push(
            possibleDropFieldCords,
            rightScoreFieldCords
          );
        else verticalRightDownPossibilities.push(possibleDropFieldCords);
    }

    return verticalRightDownPossibilities;
  }

  static checkLsPositionsLeftPawnDown(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (
      rightPawn.currentPosition.columnIndex -
        leftPawn.currentPosition.columnIndex ==
      1
    ) {
      const options = this.checkVerticalLeftPawnDownPositions(
        leftPawn,
        rightPawn,
        boardState,
        currentPlayer
      );
      return options;
    }
    const options = this.checkHorizontalLeftPawnDownPositions(
      leftPawn,
      rightPawn,
      boardState
    );
    return options;
  }

  static checkHorizontalLeftPawnDownPositions(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState
  ): Coordinates[] {
    const horizontalLeftDownPossibilities: Coordinates[] = [];

    const topScoreFieldCords: Coordinates = {
      rowIndex: leftPawn.currentPosition.rowIndex + 1,
      columnIndex: leftPawn.currentPosition.columnIndex,
    };
    const isTopScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      topScoreFieldCords,
      boardState
    );
    if (isTopScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: leftPawn.currentPosition.rowIndex + 1,
        columnIndex: leftPawn.currentPosition.columnIndex + 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        horizontalLeftDownPossibilities.push(possibleDropFieldCords);
    }

    const downScoreFieldCords: Coordinates = {
      rowIndex: rightPawn.currentPosition.rowIndex - 1,
      columnIndex: rightPawn.currentPosition.columnIndex,
    };
    const isDownScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      downScoreFieldCords,
      boardState
    );
    if (isDownScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: rightPawn.currentPosition.rowIndex - 1,
        columnIndex: rightPawn.currentPosition.columnIndex - 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        rightPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        horizontalLeftDownPossibilities.push(possibleDropFieldCords);
    }

    return horizontalLeftDownPossibilities;
  }

  static checkVerticalLeftPawnDownPositions(
    leftPawn: Pawn,
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const verticalLeftDownPossibilities: Coordinates[] = [];

    const leftScoreFieldCords: Coordinates = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex - 1,
    };
    const isLeftScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      leftScoreFieldCords,
      boardState
    );
    if (isLeftScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: rightPawn.currentPosition.rowIndex - 1,
        columnIndex: rightPawn.currentPosition.columnIndex - 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          verticalLeftDownPossibilities.push(
            possibleDropFieldCords,
            leftScoreFieldCords
          );
        else verticalLeftDownPossibilities.push(possibleDropFieldCords);
    }

    const rightScoreFieldCords: Coordinates = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex + 1,
    };
    const isRightScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      rightScoreFieldCords,
      boardState
    );
    if (isRightScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: leftPawn.currentPosition.rowIndex + 1,
        columnIndex: leftPawn.currentPosition.columnIndex + 1,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          verticalLeftDownPossibilities.push(
            possibleDropFieldCords,
            rightScoreFieldCords
          );
        else verticalLeftDownPossibilities.push(possibleDropFieldCords);
    }

    return verticalLeftDownPossibilities;
  }

  static checkNeedlesPositions(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex) {
      const options: Coordinates[] = this.checkNeedlesPositionsHorizontally(
        pair,
        boardState,
        currentPlayer
      );
      return options;
    }
    const options: Coordinates[] = this.checkNeedlesPositionsVertically(
      pair,
      boardState,
      currentPlayer
    );
    return options;
  }

  static checkNeedlesPositionsVertically(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const verticalNeedlePossibilities: Coordinates[] = [];
    let higherPawn, lowerPawn;
    if (pair[0].currentPosition.rowIndex > pair[1].currentPosition.rowIndex) {
      higherPawn = pair[0];
      lowerPawn = pair[1];
    } else {
      higherPawn = pair[1];
      lowerPawn = pair[0];
    }

    const lowerScoreFieldCords: Coordinates = {
      rowIndex: lowerPawn.currentPosition.rowIndex + 1,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isLowerScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      lowerScoreFieldCords,
      boardState
    );
    if (isLowerScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: lowerPawn.currentPosition.rowIndex + 2,
        columnIndex: lowerPawn.currentPosition.columnIndex,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        lowerPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (lowerPawn.player != currentPlayer)
          verticalNeedlePossibilities.push(
            possibleDropFieldCords,
            lowerScoreFieldCords
          );
        else verticalNeedlePossibilities.push(possibleDropFieldCords);
    }

    const higherScoreFieldCords: Coordinates = {
      rowIndex: higherPawn.currentPosition.rowIndex - 1,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isHigherScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      higherScoreFieldCords,
      boardState
    );
    if (isHigherScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: higherPawn.currentPosition.rowIndex - 2,
        columnIndex: higherPawn.currentPosition.columnIndex,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        higherPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (higherPawn.player != currentPlayer)
          verticalNeedlePossibilities.push(
            possibleDropFieldCords,
            higherScoreFieldCords
          );
        else verticalNeedlePossibilities.push(possibleDropFieldCords);
    }

    return verticalNeedlePossibilities;
  }
  static checkNeedlesPositionsHorizontally(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const horizontalNeedlePossibilities: Coordinates[] = [];
    let leftPawn, rightPawn;
    if (
      pair[0].currentPosition.columnIndex > pair[1].currentPosition.columnIndex
    ) {
      rightPawn = pair[0];
      leftPawn = pair[1];
    } else {
      rightPawn = pair[1];
      leftPawn = pair[0];
    }

    const leftScoreFieldCords: Coordinates = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex + 1,
    };
    const isLeftScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      leftScoreFieldCords,
      boardState
    );
    if (isLeftScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: leftPawn.currentPosition.rowIndex,
        columnIndex: leftPawn.currentPosition.columnIndex + 2,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        leftPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (leftPawn.player != currentPlayer)
          horizontalNeedlePossibilities.push(
            possibleDropFieldCords,
            leftScoreFieldCords
          );
        else horizontalNeedlePossibilities.push(possibleDropFieldCords);
    }

    const rightScoreFieldCords: Coordinates = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex - 1,
    };
    const isRightScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      rightScoreFieldCords,
      boardState
    );
    if (isRightScoreFieldEmpty) {
      const possibleDropFieldCords: Coordinates = {
        rowIndex: rightPawn.currentPosition.rowIndex,
        columnIndex: rightPawn.currentPosition.columnIndex - 2,
      };
      const isFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
        possibleDropFieldCords,
        rightPawn.player,
        boardState
      );
      if (isFieldSuitableToDrop)
        if (rightPawn.player != currentPlayer)
          horizontalNeedlePossibilities.push(
            possibleDropFieldCords,
            rightScoreFieldCords
          );
        else horizontalNeedlePossibilities.push(possibleDropFieldCords);
    }

    return horizontalNeedlePossibilities;
  }

  static checkMediumDistancePossibilities(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (
      pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex ||
      pair[0].currentPosition.columnIndex == pair[1].currentPosition.columnIndex
    ) {
      const options: Coordinates[] = this.checkRingPositionPerpendicularly(
        pair,
        boardState,
        currentPlayer
      );
      return options;
    }
    const options: Coordinates[] = this.checkRingPositionDiagonally(
      pair,
      boardState,
      currentPlayer
    );
    return options;
  }

  static checkRingPositionPerpendicularly(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    if (pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex) {
      return this.checkDoublePointHorizontally(pair, boardState, currentPlayer);
    }
    return this.checkDoublePointVertically(pair, boardState, currentPlayer);
  }

  static checkDoublePointHorizontally(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const doublePointPossibilities: Coordinates[] = [];

    const scoreFieldCords: Coordinates = {
      rowIndex: pair[0].currentPosition.rowIndex,
      columnIndex:
        (pair[0].currentPosition.columnIndex +
          pair[0].currentPosition.columnIndex) /
        2,
    };

    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 2,
    };
    const scoreToBottomtCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 2,
    };

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      pair[0].player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointPossibilities.push(scoreToTopCords, scoreFieldCords);
      else doublePointPossibilities.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      pair[0].player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointPossibilities.push(scoreToRightCords, scoreFieldCords);
      else doublePointPossibilities.push(scoreToRightCords);

    const isBottomFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomtCords,
      pair[0].player,
      boardState
    );
    if (isBottomFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointPossibilities.push(scoreToBottomtCords, scoreFieldCords);
      else doublePointPossibilities.push(scoreToBottomtCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      pair[0].player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointPossibilities.push(scoreToLeftCords, scoreFieldCords);
      else doublePointPossibilities.push(scoreToLeftCords);

    return doublePointPossibilities;
  }

  static checkDoublePointVertically(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const doublePointOptions: Coordinates[] = [];

    const scoreFieldCords: Coordinates = {
      rowIndex:
        (pair[0].currentPosition.rowIndex + pair[1].currentPosition.rowIndex) /
        2,
      columnIndex: pair[0].currentPosition.columnIndex,
    };

    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 2,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };
    const scoreToBottomtCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 2,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      pair[0].player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointOptions.push(scoreToTopCords, scoreFieldCords);
      else doublePointOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      pair[0].player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointOptions.push(scoreToRightCords, scoreFieldCords);
      else doublePointOptions.push(scoreToRightCords);

    const isBottomFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomtCords,
      pair[0].player,
      boardState
    );
    if (isBottomFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointOptions.push(scoreToBottomtCords, scoreFieldCords);
      else doublePointOptions.push(scoreToBottomtCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      pair[0].player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (pair[0].player != currentPlayer)
        doublePointOptions.push(scoreToLeftCords, scoreFieldCords);
      else doublePointOptions.push(scoreToLeftCords);

    return doublePointOptions;
  }

  static checkRingPositionDiagonally(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    let lowerPawn, higherPawn;
    if (pair[0].currentPosition.rowIndex > pair[1].currentPosition.rowIndex) {
      higherPawn = pair[0];
      lowerPawn = pair[1];
    } else {
      higherPawn = pair[1];
      lowerPawn = pair[0];
    }

    if (
      lowerPawn.currentPosition.columnIndex <
      higherPawn.currentPosition.columnIndex
    ) {
      return this.checkRingPositionDiagonallyRising(
        lowerPawn,
        higherPawn,
        boardState,
        currentPlayer
      );
    }
    return this.checkRingPositionDiagonallyDecreasing(
      lowerPawn,
      higherPawn,
      boardState,
      currentPlayer
    );
  }
  static checkRingPositionDiagonallyDecreasing(
    lowerPawn: Pawn,
    higherPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    let diagonallyDecreasingOptions: Coordinates[] = [];

    const topRightPawn = {
      player: higherPawn.player,
      index: higherPawn.index,
      currentPosition: {
        rowIndex: higherPawn.currentPosition.rowIndex,
        columnIndex: lowerPawn.currentPosition.columnIndex,
      },
    };
    const topRight = this.checkRingPositionTopRight(
      topRightPawn,
      boardState,
      currentPlayer
    );

    const bottomLeftPawn = {
      player: lowerPawn.player,
      index: lowerPawn.index,
      currentPosition: {
        rowIndex: lowerPawn.currentPosition.rowIndex,
        columnIndex: higherPawn.currentPosition.columnIndex,
      },
    };
    const bottomLeft = this.checkRingPositionBottomLeft(
      bottomLeftPawn,
      boardState,
      currentPlayer
    );

    diagonallyDecreasingOptions = diagonallyDecreasingOptions.concat(
      topRight,
      bottomLeft
    );
    return diagonallyDecreasingOptions;
  }

  static checkRingPositionBottomLeft(
    lowerPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const ringPositionBottomLeftOptions: Coordinates[] = [];
    const scoreFieldCords: Coordinates = {
      rowIndex: lowerPawn.currentPosition.rowIndex,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );

    if (!isScoreFieldEmpty) return [];

    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 2,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 2,
    };
    const scoreToBottomtCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      lowerPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomLeftOptions.push(scoreToTopCords, scoreFieldCords);
      else ringPositionBottomLeftOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      lowerPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomLeftOptions.push(scoreToRightCords, scoreFieldCords);
      else ringPositionBottomLeftOptions.push(scoreToRightCords);

    const isBottomFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomtCords,
      lowerPawn.player,
      boardState
    );
    if (isBottomFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomLeftOptions.push(
          scoreToBottomtCords,
          scoreFieldCords
        );
      else ringPositionBottomLeftOptions.push(scoreToBottomtCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      lowerPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomLeftOptions.push(scoreToLeftCords, scoreFieldCords);
      else ringPositionBottomLeftOptions.push(scoreToLeftCords);

    return ringPositionBottomLeftOptions;
  }

  static checkRingPositionTopRight(
    higherPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const ringPositionTopRightOptions: Coordinates[] = [];
    const scoreFieldCords: Coordinates = {
      rowIndex: higherPawn.currentPosition.rowIndex,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );

    if (!isScoreFieldEmpty) return [];

    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };
    const scoreToBottomtCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 2,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 2,
    };

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      higherPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopRightOptions.push(scoreToTopCords, scoreFieldCords);
      else ringPositionTopRightOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      higherPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopRightOptions.push(scoreToRightCords, scoreFieldCords);
      else ringPositionTopRightOptions.push(scoreToRightCords);

    const isBottomFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomtCords,
      higherPawn.player,
      boardState
    );
    if (isBottomFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopRightOptions.push(scoreToBottomtCords, scoreFieldCords);
      else ringPositionTopRightOptions.push(scoreToBottomtCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      higherPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopRightOptions.push(scoreToLeftCords, scoreFieldCords);
      else ringPositionTopRightOptions.push(scoreToLeftCords);

    return ringPositionTopRightOptions;
  }

  static checkRingPositionDiagonallyRising(
    lowerPawn: Pawn,
    higherPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    let diagonallyRisingOptions: Coordinates[] = [];

    const topLeftPawn = {
      player: higherPawn.player,
      index: higherPawn.index,
      currentPosition: {
        rowIndex: higherPawn.currentPosition.rowIndex,
        columnIndex: lowerPawn.currentPosition.columnIndex,
      },
    };
    const topLeft = this.checkRingPositionTopLeft(
      topLeftPawn,
      boardState,
      currentPlayer
    );

    const bottomRightPawn = {
      player: lowerPawn.player,
      index: lowerPawn.index,
      currentPosition: {
        rowIndex: lowerPawn.currentPosition.rowIndex,
        columnIndex: higherPawn.currentPosition.columnIndex,
      },
    };
    const bottomRight = this.checkRingPositionBottomRight(
      bottomRightPawn,
      boardState,
      currentPlayer
    );

    diagonallyRisingOptions = diagonallyRisingOptions.concat(
      topLeft,
      bottomRight
    );
    return diagonallyRisingOptions;
  }

  static checkRingPositionBottomRight(
    lowerPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const ringPositionBottomRightOptions: Coordinates[] = [];
    const scoreFieldCords: Coordinates = {
      rowIndex: lowerPawn.currentPosition.rowIndex,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );

    if (!isScoreFieldEmpty) return [];

    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 2,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };
    const scoreToBottomtCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 2,
    };

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      lowerPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomRightOptions.push(scoreToTopCords, scoreFieldCords);
      else ringPositionBottomRightOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      lowerPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomRightOptions.push(scoreToRightCords, scoreFieldCords);
      else ringPositionBottomRightOptions.push(scoreToRightCords);

    const isBottomFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomtCords,
      lowerPawn.player,
      boardState
    );
    if (isBottomFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomRightOptions.push(
          scoreToBottomtCords,
          scoreFieldCords
        );
      else ringPositionBottomRightOptions.push(scoreToBottomtCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      lowerPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        ringPositionBottomRightOptions.push(scoreToLeftCords, scoreFieldCords);
      else ringPositionBottomRightOptions.push(scoreToLeftCords);

    return ringPositionBottomRightOptions;
  }

  static checkRingPositionTopLeft(
    higherPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const ringPositionTopLeftOptions: Coordinates[] = [];
    const scoreFieldCords: Coordinates = {
      rowIndex: higherPawn.currentPosition.rowIndex,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );

    if (!isScoreFieldEmpty) return [];

    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 2,
    };
    const scoreToBottomtCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 2,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      higherPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopLeftOptions.push(scoreToTopCords, scoreFieldCords);
      else ringPositionTopLeftOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      higherPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopLeftOptions.push(scoreToRightCords, scoreFieldCords);
      else ringPositionTopLeftOptions.push(scoreToRightCords);

    const isBottomFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomtCords,
      higherPawn.player,
      boardState
    );
    if (isBottomFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopLeftOptions.push(scoreToBottomtCords, scoreFieldCords);
      else ringPositionTopLeftOptions.push(scoreToBottomtCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      higherPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        ringPositionTopLeftOptions.push(scoreToLeftCords, scoreFieldCords);
      else ringPositionTopLeftOptions.push(scoreToLeftCords);

    return ringPositionTopLeftOptions;
  }

  static checkCloseDistancePossibilities(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    // 1. Sprawdzamy występowanie hairpoona dwustronnie
    //    a) czy sprawdzamy pionowe czy poziome ustawienie
    //    b) czy trzecie pole jest wolne, jeśli tak sprawdź wolne wokół
    if (pair[0].currentPosition.rowIndex == pair[1].currentPosition.rowIndex) {
      const options = this.checkHarpoonPositionInRow(
        pair,
        boardState,
        currentPlayer
      );
      return options;
    }
    const options = this.checkHarpoonPositionInColumn(
      pair,
      boardState,
      currentPlayer
    );
    return options;
  }

  static checkHarpoonPositionInColumn(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    let columnOptions: Coordinates[] = [];
    let lowerPawn, higherPawn;
    if (pair[0].currentPosition.rowIndex > pair[1].currentPosition.rowIndex) {
      higherPawn = pair[0];
      lowerPawn = pair[1];
    } else {
      higherPawn = pair[1];
      lowerPawn = pair[0];
    }
    const highHarpoonOptions = this.checkHighHarpoon(
      higherPawn,
      boardState,
      currentPlayer
    );
    const lowHarpoonOptions = this.checkLowHarpoon(
      lowerPawn,
      boardState,
      currentPlayer
    );
    columnOptions = columnOptions.concat(highHarpoonOptions, lowHarpoonOptions);

    return columnOptions;
  }

  static checkLowHarpoon(
    lowerPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const lowHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: lowerPawn.currentPosition.rowIndex - 1,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: lowerPawn.currentPosition.rowIndex - 2,
      columnIndex: lowerPawn.currentPosition.columnIndex,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      lowerPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };
    const scoreToBottomCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      lowerPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        lowHarpoonOptions.push(scoreToLeftCords, scoreFieldCords);
      else lowHarpoonOptions.push(scoreToLeftCords);

    const isDownFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomCords,
      lowerPawn.player,
      boardState
    );
    if (isDownFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        lowHarpoonOptions.push(scoreToBottomCords, scoreFieldCords);
      else lowHarpoonOptions.push(scoreToBottomCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      lowerPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (lowerPawn.player != currentPlayer)
        lowHarpoonOptions.push(scoreToRightCords, scoreFieldCords);
      else lowHarpoonOptions.push(scoreToRightCords);

    return lowHarpoonOptions;
  }

  static checkHighHarpoon(
    higherPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const highHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: higherPawn.currentPosition.rowIndex + 1,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: higherPawn.currentPosition.rowIndex + 2,
      columnIndex: higherPawn.currentPosition.columnIndex,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      higherPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };
    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      higherPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        highHarpoonOptions.push(scoreToLeftCords, scoreFieldCords);
      else highHarpoonOptions.push(scoreToLeftCords);

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      higherPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        highHarpoonOptions.push(scoreToTopCords, scoreFieldCords);
      else highHarpoonOptions.push(scoreToTopCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      higherPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (higherPawn.player != currentPlayer)
        highHarpoonOptions.push(scoreToRightCords, scoreFieldCords);
      else highHarpoonOptions.push(scoreToRightCords);

    return highHarpoonOptions;
  }

  static checkHarpoonPositionInRow(
    pair: Pawn[],
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    let rowOptions: Coordinates[] = [];
    let leftPawn, rightPawn;
    if (
      pair[0].currentPosition.columnIndex > pair[1].currentPosition.columnIndex
    ) {
      rightPawn = pair[0];
      leftPawn = pair[1];
    } else {
      rightPawn = pair[1];
      leftPawn = pair[0];
    }
    const leftHarpoonOptions = this.checkLeftHarpoon(
      leftPawn,
      boardState,
      currentPlayer
    );
    const rightHarpoonOptions = this.checkRightHarpoon(
      rightPawn,
      boardState,
      currentPlayer
    );
    rowOptions = rowOptions.concat(leftHarpoonOptions, rightHarpoonOptions);

    return rowOptions;
  }

  static checkLeftHarpoon(
    leftPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const leftHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex - 1,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: leftPawn.currentPosition.rowIndex,
      columnIndex: leftPawn.currentPosition.columnIndex - 2,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      leftPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToBottomCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToLeftCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex - 1,
    };
    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };

    const isDownFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomCords,
      leftPawn.player,
      boardState
    );
    if (isDownFieldSuitableToDrop)
      if (leftPawn.player != currentPlayer)
        leftHarpoonOptions.push(scoreToBottomCords, scoreFieldCords);
      else leftHarpoonOptions.push(scoreToBottomCords);

    const isLeftFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToLeftCords,
      leftPawn.player,
      boardState
    );
    if (isLeftFieldSuitableToDrop)
      if (leftPawn.player != currentPlayer)
        leftHarpoonOptions.push(scoreToLeftCords, scoreFieldCords);
      else leftHarpoonOptions.push(scoreToLeftCords);

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      leftPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (leftPawn.player != currentPlayer)
        leftHarpoonOptions.push(scoreToTopCords, scoreFieldCords);
      else leftHarpoonOptions.push(scoreToTopCords);

    return leftHarpoonOptions;
  }

  static checkRightHarpoon(
    rightPawn: Pawn,
    boardState: BoardState,
    currentPlayer: Player
  ): Coordinates[] {
    const rightHarpoonOptions: Coordinates[] = [];

    const scoreFieldCords = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex + 1,
    };
    const isScoreFieldEmpty = FieldHelper.isThisFieldEmpty(
      scoreFieldCords,
      boardState
    );
    if (!isScoreFieldEmpty) return [];

    const possibleFourthPawnInRow = {
      rowIndex: rightPawn.currentPosition.rowIndex,
      columnIndex: rightPawn.currentPosition.columnIndex + 2,
    };
    const isFourthPawnBlocking = FieldHelper.isThisPlayerField(
      possibleFourthPawnInRow,
      rightPawn.player,
      boardState
    );
    if (isFourthPawnBlocking) return [];

    const scoreToBottomCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex - 1,
      columnIndex: scoreFieldCords.columnIndex,
    };
    const scoreToRightCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex,
      columnIndex: scoreFieldCords.columnIndex + 1,
    };
    const scoreToTopCords: Coordinates = {
      rowIndex: scoreFieldCords.rowIndex + 1,
      columnIndex: scoreFieldCords.columnIndex,
    };

    const isDownFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToBottomCords,
      rightPawn.player,
      boardState
    );
    if (isDownFieldSuitableToDrop)
      if (rightPawn.player != currentPlayer)
        rightHarpoonOptions.push(scoreToBottomCords, scoreFieldCords);
      else rightHarpoonOptions.push(scoreToBottomCords);

    const isRightFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToRightCords,
      rightPawn.player,
      boardState
    );
    if (isRightFieldSuitableToDrop)
      if (rightPawn.player != currentPlayer)
        rightHarpoonOptions.push(scoreToRightCords, scoreFieldCords);
      else rightHarpoonOptions.push(scoreToRightCords);

    const isTopFieldSuitableToDrop = FieldHelper.isFieldSuitableToDrop(
      scoreToTopCords,
      rightPawn.player,
      boardState
    );
    if (isTopFieldSuitableToDrop)
      if (rightPawn.player != currentPlayer)
        rightHarpoonOptions.push(scoreToTopCords, scoreFieldCords);
      else rightHarpoonOptions.push(scoreToTopCords);

    return rightHarpoonOptions;
  }

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

    if (
      !boardState[xCenter][yCenter].player &&
      FieldHelper.isFieldSuitableToDrop(
        { rowIndex: xCenter, columnIndex: yCenter },
        myPawnsOnBoard[0].player,
        boardState
      )
    ) {
      return { rowIndex: xCenter, columnIndex: yCenter };
    }

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
