<template>
  <div class="artificial-content">
    <!-- <img
      v-show="isComputerThinking"
      src="@/assets/img/spinner.gif"
      alt="thinking"
      style="width:50px; height:50px;"
    /> -->
    <div class="game-board">
      <div
        v-for="(e, rowIndex) in boardDimensions.rowsNumber"
        :key="e"
        class="board-row"
      >
        <div
          v-for="(f, columnIndex) in boardDimensions.columnsNumber"
          :key="f"
          @click="cellOnClick(rowIndex, columnIndex)"
        >
          <div
            :id="`${rowIndex}${columnIndex}`"
            :class="[
              (rowIndex + columnIndex) % 2 === 0
                ? 'white-field'
                : 'black-field',
            ]"
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
    <div>
      <Timer
        ref="timer"
        @timesUp="timesUp"
        firstPlayerName="Gracz"
        secondPlayerName="Komputer"
      >
        <v-btn dark :disabled="isComputerThinking" @click="setupGame()"
          >Restart Game</v-btn
        >
      </Timer>
      <PopUp ref="popup" />
    </div>

    <!-- <span>Tura {{ moveCounter }} |</span>
    <span v-if="tura"> Ruch Białych </span> -->
    <!-- <span v-else>Ruch Czarnych</span> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  Coordinates,
  BoardDimensions,
  Pawn,
  Player,
} from "../../../types/board";
import { Difficulty } from "../../../types/minimax";
import FieldHelper from "../../../helpers/FieldHelper";
import { minimaxValues } from "../../../helpers/BoardInfo";
import Timer from "../../Timer.vue";
import PopUp from "../../PopUp.vue";

@Component({
  props: {
    worker: {},
    aiDifficulty: Object as () => Difficulty,
  },
  components: {
    Timer,
    PopUp,
  },
})
export default class Board extends Vue {
  $refs: {
    timer: Timer;
    popup: PopUp;
  };

  freezeGame = false;
  tura = true;
  isComputerThinking = false;
  removeStagePlayer: string;
  moveCounter = 1;
  firstStageMovesLimit = 24;
  focused: Coordinates;
  boardDimensions: BoardDimensions = {
    columnsNumber: 6,
    rowsNumber: 5,
  };
  boardState: Pawn[][] = new Array(this.boardDimensions.rowsNumber)
    .fill(false)
    .map(() =>
      new Array(this.boardDimensions.columnsNumber).fill(this.emptyField)
    );

  pawns: Pawn[] = []; // { player: 'black', currentPosition: {rowIndex: 4, columnIndex: 4}, lastPosition:{rowIndex: 4, columnIndex: 3} }

  // history = []; // HistoryItem{tour: 1, pawnIndexMoved: w4, from: {rowIndex: 4, columnIndex:5}, to: {rowIndex: 3, columnIndex:5}, scored: {rowIndex: 2, columnIndex:2, player: 'white', pawnIndex: w4 } }

  setupGame() {
    this.clearTheBoard();
    this.focused = null as Coordinates;
    this.pawns = [];
    this.moveCounter = 1;
    this.tura = true;
    this.removeStagePlayer = null as string;
    this.$refs.timer.resetTimer();
    this.freezeGame = false;
  }

  clearTheBoard() {
    this.boardState = new Array(this.boardDimensions.rowsNumber)
      .fill(false)
      .map(() =>
        new Array(this.boardDimensions.columnsNumber).fill(this.emptyField)
      );
  }

  get emptyField(): Pawn {
    return {
      player: null,
      index: null,
      currentPosition: null,
      lastPosition: null,
    };
  }

  cellOnClick(rowIndex: number, columnIndex: number): void {
    if (this.isComputerThinking || this.freezeGame) return;
    const position: Coordinates = { rowIndex, columnIndex };
    if (this.moveCounter <= this.firstStageMovesLimit) {
      this.pawnsPlacingStageController(position);
    } else {
      this.pawnsMovingStageController(position);
    }
  }

