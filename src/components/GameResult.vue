<template>
  <div id="gameResult">
    <div class="resultMsgArea">
      <div class="">
        <div v-if="matchEndMessage == 'win'">
          <h1 class="resultMsg gameWinMsg">かち！！！</h1>
          <router-link class="button" :to="`/battle/${this.$route.params.selectPlayerImgName}/${getNextEnemyPath()}`">
            　次の対戦へすすむ <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
        <div v-if="matchEndMessage == 'clear'">
          <h1 class="resultMsg gameWinMsg">かち！！！</h1>
          <router-link class="button" :to="`/thanks/${matchEndMessage}`">
            　次へ <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
        <div v-if="matchEndMessage == 'lose'">
          <h1 class="resultMsg gameLoseMsg">まけ・・・</h1>
          <router-link class="button" :to="`/thanks/${matchEndMessage}`">
            　次へ <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
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
    getNextEnemyPath() {
      let enemyString = this.$route.params.enemyNum;
      let enemyNum = Number(enemyString);
      return enemyNum + 1;
    }
  },
};
</script>

<style scoped>

.resultMsgArea {
  position: absolute;
  top: 15%;
  right: 0%;
  width: 100%;
}

.resultMsg {
  font-size: 5em;
  -webkit-text-stroke: 4px #2E2E2E;
  margin-top: 1.5%;
  text-align: center;
}

.gameClearMsg {
  font-size: 1em;
  color: yellow;
  -webkit-text-stroke: 4px #2E2E2E;
}

.gameWinMsg {
  color: red;
}

.gameLoseMsg {
  color: blue;
}


</style>
