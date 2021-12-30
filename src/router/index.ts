import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LocalGame from "../views/LocalGame/LocalGame.vue";
import LocalGameMenu from "../views/LocalGame/LocalGameMenu.vue";
import AIGame from "../views/LocalGame/AIGame.vue";
import OnlineGame from "../views/OnlineGame.vue";
import Menu from "../views/Menu.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/local-menu",
    name: "Local Game Menu",
    component: LocalGameMenu,
  },
  {
    path: "/local",
    name: "Local Game",
    component: LocalGame,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: About,
  // },
  {
    path: "/aigame",
    name: "Artificial Intelligence Game",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AIGame,
  },
  {
    path: "/online",
    name: "Online Game",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: OnlineGame,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
