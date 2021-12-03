<template>
  <div class="hello">
    <div class="timer">
      <span class="minutes">{{ minutes }}</span
      >:<span class="seconds">{{ seconds }}</span
      >.<span class="mili-seconds">{{ miliSeconds }}</span>
    </div>
    <button class="starter" @click="startTimer">Start</button>
    <button class="starter" @click="stopTimer">Stop</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Timer2 extends Vue {
  timerRunning = false;
  minutes = 10;
  seconds = 0;
  miliSeconds = 0;
  miliSecondsLeft = 600000;

  mounted() {
    setInterval(() => {
      if (this.timerRunning) {
        this.miliSecondsLeft -= 100;
        this.minutes = Math.floor(this.miliSecondsLeft / 1000 / 60);
        this.seconds = Math.floor((this.miliSecondsLeft / 1000) % 60);
        this.miliSeconds = (this.miliSecondsLeft % 1000) / 100;
      }
    }, 100);
  }

  startTimer() {
    // console.log("starting", this);
    this.timerRunning = true;
  }
  stopTimer() {
    this.timerRunning = false;
  }
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
