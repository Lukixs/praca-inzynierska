import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LocalGame from "../views/LocalGame/LocalGame.vue";
import LocalGameMenu from "../views/LocalGame/LocalGameMenu.vue";
import AIGameEasy from "../views/LocalGame/Difficulty/Easy.vue";
import AIGameMedium from "../views/LocalGame/Difficulty/Medium.vue";
import AIGameHard from "../views/LocalGame/Difficulty/Hard.vue";
import OnlineGame from "../views/OnlineGame.vue";
import Instruction from "../views/Instruction.vue";
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
  {
    path: "/aigame-easy",
    name: "AI Game Easy",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AIGameEasy,
  },
  {
    path: "/aigame-medium",
    name: "AI Game Medium",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AIGameMedium,
  },
  {
    path: "/aigame-hard",
    name: "AI Game Hard",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AIGameHard,
  },
  {
    path: "/online",
    name: "Online Game",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: OnlineGame,
  },
  {
    path: "/instruction",
    name: "Instruction",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Instruction,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
