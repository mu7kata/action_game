<template>
  <div id="app">
    <div class="gameTitle">
    <h1>格闘アクションゲーム（仮）</h1>
    <router-link class="button" :to="`/select`"><i class="bi bi-arrow-right me-2"></i>はじめる！</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
.gameTitle{
  position: absolute;
  top: 25%;
  left: 35%;
}

</style>
