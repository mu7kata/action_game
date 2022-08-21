<template>
  <div id="gameResult">
    <div class="resultMsg">
      <h1>{{ matchEndMessage }}</h1>
      <a :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/2`">次の対戦へすすむ</a>
      <a :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/`">もう一度戦う</a>
      <a href="/">ホームへ戻る</a>

    </div>
  </div>
</template>
<script>
export default {
  name: "GameResult",
  props: ["matchEndMessage"],
  methods: {
  },
};
</script>

<style scoped>

.resultMsg{
  position: absolute;
  top: 20%;
  left: 50%;
}

</style>
