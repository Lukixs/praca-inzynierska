<template>
  <div class="about">
    <OnlineGame ref="onlineGame" />
  </div>
</template>
<script>
import OnlineGame from "@/components/Online/OnlineGame.vue";

export default {
  components: {
    OnlineGame,
  },

  beforeRouteLeave(to, from, next) {
    // const answer = window.confirm("Czy na pewno chcesz opuścić grę online?");
    // if (answer) {
    this.$refs.onlineGame.closeSocket();
    next();
    // } else {
    //   next(false);
    // }
  },
};
</script>
