<template>
  <div class="menu">
    <div class="header">
      <h1 class="h1 title ">DARA</h1>
    </div>

    <div class="options">
      <div class="options--list">
        <!-- <div class="test1"> -->
        <v-btn
          dark
          text
          v-for="(item, index) in items"
          :key="index"
          :to="item.link"
        >
          {{ item.title }}</v-btn
        >
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";

export default Vue.extend({
  name: "Home",
  components: {},
  data() {
    return {
      items: [
        { title: "GRAJ LOKALNIE", link: "/local-menu" },
        { title: "GRAJ ONLINE", link: "/online" },
        { title: "INSTRUKCJA", icon: "mdi-forum", link: "/instruction" },
      ],
    };
  },
});
</script>
<style lang="scss" scoped>
.menu {
  color: white;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
.header {
  font-size: 130px;
  letter-spacing: -41px;
}

.options {
  margin-top: 5vh;
  font-size: 50px;
  display: flex;
  overflow: auto;

  justify-content: center;
  &--list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  // .test1 {
  //   position: absolute;
  // }
  // .test1:hover::before,
  // .test1:hover::after {
  //   content: "";
  //   position: absolute;
  //   height: 100%;
  //   width: 20px;
  //   top: 0px;
  //   background-image: radial-gradient(
  //       circle at center,
  //       red 5px,
  //       transparent 5px
  //     ),
  //     radial-gradient(circle at center, red 5px, transparent 5px);
  //   background-size: 20px 20px;
  //   background-position: top center, bottom center;
  //   background-repeat: no-repeat;
  // }

  // .test1:hover::before {
  //   left: 0px;
  // }
  // .test1:hover::after {
  //   right: 0px;
  // }

  .v-btn {
    // margin: 5px 0;
    // width: 36px;
    // min-width: 36px;
    font-size: 50px;
    height: 110px !important;
  }
}
/* @import "../styles/styles.scss"; */
</style>
