<template>
  <div class="about">
    <Board :worker="worker" />
  </div>
</template>
<script>
import Board from "./Board/Board.vue";
import Vue from "vue";
import Component from "vue-class-component";

import MinimaxWorker from "worker-loader!./MinimaxWorker";

@Component({
  components: { Board },
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
