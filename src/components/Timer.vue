<template>
  <div class="timer">
    <div class="firstPlayer">
      <div class="clock">
        <div class="time">
          <span class="minutes">{{ firstPlayerMinutes }}</span
          >:<span class="seconds">{{ firstPlayerSeconds }}</span
          >.<span class="mili-seconds">{{ firstPlayerMiliSeconds }}</span>
        </div>
      </div>
      <!-- <br /> -->
      <div class="playerName">
        <span>{{ firstPlayerName }}</span>
      </div>
    </div>
    <div class="middleground">
      <slot />
    </div>
    <div class="secondPlayer">
      <div class="playerName">
        <span>{{ secondPlayerName }}</span>
      </div>
      <!-- <br /> -->
      <div class="clock low-time">
        <div class="time">
          <span class="minutes">{{ secondPlayerMinutes }}</span
          >:<span class="seconds">{{ secondPlayerSeconds }}</span
          >.<span class="mili-seconds">{{ secondPlayerMiliSeconds }}</span>
        </div>
      </div>
    </div>
    <!-- <button class="starter" @click="timerChangePlayer">ChangePlayer</button>
    <button class="starter" @click="stopTimer">Stop</button> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    firstPlayerName: {
      type: String,
    },
    secondPlayerName: {
      type: String,
    },
  },
})
export default class Timer extends Vue {
  firstTimerRunning = false;
  SecondTimerRunning = false;

  firstPlayerMinutes = 10;
  firstPlayerSeconds = 0;
  firstPlayerMiliSeconds = 0;
  firstPlayerMiliSecondsLeft = 600000;

  secondPlayerMinutes = 10;
  secondPlayerSeconds = 0;
  secondPlayerMiliSeconds = 0;
  secondPlayerMiliSecondsLeft = 600000;

  mounted() {
    setInterval(() => {
      if (this.firstTimerRunning) {
        this.firstPlayerMiliSecondsLeft -= 100;

        this.firstPlayerMinutes = Math.floor(
          this.firstPlayerMiliSecondsLeft / 1000 / 60
        );
        this.firstPlayerSeconds = Math.floor(
          (this.firstPlayerMiliSecondsLeft / 1000) % 60
        );
        this.firstPlayerMiliSeconds =
          (this.firstPlayerMiliSecondsLeft % 1000) / 100;
        if (this.firstPlayerMiliSecondsLeft <= 0) this.emitTimesUp();
      } else if (this.SecondTimerRunning) {
        this.secondPlayerMiliSecondsLeft -= 100;
        this.secondPlayerMinutes = Math.floor(
          this.secondPlayerMiliSecondsLeft / 1000 / 60
        );
        this.secondPlayerSeconds = Math.floor(
          (this.secondPlayerMiliSecondsLeft / 1000) % 60
        );
        this.secondPlayerMiliSeconds =
          (this.secondPlayerMiliSecondsLeft % 1000) / 100;
        if (this.secondPlayerMiliSecondsLeft <= 0) this.emitTimesUp();
      }
    }, 100);
  }

  timerChangePlayer() {
    // console.log("starting", this);
    if (!this.firstTimerRunning && !this.SecondTimerRunning)
      this.firstTimerRunning = true;
    this.firstTimerRunning = !this.firstTimerRunning;
    this.SecondTimerRunning = !this.SecondTimerRunning;
  }
  stopTimer() {
    this.firstTimerRunning = false;
    this.SecondTimerRunning = false;
  }

  emitTimesUp() {
    this.$emit("timesUp");
    this.firstTimerRunning = false;
    this.SecondTimerRunning = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.timer {
  .clock {
    // position: relative;
    // display: inline-block;
    // float: left;
    display: flex;
    justify-content: space-between;

    .time {
      font-size: 50px;
      padding: 10px 20px 10px 10px;
      background-color: #6e6e6e30;
      display: flex;
      font-weight: bold;
      align-items: flex-end;
    }
  }
  .low-time {
    color: red;
  }

  .playerName {
    font-size: 22px;
    padding: 10px;
    display: flex;
    background-color: #6e6e6e30;
  }

  .middleground {
    background-color: #6e6e6e;
    min-height: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .firstPlayer,
  .secondPlayer {
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
    min-width: 25vw;
    display: inline-block;
  }
}
</style>
