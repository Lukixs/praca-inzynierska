var boardStats = {
  columnsNumber: 6,
  rowsNumber: 5,
};

export default {
  minimax(node, depth, maximizingPlayer) {
    // const currentNode = JSON.parse(JSON.stringify(node));
    // console.log("Jaki mamy stan boarda dla danej głębokości:", {
    //   depth,
    //   currentNode,
    // });
    // if (depth == 0 || this.isTerminalNode(node, maximizingPlayer)) {
    //   const evaluation = this.evaluateBoardState(node, maximizingPlayer);
    //   console.log("terminalNode", evaluation);
    //   return [evaluation, node.to];
    // }
    const previousPlayer = maximizingPlayer == "white" ? "black" : "white";
    if (depth == 0) {
      const evaluation = this.evaluateBoardState(node, previousPlayer);
      return {
        evaluation: evaluation,
        bestMove: { pawn: node.movedPawn, direction: node.movedPawn.to },
        pawnToRemove: null,
      };
    }

    const movedPawn = node.movedPawn;
    const boardState = node.boardState;
    if (boardState && movedPawn) {
      console.log("rozważamy zdobycie punktu");
      const playerScored = this.hasPlayerScored(
        movedPawn,
        boardState,
        maximizingPlayer
      );
      console.log("Czy punkt zdobyto?", playerScored);
      if (playerScored) {
        const terminalNode = this.isTerminalNode(
          node.boardState,
          maximizingPlayer
        );
        if (terminalNode) {
          if (maximizingPlayer == "white")
            return {
              evaluation: 1000,
              bestMove: { pawn: node.movedPawn, direction: node.movedPawn.to },
              pawnToRemove: null,
            };
          return {
            evaluation: -1000,
            bestMove: { pawn: node.movedPawn, direction: node.movedPawn.to },
            pawnToRemove: null,
          };
        }
        const result = this.findMostProfitableEnemyPawnToRemove(
          node,
          depth,
          maximizingPlayer
        );
        console.log("playerScoredTimeToRemove", [
          result.estimatedValue,
          { pawn: node.movedPawn, direction: node.movedPawn.to },
          result.pawnToRemove,
        ]);
        return {
          evaluation: result.estimatedValue,
          bestMove: { pawn: node.movedPawn, direction: node.movedPawn.to },
          pawnToRemove: result.pawnToRemove,
        };
      }
    }

    ///////
    ///////
    ///////
    ///////
    ///////
    ///////

    if (maximizingPlayer == "white") {
      let best_move = null;
      let maxEval = this.MINIMUM();

      const pawns = this.getPlayerPawnsFromBoard(
        maximizingPlayer,
        node.boardState
      );

      const pawnsWithMoves = this.getMovablePawnWithAvailableDirections(
        pawns,
        node.boardState
      );
      pawnsWithMoves.forEach((item) => {
        item.directions.forEach((direction) => {
          let newBoardState = JSON.parse(JSON.stringify(node.boardState));
          newBoardState[direction.rowIndex][direction.columnIndex] =
            newBoardState[item.pawn.currentPosition.rowIndex][
              item.pawn.currentPosition.columnIndex
            ];
          newBoardState[item.pawn.currentPosition.rowIndex][
            item.pawn.currentPosition.columnIndex
          ] = null;
          const newNode = {
            movedPawn: {
              pawn: item.pawn,
              from: item.pawn.currentPosition,
              to: direction,
            },
            boardState: newBoardState,
          };
          const evaluation = this.minimax(newNode, depth - 1, "black")
            .evaluation;
          console.log(
            "Ewaluuje dla białych",
            evaluation,
            ">",
            maxEval,
            direction
          );
          if (evaluation > maxEval) {
            maxEval = evaluation;
            best_move = { pawn: item.pawn, direction };
          }
          // MINIMUM = Math.min(MINIMUM, evaluation);
          // if (evaluation == MINIMUM) {
          // best_move = { pawn: item.pawn, direction };
          // }
        });
      });
      return {
        evaluation: maxEval,
        bestMove: best_move,
        pawnToRemove: null,
      };
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
    //   removedPawn =  pawn|null,
    //   boardState:{value[][]:{pawn}}
    // }
    else {
      let best_move = null;
      let minEval = this.MAXIMUM();

      const pawns = this.getPlayerPawnsFromBoard(
        maximizingPlayer,
        node.boardState
      );
      const pawnsWithMoves = this.getMovablePawnWithAvailableDirections(
        pawns,
        node.boardState
      );
      pawnsWithMoves.forEach((item) => {
        item.directions.forEach((direction) => {
          let newBoardState = JSON.parse(JSON.stringify(node.boardState));
          newBoardState[direction.rowIndex][direction.columnIndex] =
            newBoardState[item.pawn.currentPosition.rowIndex][
              item.pawn.currentPosition.columnIndex
            ];
          newBoardState[item.pawn.currentPosition.rowIndex][
            item.pawn.currentPosition.columnIndex
          ] = null;

          const newNode = {
            movedPawn: {
              pawn: item.pawn,
              from: item.pawn.currentPosition,
              to: direction,
            },
            boardState: newBoardState,
          };
          const evaluation = this.minimax(newNode, depth - 1, "white")
            .evaluation;
          // MAXIMUM = Math.min(MAXIMUM, evaluation);
          // if (evaluation == MAXIMUM) {
          //   best_move = { pawn: item.pawn, direction };
          // }
          console.log(
            "Ewaluuje dla czarnych",
            evaluation,
            "<",
            minEval,
            direction,
            boardState
          );
          if (evaluation < minEval) {
            minEval = evaluation;
            best_move = { pawn: item.pawn, direction };
          }
        });
      });

      // if (MAXIMUM < 5)
      return {
        evaluation: minEval,
        bestMove: best_move,
        pawnToRemove: null,
      };
    }
  },

  findMostProfitableEnemyPawnToRemove(node, depth, maximizingPlayer) {
    let pawnToRemove = null;
    let bestValue = null;
    let newNode = { boardState: null };

    let minEval = this.MAXIMUM();
    let maxEval = this.MINIMUM();

    const enemyPawns = this.getEnemyPlayerPawnsFromBoard(
      maximizingPlayer,
      node.boardState
    );

    enemyPawns.forEach((pawn) => {
      newNode.boardState = JSON.parse(JSON.stringify(node.boardState));
      const { rowId, colId } = {
        rowId: pawn.currentPosition.rowIndex,
        colId: pawn.currentPosition.columnIndex,
      };
      newNode.boardState[rowId][colId] = null;

      const evaluation = this.minimax(newNode, depth, pawn.player).evaluation;
      if (maximizingPlayer == "white") {
        if (evaluation > maxEval) {
          pawnToRemove = pawn;
          bestValue = evaluation;
        }
      } else if (evaluation < minEval) {
        pawnToRemove = pawn;
        bestValue = evaluation;
      }
    });

    if (maximizingPlayer == "white")
      return { estimatedValue: bestValue + 20, pawnToRemove };
    return { estimatedValue: bestValue - 20, pawnToRemove };
  },

  evaluateBoardState(node, maximizingPlayer) {
    const boardState = node.boardState;
    const movedPawn = node.movedPawn;
    if (boardState && movedPawn) {
      let hasPlayerScored = this.hasPlayerScored(
        movedPawn,
        boardState,
        maximizingPlayer
      );
      if (hasPlayerScored) {
        // console.log(`Player ${movedPawn.pawn.player} zescorował `, movedPawn);
        if (movedPawn.pawn.player == "white") return 20;
        return -20;
      }
    }
    return 0;
  },

  hasPlayerScored(movedPawn, boardState, maximizingPlayer) {
    if (
      this.checkRowsForPoint(movedPawn, boardState, maximizingPlayer) ||
      this.checkColumnsForPoint(movedPawn, boardState, maximizingPlayer)
    ) {
      console.log(
        "Bingo!",
        movedPawn,
        boardState,
        {
          rows: this.checkRowsForPoint(movedPawn, boardState, maximizingPlayer),
        },
        {
          columns: this.checkColumnsForPoint(
            movedPawn,
            boardState,
            maximizingPlayer
          ),
        }
      );
      return true;
    }
    return false;
  },

  isTerminalNode(boardState, maximizingPlayer) {
    const enemyPawnsAmount = this.getEnemyPlayerPawnsFromBoard(
      maximizingPlayer,
      boardState
    ).length;
    if (enemyPawnsAmount <= 3) return true;
  },

  checkRowsForPoint(movedPawn, boardState, player) {
    const rowIndex = movedPawn.to.rowIndex;
    const columnIndex = movedPawn.to.columnIndex;
    if (rowIndex === 0)
      return this.checkUpperRows(rowIndex, columnIndex, player, boardState);

    if (rowIndex === boardStats.rowsNumber - 1)
      return this.checkLowerRows(rowIndex, columnIndex, player, boardState);

    return this.checkAroundRow(rowIndex, columnIndex, player, boardState);
  },

  checkAroundRow(rowIndex, columnIndex, currentPlayer, boardState) {
    let under = this.isThisPlayerField(
      rowIndex - 1,
      columnIndex,
      currentPlayer,
      boardState
    );
    let over = this.isThisPlayerField(
      rowIndex + 1,
      columnIndex,
      currentPlayer,
      boardState
    );

    //Czy otaczające należą do gracza?
    if (under && over) {
      under = this.isThisPlayerField(
        rowIndex - 2,
        columnIndex,
        currentPlayer,
        boardState
      );
      over = this.isThisPlayerField(
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
      return this.checkLowerRows(
        rowIndex,
        columnIndex,
        currentPlayer,
        boardState
      );
    return this.checkUpperRows(
      rowIndex,
      columnIndex,
      currentPlayer,
      boardState
    );
  },

  checkLowerRows(rowIndex, columnIndex, currentPlayer, boardState) {
    const firstNext = this.isThisPlayerField(
      rowIndex - 1,
      columnIndex,
      currentPlayer,
      boardState
    );
    const secondNext = this.isThisPlayerField(
      rowIndex - 2,
      columnIndex,
      currentPlayer,
      boardState
    );
    const thirdNext = this.isThisPlayerField(
      rowIndex - 3,
      columnIndex,
      currentPlayer,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  },

  checkUpperRows(rowIndex, columnIndex, currentPlayer, boardState) {
    const firstNext = this.isThisPlayerField(
      rowIndex + 1,
      columnIndex,
      currentPlayer,
      boardState
    );
    const secondNext = this.isThisPlayerField(
      rowIndex + 2,
      columnIndex,
      currentPlayer,
      boardState
    );
    const thirdNext = this.isThisPlayerField(
      rowIndex + 3,
      columnIndex,
      currentPlayer,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  },

  checkColumnsForPoint(movedPawn, boardState, player) {
    const columnIndex = movedPawn.to.columnIndex;
    const rowIndex = movedPawn.to.rowIndex;
    if (columnIndex === 0)
      return this.checkRightColumns(rowIndex, columnIndex, player, boardState);

    if (columnIndex === boardStats.columnsNumber - 1)
      return this.checkLeftColumns(rowIndex, columnIndex, player, boardState);

    return this.checkAroundColumn(rowIndex, columnIndex, player, boardState);
  },

  checkAroundColumn(rowIndex, columnIndex, currentPlayer, boardState) {
    let right = this.isThisPlayerField(
      rowIndex,
      columnIndex + 1,
      currentPlayer,
      boardState
    );
    let left = this.isThisPlayerField(
      rowIndex,
      columnIndex - 1,
      currentPlayer,
      boardState
    );

    //Czy otaczające należą do gracza?
    if (right && left) {
      // Out Of bounds Error
      right = this.isThisPlayerField(
        rowIndex,
        columnIndex + 2,
        currentPlayer,
        boardState
      );
      left = this.isThisPlayerField(
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
      return this.checkRightColumns(
        rowIndex,
        columnIndex,
        currentPlayer,
        boardState
      );
    return this.checkLeftColumns(
      rowIndex,
      columnIndex,
      currentPlayer,
      boardState
    );
  },

  checkRightColumns(rowIndex, columnIndex, currentPlayer, boardState) {
    const firstNext = this.isThisPlayerField(
      rowIndex,
      columnIndex + 1,
      currentPlayer,
      boardState
    );
    const secondNext = this.isThisPlayerField(
      rowIndex,
      columnIndex + 2,
      currentPlayer,
      boardState
    );
    const thirdNext = this.isThisPlayerField(
      rowIndex,
      columnIndex + 3,
      currentPlayer,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  },

  checkLeftColumns(rowIndex, columnIndex, currentPlayer, boardState) {
    const firstNext = this.isThisPlayerField(
      rowIndex,
      columnIndex - 1,
      currentPlayer,
      boardState
    );
    const secondNext = this.isThisPlayerField(
      rowIndex,
      columnIndex - 2,
      currentPlayer,
      boardState
    );
    const thirdNext = this.isThisPlayerField(
      rowIndex,
      columnIndex - 3,
      currentPlayer,
      boardState
    );
    if (firstNext && secondNext && !thirdNext) return true;
  },

  isThisPlayerField(rowIndex, columnIndex, player, board) {
    if (this.isCoordinateOutOfBounds(rowIndex, columnIndex)) {
      return false;
    }
    const field = board[rowIndex][columnIndex];
    return field && field.player === player;
  },

  isCoordinateOutOfBounds(rowIndex, columnIndex) {
    const rowOutOfBound = rowIndex < 0 || rowIndex >= boardStats.rowsNumber;
    const columnOutOfBound =
      columnIndex < 0 || columnIndex >= boardStats.columnsNumber;
    if (rowOutOfBound || columnOutOfBound) {
      return true;
    }
  },

  getPlayerPawnsFromBoard(player, board) {
    let pawns = [];
    board.forEach((row) => {
      row.forEach((field) => {
        if (field && field.player == player) pawns.push(field);
      });
    });
    return pawns;
  },

  getEnemyPlayerPawnsFromBoard(player, board) {
    let pawns = [];
    board.forEach((row) => {
      row.forEach((field) => {
        if (field && field.player != player) pawns.push(field);
      });
    });
    return pawns;
  },

  getMovablePawnWithAvailableDirections(pawns, boardState) {
    let availablePawns = [];
    for (let i = 0; i < pawns.length; i++) {
      const directions = this.getAvailableDirectionsForPawn(
        pawns[i],
        boardState
      );
      if (directions.length)
        availablePawns.push({ pawn: pawns[i], directions: directions });
    }
    return availablePawns;
  },

  MINIMUM() {
    return -10000;
  },

  MAXIMUM() {
    return 10000;
  },

  getAvailableDirectionsForPawn(pawn, boardState) {
    let availableDirections = [];
    if (
      this.isUpperFieldSuitableToMove(
        pawn.currentPosition.rowIndex,
        pawn.currentPosition.columnIndex,
        pawn,
        boardState
      )
    )
      availableDirections.push({
        rowIndex: pawn.currentPosition.rowIndex - 1,
        columnIndex: pawn.currentPosition.columnIndex,
      });
    if (
      this.isLowerFieldSuitableToMove(
        pawn.currentPosition.rowIndex,
        pawn.currentPosition.columnIndex,
        pawn,
        boardState
      )
    )
      availableDirections.push({
        rowIndex: pawn.currentPosition.rowIndex + 1,
        columnIndex: pawn.currentPosition.columnIndex,
      });
    if (
      this.isLeftFieldSuitableToMove(
        pawn.currentPosition.rowIndex,
        pawn.currentPosition.columnIndex,
        pawn,
        boardState
      )
    )
      availableDirections.push({
        rowIndex: pawn.currentPosition.rowIndex,
        columnIndex: pawn.currentPosition.columnIndex - 1,
      });
    if (
      this.isRightFieldSuitableToMove(
        pawn.currentPosition.rowIndex,
        pawn.currentPosition.columnIndex,
        pawn,
        boardState
      )
    )
      availableDirections.push({
        rowIndex: pawn.currentPosition.rowIndex,
        columnIndex: pawn.currentPosition.columnIndex + 1,
      });

    return availableDirections;
  },

  isUpperFieldSuitableToMove(rowIndex, columnIndex, movingPawn, boardState) {
    if (rowIndex <= 0) return false;
    const targetedField = boardState[rowIndex - 1][columnIndex];

    if (targetedField) return false;
    else if (
      movingPawn.lastPosition &&
      movingPawn.lastPosition.rowIndex === rowIndex - 1
    ) {
      return false;
    }
    return true;
  },
  isLowerFieldSuitableToMove(rowIndex, columnIndex, movingPawn, boardState) {
    if (rowIndex + 1 >= boardStats.rowsNumber) return false;
    const targetedField = boardState[rowIndex + 1][columnIndex];

    if (targetedField) return false;
    else if (
      movingPawn.lastPosition &&
      movingPawn.lastPosition.rowIndex === rowIndex + 1
    ) {
      return false;
    }
    return true;
  },
  isLeftFieldSuitableToMove(rowIndex, columnIndex, movingPawn, boardState) {
    if (columnIndex <= 0) return false;
    const targetedField = boardState[rowIndex][columnIndex - 1];

    if (targetedField) return false;
    else if (
      movingPawn.lastPosition &&
      movingPawn.lastPosition.columnIndex === columnIndex - 1
    ) {
      return false;
    }
    return true;
  },
  isRightFieldSuitableToMove(rowIndex, columnIndex, movingPawn, boardState) {
    if (columnIndex + 1 >= boardStats.columnsNumber) return false;
    const targetedField = boardState[rowIndex][columnIndex + 1];

    if (targetedField) return false;
    else if (
      movingPawn.lastPosition &&
      movingPawn.lastPosition.columnIndex === columnIndex + 1
    ) {
      return false;
    }
    return true;
  },
};