  pawnsPlacingStageController(position: Coordinates): void {
    const isTaken = this.isGivenFieldTaken(position);
    if (!isTaken) this.tryPlacePawn(position);
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

  tryPlacePawn(position: Coordinates): void {
    if (this.isPawnThirdInRow(position)) return;

    const newPawn = this.createNewPawn(position);

    this.addPawnToGame(newPawn, position);

    this.tura = !this.tura;
    this.moveCounter++;
    this.$refs.timer.timerChangePlayer();
    this.placePawnByAI();
  }

  isPawnThirdInRow(position: Coordinates): boolean {
    const player: Player = this.tura ? "white" : "black";
    if (
      this.checkRowsForLine(position, player) ||
      this.checkColumnsForLine(position, player)
    )
      return true;
  }

  checkRowsForLine(position: Coordinates, player: Player) {
    if (position.rowIndex === 0)
      return this.checkUpperRowsForLine(position, player);
    if (position.rowIndex === this.boardDimensions.rowsNumber - 1)
      return this.checkLowerRowsForLine(position, player);

    return this.checkAroundRowForLine(position, player);
  }

  checkAroundRowForLine(position: Coordinates, player: Player): boolean {
    let positionUnder: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex,
    };
    let positionOver: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex,
    };
    let under = this.isThisPlayerField(positionUnder, player);
    let over = this.isThisPlayerField(positionOver, player);

    //Czy otaczające należą do gracza?
    if (under && over) return true;

