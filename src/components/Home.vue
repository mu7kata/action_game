<template>
  <div id="app">
    <div class="gameTitle w-100">
      <h1 style="text-align: center;">格闘アクションゲーム（仮）</h1>
      <div>
        <div class="row m-auto w-50">
          <div class="col-sm-3">
            <img class="object" ref="player" :src="getImageUrl('haru_stand.gif')">
          </div>
          <div class="col-sm-3">
            <img class="object" ref="player" :src="getImageUrl('eda_stand.gif')">
          </div>
          <div class="col-sm-3">
            <img class="object" ref="player" :src="getImageUrl('kaki_stand.gif')">
          </div>
          <div class="col-sm-3">
            <img class="object" ref="player" :src="getImageUrl('kuni_stand.gif')">
          </div>
        </div>
        <div class="mt-5">
          <router-link class="button p-3 m-2 w-25" :to="`/select`"><i class="bi bi-cursor-fill me-2"></i>　チャレンジモードではじめる
          </router-link>
        </div>
        <div class="mt-5 ">
          <p>↓ 近日公開</p>
          <a class="button border-light p-3 m-2 w-25 text-secondary bg-light bg"><i class="bi bi-cursor-fill me-2"></i>フリーたいせんモードではじめる</a>
        </div>
      </div>
      <div class="mt-5 m-auto w-75">
        <h3>更新情報</h3>
        <div class="text-start w-25 m-auto mt-3">
          <p class="m-0">【2022.09.10】 "えだまつ"に覚醒モードが追加されました</p>
          <p class="m-0">【2022.09.05】 ベータ版リリースしました</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getImageUrl } from '@/utils/imageLoader'

export default {
  name: "Home",
  methods: {
    getImageUrl
  }
}
</script>

<style scoped>
.gameTitle {
  position: absolute;
  top: 25%;
}

</style>
