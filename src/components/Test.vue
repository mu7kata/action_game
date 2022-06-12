<template>
  <div id="app">
    <img class="player" :src="playerImage" :style="{ transform: `translate(${x}px, ${y}px)` }">
    <div class="action">
      <button @click="leftMove">左</button>
      <button @click="rightMove">右</button>
      <button @click="attackMove">攻撃</button>
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
      y: 0,
      playerImage:'/static/img/sample_stand.b88e874.gif' //HACK：なぜ表示されるかよくわからない
    }
  },
  methods: {
    rightMove () {
      this.x = this.x + 50
    },
    leftMove () {
      this.x = this.x - 50
    },
    attackMove () {
      this.playerImage = "/static/img/sample_attack.c10ccbd.gif";
      setTimeout(() => {
          this.playerImage = "/static/img/gra_mot_SWD_standA.b88e874.gif"}
        ,880
      )
    }
  }
}
</script>
<style>
.action {
  margin-top: 25px;
}

.player {
  width: 300px;
  height: 200px;
}

</style>
