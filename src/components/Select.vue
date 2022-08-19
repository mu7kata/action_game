<template>
  <div id="app">
    <h1>選択画面</h1>
    <div class="selectImgArea">
      <img class="selectImg" :src="require(`@/assets/img/${player}_stand.gif`)" alt="">
    </div>
    <router-link :to="`battle/${player}`">スタート</router-link>
    <div class="bl_media_container">
      <div class="bl_media_itemWrapper">
        <div class="bl_media_item">
          <p class="img"><img class="cardImg" :src="require(`@/assets/img/haru_stand.gif`)" alt=""></p>
          <h3>haru</h3>
          <input type="button" @click="player = 'haru'" value="選択"/>
        </div>
      </div>
      <div class="bl_media_itemWrapper">
        <div class="bl_media_item">
          <p class="img"><img class="cardImg" :src="require(`@/assets/img/kaki_stand.gif`)" alt=""></p>
          <h3>kaki</h3>
          <input type="button" @click="player = 'kaki'" value="選択"/>
        </div>
      </div>
      <div class="bl_media_itemWrapper">
        <div class="bl_media_item">
          <p class="img"><img class="cardImg" :src="require(`@/assets/img/kuni_stand.gif`)" alt=""></p>
          <h3>kuni</h3>
          <input type="button" @click="player = 'kuni'" value="選択"/>
        </div>
      </div>
      <div class="bl_media_itemWrapper">
        <div class="bl_media_item">
          <p class="img"><img class="cardImg" :src="require(`@/assets/img/eda_stand.gif`)" alt=""></p>
          <h3>eda</h3>
          <input type="button" @click="player = 'eda'" value="選択"/>
        </div>
      </div>
      <div class="bl_media_itemWrapper">
        <div class="bl_media_item">
          <p class="img"><img src="img/..." alt=""></p>
          <h3>coming soon...</h3>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  data() {
    return {
      player: 'eda'
    }
  },
  methods: {}
}
</script>

<style>
* {
  list-style: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img {
  width: 100%;
  vertical-align: bottom;
}

/* ここからカードレイアウトのスタイリング */
/* PC　3カラム */
.bl_media_container {
  display: flex;
  flex-wrap: wrap;
  margin: calc(-30px / 2);
  padding: 30px;
}

.bl_media_itemWrapper {
  width: calc(100% / 4 - 30px);
  margin: calc(30px / 2);
}

.bl_media_item {
  outline: 1px solid #000;
  font-size: 1.5vw;
}

/* タブレット　2カラム */
@media screen and (max-width: 1024px) {
  .bl_media_itemWrapper {
    width: calc(100% / 2 - 30px);
  }
}

/* スマホ 1カラム*/
@media screen and (max-width: 599px) {
  .bl_media_itemWrapper {
    width: calc(100% / 1 - 30px);
  }
}

.selectImg{
  width: 10%;
  border: solid 2px #00bfff;
}
.cardImg{
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: 100% 10%
}

</style>
