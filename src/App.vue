<!--<template>-->
<!--  <div id="app">-->
<!--    <Battle/>-->
<!--&lt;!&ndash;    <moving-box/>&ndash;&gt;-->
<!--&lt;!&ndash;    <router-view/>&ndash;&gt;-->
<!--  </div>-->
<!--</template>-->
<template>
  <div id="app" class="appContainer">
    <router-view />
  </div>
</template>

<script>
// import Battle from "./components/Battle"
// // import movingBox from "./components/moving-box"
//
// export default {
//   name: "App",
//   components: {
//     Battle
//   }
// }
export default {
  name: "App",
};
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

