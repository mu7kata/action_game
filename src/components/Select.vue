<template>
  <div id="app">
    <h1>キャラクター選択画面</h1>
    <h3>選択</h3>
    <div class="selectImgArea">
      <img class="selectImg" :src="require(`@/assets/img/${selectPlayer}_stand.gif`)" alt="">
    </div>
    <router-link :to="`battle/${selectPlayer}`">スタート</router-link>
    <div class="bl_media_container">
      <div class="bl_media_itemWrapper" v-for="player in playerList">
        <div class="bl_media_item">
          <p class="img">
            <img class="cardImg" :src="require(`@/assets/img/${player.imgName}_stand.gif`)" alt="">
          </p>
          <h3>{{ player.displayName }}</h3>
          <input type="button" @click="selectPlayer = player.imgName" value="選択"/>
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
      selectPlayer: 'eda',
      playerList: [
        {imgName: 'eda', displayName: 'eda'},
        {imgName: 'kuni', displayName: 'kuni'},
        {imgName: 'haru', displayName: 'haru'},
        {imgName: 'kaki', displayName: 'kaki'}
      ]
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

/*img {*/
/*  width: 100%;*/
/*  vertical-align: bottom;*/
/*}*/

/* ここからカードレイアウトのスタイリング */
/* PC　3カラム */
.bl_media_container {
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  /*margin: calc(-30px / 2);*/
  margin: 0 auto;
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

.selectImg {
  width: 10%;
  border: solid 2px #00bfff;
}

.cardImg {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: 100% 10%
}

h1 {
  text-align: left;
  margin: 1em;
}
</style>
