<template>
  <MiniMax :aiDifficulty="gameDifficulty()" />
</template>
<script>
import MiniMax from "@/components/Minimax/Minimax.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: { MiniMax },
})
export default class Home extends Vue {
  gameDifficulty() {
    return { title: "Sztuczna Inteligencja - Trudna", drop: 5, move: 7 };
  }
}
</script>
