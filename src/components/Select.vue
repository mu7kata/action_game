<template>
  <div id="app">
    <h1><span class="me-2">■</span> キャラクター選択画面</h1>
    <h3>選択中：{{ selectPlayerDisplayName }}</h3>
    <div class=" ">
      <img class="selectImg" :src="getImageUrl(`${selectPlayerImgName}_stand.gif`)" alt="">
    </div>


    <div class="mt-3">
      <div v-if="!selectStatus">
        <button class="button bg-light p-2 fs-4" @click="confirmChara">
          　このキャラクターですすむ<span class="ms-2">→</span>
        </button>
      </div>
      <div v-if="selectStatus" class="startArea w-25 m-auto">
        <p class="mb-2 pt-2 fs-4">3かい "かち" でゲームクリア</p>
        <div>
        <router-link class="button startButton mb-2 fs-3" :to="`battle/${selectPlayerImgName}/1`">
          バトルスタート <span class="ms-2">→</span>
        </router-link>
        </div>
      <div v-if="selectStatus"><a  class="reSelectButton pt-4" @click="confirmChara">　<span class="me-2">↻</span>キャラクターを選択しなおす</a></div>
      </div>
    </div>
    <div class=" mt-5 fs-4 m-auto " style="width: 45%;">
      <details class="text-start">
        <summary @click="openAccordion">
          <span class="me-2">{{ accordionIcon }}</span> 操作方法(コマンド)
        </summary>

        <div class="m-auto w-100">
          <ul class="text-start">
            <li>弱 こうげき ： スペースキー</li>
            <li>強 こうげき ： エンターキー</li>
            <li>ガード ： ↓ キー</li>
            <li>いどう ： ← → キー</li>
            <li v-if="selectPlayerImgName =='eda'">覚醒モード ： ↑ キー (5秒間 のうりょく値がすごくあがります)</li>
            <li class="mt-3">● そのた</li>
            <li>・えんきょりタイプときんきょりタイプがいます</li>
            <li>・れんぞくしてこうげきするとつかれます</li>
          </ul>
        </div>
      </details>
    </div>
    <div class="w-50 m-auto text-start pt-5 fs-3">
      <p class="mb-0 ms-5">使いたいキャラクターを選択してください</p>
    </div>
    <div class="bl_media_container">
      <div class="bl_media_itemWrapper" v-for="player in playerList" :key="player.imgName">
        <div class="button" @click="selectPlayerDisplayName = player.displayName">
          <label class="cardArea">
            <img class="cardImg" :src="getImageUrl(`${player.imgName}_face.gif`)" alt="">
            <input style="display: none" type="button" @click="selectPlayerImgName = player.imgName" value="選択"/>
          </label>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { getImageUrl } from '@/utils/imageLoader'

export default {
  name: 'app',
  components: {},
  data() {
    return {
      selectPlayerImgName: 'haru',
      selectPlayerDisplayName: 'はるか',
      playerList: [
        {imgName: 'haru', displayName: 'はるか'},
        {imgName: 'kaki', displayName: 'カッキー'},
        {imgName: 'eda', displayName: 'えだまつ'},
        {imgName: 'kuni', displayName: 'くにあき'},
      ],
      selectStatus: false,
      accordionIcon: "▶"
    }
  },
  methods: {
    getImageUrl,
    confirmChara() {
      if (this.selectStatus == false) {
        return this.selectStatus = true
      }
      return this.selectStatus = false
    },
    openAccordion() {
      this.accordionIcon = this.accordionIcon === '▼' ? '▶' : '▼';
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



.startButton {
  background-color: #00ffff;
  display: inline-block;
}

.reSelectButton:hover{
  cursor:pointer;
}

.startArea {
  color: #2E2E2E;
  text-decoration: none;
  box-shadow: 4px 0 black,
  -4px 0 black,
  0 4px black,
  0 -4px black;
  height: 10em;
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
  box-shadow: 4px 0 black,
  -4px 0 black,
  0 4px black,
  0 -4px black;
  width: 10% !important;
  /*!*transform: scale(-1, 1);*! 敵キャラで使えるかも*/
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

.cardArea {
  display: block !important;
}

</style>
