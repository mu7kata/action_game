<template>
  <div id="app">
    <div class="gameTitle w-100">
      <h1>おめでとう！ゲームクリアです！</h1>
      <p>この度は遊んでいただきありがとうございました!
        <br>今後アップデートする、、かもです。
      </p>
      <div class="mb-4">
        <img class="object" ref="player" :src="require('@/assets/img/enamy_1_stand.gif')">
      </div>
      <div>
        <a class="button p-2" href="/">
          ホームへ戻る <i class="bi bi-house-door-fill"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Thanks"
}
</script>

<style scoped>
.gameTitle {
  position: absolute;
  top: 25%;
}

</style>
