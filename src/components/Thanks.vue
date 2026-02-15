<template>
  <div id="app">
    <div class="gameTitle w-100">
      <div v-if="$route.params.gameResult == 'clear'">
        <h1 class="text-center">おめでとう！ゲームクリアです！</h1>
        <p>この度は遊んでいただきありがとうございました!<br>ゲームは今後アップデートする、、かもです。</p>
      </div>
      <div v-if="$route.params.gameResult == 'lose'">
        <h1 class="text-center">残念・・、ゲームオーバーです</h1>
        <p>再チャレンジお待ちしています</p>
      </div>
      <div class="mb-4">

      </div>
      <div class="row m-auto w-50 mb-4">
        <div class="col-sm-4">
          <img class="object" ref="player" :src="getImageUrl('enamy_1_stand.gif')">
        </div>
        <div class="col-sm-4">
          <img class="object" ref="player" :src="getImageUrl('enamy_3_stand.gif')">
        </div>
        <div class="col-sm-4">
          <img class="object" ref="player" :src="getImageUrl('enamy_2_stand.gif')">
        </div>
      </div>
      <div>
        <a class="button p-2" href="/">
          ホームへ戻る <span>⌂</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getImageUrl } from '@/utils/imageLoader'

export default defineComponent({
  name: "Thanks",
  methods: {
    getImageUrl
  }
})
</script>

<style scoped>
.gameTitle {
  position: absolute;
  top: 25%;
}


</style>
