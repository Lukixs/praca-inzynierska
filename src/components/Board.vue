<template>
  <div class="hello">
    Webowa Aplikacja do gry Dara
    <div class="board">
      <div v-for="rowIndex in board.rowsNumber" :key="rowIndex">
        <div v-for="columnIndex in board.columnsNumber" :key="columnIndex" @click="cellOnClick(rowIndex, columnIndex)">
          <div :id="rowIndex*10+columnIndex" :class="[(rowIndex + columnIndex) % 2 === 0 ? 'white' : 'black']"> 
            <div v-if="board.values[rowIndex-1][columnIndex-1] == 'white'">&#9920;</div>
            <div v-if="board.values[rowIndex-1][columnIndex-1] == 'black'">&#9922;</div>
          </div>
        </div>
      </div>
    </div>
    <span>Tura {{moveCounter}} |</span>
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
    msg: String
  },
  data: function () {
    return {
      tura: true,
      moveCounter: 1,
      focused: null, //Mówi czy gracz wybrał piona którym chce ruszyć.
      board: {
        columnsNumber: 6,
        rowsNumber: 5,
        values: null // { player: 'black', pawnIndex: '0' }
        // rows: Array(8).fill(null),
      },
      history: [] // HistoryItem{tour: 1, from: 'e4', to: 'e5', player: 'black' }...
    }
  },
  methods: {
    cellOnClick(rowIndex, columnIndex){
      if((this.board.values[rowIndex-1][columnIndex-1] == null) & (this.moveCounter<=4)){
        this.placePawn(rowIndex, columnIndex)
      }
      else if ((this.board.values[rowIndex-1][columnIndex-1] != null) & (this.moveCounter>4) & (this.focused == null)) {
        this.selectPawn(rowIndex, columnIndex)
      }
      else if ((this.board.values[rowIndex-1][columnIndex-1] != null) & (this.moveCounter>4) & (this.focused != null)) {
        this.reSelectPawn(rowIndex, columnIndex)
      }
    },

    placePawn(rowIndex, columnIndex){
      if(this.board.values[rowIndex-1][columnIndex-1] == null){
        const newRow = this.board.values[rowIndex-1].slice(0)
        if(this.tura == true)
          newRow[columnIndex-1] = "white"
        else
        newRow[columnIndex-1] = "black"
        this.tura = !this.tura
        this.$set(this.board.values, rowIndex-1, newRow)


        this.moveCounter++
        // this.board.values[rowIndex-1][columnIndex-1] = "XD"
        // console.log(this.board.values)
        // alert("Kliknięto wiersz: " + rowIndex + " kolumny: " + columnIndex)
      }
    },

    selectPawn(rowIndex, columnIndex){
      // const element = document.getElementById(rowIndex*10+columnIndex)
      // element.classList.add("yellowgreen")
      // console.log(rowIndex, columnIndex);
      // console.log(element.children[0].textContent);
      if(this.board.values[rowIndex-1][columnIndex-1] == "white" && this.tura % 2 == 1){
        this.drawAvailableMoves(rowIndex,columnIndex)
        // const element = document.getElementById(rowIndex*10+columnIndex)
        // element.classList.add("yellowgreen")
        this.focused = {rowIndex, columnIndex}
        console.log(this.focused)
      }
      else if (this.board.values[rowIndex-1][columnIndex-1] == "black" && this.tura % 2 == 0){
        this.drawAvailableMoves(rowIndex,columnIndex)
        // const element = document.getElementById(rowIndex*10+columnIndex)
        // element.classList.add("yellowgreen")
        this.focused = {rowIndex, columnIndex}
        console.log(this.focused)
      }
    },

    reSelectPawn(rowIndex, columnIndex){
      if(this.board.values[rowIndex-1][columnIndex-1] == "white" && this.tura % 2 == 1){
        this.removeAvailableMoves(this.focused.rowIndex, this.focused.columnIndex)
        this.drawAvailableMoves(rowIndex,columnIndex)
        this.focused = {rowIndex, columnIndex}
        console.log(this.focused)
      }
      else if (this.board.values[rowIndex-1][columnIndex-1] == "black" && this.tura % 2 == 0){
        this.removeAvailableMoves(this.focused.rowIndex, this.focused.columnIndex)
        this.drawAvailableMoves(rowIndex,columnIndex)
        this.focused = {rowIndex, columnIndex}
        console.log(this.focused)
      }
    },

    drawAvailableMoves(rowIndex, columnIndex){
      const element = document.getElementById(rowIndex*10+columnIndex)
      element.classList.add("darkgreen")
      if(rowIndex-1 >= 1 & this.board.values[rowIndex-2][columnIndex-1] == null){
        const element = document.getElementById((rowIndex-1)*10+columnIndex)
        element.classList.add("yellowgreen")
      }
      if(rowIndex+1 <= this.board.rowsNumber & this.board.values[rowIndex][columnIndex-1] == null){
        const element = document.getElementById((rowIndex+1)*10+columnIndex)
        element.classList.add("yellowgreen")
      }
      if(columnIndex-1 >= 1 & this.board.values[rowIndex-1][columnIndex-2] == null){
        const element = document.getElementById(rowIndex*10+(columnIndex-1))
        element.classList.add("yellowgreen")
      }
      if(columnIndex+1 <= this.board.columnsNumber & this.board.values[rowIndex-1][columnIndex] == null){
        const element = document.getElementById(rowIndex*10+(columnIndex+1))
        element.classList.add("yellowgreen")
      }
    },

    removeAvailableMoves(rowIndex, columnIndex){
      const element = document.getElementById(rowIndex*10+columnIndex)
      element.classList.remove("darkgreen")
      if(rowIndex-1 >= 1 & this.board.values[rowIndex-2][columnIndex-1] == null){
        const element = document.getElementById((rowIndex-1)*10+columnIndex)
        element.classList.remove("yellowgreen")
      }
      if(rowIndex+1 <= this.board.rowsNumber & this.board.values[rowIndex][columnIndex-1] == null){
        const element = document.getElementById((rowIndex+1)*10+columnIndex)
        element.classList.remove("yellowgreen")
      }
      if(columnIndex-1 >= 1 & this.board.values[rowIndex-1][columnIndex-2] == null){
        const element = document.getElementById(rowIndex*10+(columnIndex-1))
        element.classList.remove("yellowgreen")
      }
      if(columnIndex+1 <= this.board.columnsNumber & this.board.values[rowIndex-1][columnIndex] == null){
        const element = document.getElementById(rowIndex*10+(columnIndex+1))
        element.classList.remove("yellowgreen")
      }
    }
  },
  beforeMount() {
    this.board.values = Array(8).fill(null).map(() => Array(8).fill(null))
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board  {
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
      font-size:80px;
    text-align:center;
    display: table-cell;
    vertical-align:middle;
}
.white {
    float: left;
    width: 120px;
    height: 120px;
    background-color: #fff;
    font-size:80px;
    text-align:center;
    display: table-cell;
    vertical-align:middle;
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