    if (under) {
      positionUnder = {
        rowIndex: position.rowIndex - 2,
        columnIndex: position.columnIndex,
      };
      under = this.isThisPlayerField(positionUnder, player);

      if (under) return true;
    }
    if (over) {
      positionOver = {
        rowIndex: position.rowIndex + 2,
        columnIndex: position.columnIndex,
      };
      over = this.isThisPlayerField(positionOver, player);

      if (over) return true;
    }
  }

  checkLowerRowsForLine(position: Coordinates, player: Player): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex - 2,
      columnIndex: position.columnIndex,
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);

    if (firstNext && secondNext) return true;
  }

  checkUpperRowsForLine(position: Coordinates, player: Player): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex + 2,
      columnIndex: position.columnIndex,
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);

    if (firstNext && secondNext) return true;
  }

  checkColumnsForLine(position: Coordinates, player: string): boolean {
    if (position.columnIndex === 0)
      return this.checkRightColumnsForLine(position, player);

    if (position.columnIndex === this.boardDimensions.columnsNumber - 1)
      return this.checkLeftColumnsForLine(position, player);

    return this.checkAroundColumnForLine(position, player);
  }

  checkAroundColumnForLine(position: Coordinates, player: string): boolean {
    let rightPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1,
    };
    let leftPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1,
    };
    let right = this.isThisPlayerField(rightPosition, player);
    let left = this.isThisPlayerField(leftPosition, player);

    //Czy otaczające należą do gracza?
    if (right && left) {
      return true;
    }

    if (right) {
      rightPosition = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex + 2,
      };
      right = this.isThisPlayerField(rightPosition, player);

      if (right) return true;
    }

    if (left) {
      leftPosition = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex - 2,
      };
      left = this.isThisPlayerField(leftPosition, player);

      if (left) return true;
    }
  }

  checkRightColumnsForLine(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 2,
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    if (firstNext && secondNext) return true;
  }

  checkLeftColumnsForLine(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 2,
    };
    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    if (firstNext && secondNext) return true;
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
        columnIndex: position.columnIndex,
      },
    };
  }

  createBlackPawn(position: Coordinates, moveCounter: number): Pawn {
    return {
      player: "black",
      index: moveCounter,
      currentPosition: {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex,
      },
    };
  }

  placePawnByAI(): void {
    this.isComputerThinking = true;
    const currentPlayer: Player = this.tura ? "white" : "black";

    this.$props.worker.postMessage({
      type: this.$props.aiDifficulty.drop,
      params: [
        this.boardState,
        5,
        minimaxValues.MIN,
        minimaxValues.MAX,
        currentPlayer,
      ],
    });

    const result = new Promise((resolve) => {
      this.$props.worker.onmessage = (result: any) => {
        resolve(result);
      };
    });
    result.then((result: any) => {
      let newPawn: Pawn;

      if (result.data.position) {
        newPawn = this.createNewPawn(result.data.position);
        this.addPawnToGame(newPawn, result.data.position);
      } else {
        const availableFields: Coordinates[] = this.getEmptyFields(
          this.boardState,
          this.boardDimensions
        );
        const randomFieldAddress =
          availableFields[Math.floor(Math.random() * availableFields.length)];
        newPawn = this.createNewPawn(randomFieldAddress);
        this.addPawnToGame(newPawn, randomFieldAddress);
      }

      this.tura = !this.tura;
      this.moveCounter++;
      this.isComputerThinking = false;
      this.$refs.timer.timerChangePlayer();
    });
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
            columnIndex: j,
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
      columnIndex: position.columnIndex,
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
      columnIndex: this.focused.columnIndex,
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
      columnIndex: position.columnIndex,
    };
    const lowerPosition: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex,
    };
    const leftPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 1,
    };
    const rightPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1,
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
        columnIndex: position.columnIndex,
      };
      this.removeYellowGreenHighlight(upperPosition);
    }
    if (position.rowIndex - 1 >= 0) {
      const lowerPosition: Coordinates = {
        rowIndex: position.rowIndex - 1,
        columnIndex: position.columnIndex,
      };
      this.removeYellowGreenHighlight(lowerPosition);
    }
    if (position.columnIndex + 1 < this.boardDimensions.columnsNumber) {
      const leftPosition: Coordinates = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex + 1,
      };
      this.removeYellowGreenHighlight(leftPosition);
    }
    if (position.columnIndex - 1 >= 0) {
      const rightPosition: Coordinates = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex - 1,
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
    this.updatePawnById(pawn);
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
      this.$refs.timer.timerChangePlayer();
      return;
    }

    this.tura = !this.tura;
    this.moveCounter++;
    this.$refs.timer.timerChangePlayer();
    const board = this.boardState;
    const currentPlayer = pawn.player;
    const enemyPlayer: Player = pawn.player == "white" ? "black" : "white";
    if (FieldHelper.isPlayerOutOfMoves(enemyPlayer, this.boardState)) {
      this.$refs.timer.stopTimer();

      this.showDialog(
        `Niestety pionki koloru ${
          enemyPlayer == "white" ? "białe" : "czarne"
        }, nie posiadają możliwości ruchu, przez co następuje remis.`
      );
      this.freezeGame = true;
      return;
    }
    this.movePawnByAI(currentPlayer, board);
  }

  showDialog(text: string) {
    this.$refs.popup.showDialog(text);
  }

  emptyGivenField(position: Coordinates): void {
    let oldRow = this.boardState[position.rowIndex].slice(0);
    oldRow[position.columnIndex] = this.emptyField;
    this.$set(this.boardState, position.rowIndex, oldRow);
  }

  emptyFocused(): void {
    this.focused = null;
  }

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

  movePawnByAI(currentPlayer: string, board: Pawn[][]): void {
    const player: Player = currentPlayer == "white" ? "black" : "white";
    const enemyPlayer: Player = player == "white" ? "black" : "white";
    this.isComputerThinking = true;
    this.$props.worker.postMessage({
      type: "move",
      params: [
        { boardState: board },
        this.$props.aiDifficulty.move,
        minimaxValues.MIN,
        minimaxValues.MAX,
        player,
      ],
    });

    const mini = new Promise((resolve) => {
      this.$props.worker.onmessage = (result: any) => {
        resolve(result);
      };
    });
    mini.then((value: any) => {
      const data = value.data;

      if (!data.bestMove) {
        this.$refs.timer.stopTimer();
        this.showDialog(`Komputer poddał się, wygrały pionki białe`);
        this.freezeGame = true;
        this.isComputerThinking = false;
        return;
      }

      this.updatePawnById(data.bestMove);
      this.placePawnOnBoard(data.bestMove, data.bestMove.currentPosition);
      this.emptyGivenField(data.bestMove.lastPosition);

      if (data.pawnToRemove && data.pawnToRemove.player != player) {
        this.removePawnById(data.pawnToRemove.index);
        this.clearBoardField(data.pawnToRemove.currentPosition);
        if (this.hasPlayerWon(data.bestMove.player)) return;
      }

      if (FieldHelper.isPlayerOutOfMoves(enemyPlayer, this.boardState)) {
        this.$refs.timer.stopTimer();
        this.showDialog(
          `Niestety graczowi ${enemyPlayer} nie posiada możliwości ruchu, przez co następuje remis`
        );

        this.freezeGame = true;
        this.isComputerThinking = false;
        return;
      }

      this.tura = !this.tura;
      this.moveCounter++;
      this.isComputerThinking = false;
      this.$refs.timer.timerChangePlayer();
    });
  }

  getPawnById(id: number): Pawn {
    return this.pawns.find((item) => item.index === id);
  }
  updatePawnById(updatedPawn: Pawn): void {
    const idFromArray = this.pawns.findIndex(
      (item) => item.index === updatedPawn.index
    );
    this.pawns[idFromArray] = updatedPawn;
  }

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
    this.hasPlayerWon(this.removeStagePlayer);
    this.removeStagePlayer = null;
    this.tura = !this.tura;
    this.moveCounter++;
    const board = this.boardState;
    const currentPlayer = "white";
    this.movePawnByAI(currentPlayer, board);
  }

  hasPlayerWon(player: string): boolean {
    const enemyPawns = this.getEnemyPawns(player);
    if (enemyPawns.length > 2) return;
    this.$refs.timer.stopTimer();
    this.showDialog(
      `Wygrały pionki ${player == "white" ? "białe" : "czarne"}.`
    );
    this.freezeGame = true;
    this.isComputerThinking = false;
    return true;
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

  checkRowsForPoint(position: Coordinates, player: string): boolean {
    if (position.rowIndex === 0) return this.checkUpperRows(position, player);
    if (position.rowIndex === this.boardDimensions.rowsNumber - 1)
      return this.checkLowerRows(position, player);

    return this.checkAroundRow(position, player);
  }
  checkAroundRow(position: Coordinates, player: string): boolean {
    let positionUnder: Coordinates = {
      rowIndex: position.rowIndex - 1,
      columnIndex: position.columnIndex,
    };
    let positionOver: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex,
    };
    let under = this.isThisPlayerField(positionUnder, player);
    let over = this.isThisPlayerField(positionOver, player);

    //Czy otaczające należą do gracza?
    if (under && over) {
      positionUnder = {
        rowIndex: position.rowIndex - 2,
        columnIndex: position.columnIndex,
      };
      positionOver = {
        rowIndex: position.rowIndex + 2,
        columnIndex: position.columnIndex,
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
      columnIndex: position.columnIndex,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex - 2,
      columnIndex: position.columnIndex,
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex - 3,
      columnIndex: position.columnIndex,
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    const thirdNext = this.isThisPlayerField(thirdPosition, player);
    if (firstNext && secondNext && !thirdNext) return true;
  }
  checkUpperRows(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex + 1,
      columnIndex: position.columnIndex,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex + 2,
      columnIndex: position.columnIndex,
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex + 3,
      columnIndex: position.columnIndex,
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
      columnIndex: position.columnIndex + 1,
    };
    let leftPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1,
    };
    let right = this.isThisPlayerField(rightPosition, player);
    let left = this.isThisPlayerField(leftPosition, player);

    //Czy otaczające należą do gracza?
    if (right && left) {
      rightPosition = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex + 2,
      };
      leftPosition = {
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex - 2,
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
      columnIndex: position.columnIndex + 1,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 2,
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex + 3,
    };

    const firstNext = this.isThisPlayerField(firstPosition, player);
    const secondNext = this.isThisPlayerField(secondPosition, player);
    const thirdNext = this.isThisPlayerField(thirdPosition, player);
    if (firstNext && secondNext && !thirdNext) return true;
  }

  checkLeftColumns(position: Coordinates, player: string): boolean {
    const firstPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 1,
    };
    const secondPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 2,
    };
    const thirdPosition: Coordinates = {
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex - 3,
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

  timesUp() {
    if (this.tura) {
      this.showDialog("Wygrały pionki czarne poprzez czas");
      this.freezeGame = true;
      return;
    }
    this.showDialog("Wygrały pionki białe poprzez czas");
    this.freezeGame = true;
  }
  // },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.artificial-content {
  margin-top: 5vh;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-start;
}

.game-board {
  color: black;
  width: 770px;
  height: 650px;

  display: flex;
  flex-wrap: wrap-reverse;

  // margin: 20px;
  border: 25px solid #333;
  // margin-left: auto;
  // margin-right: auto;
}

.board-row {
  display: flex;
}

.black-field {
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
.white-field {
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
