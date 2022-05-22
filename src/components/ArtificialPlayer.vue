<template>
  <div>
    Webowa Aplikacja do gry Dara
    <div class="game-board">
      <div v-for="(e, rowIndex) in board.rowsNumber" :key="e" class="board-row">
        <div
          v-for="(f, columnIndex) in board.columnsNumber"
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
            <div v-if="board.values[rowIndex][columnIndex].player == 'white'">
              &#9920;
            </div>
            <div v-if="board.values[rowIndex][columnIndex].player == 'black'">
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

<script>
export default {
  props: {
    msg: String,
  },
  data: function() {
    return {
      tura: true,
      removeStagePlayer: null,
      moveCounter: 1,
      firstStageMovesLimit: 8,
      focused: null,
      board: {
        columnsNumber: 6,
        rowsNumber: 5,
        values: null,
      },
      pawns: [],
      history: [],
    };
  },
  methods: {
    cellOnClick(rowIndex, columnIndex) {
      if (this.moveCounter <= this.firstStageMovesLimit) {
        this.pawnsPlacingStageController(rowIndex, columnIndex);
      } else {
        this.pawnsMovingStageController(rowIndex, columnIndex);
      }
    },

    pawnsPlacingStageController(rowIndex, columnIndex) {
      const isEmpty = this.isGivenFieldEmpty(rowIndex, columnIndex);
      if (isEmpty) this.placePawn(rowIndex, columnIndex);
    },

    pawnsMovingStageController(rowIndex, columnIndex) {
      const isEmpty = this.isGivenFieldEmpty(rowIndex, columnIndex);
      if (isEmpty) {
        this.pawnsMovingStageControllerEmptyField(rowIndex, columnIndex);
      } else {
        this.pawnsMovingStageControllerOccupiedField(rowIndex, columnIndex);
      }
    },

    pawnsMovingStageControllerEmptyField(rowIndex, columnIndex) {
      if (this.isAnyPawnFocused()) this.tryToMovePawnTo(rowIndex, columnIndex);
    },

    pawnsMovingStageControllerOccupiedField(rowIndex, columnIndex) {
      if (this.removeStagePlayer) {
        this.removeEnemyPawn(rowIndex, columnIndex);
      } else if (!this.isAnyPawnFocused()) {
        this.selectPawn(rowIndex, columnIndex);
      } else {
        this.reSelectPawn(rowIndex, columnIndex);
      }
    },

    isGivenFieldEmpty(rowIndex, columnIndex) {
      const pawn = this.board.values[rowIndex][columnIndex];
      if (!pawn.player) return true;
    },

    isAnyPawnFocused() {
      if (this.focused != null) return true;
    },

    placePawn(rowIndex, columnIndex) {
      if (!this.isGivenFieldEmpty(rowIndex, columnIndex)) return;

      const newPawn = this.createNewPawn(rowIndex, columnIndex);

      this.addPawnToGame(newPawn, rowIndex, columnIndex);

      this.tura = !this.tura;
      this.moveCounter++;
      this.placePawnByAI();
    },

    addPawnToGame(pawn, rowIndex, columnIndex) {
      this.addPawnToList(pawn);
      this.addPawnToBoard(pawn, rowIndex, columnIndex);
    },

    addPawnToList(pawn) {
      this.pawns.push(pawn);
    },

    addPawnToBoard(pawn, rowIndex, columnIndex) {
      const newRow = this.board.values[rowIndex].slice(0);
      newRow[columnIndex] = pawn;
      this.$set(this.board.values, rowIndex, newRow);
    },

    createNewPawn(rowIndex, columnIndex) {
      if (this.tura)
        return this.createWhitePawn(rowIndex, columnIndex, this.moveCounter);

      return this.createBlackPawn(rowIndex, columnIndex, this.moveCounter);
    },

    createWhitePawn(rowIndex, columnIndex, moveCounter) {
      return {
        player: "white",
        pawnIndex: moveCounter,
        currentPosition: {
          rowIndex: rowIndex,
          columnIndex: columnIndex,
        },
        lastPosition: null,
      };
    },

    createBlackPawn(rowIndex, columnIndex, moveCounter) {
      return {
        player: "black",
        pawnIndex: moveCounter,
        currentPosition: {
          rowIndex: rowIndex,
          columnIndex: columnIndex,
        },
        lastPosition: null,
      };
    },

    placePawnByAI() {
      const availableFields = this.getEmptyFields(
        this.board.values,
        this.board.rowsNumber,
        this.board.columnsNumber
      );

      const randomFieldAddress =
        availableFields[Math.floor(Math.random() * availableFields.length)];

      const newPawn = this.createNewPawn(
        randomFieldAddress.rowIndex,
        randomFieldAddress.columnIndex
      );

      this.addPawnToGame(
        newPawn,
        randomFieldAddress.rowIndex,
        randomFieldAddress.columnIndex
      );

      this.tura = !this.tura;
      this.moveCounter++;
    },

    getEmptyFields(values, rowsNumber, columnsNumber) {
      let emptyFields = [];
      for (let i = 0; i < rowsNumber; i++) {
        for (let j = 0; j < columnsNumber; j++) {
          if (!values[i][j].player)
            emptyFields.push({
              rowIndex: i,
              columnIndex: j,
            });
        }
      }

      return emptyFields;
    },

    selectPawn(rowIndex, columnIndex) {
      const currentPlayer = this.whichPlayerTurnItIs(this.tura);
      const selectedPawn = this.getPawnFromBoard(rowIndex, columnIndex);
      if (selectedPawn.player != currentPlayer) return;

      this.drawAvailableMoves(rowIndex, columnIndex);
      this.setFocused(rowIndex, columnIndex);
    },

    setFocused(rowIndex, columnIndex) {
      this.focused = { rowIndex: rowIndex, columnIndex: columnIndex };
    },

    whichPlayerTurnItIs(tura) {
      if (tura) return "white";
      return "black";
    },
    reSelectPawn(rowIndex, columnIndex) {
      if (this.isThisFocusedPawn(rowIndex, columnIndex)) return;

      const currentPlayer = this.whichPlayerTurnItIs(this.tura);
      const selectedPawn = this.getPawnFromBoard(rowIndex, columnIndex);
      if (selectedPawn.player != currentPlayer) return;

      this.removeAvailableMoves(
        this.focused.rowIndex,
        this.focused.columnIndex
      );
      this.drawAvailableMoves(rowIndex, columnIndex);
      this.setFocused(rowIndex, columnIndex);
    },

    isThisFocusedPawn(rowIndex, columnIndex) {
      if (
        rowIndex === this.focused.rowIndex &&
        columnIndex === this.focused.columnIndex
      )
        return true;
    },

    getPawnFromBoard(rowIndex, columnIndex) {
      return this.board.values[rowIndex][columnIndex];
    },

    isUpperFieldSuitableToMove(rowIndex, columnIndex, movingPawn) {
      if (rowIndex <= 0) return false;
      const targetedField = this.getPawnFromBoard(rowIndex - 1, columnIndex);

      if (targetedField.player) return false;
      else if (
        movingPawn.lastPosition &&
        movingPawn.lastPosition.rowIndex === rowIndex - 1
      ) {
        return false;
      }
      return true;
    },
    isLowerFieldSuitableToMove(rowIndex, columnIndex, movingPawn) {
      if (rowIndex + 1 >= this.board.rowsNumber) return false;
      const targetedField = this.getPawnFromBoard(rowIndex + 1, columnIndex);

      if (targetedField.player) return false;
      else if (
        movingPawn.lastPosition &&
        movingPawn.lastPosition.rowIndex === rowIndex + 1
      ) {
        return false;
      }
      return true;
    },
    isLeftFieldSuitableToMove(rowIndex, columnIndex, movingPawn) {
      if (columnIndex <= 0) return false;
      const targetedField = this.getPawnFromBoard(rowIndex, columnIndex - 1);

      if (targetedField.player) return false;
      else if (
        movingPawn.lastPosition &&
        movingPawn.lastPosition.columnIndex === columnIndex - 1
      ) {
        return false;
      }
      return true;
    },
    isRightFieldSuitableToMove(rowIndex, columnIndex, movingPawn) {
      if (columnIndex + 1 >= this.board.columnsNumber) return false;
      const targetedField = this.getPawnFromBoard(rowIndex, columnIndex + 1);

      if (targetedField.player) return false;
      else if (
        movingPawn.lastPosition &&
        movingPawn.lastPosition.columnIndex === columnIndex + 1
      ) {
        return false;
      }
      return true;
    },

    drawAvailableMoves(rowIndex, columnIndex) {
      this.highlightWithDarkGreen(rowIndex, columnIndex);
      const movingPawn = this.getPawnFromBoard(rowIndex, columnIndex);

      if (this.isUpperFieldSuitableToMove(rowIndex, columnIndex, movingPawn)) {
        this.highlightWithYellowGreen(rowIndex - 1, columnIndex);
      }
      if (this.isLowerFieldSuitableToMove(rowIndex, columnIndex, movingPawn)) {
        this.highlightWithYellowGreen(rowIndex + 1, columnIndex);
      }
      if (this.isLeftFieldSuitableToMove(rowIndex, columnIndex, movingPawn)) {
        this.highlightWithYellowGreen(rowIndex, columnIndex - 1);
      }
      if (this.isRightFieldSuitableToMove(rowIndex, columnIndex, movingPawn)) {
        this.highlightWithYellowGreen(rowIndex, columnIndex + 1);
      }
    },

    highlightWithYellowGreen(rowIndex, columnIndex) {
      const element = document.getElementById(`${rowIndex}${columnIndex}`);
      element.classList.add("yellowgreen");
    },

    highlightWithDarkGreen(rowIndex, columnIndex) {
      const element = document.getElementById(`${rowIndex}${columnIndex}`);
      element.classList.add("darkgreen");
    },

    removeAvailableMoves(rowIndex, columnIndex) {
      this.removeDarkGreenHighlight(rowIndex, columnIndex);

      if (rowIndex - 1 >= 0) {
        this.removeYellowGreenHighlight(rowIndex - 1, columnIndex);
      }
      if (rowIndex + 1 < this.board.rowsNumber) {
        this.removeYellowGreenHighlight(rowIndex + 1, columnIndex);
      }
      if (columnIndex - 1 >= 0) {
        this.removeYellowGreenHighlight(rowIndex, columnIndex - 1);
      }
      if (columnIndex + 1 < this.board.columnsNumber) {
        this.removeYellowGreenHighlight(rowIndex, columnIndex + 1);
      }
    },

    removeDarkGreenHighlight(rowIndex, columnIndex) {
      const element = document.getElementById(`${rowIndex}${columnIndex}`);
      element.classList.remove("darkgreen");
    },

    removeYellowGreenHighlight(rowIndex, columnIndex) {
      const element = document.getElementById(`${rowIndex}${columnIndex}`);
      element.classList.remove("yellowgreen");
    },

    tryToMovePawnTo(rowIndex, columnIndex) {
      if (
        !(
          (rowIndex == this.focused.rowIndex &&
            (columnIndex == this.focused.columnIndex - 1 ||
              columnIndex == this.focused.columnIndex + 1)) ||
          (columnIndex == this.focused.columnIndex &&
            (rowIndex == this.focused.rowIndex - 1 ||
              rowIndex == this.focused.rowIndex + 1))
        )
      )
        return;

      let newRow = this.board.values[rowIndex].slice(0);
      const boardPawn = this.board.values[this.focused.rowIndex][
        this.focused.columnIndex
      ];

      const pawn = this.getPawnById(boardPawn.pawnIndex);
      if (
        pawn.lastPosition &&
        pawn.lastPosition.columnIndex == columnIndex &&
        pawn.lastPosition.rowIndex == rowIndex
      ) {
        return;
      }

      pawn.lastPosition = pawn.currentPosition;
      pawn.currentPosition = {
        rowIndex: rowIndex,
        columnIndex: columnIndex,
      };

      newRow[columnIndex] = pawn;
      this.$set(this.board.values, rowIndex, newRow);

      let oldRow = this.board.values[this.focused.rowIndex].slice(0);
      oldRow[this.focused.columnIndex] = this.getEmptyBoardField();
      this.$set(this.board.values, this.focused.rowIndex, oldRow);

      this.removeAvailableMoves(
        this.focused.rowIndex,
        this.focused.columnIndex
      );
      this.focused = null;

      if (
        this.hasPlayerScored(rowIndex, columnIndex, newRow[columnIndex].player)
      ) {
        this.highlightEnemyPawns(pawn.player);
        this.removeStagePlayer = pawn.player;
        return;
      }

      this.tura = !this.tura;
      this.moveCounter++;
      this.movePawnByAI(pawn.player);
    },

    movePawnByAI(enemy) {
      const myPawns = this.getEnemyPawns(enemy);
      const pawnsWithAvailableMoves = this.getMovablePawn(myPawns);
      if (pawnsWithAvailableMoves && pawnsWithAvailableMoves.length)
        this.movePawnIntoRandomDirection(
          pawnsWithAvailableMoves[
            Math.floor(Math.random() * pawnsWithAvailableMoves.length)
          ]
        );
      else {
        alert("Komputer przegrał z powodu braku dostępnych ruchów.");
      }
    },

    movePawnIntoRandomDirection(pawn) {
      const availableDirections = this.getAvailableDirectionsForPawn(pawn);
      const randomizedDirection =
        availableDirections[
          Math.floor(Math.random() * availableDirections.length)
        ];

      const rowIndex = randomizedDirection.rowIndex;
      const columnIndex = randomizedDirection.columnIndex;

      let newRow = this.board.values[rowIndex].slice(0);

      pawn.lastPosition = pawn.currentPosition;
      pawn.currentPosition = {
        rowIndex: rowIndex,
        columnIndex: columnIndex,
      };
      newRow[columnIndex] = pawn;
      this.$set(this.board.values, rowIndex, newRow);

      let oldRow = this.board.values[pawn.lastPosition.rowIndex].slice(0);
      oldRow[pawn.lastPosition.columnIndex] = this.getEmptyBoardField();
      this.$set(this.board.values, pawn.lastPosition.rowIndex, oldRow);
      if (
        this.hasPlayerScored(rowIndex, columnIndex, newRow[columnIndex].player)
      ) {
        this.removeRandomEnemyPawn(newRow[columnIndex].player);
        this.tura = !this.tura;
        this.moveCounter++;
        return;
      }

      this.tura = !this.tura;
      this.moveCounter++;
    },

    removeRandomEnemyPawn(player) {
      const enemyPawns = this.getEnemyPawns(player);
      const pawnToRemove =
        enemyPawns[Math.floor(Math.random() * enemyPawns.length)];
      this.removePawnById(pawnToRemove.pawnIndex);
      this.clearBoardField(
        pawnToRemove.currentPosition.rowIndex,
        pawnToRemove.currentPosition.columnIndex
      );
      this.didPlayerWin(player);
    },

    getMovablePawn(pawns) {
      let availablePawns = [];
      for (let i = 0; i < pawns.length; i++) {
        if (this.getAvailableDirectionsForPawn(pawns[i]).length)
          availablePawns.push(pawns[i]);
      }
      return availablePawns;
    },

    getAvailableDirectionsForPawn(pawn) {
      let availableDirections = [];
      if (
        this.isUpperFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex - 1,
          columnIndex: pawn.currentPosition.columnIndex,
        });
      else if (
        this.isLowerFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex + 1,
          columnIndex: pawn.currentPosition.columnIndex,
        });
      else if (
        this.isLeftFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex,
          columnIndex: pawn.currentPosition.columnIndex - 1,
        });
      else if (
        this.isRightFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex,
          columnIndex: pawn.currentPosition.columnIndex + 1,
        });

      return availableDirections;
    },

    highlightEnemyPawns(player) {
      const enemyPawns = this.getEnemyPawns(player);
      let element;
      for (let i = 0; i < enemyPawns.length; i++) {
        element = document.getElementById(
          `${enemyPawns[i].currentPosition.rowIndex}${enemyPawns[i].currentPosition.columnIndex}`
        );
        element.classList.add("yellowgreen");
      }
    },

    removeHighlightFromEnemyPawns(player) {
      const enemyPawns = this.getEnemyPawns(player);
      let element;
      for (let i = 0; i < enemyPawns.length; i++) {
        element = document.getElementById(
          `${enemyPawns[i].currentPosition.rowIndex}${enemyPawns[i].currentPosition.columnIndex}`
        );
        element.classList.remove("yellowgreen");
      }
    },

    removeEnemyPawn(rowIndex, columnIndex) {
      const targetedPawn = this.board.values[rowIndex][columnIndex];
      if (targetedPawn.player === this.removeStagePlayer) return;

      this.removeHighlightFromEnemyPawns(this.removeStagePlayer);
      this.removePawnById(targetedPawn.pawnIndex);
      this.clearBoardField(rowIndex, columnIndex);
      this.didPlayerWin(this.removeStagePlayer);
      const currentPlayer = this.removeStagePlayer;
      this.removeStagePlayer = null;
      this.tura = !this.tura;
      this.moveCounter++;
      this.movePawnByAI(currentPlayer);
    },

    didPlayerWin(player) {
      const enemyPawns = this.getEnemyPawns(player);
      if (enemyPawns.length > 2) return;
      alert(`Gratulacje, wygrał gracz: ${player}`);
    },

    clearBoardField(rowIndex, columnIndex) {
      this.board.values[rowIndex][columnIndex] = this.getEmptyBoardField();
    },

    getEmptyBoardField() {
      return {
        player: null,
        pawnIndex: null,
        currentPosition: null,
        lastPosition: null,
      };
    },

    removePawnById(id) {
      this.pawns = this.pawns.filter((item) => item.pawnIndex != id);
    },

    getPawnById(id) {
      return this.pawns.find((item) => item.pawnIndex === id);
    },

    getEnemyPawns(player) {
      return this.pawns.filter((item) => {
        if (item.player != player) return item;
      });
    },

    hasPlayerScored(rowIndex, columnIndex, player) {
      if (
        this.checkRowsForPoint(rowIndex, columnIndex, player) ||
        this.checkColumnsForPoint(rowIndex, columnIndex, player)
      )
        return true;
    },

    checkRowsForPoint(rowIndex, columnIndex, player) {
      if (rowIndex === 0)
        return this.checkLowerRows(rowIndex, columnIndex, player);

      if (rowIndex === this.rowsNumber - 1)
        return this.checkUpperRows(rowIndex, columnIndex, player);

      return this.checkAroundRow(rowIndex, columnIndex, player);
    },

    checkAroundRow(rowIndex, columnIndex, player) {
      let under = this.isThisPlayerField(rowIndex + 1, columnIndex, player);
      let over = this.isThisPlayerField(rowIndex - 1, columnIndex, player);

      //Czy otaczające należą do gracza?
      if (under && over) {
        under = this.isThisPlayerField(rowIndex + 2, columnIndex, player);
        over = this.isThisPlayerField(rowIndex - 2, columnIndex, player);

        //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
        if (under || over) return false;
        return true;
      }
      if (under) return this.checkLowerRows(rowIndex, columnIndex, player);
      return this.checkUpperRows(rowIndex, columnIndex, player);
    },

    checkLowerRows(rowIndex, columnIndex, player) {
      const firstNext = this.isThisPlayerField(
        rowIndex + 1,
        columnIndex,
        player
      );
      const secondNext = this.isThisPlayerField(
        rowIndex + 2,
        columnIndex,
        player
      );
      const thirdNext = this.isThisPlayerField(
        rowIndex + 3,
        columnIndex,
        player
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkUpperRows(rowIndex, columnIndex, player) {
      const firstNext = this.isThisPlayerField(
        rowIndex - 1,
        columnIndex,
        player
      );
      const secondNext = this.isThisPlayerField(
        rowIndex - 2,
        columnIndex,
        player
      );
      const thirdNext = this.isThisPlayerField(
        rowIndex - 3,
        columnIndex,
        player
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkColumnsForPoint(rowIndex, columnIndex, player) {
      if (columnIndex === 1)
        return this.checkRightColumns(rowIndex, columnIndex, player);

      if (columnIndex === this.columnsNumber - 1)
        return this.checkLeftColumns(rowIndex, columnIndex, player);

      return this.checkAroundColumn(rowIndex, columnIndex, player);
    },

    checkAroundColumn(rowIndex, columnIndex, player) {
      let right = this.isThisPlayerField(rowIndex, columnIndex + 1, player);
      let left = this.isThisPlayerField(rowIndex, columnIndex - 1, player);

      //Czy otaczające należą do gracza?
      if (right && left) {
        right = this.isThisPlayerField(rowIndex, columnIndex + 2, player);
        left = this.isThisPlayerField(rowIndex, columnIndex - 2, player);

        //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
        if (right || left) return false;
        return true;
      }
      if (right) return this.checkRightColumns(rowIndex, columnIndex, player);
      return this.checkLeftColumns(rowIndex, columnIndex, player);
    },

    checkRightColumns(rowIndex, columnIndex, player) {
      const firstNext = this.isThisPlayerField(
        rowIndex,
        columnIndex + 1,
        player
      );
      const secondNext = this.isThisPlayerField(
        rowIndex,
        columnIndex + 2,
        player
      );
      const thirdNext = this.isThisPlayerField(
        rowIndex,
        columnIndex + 3,
        player
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkLeftColumns(rowIndex, columnIndex, player) {
      const firstNext = this.isThisPlayerField(
        rowIndex,
        columnIndex - 1,
        player
      );
      const secondNext = this.isThisPlayerField(
        rowIndex,
        columnIndex - 2,
        player
      );
      const thirdNext = this.isThisPlayerField(
        rowIndex,
        columnIndex - 3,
        player
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    isThisPlayerField(rowIndex, columnIndex, player) {
      if (
        rowIndex >= this.rowsNumber ||
        rowIndex < 0 ||
        columnIndex >= this.columnsNumber ||
        columnIndex < 0
      ) {
        return;
      }

      return this.board.values[rowIndex][columnIndex].player === player;
    },
  },
  beforeMount() {
    this.board.values = Array(8)
      .fill(null)
      .map(() =>
        Array(8).fill({
          player: null,
          pawnIndex: null,
          currentPosition: null,
          lastPosition: null,
        })
      );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.game-board {
  width: 770px;
  height: 650px;

  display: flex;
  flex-wrap: wrap-reverse;

  margin: 20px;
  border: 25px solid #333;
  margin-left: auto;
  margin-right: auto;
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
