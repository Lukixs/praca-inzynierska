<template>
  <div class="hello">
    Webowa Aplikacja do gry Dara
    <div class="board">
      <div
        v-for="(e, rowIndex) in boardDimensions.rowsNumber"
        :key="e"
        class="row"
      >
        <div
          v-for="(f, columnIndex) in boardDimensions.columnsNumber"
          :key="f"
          @click="cellOnClick(rowIndex, columnIndex)"
        >
          <div
            :id="`${rowIndex}${columnIndex}`"
            :class="[(rowIndex + columnIndex) % 2 === 0 ? 'white' : 'black']"
          >
            <div v-if="boardState[rowIndex][columnIndex].player == 'white'">
              &#9920;
            </div>
            <div v-if="boardState[rowIndex][columnIndex].player == 'black'">
              &#9922;
            </div>
          </div>
        </div>
      </div>
    </div>
    <span>Tura {{ moveCounter }} |</span>
    <span v-if="tura"> Ruch Białych </span>
    <span v-else>Ruch Czarnych</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Coordinates, BoardDimensions, Pawn, Player } from "../types/board";
import minimaxHelper from "../helpers/minimaxHelper";

@Component({
  props: {
    msg: {
      type: String
    }
  }
})
export default class Board extends Vue {
  // name: 'Board',

  tura = true;
  removeStagePlayer: string;
  moveCounter = 1;
  firstStageMovesLimit = 8;
  focused: Coordinates; // {rowIndex, columnIndex}   Aktualnie wybrany pionek
  boardDimensions: BoardDimensions = {
    columnsNumber: 6,
    rowsNumber: 5
    // { player: 'black', pawnIndex: '0' }
    // rows: Array(8).fill(null),
  };
  boardState: Pawn[][] = new Array(this.boardDimensions.rowsNumber)
    .fill(false)
    .map(() =>
      new Array(this.boardDimensions.columnsNumber).fill(this.emptyField)
    );

  pawns: Pawn[] = []; // { player: 'black', currentPosition: {rowIndex: 4, columnIndex: 4}, lastPosition:{rowIndex: 4, columnIndex: 3} }
  // history = []; // HistoryItem{tour: 1, pawnIndexMoved: w4, from: {rowIndex: 4, columnIndex:5}, to: {rowIndex: 3, columnIndex:5}, scored: {rowIndex: 2, columnIndex:2, player: 'white', pawnIndex: w4 } }

  get emptyField(): Pawn {
    return {
      player: null,
      index: null,
      currentPosition: null,
      lastPosition: null
    };
  }

  cellOnClick(rowIndex: number, columnIndex: number): void {
    const position: Coordinates = { rowIndex, columnIndex };
    if (this.moveCounter <= this.firstStageMovesLimit) {
      this.pawnsPlacingStageController(position);
    } else {
      this.pawnsMovingStageController(position);
    }
  }

  pawnsPlacingStageController(position: Coordinates): void {
    const isTaken = this.isGivenFieldTaken(position);
    if (!isTaken) this.placePawn(position);
  }

  pawnsMovingStageController(position: Coordinates): void {
    const isTaken = this.isGivenFieldTaken(position);
    if (isTaken) this.pawnsMovingStageControllerOccupiedField(position);
    else this.pawnsMovingStageControllerEmptyField(position);
  }

  pawnsMovingStageControllerEmptyField(position: Coordinates): void {
    if (this.isAnyPawnFocused()) this.tryToMovePawnTo(position);
  }

  pawnsMovingStageControllerOccupiedField(position: Coordinates): void {
    if (this.removeStagePlayer) {
      this.removeEnemyPawn(position);
    } else if (!this.isAnyPawnFocused()) {
      this.selectPawn(position);
    } else {
      this.reSelectPawn(position);
    }
  }

  isGivenFieldTaken(position: Coordinates): string {
    const field = this.boardState[position.rowIndex][position.columnIndex];
    if (field.player) return field.player;
  }

  isAnyPawnFocused(): boolean {
    if (this.focused != null) return true;
  }

