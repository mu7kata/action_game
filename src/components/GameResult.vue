<template>
  <div id="gameResult">
    <div class="resultMsg">
      <img class="resultImg" :src="require(`@/assets/img/${this.matchEndMessage}.png`)" alt="resultImg">
      {{ this.matchEndMessage }}
      <div>
        <a v-if="matchEndMessage == 'win'" class="btn btn-dark"
           :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/2`">
          次の対戦へすすむ <i class="bi bi-arrow-right"></i>
        </a>
        <a v-if="matchEndMessage == 'lose'" class="btn btn-dark" @click="reload()">
          もう一度戦う <i class="bi bi-arrow-clockwise"></i>
        </a>
        <a class="pt-5" href="/">
          ホームへ戻る
        </a>
      </div>
    </div>
  </div>
</template>win
<script>
export default {
  name: "GameResult",
  props: ["matchEndMessage"],
  data() {
    return {}
  },
  methods: {
    reload(){
      this.$router.go({path: this.$router.currentRoute.path, force: true});
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
