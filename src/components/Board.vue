<template>
  <div class="hello">
    Hi there will be a Game
    <div class="board">
      <div v-for="rowIndex in board.rowsNumber" :key="rowIndex">
        <div v-for="columnIndex in board.columnsNumber" :key="columnIndex" @click="cellOnClick(rowIndex, columnIndex)">
          <div :class="[(rowIndex + columnIndex) % 2 === 0 ? 'white' : 'black']"> 
            <div v-if="board.values[rowIndex-1][columnIndex-1] == 'biały'">&#9817;</div>
            <div v-if="board.values[rowIndex-1][columnIndex-1] == 'czarny'">&#9823;</div>
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
      board: {
        columnsNumber: 6,
        rowsNumber: 5,
        values: null
        // rows: Array(8).fill(null),
      }
    }
  },
  methods: {
    cellOnClick(rowIndex, columnIndex){
      if(this.board.values[rowIndex-1][columnIndex-1] == null){
        const newRow = this.board.values[rowIndex-1].slice(0)
        if(this.tura == true)
          newRow[columnIndex-1] = "biały"
        else
        newRow[columnIndex-1] = "czarny"
        this.tura = !this.tura
        this.$set(this.board.values, rowIndex-1, newRow)


        this.moveCounter++
        // this.board.values[rowIndex-1][columnIndex-1] = "XD"
        // console.log(this.board.values)
        // alert("Kliknięto wiersz: " + rowIndex + " kolumny: " + columnIndex)
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
