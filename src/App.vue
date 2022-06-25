<template>
  <div id="app">
    <Battle/>
<!--    <moving-box/>-->
<!--    <router-view/>-->
  </div>
</template>

<script>
import Battle from "./components/Battle"
// import movingBox from "./components/moving-box"

export default {
  name: "App",
  components: {
    Battle
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

