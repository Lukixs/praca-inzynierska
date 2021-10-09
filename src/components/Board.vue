<template>
  <div class="hello">
    Webowa Aplikacja do gry Dara
    <div class="board">
      <div v-for="rowIndex in board.rowsNumber" :key="rowIndex">
        <div
          v-for="columnIndex in board.columnsNumber"
          :key="columnIndex"
          @click="cellOnClick(rowIndex, columnIndex)"
        >
          <div
            :id="rowIndex * 10 + columnIndex"
            :class="[(rowIndex + columnIndex) % 2 === 0 ? 'white' : 'black']"
          >
            <div
              v-if="
                board.values[rowIndex - 1][columnIndex - 1].player == 'white'
              "
            >
              &#9920;
            </div>
            <div
              v-if="
                board.values[rowIndex - 1][columnIndex - 1].player == 'black'
              "
            >
              &#9922;
            </div>
          </div>
        </div>
      </div>
    </div>
    <span>Tura {{ moveCounter }} |</span>
    <span v-if="tura">
      Ruch Białych
    </span>
    <span v-else>Ruch Czarnych</span>
  </div>
</template>

<script>
export default {
  // name: 'Board',
  props: {
    msg: String,
  },
  data: function() {
    return {
      tura: true,
      removeStagePlayer: null,
      moveCounter: 1,
      firstStageMovesLimit: 8,
      focused: null, // {rowIndex, columnIndex}   Aktualnie wybrany pionek
      board: {
        columnsNumber: 6,
        rowsNumber: 5,
        values: null, // { player: 'black', pawnIndex: '0' }
        // rows: Array(8).fill(null),
      },
      pawns: [], // { player: 'black', currentPosition: {rowIndex: 4, columnIndex: 4}, lastPosition:{rowIndex: 4, columnIndex: 3} }
      history: [], // HistoryItem{tour: 1, pawnIndexMoved: w4, from: {rowIndex: 4, columnIndex:5}, to: {rowIndex: 3, columnIndex:5}, scored: {rowIndex: 2, columnIndex:2, player: 'white', pawnIndex: w4 } }
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
      const isEmpty = this.isGivenFieldEmpty(rowIndex - 1, columnIndex - 1);
      if (isEmpty) this.placePawn(rowIndex, columnIndex);
    },

    pawnsMovingStageController(rowIndex, columnIndex) {
      const isEmpty = this.isGivenFieldEmpty(rowIndex - 1, columnIndex - 1);
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
      if (!this.isGivenFieldEmpty(rowIndex - 1, columnIndex - 1)) return;

      const newPawn = this.createNewPawn(rowIndex - 1, columnIndex - 1);

      this.addPawnToGame(newPawn, rowIndex, columnIndex);

      this.tura = !this.tura;
      this.moveCounter++;
    },

    addPawnToGame(pawn, rowIndex, columnIndex) {
      this.addPawnToList(pawn);
      this.addPawnToBoard(pawn, rowIndex, columnIndex);
    },

    addPawnToList(pawn) {
      this.pawns.push(pawn);
    },

    addPawnToBoard(pawn, rowIndex, columnIndex) {
      const newRow = this.board.values[rowIndex - 1].slice(0);
      newRow[columnIndex - 1] = pawn;
      this.$set(this.board.values, rowIndex - 1, newRow);
    },

    createNewPawn(rowIndex, columnIndex) {
      if (this.tura == true)
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

    selectPawn(rowIndex, columnIndex) {
      // const element = document.getElementById(rowIndex*10+columnIndex)
      // element.classList.add("yellowgreen")
      // console.log(rowIndex, columnIndex);
      // console.log(element.children[0].textContent);
      if (
        this.board.values[rowIndex - 1][columnIndex - 1].player == "white" &&
        this.tura % 2 == 1
      ) {
        this.drawAvailableMoves(rowIndex, columnIndex);
        // const element = document.getElementById(rowIndex*10+columnIndex)
        // element.classList.add("yellowgreen")
        this.focused = { rowIndex: rowIndex, columnIndex: columnIndex };
        // console.log(this.focused);
      } else if (
        this.board.values[rowIndex - 1][columnIndex - 1].player == "black" &&
        this.tura % 2 == 0
      ) {
        this.drawAvailableMoves(rowIndex, columnIndex);
        // const element = document.getElementById(rowIndex*10+columnIndex)
        // element.classList.add("yellowgreen")
        this.focused = { rowIndex: rowIndex, columnIndex: columnIndex };
        // console.log(this.focused);
      }
    },

    reSelectPawn(rowIndex, columnIndex) {
      if (
        rowIndex != this.focused.rowIndex ||
        columnIndex != this.focused.columnIndex
      ) {
        if (
          this.board.values[rowIndex - 1][columnIndex - 1].player == "white" &&
          this.tura % 2 == 1
        ) {
          this.removeAvailableMoves(
            this.focused.rowIndex,
            this.focused.columnIndex
          );
          this.drawAvailableMoves(rowIndex, columnIndex);
          this.focused = { rowIndex, columnIndex };
          // console.log(this.focused);
        } else if (
          this.board.values[rowIndex - 1][columnIndex - 1].player == "black" &&
          this.tura % 2 == 0
        ) {
          this.removeAvailableMoves(
            this.focused.rowIndex,
            this.focused.columnIndex
          );
          this.drawAvailableMoves(rowIndex, columnIndex);
          this.focused = { rowIndex, columnIndex };
          // console.log(this.focused);
        }
      }
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
      const element = document.getElementById(rowIndex * 10 + columnIndex);
      element.classList.add("darkgreen");
      const movingPawn = this.getPawnFromBoard(rowIndex - 1, columnIndex - 1);

      if (
        this.isUpperFieldSuitableToMove(
          rowIndex - 1,
          columnIndex - 1,
          movingPawn
        )
      ) {
        const element = document.getElementById(
          (rowIndex - 1) * 10 + columnIndex
        );
        element.classList.add("yellowgreen");
      }
      if (
        this.isLowerFieldSuitableToMove(
          rowIndex - 1,
          columnIndex - 1,
          movingPawn
        )
      ) {
        const element = document.getElementById(
          (rowIndex + 1) * 10 + columnIndex
        );
        element.classList.add("yellowgreen");
      }
      if (
        this.isLeftFieldSuitableToMove(
          rowIndex - 1,
          columnIndex - 1,
          movingPawn
        )
      ) {
        const element = document.getElementById(
          rowIndex * 10 + (columnIndex - 1)
        );
        element.classList.add("yellowgreen");
      }
      if (
        this.isRightFieldSuitableToMove(
          rowIndex - 1,
          columnIndex - 1,
          movingPawn
        )
      ) {
        const element = document.getElementById(
          rowIndex * 10 + (columnIndex + 1)
        );
        element.classList.add("yellowgreen");
      }
    },

    removeAvailableMoves(rowIndex, columnIndex) {
      const element = document.getElementById(rowIndex * 10 + columnIndex);
      element.classList.remove("darkgreen");

      if (rowIndex - 1 >= 1) {
        const element = document.getElementById(
          (rowIndex - 1) * 10 + columnIndex
        );
        element.classList.remove("yellowgreen");
      }
      if (rowIndex + 1 <= this.board.rowsNumber) {
        const element = document.getElementById(
          (rowIndex + 1) * 10 + columnIndex
        );
        element.classList.remove("yellowgreen");
      }
      if (columnIndex - 1 >= 1) {
        const element = document.getElementById(
          rowIndex * 10 + (columnIndex - 1)
        );
        element.classList.remove("yellowgreen");
      }
      if (columnIndex + 1 <= this.board.columnsNumber) {
        const element = document.getElementById(
          rowIndex * 10 + (columnIndex + 1)
        );
        element.classList.remove("yellowgreen");
      }
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

      let newRow = this.board.values[rowIndex - 1].slice(0);
      const boardPawn = this.board.values[this.focused.rowIndex - 1][
        this.focused.columnIndex - 1
      ];

      // Check if given field hasn't been last position of given pawn, is so end function
      const pawn = this.getPawnById(boardPawn.pawnIndex);
      if (
        pawn.lastPosition &&
        pawn.lastPosition.columnIndex == columnIndex - 1 &&
        pawn.lastPosition.rowIndex == rowIndex - 1
      ) {
        return;
      }

      pawn.lastPosition = pawn.currentPosition;
      pawn.currentPosition = {
        rowIndex: rowIndex - 1,
        columnIndex: columnIndex - 1,
      };

      newRow[columnIndex - 1] = pawn;
      this.$set(this.board.values, rowIndex - 1, newRow);

      let oldRow = this.board.values[this.focused.rowIndex - 1].slice(0);
      oldRow[this.focused.columnIndex - 1] = this.getEmptyBoardField();
      this.$set(this.board.values, this.focused.rowIndex - 1, oldRow);

      this.removeAvailableMoves(
        this.focused.rowIndex,
        this.focused.columnIndex
      );
      this.focused = null;

      if (
        this.hasPlayerScored(
          rowIndex,
          columnIndex,
          newRow[columnIndex - 1].player
        )
      ) {
        this.highlightEnemyPawns(pawn.player);
        this.removeStagePlayer = pawn.player;
        return;
      }

      this.tura = !this.tura;
      this.moveCounter++;
    },

    highlightEnemyPawns(player) {
      const enemyPawns = this.getEnemyPawns(player);
      let element;
      for (let i = 0; i < enemyPawns.length; i++) {
        element = document.getElementById(
          (enemyPawns[i].currentPosition.rowIndex + 1) * 10 +
            enemyPawns[i].currentPosition.columnIndex +
            1
        );
        element.classList.add("yellowgreen");
      }
    },

    removeHighlightFromEnemyPawns(player) {
      const enemyPawns = this.getEnemyPawns(player);
      let element;
      for (let i = 0; i < enemyPawns.length; i++) {
        element = document.getElementById(
          (enemyPawns[i].currentPosition.rowIndex + 1) * 10 +
            enemyPawns[i].currentPosition.columnIndex +
            1
        );
        element.classList.remove("yellowgreen");
      }
    },

    removeEnemyPawn(rowIndex, columnIndex) {
      const targetedPawn = this.board.values[rowIndex - 1][columnIndex - 1];
      if (targetedPawn.player === this.removeStagePlayer) return;

      this.removeHighlightFromEnemyPawns(this.removeStagePlayer);
      this.removePawnById(targetedPawn.pawnIndex);
      this.clearBoardField(rowIndex - 1, columnIndex - 1);
      this.didPlayerWin(this.removeStagePlayer);
      this.removeStagePlayer = null;
      this.tura = !this.tura;
      this.moveCounter++;
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
      if (rowIndex === 1)
        return this.checkLowerRows(rowIndex, columnIndex, player);

      if (rowIndex === this.rowsNumber)
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

      if (columnIndex === this.columnsNumber)
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
        rowIndex > this.rowsNumber ||
        rowIndex < 1 ||
        columnIndex > this.columnsNumber ||
        columnIndex < 1
      ) {
        return;
      }

      return this.board.values[rowIndex - 1][columnIndex - 1].player === player;
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
.board {
  width: 720px;
  height: 600px;
  margin: 20px;
  border: 25px solid #333;
  margin-left: auto;
  margin-right: auto;
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
