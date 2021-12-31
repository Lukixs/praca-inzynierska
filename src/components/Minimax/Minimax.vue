<template>
  <div class="artificial">
    <div class="header">
      <h1 class="h1 title ">Sztuczna Inteligencja - Trudna</h1>
    </div>
    <ArtificialBoard :worker="worker" />
  </div>
</template>
<script>
import Vue from "vue";
import Component from "vue-class-component";
import ArtificialBoard from "./Board/ArtificialBoard.vue";

import MinimaxWorker from "worker-loader!./MinimaxWorker";

@Component({
  components: { ArtificialBoard },
})
export default class Home extends Vue {
  worker;
  created() {
    if (typeof Worker !== "undefined") {
      this.worker = new MinimaxWorker("worker-loader!./Workers/Worker");
    }
  }
}
</script>
<style lang="scss" scoped>
.artificial {
  color: white;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
.header {
  font-size: 30px;
  padding: 15px;
  // min-height: 15vh;
  background-color: #6e6e6e30;
}
</style>
