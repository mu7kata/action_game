<template>
  <div id="app">
    <div class="gameTitle w-100">
      <h1>格闘アクションゲーム（仮）</h1>
      <div class="mt-5">
        <router-link class="button" :to="`/select`"><i class="bi bi-cursor-fill me-2"></i>はじめる</router-link>
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
