<template>
  <div id="gameResult">
    <div class="resultMsg">
      <img class="resultImg" :src="require(`@/assets/img/${this.matchEndMessage}.png`)" alt="resultImg">
      {{this.matchEndMessage}}
      <div>
        <a v-if="matchEndMessage == 'win'" class="btn btn-dark" :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/2`">
          次の対戦へすすむ <i class="bi bi-arrow-right"></i>
        </a>
        <a v-if="matchEndMessage == 'lose'" class="btn btn-dark" :href="`/#/Battle/${this.$route.params.selectPlayerImgName}/2`">
          もう一度戦う <i class="bi bi-arrow-clockwise"></i>
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
    return {

    }
  },
  methods: {
  },
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
