<template>
  <div class="about">
    <MiniMax :worker="worker" />
  </div>
</template>
<script>
import MiniMax from "@/components/MiniMax.vue";
import Vue from "vue";
import Component from "vue-class-component";

import Worker from "worker-loader!./Worker";

@Component({
  components: { MiniMax },
})
export default class Home extends Vue {
  worker;
  created() {
    if (typeof Worker !== "undefined") {
      this.worker = new Worker("worker-loader!./Workers/Worker");
    }
  }
}
</script>
