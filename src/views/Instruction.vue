<template>
  <div class="menu">
    <div class="header">
      <h1 class="h1 title ">Instruckcja</h1>
    </div>
    <Rules />
  </div>
</template>

<script lang="ts">
import Rules from "@/components/Rules.vue";

export default {
  components: {
    Rules,
  },
};
</script>
<style lang="scss" scoped>
.header {
  font-size: 30px;
  padding: 15px;
  // min-height: 15vh;
  background-color: #6e6e6e30;
}
/* @import "../styles/styles.scss"; */
</style>
