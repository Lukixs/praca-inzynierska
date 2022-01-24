import { BoardState, Coordinates, Pawn, Player } from "../types/board";
// import { PawnWithAvailableMoves } from "../types/minimax";
import { dropShapes, strengthCoordinate } from "../types/shapes";
import FieldHelper from "./FieldHelper";
import ShapesHelper from "./ShapesHelper";

export default class {
  public static dropShapes(boardState: BoardState, player: Player): dropShapes {
    // const numberOfPawns: number = FieldHelper.amountOfPlayerPawnsOnBoard(
    //   player,
    //   boardState
    // );

    // if (numberOfPawns === 0) return this.dropFirstPawn(boardState);
    const myPawnsOnBoard = FieldHelper.getPlayerPawnsFromBoard(
      player,
      boardState
    );

    if (myPawnsOnBoard.length === 0) return this.dropFirstPawn(boardState);

    let playerOptions: strengthCoordinate[] = [],
      enemyOptions: strengthCoordinate[] = [];

    if (myPawnsOnBoard.length >= 2) {
      playerOptions = ShapesHelper.findDropOptions(
        myPawnsOnBoard,
        boardState,
        player
      );
      console.log("player", playerOptions);
    }

    const enemyPlayer: Player = player == "white" ? "black" : "white";
    const enemyPawnsOnBoard = FieldHelper.getPlayerPawnsFromBoard(
      enemyPlayer,
      boardState
    );
    if (enemyPawnsOnBoard.length >= 2) {
      enemyOptions = ShapesHelper.findDropOptions(
        enemyPawnsOnBoard,
        boardState,
        player
      );
      console.log("enemy", enemyOptions);
    }

    // #3 Decydujem o ostatnim ruchu, czy mamy jakieś własne ruchy, czy przeciwnik ma
    if (playerOptions.length && enemyOptions.length) {
      const commonOptions: strengthCoordinate[] = [];

      for (let i = 0; i < playerOptions.length; i++) {
        const callerOption = playerOptions[i];
        for (let j = 0; j < enemyOptions.length; j++) {
          const enemyOption = enemyOptions[j];
          if (
            FieldHelper.isCoordinateEqual(
              callerOption.coordinate,
              enemyOption.coordinate
            )
          )
            commonOptions.push({
              coordinate: callerOption.coordinate,
              strength: callerOption.strength + enemyOption.strength,
            });
        }
      }
      console.log("Common Options", commonOptions);

      if (commonOptions.length == 1) {
        return {
          position: commonOptions[0].coordinate,
        };
      }

      if (commonOptions.length > 1) {
        let highestPowerCommonPlace = commonOptions[0];

        for (let index = 1; index < commonOptions.length; index++) {
          const option = commonOptions[index];
          if (option.strength > highestPowerCommonPlace.strength)
            highestPowerCommonPlace = option;
        }

        return {
          position: highestPowerCommonPlace.coordinate,
        };
      }
    }

    if (playerOptions.length || enemyOptions.length) {
      const combinedOptions = playerOptions.concat(enemyOptions);
      let strongestOption = combinedOptions[0];

      for (let index = 1; index < combinedOptions.length; index++) {
        const option = combinedOptions[index];
        if (option.strength > strongestOption.strength)
          strongestOption = option;
      }
      console.log("Zwrócona pojedyńcza pozycja:", strongestOption);
      return { position: strongestOption.coordinate };
    }
    // #4 a) Dostawiam pionka w pierwszym możliwym mniej oddalonym

    const defaultPosition = ShapesHelper.dropNearby(myPawnsOnBoard, boardState);
    return { position: defaultPosition };

    // 1. Rozstawienie pierwszego pionka, środke/ losowo
    // 2. Drugi krok, tu już algorytm, albo doklejenie pionka
    // 3. Algorytm:
    //    1) patrzysz na pionki jakie masz:
    //        a) szukasz par w rzędzie, albo po ukosie
    //        b) sprawdzasz, czy masz miejsce na dostawienie trzeciego (biorąc pod uwagę groźbę 4 w rzędzie), zapisujesz opcje
    //    2) patrzysz na pionki przeciwnika:
    //        a) szukasz par w rzędzie, albo po ukosie
    //        b) sprawdzasz, czy masz miejsce na dostawienie trzeciego (biorąc pod uwagę groźbę 4 w rzędzie)
    //        c) jeśli ma, zapisujesz miejsce w którym pionek ten zdobyłby punkt
    //    3) Sprawdzasz czy któreś z waszych docelowych miejsc postawienia piona się pokrywają:
    //        a) jeśli jedeno, to go wybierasz i przechodzisz dalej
    //        b) jeśli więcej niż jeden, wybierasz ten średnio bliższy do pozostałych twoich pionków(Manhattan)
    //        c) jeśli nie ma pokrycia, dostawiasz pionek możliwie najdalej od pozostałych pionków swoich/przeciwnika(Manhattan)
    //    4) Jeśli żadne z powyższych nie występuje:
    //        a) dostaw pionka w pierwszym możliwym najmniej oddalonym
  }

  //

  //

  //

  //

  static dropFirstPawn(boardState: Pawn[][]): dropShapes {
    const emptyFields: Coordinates[] = this.getEmptyCentralFields(boardState);
    if (emptyFields.length)
      return {
        position:
          emptyFields[FieldHelper.randomIntFromInterval(0, emptyFields.length)],
        value: 0,
      };
  }

  static getEmptyCentralFields(boardState: Pawn[][]): Coordinates[] {
    const copiedBoardState: Pawn[][] = FieldHelper.deepCopyItem(boardState);

    const coordinatesToCheck: Coordinates[] = FieldHelper.boardCentralCoordinates();
    const emptyFields: Coordinates[] = [];

    coordinatesToCheck.forEach((coordinate) => {
      if (!copiedBoardState[coordinate.rowIndex][coordinate.columnIndex].player)
        emptyFields.push(coordinate);
    });
    return emptyFields;
  }
}
