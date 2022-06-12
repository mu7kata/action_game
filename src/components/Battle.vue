<template>
  <div id="app">
<div class="floar">
    <div class="player">
    <img class="object"  ref="player" :src="playerImage" :style="{ transform: `translate(${x}px, ${y}px)` }">
    </div>
    <div class="enemy">
    <img class="object"  ref="enemy" src="../img/sample_stand.gif" :style="{ transform: `translate(200px, 0px)` }">
    </div>
    <div class="action">
      <button @click="leftMove">左</button>
      <button @click="rightMove">右</button>
      <button @click="attackMove">攻撃</button>
    </div>
    <div class="lifeGage">
      {{life}}
    </div>
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
      playerImage:'/static/img/sample_stand.b88e874.gif', //HACK：なぜ表示されるかよくわからない
      life:10
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
          this.playerImage = "/static/img/sample_stand.b88e874.gif"}
        ,880
      );
      //物体同士の正徳を検知したらダメージを減らす
      if (this.isConflict()){
        this.life_decrease();
      }

    },
    life_decrease(){
      this.life=this.life-1;
    },
    isConflict(){
      const enemyDom = this.$refs.enemy;
      const enemyRect = enemyDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得
      const playerDom = this.$refs.player;
      const playerRect = playerDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得

      if ((enemyRect.right - playerRect.right) < 300) {
        return true;
      }
      return false
    }
  }
}
</script>
<style>
.action {
  margin-top: 25px;
}

.player {
  display: inline;
  width: 10px;
}
.object {
  width: 300px;
  height: 200px;
}

.enemy{
  display: inline;
  width: 10px;
  right: 200px;
  transform: translate(0px, 200px);
}
.floar{
  width: 1000px;
  margin: auto 0;
}
</style>
