<template>
  <div id="app">
    <div class="moving-box" :style="{ transform: `translate(${x}px, ${y}px)` }">
    </div>
    <div class="action">
      <button @click="rightMove">右</button>
      <button @click="leftMove">左</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      x: 0,
      y: 0
    }
  },
  methods: {
    move (e) {
      this.x = e.offsetX - 50
      this.y = e.offsetY - 50
    },
    rightMove (e) {
      this.x = this.x + 50
    },
    leftMove (e) {
      this.x = this.x - 50
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 80vh;
  width: 80vw;
  margin: 30px auto;
  box-sizing: border-box;
  border: 1px solid black;
}
.moving-box {
  height: 100px;
  width: 100px;
  transition: transform .5s ease;
  box-sizing: border-box;
  border: 1px solid black;
  background-color: #41B883
}
</style>
