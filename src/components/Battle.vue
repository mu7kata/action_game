<template>
  <div id="app">
    <div class="centeringParent">
      <div class="floar">
        <div style="display: flex;justify-content: space-between;">
          <div class="life-frame">
            <div class="player-life-bar"></div>
            <div class="life-mark"></div>
          </div>
          <div class="life-frame">
            <div class="enemy-life-bar"></div>
            <div class="life-mark"></div>
          </div>
        </div>
        <div class="battleField">
          <div class="player">
            <img class="object" ref="player" :src="playerImage" :style="{ transform: `translate(${p_x}px, ${p_y}px)` }">
          </div>
          <div class="enemy">
            <img class="object" ref="enemy" :src="enemyImage" :style="{ transform: `translate(${e_x}px, ${e_y}px)` }">
          </div>
        </div>
        <div class="action">
          <button @click="leftMove">左</button>
          <button @click="rightMove">右</button>
          <button @click="attackMove">攻撃</button>
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
      player: '',
      p_x: 0,
      p_y: 0,
      e_x: 200,//敵キャラの位置（横）
      e_y: 0,//敵キャラの位置（縦）
      playerImage: '',
      enemyImage: require('@/assets/img/enamy_1_stand.gif'),
      p_life: 10,
      e_life: 10,
      keyCode: null,
      playerStatus: '',
      enemyStatus: '',
    }
  }, mounted() {
    this.player = this.$route.params.playerName;
    this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
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
      this.playerImage = require(`@/assets/img/${this.player}_attack.gif`);
      this.playerStatus = 'attack';
      setTimeout(() => {
          this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
          this.playerStatus = '';
        }
        , 450
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
    damageMove() {
      this.playerImage = require(`@/assets/img/${this.player}_damage.gif`);
      this.playerStatus = 'damage';
      if (this.p_life <= 0) {
        this.deadMove();
        return;
      }

      setTimeout(() => {
          this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
          this.playerStatus = '';
        }
        , 500
      );

    },
    gardMove() {
      this.playerImage = require(`@/assets/img/${this.player}_gard.gif`);

      setTimeout(() => {
          this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
          this.playerStatus = '';
        }
        , 4000
      );
      document.addEventListener('keyup', this.onKeyUp);
      this.playerStatus = 'gard';
    },
    deadMove() {
      this.playerImage = require(`@/assets/img/${this.player}_dead.gif`);
      this.playerStatus = 'dead';
    },
    p_life_decrease() {
      if (this.playerStatus == 'gard' || this.playerStatus == 'damage' || this.playerStatus == 'dead') {
        return;
      }

      this.p_life = this.p_life - 5;
      //体力ゲージ消費処理
      const lifeBar = document.getElementsByClassName('player-life-bar');
      lifeBar[0].style.width = this.p_life * 10 + "%"
      this.damageMove();

    },
    e_life_decrease() {
      if (this.enemyStatus == 'damage' || this.enemyStatus == 'dead') {
        return;
      }
      this.e_life = this.e_life - 1;
      //体力ゲージ消費処理
      const lifeBar = document.getElementsByClassName('enemy-life-bar');
      lifeBar[0].style.width = this.e_life * 10 + "%";
      this.enemyDamageMove();
    },
    isConflict() {
      const enemyDom = this.$refs.enemy;
      const enemyRect = enemyDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得
      const playerDom = this.$refs.player;
      const playerRect = playerDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得

      if ((enemyRect.right - playerRect.right) < 200) {
        return true;
      }
      return false
    },
    enemyDeadMove() {
      this.enemyImage = require('@/assets/img/enamy_1_dead.gif');

      setTimeout(() => {
          this.enemyImage = require('@/assets/img/enamy_1_deading.gif');
        }
        , 250
      );
      this.enemyStatus = 'dead';
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
      if (this.enemyStatus == 'damage' || this.enemyStatus == 'dead') {
        return;
      }
      //死亡アクション
      if (this.e_life <= 0) {
        this.enemyDeadMove();
        return;
      }
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
    enemyDamageMove() {
      this.enemyImage = require('@/assets/img/enamy_1_damege.gif');
      this.enemyStatus = 'damage';
      setTimeout(() => {
          this.enemyImage = require('@/assets/img/enamy_1_stand.gif');
          this.enemyStatus = '';
        }
        , 880
      );
    },
    onKeyDown(event) {

      if (this.playerStatus == 'damage' || this.playerStatus == 'dead') {
        return;
      }
      this.keyCode = event.keyCode
      const ArrowRight = 39;
      const ArrowLeft = 37;
      const ArrowDown = 40;
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
      if (this.keyCode == ArrowDown && this.playerStatus != 'gard') {
        this.gardMove();
      }
    },
    onKeyUp() {

      this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
      this.playerStatus = '';
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

.player > .object {
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
  /*background-color: #03A9F4; !* 背景色指定 *!*/
  width: 1200px; /* 幅指定 */
  height: 500px; /* 高さ指定 */
  margin: 0 auto; /* 中央寄せ */
}

.battleField {
  height: 100%;
  width: 100%;

  /* フレックスコンテナであることを指定 */
  display: flex;
  /* 交差軸：上下の配置 */
  align-items: flex-end;
}

.enemy > .object {
  width: 200px;
  height: 200px;
}


/**
体力ゲージ
 */
.life-frame {
  margin-top: 20px;
  width: 30%;
  background-color: rgba(10, 0, 50, 0.6);
  display: flex;
  padding: 3px 3px;
}

.player-life-bar, .enemy-life-bar {
  height: 20px;
  background-color: rgb(0, 255, 255);
  transition: 300ms;
  width: 100%;
}

</style>
