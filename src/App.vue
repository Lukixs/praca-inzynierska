<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Local Game</router-link> |
      <router-link to="/about">AI Game - Easy</router-link> |
      <router-link to="/minimax">MiniMax Game</router-link> |
      <router-link to="/online">Online</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
@keyframes animatedBackground {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100vw 100vh;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background: url("./img/pattern(1).svg") repeat; */
  /* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='50' height='50' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Crect width='100%25' height='100%25' fill='%232d3748'/%3E%3Ccircle cx='34' cy='20' r='4' fill='%234a5568'/%3E%3Ccircle cx='6' cy='20' r='4' fill='%234a5568'/%3E%3Ccircle cx='20' cy='34' r='4' fill='%234a5568'/%3E%3Ccircle cx='20' cy='6' r='4' fill='%234a5568'/%3E%3Ccircle cx='34' cy='6' r='4' fill='%231a202c'/%3E%3Ccircle cx='6' cy='34' r='4' fill='%231a202c'/%3E%3Ccircle cx='34' cy='34' r='4' fill='%231a202c'/%3E%3Ccircle cx='6' cy='6' r='4' fill='%231a202c'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E "); */
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='40' height='40' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(135)'%3E%3Crect width='100%25' height='100%25' fill='%232a4365'/%3E%3Cpath d='M0 29a 9-9 0 0 0 9-9a 11-11 0 0 1 11-11v2a-9 9 0 0 0-9 9a-11 11 0 0 1-11 11zM0 69a 9-9 0 0 0 9-9a 11-11 0 0 1 11-11v2a-9 9 0 0 0-9 9a-11 11 0 0 1-11 11z' fill='%231a202c'/%3E%3Cpath d='M20 29.5a 9.5-9.5 0 0 0 9.5-9.5a 10.5-10.5 0 0 1 10.5-10.5v1a-9.5 9.5 0 0 0-9.5 9.5a-10.5 10.5 0 0 1-10.5 10.5z' fill='%23ecc94b'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ");
  margin: 0;
  padding: 0;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-repeat: repeat;
  background-position: 0 0;
  /* animation: animatedBackground 40s linear infinite; */
}

#nav {
  padding: 30px;
  background: #4a5568;
  border: 5px solid #1a202c;
  border-radius: 30px;
  width: 30vw;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  font-size: 2vw;
  color: #fff;
}

#nav a {
  font-weight: bold;
  font-size: 1vw;
  color: #fff;
  /* color: #2c3e50; */
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
