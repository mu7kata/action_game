<template>
  <div id="app">
    <h1><span class="me-2">■</span> キャラクター選択画面</h1>

    <!-- キャラ選択ガイド -->
    <p class="select-guide-text fs-4">使いたいキャラクターを選択してください</p>

    <!-- キャラカード -->
    <div class="card-container">
      <div class="card-item" v-for="player in playerList" :key="player.imgName"
           :class="{ 'card-selected': selectPlayerImgName === player.imgName }"
           @click="selectPlayer(player)">
        <img class="cardImg" :src="getImageUrl(`${player.imgName}_face.gif`)" alt="">
        <p class="card-name">{{ player.displayName }}</p>
      </div>
    </div>

    <!-- 選択中プレビュー -->
    <div class="preview-section">
      <h3>選択中：{{ selectPlayerDisplayName }}</h3>
      <img class="selectImg" :src="getImageUrl(`${selectPlayerImgName}_stand.gif`)" alt="">
    </div>

    <!-- アクションボタン -->
    <div class="mt-3">
      <div v-if="!selectStatus">
        <button class="button bg-light p-2 fs-4" @click="confirmChara">
          　このキャラクターですすむ<span class="ms-2">→</span>
        </button>
      </div>
      <div v-if="selectStatus" class="startArea m-auto">
        <p class="mb-2 pt-2 fs-4">3かい "かち" でゲームクリア</p>
        <div>
        <router-link class="button startButton mb-2 fs-3" :to="`battle/${selectPlayerImgName}/1`">
          バトルスタート <span class="ms-2">→</span>
        </router-link>
        </div>
      <div v-if="selectStatus"><a  class="reSelectButton pt-4" @click="confirmChara">　<span class="me-2">↻</span>キャラクターを選択しなおす</a></div>
      </div>
    </div>

    <!-- 操作方法（最下部） -->
    <div class="mt-5 fs-4 m-auto instructions-section">
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
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getImageUrl } from '@/utils/imageLoader'

interface PlayerInfo {
  imgName: string
  displayName: string
}

export default defineComponent({
  name: 'Select',
  data() {
    return {
      selectPlayerImgName: 'haru',
      selectPlayerDisplayName: 'はるか',
      playerList: [
        {imgName: 'haru', displayName: 'はるか'},
        {imgName: 'kaki', displayName: 'カッキー'},
        {imgName: 'eda', displayName: 'えだまつ'},
        {imgName: 'kuni', displayName: 'くにあき'},
      ] as PlayerInfo[],
      selectStatus: false,
      accordionIcon: "▶"
    }
  },
  methods: {
    getImageUrl,
    selectPlayer(player: PlayerInfo) {
      this.selectPlayerImgName = player.imgName
      this.selectPlayerDisplayName = player.displayName
    },
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
})
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.startButton {
  background-color: #00ffff;
  display: inline-block;
}

.reSelectButton:hover {
  cursor: pointer;
}

.startArea {
  color: #2E2E2E;
  text-decoration: none;
  box-shadow: 4px 0 black,
  -4px 0 black,
  0 4px black,
  0 -4px black;
  height: 10em;
  width: 25%;
}

/* キャラカードグリッド */
.card-container {
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 0 auto;
  padding: 10px 0 20px;
}

.card-item {
  width: calc(25% - 15px);
  cursor: pointer;
  text-align: center;
  padding: 8px;
  border: 3px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card-item:hover {
  border-color: #00cccc;
}

.card-selected {
  border-color: #00ffff;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.card-name {
  margin: 5px 0 0;
  font-size: 1rem;
}

.cardImg {
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: 100% 10%;
}

/* 選択ガイドテキスト */
.select-guide-text {
  margin: 0.5em 0;
}

/* プレビューセクション */
.preview-section {
  margin: 10px 0;
}

.selectImg {
  box-shadow: 4px 0 black,
  -4px 0 black,
  0 4px black,
  0 -4px black;
  width: 20%;
}

h1 {
  text-align: left;
  margin: 1em;
}

.instructions-section {
  width: 45%;
}

/* スマホ */
@media screen and (max-width: 599px) {
  .card-container {
    width: 90%;
  }
  .card-item {
    width: calc(50% - 15px);
  }
  .selectImg {
    width: 40%;
  }
  .startArea {
    width: 80% !important;
  }
  .instructions-section {
    width: 95%;
  }
  h1 {
    font-size: 1.3rem;
    margin: 0.5em;
  }
}

</style>