  placePawn(position: Coordinates): void {
    const newPawn = this.createNewPawn(position);

    this.addPawnToGame(newPawn, position);

    this.tura = !this.tura;
    this.moveCounter++;
    this.placePawnByAI();
  }

  addPawnToGame(pawn: Pawn, position: Coordinates): void {
    this.addPawnToList(pawn);
    this.placePawnOnBoard(pawn, position);
  }

  addPawnToList(pawn: Pawn): void {
    this.pawns.push(pawn);
  }

  placePawnOnBoard(pawn: Pawn, position: Coordinates): void {
    this.pushToBoardStateOnPosition(pawn, position);
  }

  pushToBoardStateOnPosition(pawn: Pawn, position: Coordinates): void {
    const newRow = this.boardState[position.rowIndex].slice(0);
    newRow[position.columnIndex] = pawn;
    this.$set(this.boardState, position.rowIndex, newRow);
  }

  createNewPawn(position: Coordinates): Pawn {
    if (this.tura) return this.createWhitePawn(position, this.moveCounter);

    return this.createBlackPawn(position, this.moveCounter);
  }

  createWhitePawn(position: Coordinates, moveCounter: number): Pawn {
    return {
      player: "white",
      index: moveCounter,
      currentPosition: {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex
      }
    };
  }

  createBlackPawn(position: Coordinates, moveCounter: number): Pawn {
    return {
      player: "black",
      index: moveCounter,
      currentPosition: {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex
      }
    };
  }

  placePawnByAI(): void {
    const availableFields: Coordinates[] = this.getEmptyFields(
      this.boardState,
      this.boardDimensions
    );

    const randomFieldAddress =
      availableFields[Math.floor(Math.random() * availableFields.length)];

    const newPawn = this.createNewPawn(randomFieldAddress);

    this.addPawnToGame(newPawn, randomFieldAddress);

    this.tura = !this.tura;
    this.moveCounter++;
  }

  getEmptyFields(
    boardState: Pawn[][],
    dimensions: BoardDimensions
  ): Coordinates[] {
    let emptyFields: Coordinates[] = [];
    for (let i = 0; i < dimensions.rowsNumber; i++) {
      for (let j = 0; j < dimensions.columnsNumber; j++) {
        if (!boardState[i][j].player)
          emptyFields.push({
            rowIndex: i,
            columnIndex: j
          });
      }
    }

    return emptyFields;
  }

  selectPawn(position: Coordinates): void {
    const currentPlayer = this.whichPlayerTurnItIs(this.tura);
    const selectedPawn = this.getPawnFromBoard(position);
    if (selectedPawn.player != currentPlayer) return;

    this.drawAvailableMoves(position);
    this.setFocused(position);
  }

