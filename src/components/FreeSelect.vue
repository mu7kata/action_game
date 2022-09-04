<template>
  <div id="app">
    <h1><i class="bi bi-person-check-fill me-2"></i> キャラクター選択画面</h1>

    <div class="row w-50 m-auto">
      <div class="col-sm-6">
        <h3>選択中：{{ selectPlayerDisplayName }}</h3>
        <div class=" ">
          <img class="selectImg" :src="require(`@/assets/img/${selectPlayerImgName}_stand.gif`)" alt="">
        </div>
      </div>
      <div class="col-sm-6">
        <h3>選択中：{{ selectEnemyDisplayName }}</h3>
        <div class=" ">
          <img class="selectImg" :src="require(`@/assets/img/${selectEnemyImgName}_stand.gif`)" alt="">
        </div>
      </div>
    </div>
    <div class="mt-3">
      <div v-if="!selectStatus">
        <button class="button bg-light p-2 fs-4" @click="confirmChara">
          　このキャラクターですすむ<i class="bi bi-arrow-right ms-2"></i>　
        </button>
      </div>
      <div v-if="selectStatus" class="startArea w-25 m-auto">
        <div>
          <router-link class="button startButton mb-2 fs-3" :to="`battle/${selectPlayerImgName}/1`">
            バトルスタート <i class="bi bi-arrow-right ms-2"></i>
          </router-link>
        </div>
        <div v-if="selectStatus"><a class="reSelectButton pt-4" @click="confirmChara">　<i
          class="bi bi-arrow-clockwise me-2"></i>キャラクターを選択しなおす</a></div>
      </div>
    </div>
    <div class="w-50 m-auto text-start pt-5 fs-3">
      <p class="mb-0 ms-5">使いたいキャラクターを選択してください</p>
    </div>
    <div class="bl_media_container col-sm-6">
      <div class="bl_media_itemWrapper" v-for="player in playerList">
        <div class="button" @click="selectCharaType = player.displayName">
          <div class="button" @click=`select${selectCharaType}DisplayName = ${player.displayName}`'>
            {{selectPlayerDisplayName}}
          <label>
            <img class="cardImg" :src="require(`@/assets/img/${player.imgName}_face.gif`)" alt="">
            <input style="display: none" type="button" @click='`select${selectCharaType}ImgName = player.imgName`' value="選択"/>
          </label>
        </div>
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
      selectEnemyDisplayName: 'かき2',
      selectEnemyImgName: 'kaki',
      playerList: [
        {imgName: 'kaki', displayName: 'かき'},
        {imgName: 'kuni', displayName: 'くに'},
        {imgName: 'eda', displayName: 'えだ'},
        {imgName: 'haru', displayName: 'はる'},
      ],
      // enemyList: [
      //   {imgName: 3, displayName: 'えだ'},
      // {imgName: '1', displayName: 'かき'},
      // {imgName: '2', displayName: 'くに'},
      // {imgName: 'haru', displayName: 'はる'},
      // ],
      selectStatus: false,
      accordionButtonClass: "bi bi-caret-right-fill me-2",
      selectCharaType: 'Player',
    }
  },
  methods: {
    confirmChara() {
      if (this.selectStatus == false) {
        if (this.selectCharaType == 'Player') {
          this.selectCharaType = 'Enemy';
          return
        }

        return this.selectStatus = true
      }
      return this.selectStatus = false
    },
    openAccordion() {
      let right = "bi bi-caret-right-fill me-2";
      let down = "bi bi-caret-down-fill me-2";
      if (this.accordionButtonClass == down) {
        return this.accordionButtonClass = right;
      }
      return this.accordionButtonClass = down;
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
