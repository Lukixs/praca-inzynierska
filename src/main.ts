import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as io from "socket.io-client";
import VueSocketIOExt from "vue-socket.io-extended";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

const socket = io.connect("ws://localhost:8080");
Vue.use(VueSocketIOExt, socket);
