<template>
  <div id="gameResult">
    <div class="resultMsg">
      <img class="resultImg" :src="require(`@/assets/img/${this.matchEndMessage}.png`)" alt="resultImg">
      {{this.matchEndMessage}}
      <div>
        <a :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/2`">次の対戦へすすむ</a>
        <a :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/`">もう一度戦う</a>
      </div>
    </div>
  </div>
</template>win
<script>
export default {
  name: "GameResult",
  props: ["matchEndMessage"],
  methods: {},
};
</script>

<style scoped>

.resultMsg {
  position: absolute;
  top: 15%;
  left: 35%;
}

.resultImg {
  width: 60%;
}

</style>
