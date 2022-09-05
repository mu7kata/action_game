<template>
  <div id="app">
    <div class="gameTitle w-100">
      <h1 style="text-align: center;">格闘アクションゲーム（仮）</h1>
      <div class="row m-auto w-50">
        <div class="col-sm-3">
          <img class="object" ref="player" :src="require('@/assets/img/haru_stand.gif')">
        </div>
        <div class="col-sm-3">
          <img class="object" ref="player" :src="require('@/assets/img/eda_stand.gif')">
        </div>
        <div class="col-sm-3">
          <img class="object" ref="player" :src="require('@/assets/img/kaki_stand.gif')">
        </div>
        <div class="col-sm-3">
          <img class="object" ref="player" :src="require('@/assets/img/kuni_stand.gif')">
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
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
.gameTitle {
  position: absolute;
  top: 25%;
}

</style>
