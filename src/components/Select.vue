<template>
  <div id="app">
    <h1>選択画面</h1>
    <input type="button" @click="player = 'kaki'" value="カッキー"/>
    <input type="button" @click="player = 'haru'" value="はるか"/>
    <router-link :to="`battle/${player}`">battle</router-link>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  data() {
    return {
      player: 0
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