  setFocused(position: Coordinates): void {
    this.focused = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex
    };
  }

  whichPlayerTurnItIs(tura: boolean): string {
    if (tura) return "white";
    return "black";
  }

  reSelectPawn(position: Coordinates): void {
    if (this.isThisFocusedPawn(position)) return;

    const currentPlayer = this.whichPlayerTurnItIs(this.tura);
    const selectedPawn = this.getPawnFromBoard(position);
    if (selectedPawn.player != currentPlayer) return;

    this.removeAvailableMoves({
      rowIndex: this.focused.rowIndex,
      columnIndex: this.focused.columnIndex
    });
    this.drawAvailableMoves(position);
    this.setFocused(position);
  }

  isThisFocusedPawn(position: Coordinates): boolean {
    if (
      position.rowIndex === this.focused.rowIndex &&
      position.columnIndex === this.focused.columnIndex
    )
      return true;
  }

  getPawnFromBoard(position: Coordinates): Pawn {
    return this.boardState[position.rowIndex][position.columnIndex];
  }

  isFieldSuitableToMoveForGivenPawn(
    position: Coordinates,
    movingPawn: Pawn
  ): boolean {
    if (this.isCoordinateOutOfBounds(position)) return false;
    if (this.isFieldEmpty(position)) return false;
    if (
      movingPawn.lastPosition &&
      this.isCoordinateEqual(movingPawn.lastPosition, position)
    )
      return false;

    return true;
  }

  isFieldEmpty(position: Coordinates): boolean {
    const targetedField: Pawn = this.getPawnFromBoard(position);
    return targetedField.player ? true : false;
  }

  isCoordinateEqual(
    firstPosition: Coordinates,
    secondPosition: Coordinates
  ): boolean {
    const columnsEqual =
      firstPosition.columnIndex === secondPosition.columnIndex;

    const rowsEqual = firstPosition.rowIndex === secondPosition.rowIndex;

    return columnsEqual && rowsEqual;
  }

  drawAvailableMoves(position: Coordinates): void {
    this.highlightWithDarkGreen(position);
    const movingPawn: Pawn = this.getPawnFromBoard(position);

    const upperPosition: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex
    };
    const lowerPosition: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex
    };
    const leftPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1
    };
    const rightPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1
    };

    if (this.isFieldSuitableToMoveForGivenPawn(upperPosition, movingPawn)) {
      this.highlightWithYellowGreen(upperPosition);
    }
    if (this.isFieldSuitableToMoveForGivenPawn(lowerPosition, movingPawn)) {
      this.highlightWithYellowGreen(lowerPosition);
    }
    if (this.isFieldSuitableToMoveForGivenPawn(leftPosition, movingPawn)) {
      this.highlightWithYellowGreen(leftPosition);
    }
    if (this.isFieldSuitableToMoveForGivenPawn(rightPosition, movingPawn)) {
      this.highlightWithYellowGreen(rightPosition);
    }
  }

  highlightWithYellowGreen(position: Coordinates): void {
    const element = document.getElementById(
      `${position.rowIndex}${position.columnIndex}`
    );
    element.classList.add("yellowgreen");
  }

  highlightWithDarkGreen(position: Coordinates): void {
    const element = document.getElementById(
      `${position.rowIndex}${position.columnIndex}`
    );
    element.classList.add("darkgreen");
  }

  removeAvailableMoves(position: Coordinates): void {
    this.removeDarkGreenHighlight(position);

    if (position.rowIndex + 1 < this.boardDimensions.rowsNumber) {
      const upperPosition: Coordinates = {
        rowIndex: position.rowIndex + 1,
        columnIndex: position.columnIndex
      };
      this.removeYellowGreenHighlight(upperPosition);
    }
    if (position.rowIndex - 1 >= 0) {
      const lowerPosition: Coordinates = {
        rowIndex: position.rowIndex - 1,
        columnIndex: position.columnIndex
      };
      this.removeYellowGreenHighlight(lowerPosition);
    }
    if (position.columnIndex + 1 < this.boardDimensions.columnsNumber) {
      const leftPosition: Coordinates = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex + 1
      };
      this.removeYellowGreenHighlight(leftPosition);
    }
    if (position.columnIndex - 1 >= 0) {
      const rightPosition: Coordinates = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex - 1
      };
      this.removeYellowGreenHighlight(rightPosition);
    }
  }

  removeDarkGreenHighlight(position: Coordinates): void {
    const element = document.getElementById(
      `${position.rowIndex}${position.columnIndex}`
    );
    element.classList.remove("darkgreen");
  }

  removeYellowGreenHighlight(position: Coordinates): void {
    const element = document.getElementById(
      `${position.rowIndex}${position.columnIndex}`
    );
    element.classList.remove("yellowgreen");
  }

  tryToMovePawnTo(targetedField: Coordinates): void {
    const focused = this.focused;
    if (!this.isMoveWithinReachForPawn(targetedField, focused)) return;

    let pawn = this.getPawnFromBoard(focused);

    if (
      pawn.lastPosition &&
      this.isCoordinateEqual(pawn.lastPosition, targetedField)
    )
      return;
    pawn.lastPosition = pawn.currentPosition;
    pawn.currentPosition = targetedField;
    this.placePawnOnBoard(pawn, targetedField);
    this.emptyGivenField(focused);

    this.removeAvailableMoves(focused);
    this.emptyFocused();

    if (
      pawn.player == "white" &&
      this.hasPlayerScored(pawn.currentPosition, pawn.player)
    ) {
      this.highlightEnemyPawns(pawn.player);
      this.removeStagePlayer = pawn.player;
      return;
    }

    this.tura = !this.tura;
    this.moveCounter++;
    const board = this.boardState;
    const currentPlayer = pawn.player;
    this.movePawnByAI(currentPlayer, board);
  }

  emptyGivenField(position: Coordinates): void {
    let oldRow = this.boardState[position.rowIndex].slice(0);
    oldRow[position.columnIndex] = this.emptyField;
    this.$set(this.boardState, position.rowIndex, oldRow);
  }

  emptyFocused(): void {
    this.focused = null;
  }

  // evaluateBoardState(node, maximizingPlayer) {
  //   // console.log("evaluateBoardState", node);
  //   const boardState = node.boardState;
  //   const movedPawn = node.movedPawn;
  //   // console.log({ boardState: boardState, movedPawn: movedPawn });
  //   if (boardState && movedPawn) {
  //     let hasPlayerScored = this.hasPlayerScoredAI(
  //       movedPawn,
  //       boardState,
  //       maximizingPlayer
  //     );
  //     if (hasPlayerScored) {
  //       // console.log({ hasScored: movedPawn.pawn.pawn.player });
  //       if (maximizingPlayer === "white") return 100;
  //       return -100;
  //     }
  //   }
  //   return 0;
  // },

  // isTerminalNode(node, maximizingPlayer) {
  //   const boardState = node.boardState;
  //   const movedPawn = node.movedPawn;
  //   if (boardState && movedPawn) {
  //     return this.hasPlayerScoredAI(movedPawn, boardState, maximizingPlayer);
  //   }
  // },

  isMoveWithinReachForPawn(
    targetedField: Coordinates,
    focusedField: Coordinates
  ): boolean {
    const rowsAreEqual = targetedField.rowIndex === focusedField.rowIndex;
    if (rowsAreEqual) {
      const isGreaterOrLower = this.isGreaterOrLowerByOne(
        targetedField.columnIndex,
        focusedField.columnIndex
      );
      if (isGreaterOrLower) return true;
      return false;
    }

    const columnsAreEqual =
      targetedField.columnIndex === focusedField.columnIndex;
    if (columnsAreEqual) {
      const isGreaterOrLower = this.isGreaterOrLowerByOne(
        targetedField.rowIndex,
        focusedField.rowIndex
      );
      if (isGreaterOrLower) return true;
    }
  }

  isGreaterOrLowerByOne(aroundValue: number, coreValue: number): boolean {
    if ([coreValue + 1, coreValue - 1].includes(aroundValue)) return true;
  }

  // getBoardStateWithPawns(board: Pawn[][], pawns: Pawn[]) {
  //   let boardState = Array(board.length)
  //     .fill(null)
  //     .map(() => Array(this.board.columnsNumber).fill(null));
  //   // const boardState = board.map((row) => {
  //   //   return row.map((item) => {
  //   //     if (item.pawnIndex) return this.getPawnById(item.pawnIndex, pawns);
  //   //     return null;
  //   //   });
  //   // });
  //   let i, j;
  //   for (i = 0; i < board.length; i++) {
  //     for (j = 0; j < board[i].length; j++) {
  //       if (board[i][j].pawnIndex)
  //         boardState[i][j] = this.getPawnById(board[i][j].pawnIndex, pawns);
  //     }
  //   }
  //   return boardState;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  movePawnByAI(currentPlayer: string, board: Pawn[][]): void {
    console.log({ StanPlanszyOtrzymany: this.boardState });
    // const currentPlayer = enemy == "white" ? enemy : "black";
    // const pawns = this.pawns;
    // const enemy = currentPlayer == "white" ? "black" : "white";
    const player: Player = currentPlayer == "white" ? "black" : "white";
    // const boardState = this.getBoardStateWithPawns(board, pawns);
    const boardState = JSON.parse(JSON.stringify(this.boardState));
    const mini = minimaxHelper.minimax({ boardState: boardState }, 5, player);
    console.log(player, mini);
    // console.log({
    //   info:
    //     "Ruszył pionek o id: " +
    //     mini.bestMove.index +
    //     " w ruchu gracza *" +
    //     player,
    //   z: mini.bestMove.lastPosition,
    //   do: mini.bestMove.currentPosition,
    //   stanPlanszyPrzed: boardState
    // });
    // const miniMaxResult = mini.bestMove;
    // const pawnToRemove = mini.pawnToRemove;

    // Wykoanie ruchu według miniMaxa

    let oldRow = this.boardState[mini.bestMove.lastPosition.rowIndex].slice(0);
    oldRow[mini.bestMove.lastPosition.columnIndex] = this.emptyField;
    this.$set(this.boardState, mini.bestMove.lastPosition.rowIndex, oldRow);

    let newRow = this.boardState[mini.bestMove.currentPosition.rowIndex].slice(
      0
    );
    newRow[mini.bestMove.currentPosition.columnIndex] = mini.bestMove;
    this.$set(this.boardState, mini.bestMove.currentPosition.rowIndex, newRow);

    if (mini.pawnToRemove && mini.pawnToRemove.player != player) {
      this.removePawnById(mini.pawnToRemove.index);
      this.clearBoardField(mini.pawnToRemove.currentPosition);
      this.didPlayerWin(mini.bestMove.player);
    }

    this.tura = !this.tura;
    this.moveCounter++;

    // const myPawns = this.getEnemyPawns(enemy);
    // const pawnsWithAvailableMoves = this.getMovablePawn(myPawns);
    // if (pawnsWithAvailableMoves && pawnsWithAvailableMoves.length)
    //   this.movePawnIntoRandomDirection(
    //     pawnsWithAvailableMoves[
    //       Math.floor(Math.random() * pawnsWithAvailableMoves.length)
    //     ]
    //   );
    // else {
    //   alert("Komputer przegrał z powodu braku dostępnych ruchów.");
    // }
  }

  // // movePawnIntoRandomDirection(pawn) {
  // //   const availableDirections = this.getAvailableDirectionsForPawn(pawn);
  // //   const randomizedDirection =
  // //     availableDirections[
  // //       Math.floor(Math.random() * availableDirections.length)
  // //     ];

  // //   const rowIndex = randomizedDirection.rowIndex;
  // //   const columnIndex = randomizedDirection.columnIndex;

  // //   let newRow = this.board.values[rowIndex].slice(0);

  // //   pawn.lastPosition = pawn.currentPosition;
  // //   pawn.currentPosition = {
  // //     rowIndex: rowIndex,
  // //     columnIndex: columnIndex
  // //   };
  // //   newRow[columnIndex] = pawn;
  // //   this.$set(this.board.values, rowIndex, newRow);

  // //   let oldRow = this.board.values[pawn.lastPosition.rowIndex].slice(0);
  // //   oldRow[pawn.lastPosition.columnIndex] = this.getEmptyBoardField();
  // //   this.$set(this.board.values, pawn.lastPosition.rowIndex, oldRow);
  // //   if (
  // //     this.hasPlayerScored(rowIndex, columnIndex, newRow[columnIndex].player)
  // //   ) {
  // //     this.removeRandomEnemyPawn(newRow[columnIndex].player);
  // //     this.tura = !this.tura;
  // //     this.moveCounter++;
  // //     return;
  // //   }

  // //   this.tura = !this.tura;
  // //   this.moveCounter++;
  // // },

  // removeRandomEnemyPawn(player) {
  //   const enemyPawns = this.getEnemyPawns(player);
  //   const pawnToRemove =
  //     enemyPawns[Math.floor(Math.random() * enemyPawns.length)];
  //   this.removePawnById(pawnToRemove.pawnIndex);
  //   this.clearBoardField(
  //     pawnToRemove.currentPosition.rowIndex,
  //     pawnToRemove.currentPosition.columnIndex
  //   );
  //   this.didPlayerWin(player);
  // },

  // // getMovablePawn(pawns) {
  // //   let availablePawns = [];
  // //   for (let i = 0; i < pawns.length; i++) {
  // //     if (this.getAvailableDirectionsForPawn(pawns[i]).length)
  // //       availablePawns.push(pawns[i]);
  // //   }
  // //   return availablePawns;
  // // },

  highlightEnemyPawns(player: string): void {
    const enemyPawns = this.getEnemyPawns(player);
    let element;
    for (let i = 0; i < enemyPawns.length; i++) {
      element = document.getElementById(
        `${enemyPawns[i].currentPosition.rowIndex}${enemyPawns[i].currentPosition.columnIndex}`
      );
      element.classList.add("yellowgreen");
    }
  }

  removeHighlightFromEnemyPawns(player: string): void {
    const enemyPawns = this.getEnemyPawns(player);
    let element;
    for (let i = 0; i < enemyPawns.length; i++) {
      element = document.getElementById(
        `${enemyPawns[i].currentPosition.rowIndex}${enemyPawns[i].currentPosition.columnIndex}`
      );
      element.classList.remove("yellowgreen");
    }
  }

  removeEnemyPawn(position: Coordinates): void {
    const targetedPawn = this.boardState[position.rowIndex][
      position.columnIndex
    ];
    if (targetedPawn.player === this.removeStagePlayer) return;

    this.removeHighlightFromEnemyPawns(this.removeStagePlayer);
    this.removePawnById(targetedPawn.index);
    this.clearBoardField(position);
    this.didPlayerWin(this.removeStagePlayer);
    this.removeStagePlayer = null;
    this.tura = !this.tura;
    this.moveCounter++;
    const board = this.boardState;
    const currentPlayer = "white";
    this.movePawnByAI(currentPlayer, board);
  }

  didPlayerWin(player: string): void {
    const enemyPawns = this.getEnemyPawns(player);
    console.log("Did Player win", enemyPawns);
    if (enemyPawns.length > 2) return;
    alert(`Gratulacje, wygrał gracz: ${player}`);
  }

  clearBoardField(position: Coordinates): void {
    let changedRow = this.boardState[position.rowIndex].slice(0);
    changedRow[position.columnIndex] = this.emptyField;
    this.$set(this.boardState, position.rowIndex, changedRow);
  }

  // getEmptyBoardField() {
  //   return {
  //     player: null,
  //     pawnIndex: null,
  //     currentPosition: null,
  //     lastPosition: null,
  //   };
  // },

  removePawnById(id: number): void {
    this.pawns = this.pawns.filter((item) => item.index != id);
  }

  // getPawnById(id, pawns) {
  //   return pawns.find((item) => item.pawnIndex === id);
  // },

  getEnemyPawns(player: string): Pawn[] {
    return this.pawns.filter((item) => {
      if (item.player != player) return item;
    });
  }

  hasPlayerScored(position: Coordinates, player: string): boolean {
    if (
      this.checkRowsForPoint(position, player) ||
      this.checkColumnsForPoint(position, player)
    )
      return true;
  }

  // hasPlayerScoredAI(movedPawn, boardState, maximizingPlayer) {
  //   // console.log("hasPlayerScored", boardState);
  //   if (
  //     this.checkRowsForPointAI(movedPawn, boardState, maximizingPlayer) ||
  //     this.checkColumnsForPointAI(movedPawn, boardState, maximizingPlayer)
  //   ) {
  //     // console.log("mamy punkt", movedPawn, boardState);
  //     return true;
  //   }
  //   return false;
  // },

  checkRowsForPoint(position: Coordinates, player: string): boolean {
    if (position.rowIndex === 0) return this.checkUpperRows(position, player);
    if (position.rowIndex === this.boardDimensions.rowsNumber - 1)
      return this.checkLowerRows(position, player);

    return this.checkAroundRow(position, player);
  }
  checkAroundRow(position: Coordinates, player: string): boolean {
    let positionUnder: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex
    };
    let positionOver: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex
    };
    let under = this.isThisPlayerField(positionUnder, player);
    let over = this.isThisPlayerField(positionOver, player);

    //Czy otaczające należą do gracza?
    if (under && over) {
      positionUnder = {
        rowIndex: position.rowIndex - 2,
        columnIndex: position.columnIndex
      };
      positionOver = {
        rowIndex: position.rowIndex + 2,
        columnIndex: position.columnIndex
      };
      under = this.isThisPlayerField(positionUnder, player);
      over = this.isThisPlayerField(positionOver, player);

      //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
      if (under || over) return false;
      return true;
    }
    if (under) return this.checkLowerRows(position, player);
    return this.checkUpperRows(position, player);
  }
  checkLowerRows(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex - 2,
      columnIndex: position.columnIndex
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex - 3,
      columnIndex: position.columnIndex
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    const thirdNext = this.isThisPlayerField(thirdPosition, player);
    if (firstNext && secondNext && !thirdNext) return true;
  }
  checkUpperRows(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex + 2,
      columnIndex: position.columnIndex
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex + 3,
      columnIndex: position.columnIndex
    };
    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    const thirdNext = this.isThisPlayerField(thirdPosition, player);
    if (firstNext && secondNext && !thirdNext) return true;
  }

  checkColumnsForPoint(position: Coordinates, player: string): boolean {
    if (position.columnIndex === 0)
      return this.checkRightColumns(position, player);

    if (position.columnIndex === this.boardDimensions.columnsNumber - 1)
      return this.checkLeftColumns(position, player);

    return this.checkAroundColumn(position, player);
  }

  checkAroundColumn(position: Coordinates, player: string): boolean {
    let rightPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1
    };
    let leftPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1
    };
    let right = this.isThisPlayerField(rightPosition, player);
    let left = this.isThisPlayerField(leftPosition, player);

    //Czy otaczające należą do gracza?
    if (right && left) {
      rightPosition = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex + 2
      };
      leftPosition = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex - 2
      };
      right = this.isThisPlayerField(rightPosition, player);
      left = this.isThisPlayerField(leftPosition, player);

      //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
      if (right || left) return false;
      return true;
    }
    if (right) return this.checkRightColumns(position, player);
    return this.checkLeftColumns(position, player);
  }

  checkRightColumns(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 2
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 3
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    const thirdNext = this.isThisPlayerField(thirdPosition, player);
    if (firstNext && secondNext && !thirdNext) return true;
  }

  checkLeftColumns(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 2
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 3
    };
    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    const thirdNext = this.isThisPlayerField(thirdPosition, player);
    if (firstNext && secondNext && !thirdNext) return true;
  }

  isCoordinateOutOfBounds(position: Coordinates): boolean {
    const rowOutOfBound =
      position.rowIndex < 0 ||
      position.rowIndex >= this.boardDimensions.rowsNumber;
    const columnOutOfBound =
      position.columnIndex < 0 ||
      position.columnIndex >= this.boardDimensions.columnsNumber;
    if (rowOutOfBound || columnOutOfBound) {
      return true;
    }
  }

  isThisPlayerField(position: Coordinates, player: string): boolean {
    if (this.isCoordinateOutOfBounds(position)) {
      return false;
    }
    const field = this.boardState[position.rowIndex][position.columnIndex];
    return field && field.player === player;
  }
  // },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board {
  width: 720px;
  height: 600px;

  display: flex;
  flex-wrap: wrap-reverse;

  margin: 20px;
  border: 25px solid #333;
  margin-left: auto;
  margin-right: auto;
}

.row {
  display: flex;
}

.black {
  float: left;
  width: 120px;
  height: 120px;
  background-color: #999;
  font-size: 80px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.white {
  float: left;
  width: 120px;
  height: 120px;
  background-color: #fff;
  font-size: 80px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.yellowgreen {
  background-color: yellowgreen;
}

.darkgreen {
  background-color: darkgreen;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
