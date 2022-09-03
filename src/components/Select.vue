<template>
  <div id="app">
    <h1><i class="bi bi-person-check-fill me-2"></i> キャラクター選択画面</h1>
    <h3>選択中：{{ selectPlayerDisplayName }}</h3>
    <div class=" ">
      <img class="selectImg" :src="require(`@/assets/img/${selectPlayerImgName}_stand.gif`)" alt="">
    </div>
    <div class="mt-5">
      <div v-if="!selectStatus" >
        <button class="button bg-light p-2 fs-4" @click="confirmChara">
          <i class="bi bi-arrow-right me-2"></i> このキャラクターですすめる
        </button>
      </div>
      <div v-if="selectStatus">
        <p class="mb-4 fs-4">5かい "かち" でゲームクリア</p>
        <router-link class="button startButton p-3 fs-3" :to="`battle/${selectPlayerImgName}/1`">
          バトルスタート <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>
    </div>
    <div></div>
    <div class="w-50 m-auto text-start pt-5 fs-3">
      <p class="mb-0 ms-5">使いたいキャラクターを選択してください</p>
    </div>
    <div class="bl_media_container">
      <div class="bl_media_itemWrapper" v-for="player in playerList">
        <div class="button" @click="selectPlayerDisplayName = player.displayName">
          <label>
            <img class="cardImg" :src="require(`@/assets/img/${player.imgName}_face.gif`)" alt="">
            <input style="display: none" type="button" @click="selectPlayerImgName = player.imgName" value="選択"/>
          </label>
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
      selectPlayerImgName: 'kaki',
      selectPlayerDisplayName: 'かき',
      playerList: [
        {imgName: 'kaki', displayName: 'かき'},
        {imgName: 'kuni', displayName: 'くに'},
        {imgName: 'eda', displayName: 'えだ'},
        {imgName: 'haru', displayName: 'はる'},
      ],
      selectStatus:false,
    }
  },
  methods: {
    confirmChara(){
      this.selectStatus =true
    },

  }
}
</script>

<style>
* {
  list-style: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.startButton{
  background-color: #00ffff;
}

/* ここからカードレイアウトのスタイリング */
/* PC　3カラム */
.bl_media_container {
  width: 40%;
  display: flex;
  flex-wrap: wrap;
  /*margin: calc(-30px / 2);*/
  margin: 0 auto;
  padding: 10px 30px 30px 30px;
}

.bl_media_itemWrapper {
  width: calc(100% / 4 - 30px);
  margin: calc(30px / 2);
}

/*.bl_media_item {*/
/*  outline: 1px solid #000;*/
/*  background: #fff;*/
/*  border-radius: 5px;*/
/*  box-shadow: 0 0.05rem 0.2rem rgb(0 0 0 / 90%);*/
/*}*/

/*.bl_media_item:hover {*/
/*  box-shadow: 0 0.1rem 0.5rem rgb(0 0 0 / 90%);*/
/*  transition: all .5s;*/
/*  background-color: #dddddd;*/
/*}*/

.bl_media_item:active {
  box-shadow: 0 0.05rem 0.2rem rgb(0 0 0 / 90%);
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
  box-shadow: 4px 0 black,
  -4px 0 black,
  0 4px black,
  0 -4px black;
}

.cardImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 100% 10%
}

.cardImg:hover {
  cursor: pointer;
}

h1 {
  text-align: left;
  margin: 1em;
}

label {
  display: block;
}

</style>
