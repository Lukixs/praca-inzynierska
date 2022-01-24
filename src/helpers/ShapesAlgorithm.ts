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

    let playerOptions: strengthCoordinate[], enemyOptions: strengthCoordinate[];

    if (myPawnsOnBoard.length >= 2) {
      playerOptions = ShapesHelper.findDropOptions(
        myPawnsOnBoard,
        boardState,
        player
      );
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
    if (
      playerOptions &&
      playerOptions.length &&
      enemyOptions &&
      enemyOptions.length
    ) {
      const commonOptions: strengthCoordinate[] = [];

      playerOptions.forEach((playerOption) => {
        const enemySameOption = enemyOptions.find((enemyOption) => {
          return FieldHelper.isCoordinateEqual(
            playerOption.coordinate,
            enemyOption.coordinate
          );
        });
        if (enemySameOption)
          commonOptions.push({
            coordinate: playerOption.coordinate,
            strength: playerOption.strength + enemySameOption.strength,
          });
      });

      if (commonOptions.length) {
        console.log("XD", {
          position:
            commonOptions[Math.floor(Math.random() * commonOptions.length)]
              .coordinate,
        });
      }
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
