<template>
  <div id="app">
    <div class="centeringParent">
      <div class="floar">
        <!--        <div class="battleField">-->
        <!--        <div class="player">-->
        <!--          <img class="object" ref="player" :src="playerImage" :style="{ transform: `translate(${p_x}px, ${p_y}px)` }">-->
        <!--          {{ p_life }}-->
        <!--        </div>-->
        <!--        <div class="enemy">-->
        <!--          <img class="object" ref="enemy" :src="enemyImage" :style="{ transform: `translate(${e_x}px, ${e_y}px)` }">-->
        <!--          {{ e_life }}-->
        <!--        </div>-->
        <!--        </div>-->
        <div class="battleField">
          <div class="player">
            <img class="object" ref="player" :src="playerImage" :style="{ transform: `translate(${p_x}px, ${p_y}px)` }">
            {{ p_life }}
          </div>
          <div class="enemy">
            <img class="object" ref="enemy" :src="enemyImage" :style="{ transform: `translate(${e_x}px, ${e_y}px)` }">
            {{ e_life }}
          </div>
        </div>
        <div class="action">
          <button @click="leftMove">左</button>
          <button @click="rightMove">右</button>
          <button @click="attackMove">攻撃</button>
        </div>
        <div class="lifeGage">
          【体力】
          プレイヤー：{{ p_life }} 　　　相手：{{ e_life }}
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
      p_x: 0,
      p_y: 0,
      e_x: 200,//敵キャラの位置（横）
      e_y: 0,//敵キャラの位置（縦）
      playerImage: require('@/assets/img/kaki_stand.gif'),
      enemyImage: require('@/assets/img/enamy_1_stand.gif'),
      p_life: 10,
      e_life: 10,
      keyCode: null
    }
  }, mounted() {
    this.enemyAutoAction();
    document.addEventListener('keydown', this.onKeyDown);
    this.e_x = 850;
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    rightMove() {
      //移動制限
      if (this.p_x == 950) {
        return;
      }
      this.p_x = this.p_x + 50
    },
    leftMove() {


      //移動制限
      if (this.p_x < 50) {
        return;
      }
      this.p_x = this.p_x - 50
    },
    attackMove() {
      this.playerImage = require('@/assets/img/kaki_attack.gif');

      setTimeout(() => {
          this.playerImage = require('@/assets/img/kaki_stand.gif');
        }
        , 880
      );
      //物体同士の正徳を検知したらダメージを減らす
      if (this.isConflict()) {
        this.e_life_decrease();
        setTimeout(() => {
            this.e_x = +550;
          }
          , 500
        );
      }
    },
    p_life_decrease() {
      this.p_life = this.p_life - 1;
    },
    e_life_decrease() {
      this.e_life = this.e_life - 1;
    },
    isConflict() {
      const enemyDom = this.$refs.enemy;
      const enemyRect = enemyDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得
      const playerDom = this.$refs.player;
      const playerRect = playerDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得

      if ((enemyRect.right - playerRect.right) < 300) {
        return true;
      }
      return false
    },
    enemyAutoAction() {
      this.enemyMove();
      setTimeout(() => {
          this.enemyAutoAction()
        }
        , 300
      );
    },
    enemyMove() {
      let x_num = this.getRandam(-100, 100);
      if (this.isConflict()) {
        //攻撃をランダムに実行
        if ((this.e_x % 3) == 0 && this.e_x != 0) {
          this.enemyAttackMove();
        }
        setTimeout(() => {
            this.e_x = this.e_x + x_num;
          }
          , 400
        );

      } else {
        this.e_x = this.e_x + x_num;
      }
      if (this.e_x < 0) {
        this.e_x = 10;
      }
      if (this.e_x > 900) {
        this.e_x = 850;
      }

    },
    getRandam(n, m) {
      let num = 0;
      for (let i = 0; i < 5; i++) {
        num = Math.floor(Math.random() * (m + 1 - n)) + n;
      }
      return num;
    },
    enemyAttackMove() {
      this.enemyImage = require('@/assets/img/enamy_1_attack.gif');


      setTimeout(() => {
          this.enemyImage = require('@/assets/img/enamy_1_stand.gif');
        }
        , 880
      );
      setTimeout(() => {
          this.p_x = -50;
        }
        , 500
      );
      //物体同士の正徳を検知したらダメージを減らす
      if (this.isConflict()) {
        this.p_life_decrease();
      }
    },
    onKeyDown(event) {
      this.keyCode = event.keyCode

      const ArrowRight = 39;
      const ArrowLeft = 37;
      const enter = 13;//TODO:追加アクションで設定する
      const space = 32;
      if (this.keyCode == ArrowRight) {
        this.rightMove();
      }
      if (this.keyCode == ArrowLeft) {
        this.leftMove();
      }
      if (this.keyCode == space) {
        this.attackMove();
      }


    }
  }
}
</script>
<style>
.action {
  margin-top: 25px;
}

.player {
  display: inline;
  width: 10px;
}

.player>.object {
  width: 300px;
  height: 200px;
}

.enemy {
  display: inline;
  width: 10px;
  right: 200px;
}

.centeringParent {
  padding: 20px; /* 余白指定 */
  background-color: #ddd; /* 背景色指定 */ /* 高さ指定 */
}

.floar {
  background-color: #03A9F4; /* 背景色指定 */
  width: 1200px; /* 幅指定 */
  height: 500px; /* 高さ指定 */
  margin: 0 auto; /* 中央寄せ */
}

.battleField{
  height: 100%;
  width: 100%;

  /* フレックスコンテナであることを指定 */
  display: flex;
  /* 交差軸：上下の配置 */
  align-items: flex-end;
}

.enemy>.object {
  width: 200px;
  height: 200px;
}
</style>
