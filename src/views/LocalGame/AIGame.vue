<template>
  <MiniMax />
</template>
<script>
import MiniMax from "@/components/Minimax/Minimax.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: { MiniMax },
})
export default class Home extends Vue {}
</script>
