<template>
  <div id="gameResult">
    <div class="resultMsg">
      <img class="resultImg" :src="require(`@/assets/img/${this.matchEndMessage}.png`)" alt="resultImg">
      {{ this.matchEndMessage }}
      <div>
        <router-link v-if="matchEndMessage == 'win'" :to="`/battle/${this.$route.params.selectPlayerImgName}/${getNextEnemyPath()}`">
          次の対戦へすすむ <i class="bi bi-arrow-right"></i>
        </router-link>
        <a v-if="matchEndMessage == 'lose'" class="btn btn-dark" @click="reload()">
          もう一度戦う <i class="bi bi-arrow-clockwise"></i>
        </a>
        <a class="pt-5" href="/">
          ホームへ戻る
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "GameResult",
  props: ["matchEndMessage"],
  data() {
    return {}
  },
  methods: {
    reload() {
      this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
    getNextEnemyPath(){
      let enemyString = this.$route.params.enemyNum;
      let enemyNum = Number(enemyString);
      return enemyNum+1;
    }
  },
};
</script>

<style scoped>

.resultMsg {
  position: absolute;
  top: 20%;
  left: 35%;
}

.resultImg {
  width: 60%;
}


</style>
