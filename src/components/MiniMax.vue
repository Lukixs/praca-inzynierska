<template>
  <div class="hello">
    Webowa Aplikacja do gry Dara
    <div class="board">
      <div v-for="(e, rowIndex) in board.rowsNumber" :key="e" class="row">
        <div
          v-for="(f, columnIndex) in board.columnsNumber"
          :key="f"
          @click="cellOnClick(rowIndex, columnIndex)"
        >
          <div
            :id="`${rowIndex}${columnIndex}`"
            :class="[(rowIndex + columnIndex) % 2 === 0 ? 'white' : 'black']"
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
  // name: 'Board',
  props: {
    msg: String
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
        values: null // { player: 'black', pawnIndex: '0' }
        // rows: Array(8).fill(null),
      },
      pawns: [], // { player: 'black', currentPosition: {rowIndex: 4, columnIndex: 4}, lastPosition:{rowIndex: 4, columnIndex: 3} }
      history: [] // HistoryItem{tour: 1, pawnIndexMoved: w4, from: {rowIndex: 4, columnIndex:5}, to: {rowIndex: 3, columnIndex:5}, scored: {rowIndex: 2, columnIndex:2, player: 'white', pawnIndex: w4 } }
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
          columnIndex: columnIndex
        },
        lastPosition: null
      };
    },

    createBlackPawn(rowIndex, columnIndex, moveCounter) {
      return {
        player: "black",
        pawnIndex: moveCounter,
        currentPosition: {
          rowIndex: rowIndex,
          columnIndex: columnIndex
        },
        lastPosition: null
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
              columnIndex: j
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
      const targetedField = { rowIndex, columnIndex };
      const focused = this.focused;
      if (!this.isMoveWithinReachForPawn(targetedField, focused)) return;

      let pawn = this.getPawnFromBoard(focused.rowIndex, focused.columnIndex);

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
        columnIndex: columnIndex
      };
      this.addPawnToGame(pawn, rowIndex, columnIndex);

      this.emptyGivenField(focused.rowIndex, focused.columnIndex);

      this.removeAvailableMoves(focused.rowIndex, focused.columnIndex);
      this.emptyFocused();

      if (this.hasPlayerScored(rowIndex, columnIndex, pawn.player)) {
        this.highlightEnemyPawns(pawn.player);
        this.removeStagePlayer = pawn.player;
        return;
      }

      this.tura = !this.tura;
      this.moveCounter++;
      const board = this.board.values;
      console.log("wywoluje movePawn z board:", board);
      const currentPlayer = pawn.player;
      this.movePawnByAI(currentPlayer, board);
    },

    emptyGivenField(rowIndex, columnIndex) {
      let oldRow = this.board.values[rowIndex].slice(0);
      oldRow[columnIndex] = this.getEmptyBoardField();
      this.$set(this.board.values, rowIndex, oldRow);
    },

    emptyFocused() {
      this.focused = null;
    },

    MINIMUM() {
      return -10000;
    },

    MAXIMUM() {
      return 10000;
    },

    minimax(node, depth, maximizingPlayer) {
      // console.log({ minimaxExecution: { node, depth, maximizingPlayer } });
      if (depth == 0 || this.isTerminalNode(node, maximizingPlayer)) {
        const evaluation = this.evaluateBoardState(node);
        console.log("terminalNode", evaluation);
        return [evaluation, node.to];
      }

      if (maximizingPlayer == "white") {
        let best_move = null;
        let boardState = null;
        let value = this.MINIMUM();

        const pawns = this.getEnemyPawns("black");
        // const pawns = this.getEnemyPawns("white");
        const pawnsWithMoves = this.getMovablePawnWithAvailableDirections(
          pawns
        );
        console.log({ pawnsWithMoves: pawnsWithMoves });
        pawnsWithMoves.forEach((item) => {
          item.directions.forEach((direction) => {
            boardState = node.boardState;
            boardState[direction.rowIndex][direction.columnIndex] =
              boardState[item.pawn.currentPosition.rowIndex][
                item.pawn.currentPosition.columnIndex
              ];
            boardState[item.pawn.currentPosition.rowIndex][
              item.pawn.currentPosition.columnIndex
            ] = this.getEmptyBoardField();
            const newBoardState = JSON.parse(JSON.stringify(boardState));
            const newNode = {
              movedPawn: {
                pawn: item.pawn,
                from: item.pawn.currentPosition,
                to: direction
              },
              boardState: newBoardState
            };
            // console.log("minimaxEval", this.minimax(newNode, depth - 1, false));
            const evaluation = this.minimax(newNode, depth - 1, "black")[0];
            value = Math.min(value, evaluation);
            if (value == evaluation) {
              best_move = { pawn: item.pawn, direction };
            }
          });
        });
        // console.log({ proba_zwrotu: [value, best_move] });
        // console.log([value, best_move], { depth: depth });
        return [value - 1, best_move];
      }

      // node = {
      //   movedPawn = {
      //     pawn: pawn
      //     from:{
      //       rowIndex,
      //       columnIndex
      //     },
      //     to:{
      //       rowIndex,
      //       columnIndex
      //     }
      //   },
      //   boardState:{value[][]:{pawn}}
      // }
      else {
        let value = this.MAXIMUM();
        const pawns = this.getEnemyPawns("white");
        const pawnsWithMoves = this.getMovablePawnWithAvailableDirections(
          pawns
        );

        let best_move = null;
        pawnsWithMoves.forEach((item) => {
          item.directions.forEach((direction) => {
            let boardState = node.boardState;
            boardState[direction.rowIndex][direction.columnIndex] =
              boardState[item.pawn.currentPosition.rowIndex][
                item.pawn.currentPosition.columnIndex
              ];
            boardState[item.pawn.currentPosition.rowIndex][
              item.pawn.currentPosition.columnIndex
            ] = this.getEmptyBoardField();

            const newBoardState = JSON.parse(JSON.stringify(boardState));
            const newNode = {
              movedPawn: {
                pawn: item.pawn,
                from: item.pawn.currentPosition,
                to: direction
              },
              boardState: newBoardState
            };
            // console.log(this.minimax(newNode, depth - 1, true));
            const evaluation = this.minimax(newNode, depth - 1, "white")[0];
            value = Math.min(value, evaluation);
            if (value == evaluation) best_move = { pawn: item.pawn, direction };
          });
        });

        return [value - 1, best_move];
      }
    },

    evaluateBoardState(node) {
      // console.log("evaluateBoardState", node);
      const boardState = node.boardState;
      const movedPawn = node.movedPawn;
      // console.log({ boardState: boardState, movedPawn: movedPawn });
      if (boardState && movedPawn) {
        let hasPlayerScored = this.hasPlayerScoredAI(movedPawn, boardState);
        if (hasPlayerScored) {
          // console.log({ hasScored: movedPawn.pawn.pawn.player });
          if (movedPawn.pawn.pawn.player === "white") return 100;
          else return -100;
        }
      }
      return 0;
    },

    isTerminalNode(node) {
      const boardState = node.boardState;
      const movedPawn = node.movedPawn;
      if (boardState && movedPawn) {
        return this.hasPlayerScoredAI(movedPawn, boardState);
      }
    },

    isMoveWithinReachForPawn(targetedField, focusedField) {
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
    },

    isGreaterOrLowerByOne(aroundValue, coreValue) {
      if ([coreValue + 1, coreValue - 1].includes(aroundValue)) return true;
    },

    getBoardStateWithPawns(board, pawns) {
      const boardState = board.map((row) => {
        return row.map((item) => {
          if (item.pawnIndex) return this.getPawnById(item.pawnIndex, pawns);
          return null;
        });
      });
      return boardState;
    },

    movePawnByAI(enemy, board) {
      // const boardSt = board;
      // console.log(enemy);
      const currentPlayer = enemy == "white" ? enemy : "black";
      const boardState = this.getBoardStateWithPawns(board, this.pawns);
      // const values = JSON.parse(JSON.stringify(board));
      console.log("oldBoardState", this.board.values);
      console.log("newBoardState", boardState);
      const miniMaxResult = this.minimax(
        { boardState: boardState },
        3,
        currentPlayer
      )[1];
      console.log({ miniMaxResult: miniMaxResult.direction });
      // Wykoanie ruchu według miniMaxa
      let newRow = this.board.values[miniMaxResult.direction.rowIndex].slice(0);
      let pawn = miniMaxResult.pawn.pawn;
      pawn.lastPosition = pawn.currentPosition;
      pawn.currentPosition = miniMaxResult.direction;
      newRow[miniMaxResult.direction.columnIndex] = pawn;
      this.$set(this.board.values, miniMaxResult.direction.rowIndex, newRow);

      let oldRow = this.board.values[pawn.lastPosition.rowIndex].slice(0);
      oldRow[pawn.lastPosition.columnIndex] = this.getEmptyBoardField();
      this.$set(this.board.values, pawn.lastPosition.rowIndex, oldRow);

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
    },

    // movePawnIntoRandomDirection(pawn) {
    //   const availableDirections = this.getAvailableDirectionsForPawn(pawn);
    //   const randomizedDirection =
    //     availableDirections[
    //       Math.floor(Math.random() * availableDirections.length)
    //     ];

    //   const rowIndex = randomizedDirection.rowIndex;
    //   const columnIndex = randomizedDirection.columnIndex;

    //   let newRow = this.board.values[rowIndex].slice(0);

    //   pawn.lastPosition = pawn.currentPosition;
    //   pawn.currentPosition = {
    //     rowIndex: rowIndex,
    //     columnIndex: columnIndex
    //   };
    //   newRow[columnIndex] = pawn;
    //   this.$set(this.board.values, rowIndex, newRow);

    //   let oldRow = this.board.values[pawn.lastPosition.rowIndex].slice(0);
    //   oldRow[pawn.lastPosition.columnIndex] = this.getEmptyBoardField();
    //   this.$set(this.board.values, pawn.lastPosition.rowIndex, oldRow);
    //   if (
    //     this.hasPlayerScored(rowIndex, columnIndex, newRow[columnIndex].player)
    //   ) {
    //     this.removeRandomEnemyPawn(newRow[columnIndex].player);
    //     this.tura = !this.tura;
    //     this.moveCounter++;
    //     return;
    //   }

    //   this.tura = !this.tura;
    //   this.moveCounter++;
    // },

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

    getMovablePawnWithAvailableDirections(pawns) {
      let availablePawns = [];
      for (let i = 0; i < pawns.length; i++) {
        const directions = this.getAvailableDirectionsForPawn(pawns[i]);
        if (directions.length)
          availablePawns.push({ pawn: pawns[i], directions: directions });
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
          columnIndex: pawn.currentPosition.columnIndex
        });
      if (
        this.isLowerFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex + 1,
          columnIndex: pawn.currentPosition.columnIndex
        });
      if (
        this.isLeftFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex,
          columnIndex: pawn.currentPosition.columnIndex - 1
        });
      if (
        this.isRightFieldSuitableToMove(
          pawn.currentPosition.rowIndex,
          pawn.currentPosition.columnIndex,
          pawn
        )
      )
        availableDirections.push({
          rowIndex: pawn.currentPosition.rowIndex,
          columnIndex: pawn.currentPosition.columnIndex + 1
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
      const board = this.board.values;
      console.log("wywoluje movePawn z board:", board);
      this.movePawnByAI(currentPlayer, board);
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
        lastPosition: null
      };
    },

    removePawnById(id) {
      this.pawns = this.pawns.filter((item) => item.pawnIndex != id);
    },

    getPawnById(id, pawns) {
      return pawns.find((item) => item.pawnIndex === id);
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

    hasPlayerScoredAI(movedPawn, boardState) {
      // console.log("hasPlayerScored", boardState);
      if (
        this.checkRowsForPointAI(movedPawn, boardState) ||
        this.checkColumnsForPointAI(movedPawn, boardState)
      ) {
        console.log("mamy punkt", movedPawn, boardState);
        return true;
      }
      return false;
    },

    checkRowsForPointAI(movedPawn, boardState) {
      // console.log("Sprawdzamy wiersze ", {
      //   movedPawn: movedPawn,
      //   boardState: boardState
      // });
      const rowIndex = movedPawn.to.rowIndex;
      const columnIndex = movedPawn.to.rowIndex;
      const player = movedPawn.pawn.player;
      if (rowIndex === 0)
        return this.checkUpperRows(rowIndex, columnIndex, player, boardState);

      if (rowIndex === this.rowsNumber - 1)
        return this.checkLowerRows(rowIndex, columnIndex, player, boardState);

      return this.checkAroundRow(rowIndex, columnIndex, player, boardState);
    },

    checkAroundRowAI(rowIndex, columnIndex, currentPlayer, boardState) {
      let under = this.isThisPlayerFieldAI(
        rowIndex - 1,
        columnIndex,
        currentPlayer,
        boardState
      );
      let over = this.isThisPlayerFieldAI(
        rowIndex + 1,
        columnIndex,
        currentPlayer,
        boardState
      );

      //Czy otaczające należą do gracza?
      if (under && over) {
        under = this.isThisPlayerFieldAI(
          rowIndex - 2,
          columnIndex,
          currentPlayer,
          boardState
        );
        over = this.isThisPlayerFieldAI(
          rowIndex + 2,
          columnIndex,
          currentPlayer,
          boardState
        );

        //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
        if (under || over) return false;
        return true;
      }
      if (under)
        return this.checkLowerRowsAI(
          rowIndex,
          columnIndex,
          currentPlayer,
          boardState
        );
      return this.checkUpperRowsAI(
        rowIndex,
        columnIndex,
        currentPlayer,
        boardState
      );
    },

    checkLowerRowsAI(rowIndex, columnIndex, currentPlayer, boardState) {
      const firstNext = this.isThisPlayerFieldAI(
        rowIndex - 1,
        columnIndex,
        currentPlayer,
        boardState
      );
      const secondNext = this.isThisPlayerFieldAI(
        rowIndex - 2,
        columnIndex,
        currentPlayer,
        boardState
      );
      const thirdNext = this.isThisPlayerFieldAI(
        rowIndex - 3,
        columnIndex,
        currentPlayer,
        boardState
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkUpperRowsAI(rowIndex, columnIndex, currentPlayer, boardState) {
      const firstNext = this.isThisPlayerFieldAI(
        rowIndex + 1,
        columnIndex,
        currentPlayer,
        boardState
      );
      const secondNext = this.isThisPlayerFieldAI(
        rowIndex + 2,
        columnIndex,
        currentPlayer,
        boardState
      );
      const thirdNext = this.isThisPlayerFieldAI(
        rowIndex + 3,
        columnIndex,
        currentPlayer,
        boardState
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkColumnsForPointAI(movedPawn, boardState) {
      const columnIndex = movedPawn.to.rowIndex;
      const rowIndex = movedPawn.to.rowIndex;
      const player = movedPawn.pawn.player;
      if (columnIndex === 0)
        return this.checkRightColumnsAI(
          rowIndex,
          columnIndex,
          player,
          boardState
        );

      if (columnIndex === this.columnsNumber - 1)
        return this.checkLeftColumnsAI(
          rowIndex,
          columnIndex,
          player,
          boardState
        );

      return this.checkAroundColumnAI(
        rowIndex,
        columnIndex,
        player,
        boardState
      );
    },

    checkAroundColumnAI(rowIndex, columnIndex, currentPlayer, boardState) {
      let right = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex + 1,
        currentPlayer,
        boardState
      );
      let left = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex - 1,
        currentPlayer,
        boardState
      );

      //Czy otaczające należą do gracza?
      if (right && left) {
        // Out Of bounds Error
        right = this.isThisPlayerFieldAI(
          rowIndex,
          columnIndex + 2,
          currentPlayer,
          boardState
        );
        left = this.isThisPlayerFieldAI(
          rowIndex,
          columnIndex - 2,
          currentPlayer,
          boardState
        );

        //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
        if (right || left) return false;
        return true;
      }
      if (right)
        return this.checkRightColumns(rowIndex, columnIndex, currentPlayer);
      return this.checkLeftColumns(rowIndex, columnIndex, currentPlayer);
    },

    checkRightColumnsAI(rowIndex, columnIndex, currentPlayer, boardState) {
      const firstNext = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex + 1,
        currentPlayer,
        boardState
      );
      const secondNext = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex + 2,
        currentPlayer,
        boardState
      );
      const thirdNext = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex + 3,
        currentPlayer,
        boardState
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkLeftColumnsAI(rowIndex, columnIndex, currentPlayer, boardState) {
      const firstNext = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex - 1,
        currentPlayer,
        boardState
      );
      const secondNext = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex - 2,
        currentPlayer,
        boardState
      );
      const thirdNext = this.isThisPlayerFieldAI(
        rowIndex,
        columnIndex - 3,
        currentPlayer,
        boardState
      );
      if (firstNext && secondNext && !thirdNext) return true;
    },

    checkRowsForPoint(rowIndex, columnIndex, player) {
      if (rowIndex === 0)
        return this.checkLowerRows(rowIndex, columnIndex, player);

      if (rowIndex === this.rowsNumber - 1)
        return this.checkUpperRows(rowIndex, columnIndex, player);

      return this.checkAroundRow(rowIndex, columnIndex, player);
    },
    checkAroundRow(rowIndex, columnIndex, player) {
      let under = this.isThisPlayerField(rowIndex - 1, columnIndex, player);
      let over = this.isThisPlayerField(rowIndex + 1, columnIndex, player);

      //Czy otaczające należą do gracza?
      if (under && over) {
        under = this.isThisPlayerField(rowIndex - 2, columnIndex, player);
        over = this.isThisPlayerField(rowIndex + 2, columnIndex, player);

        //Czy następne pola należą do gracza? (Zasada o mniej niż 4 w rzędzie)
        if (under || over) return false;
        return true;
      }
      if (under) return this.checkLowerRows(rowIndex, columnIndex, player);
      return this.checkUpperRows(rowIndex, columnIndex, player);
    },
    checkLowerRows(rowIndex, columnIndex, player) {
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
    checkUpperRows(rowIndex, columnIndex, player) {
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

    checkColumnsForPoint(rowIndex, columnIndex, player) {
      if (columnIndex === 0)
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
      if (this.isCoordinateOutOfBounds(rowIndex, columnIndex)) {
        return false;
      }
      return this.board.values[rowIndex][columnIndex].player === player;
    },
    isCoordinateOutOfBounds(rowIndex, columnIndex) {
      const rowOutOfBound = rowIndex < 0 || rowIndex >= this.board.rowsNumber;
      const columnOutOfBound =
        columnIndex < 0 || columnIndex >= this.board.columnsNumber;
      if (rowOutOfBound || columnOutOfBound) {
        return true;
      }
    },
    isThisPlayerFieldAI(rowIndex, columnIndex, player, board) {
      if (this.isCoordinateOutOfBoundsAI(rowIndex, columnIndex)) {
        return false;
      }
      return board[rowIndex][columnIndex].player === player;
    },
    isCoordinateOutOfBoundsAI(rowIndex, columnIndex) {
      const rowOutOfBound = rowIndex < 0 || rowIndex >= this.board.rowsNumber;
      const columnOutOfBound =
        columnIndex < 0 || columnIndex >= this.board.columnsNumber;
      if (rowOutOfBound || columnOutOfBound) {
        return true;
      }
    }
  },
  beforeMount() {
    this.board.values = Array(this.board.rowsNumber)
      .fill(null)
      .map(() =>
        Array(this.board.columnsNumber).fill({
          player: null,
          pawnIndex: null,
          currentPosition: null,
          lastPosition: null
        })
      );
  }
};
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
