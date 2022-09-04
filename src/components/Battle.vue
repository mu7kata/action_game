<template>
  <div id="app">
    <div class="centeringParent">
      <div class="floar">
        <div style="display: flex;justify-content: space-between;">
          <div class="life-frame">
            <div class="player-life-bar"></div>
            <div class="life-mark"></div>
          </div>
          <!-- TODO: 削除する-->
          {{ this.$store.getters }}
          <div class="life-frame">
            <div class="enemy-life-bar"></div>
            <div class="life-mark"></div>
          </div>
        </div>
        <div class="battleField">
          <GameResult :matchEndMessage="matchEndMessage" v-show="gameResult" ref="gameResult"></GameResult>
          <div class="player">
            <img class="object" ref="player" :src="playerImage" :style="{ transform: `translate(${p_x}px, ${p_y}px)` }">
          </div>
          <div class="enemy">
            <img class="object" ref="enemy" :src="enemyImage" :style="{ transform: `translate(${e_x}px, ${e_y}px)` }">
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 fs-4 m-auto" style="width:14%">
      <div class="m-auto w-100">
        <h3 class="text-start">操作方法（コマンド一覧)</h3>
        <ul class="text-start">
          <li>弱こうげき ： スペースキー</li>
          <li>強こうげき ： エンターキー</li>
          <li>ガード ： ↓ キー</li>
          <li>いどう ： ← → キー</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import GameResult from "./GameResult.vue";
import Thanks from "./Thanks.vue";

export default {
  name: 'app',
  components: {
    GameResult,
    Thanks
  },
  data() {
    return {
      player: '',
      p_x: 0,
      p_y: 0,
      e_x: 200,//敵キャラの位置（横）
      e_y: 0,//敵キャラの位置（縦）
      playerImage: '',
      enemyImage: require('@/assets/img/enamy_1_stand.gif'),
      keyCode: null,
      playerStatus: '',
      enemyStatus: '',
      matchEndMessage: "",
      gameResult: false,
      enemyAbility: this.$store.getters['enemy/status'],
      playerAbility: this.$store.getters['player/status'],
      maxEnemyLife: '',//HACK:
      maxPlayerLife: '' //HACK:
    }
  }, mounted() {
    this.player = this.$route.params.selectPlayerImgName;
    this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
    this.enemyAutoAction();
    document.addEventListener('keydown', this.onKeyDown);
    this.e_x = 850;
    this.$store.commit("enemy/selectEnemy", this.$route.params.enemyNum);
    this.$store.commit("player/selectPlayer", this.$route.params.selectPlayerImgName);
    this.maxEnemyLife = this.enemyAbility.life;
    this.maxPlayerLife = this.playerAbility.life;
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown)
  },
  beforeRouteUpdate(to, from, next) {
    //再描画前のアクション
    next();
    //再描画後のアクション
    this.$refs.gameResult.reload();
  },
  methods: {
    rightMove() {
      //移動制限
      if (this.p_x == 1150) {
        return;
      }
      //敵との距離制限
      if (this.e_x - this.p_x < 220) {
        this.p_x = this.p_x - 10
        return;
      }
      this.p_x = this.p_x + this.playerAbility.motionRange;
    },
    leftMove() {
      //移動制限
      if (this.p_x < -100) {
        return;
      }
      this.p_x = this.p_x - this.playerAbility.motionRange;
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


      // 遠距離タイプだった場合の処理
      if (this.playerAbility.attackType == 'longDistance') {
        setTimeout(() => {
        this.enemyLifeDecrease();
            // this.e_x = +550;
          }
          , 400
        );
      }

      //物体同士の衝突を検知したらダメージを減らす
      if (this.isConflict()) {
        this.enemyLifeDecrease();
      }
    },
    damageMove() {
      this.playerImage = require(`@/assets/img/${this.player}_damage.gif`);
      this.playerStatus = 'damage';
      if (this.playerAbility.life <= 0) {
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
      this.showGameResult();
    },
    playerLifeDecrease() {
      if (this.playerStatus == 'gard') {
        this.playerImage = require(`@/assets/img/${this.player}_garding.gif`);
        setTimeout(() => {
            this.p_x = this.p_x - 150;
          }
          , 300
        );
        return;
      }

      if (this.playerStatus == 'damage' || this.playerStatus == 'dead') {
        return;
      }
      //体力ゲージ消費処理
      this.playerAbility.life = this.playerAbility.life - this.enemyAbility.attack;
      const lifeBar = document.getElementsByClassName('player-life-bar');
      lifeBar[0].style.width = this.playerAbility.life * 10 + "%"
      this.damageMove();
      setTimeout(() => {
          this.p_x = this.p_x - 200;
        }
        , 300
      );
    },
    enemyLifeDecrease() {
      if (this.enemyStatus == 'damage' || this.enemyStatus == 'dead') {
        return;
      }

      //体力ゲージ消費処理
      this.$store.commit("enemy/changeLife", this.playerAbility.attack)
      const lifeBar = document.getElementsByClassName('enemy-life-bar');
      let lessLife = Math.floor(this.enemyAbility.life / this.maxEnemyLife * 100)
      if (lessLife < 0) {
        // HACK:マイナスの値はなぜか反応しないため
        lessLife = 0;
      }
      lifeBar[0].style.width = lessLife + "%";

      this.enemyDamageMove();

      setTimeout(() => {
          if (this.e_x > 1100) {
            this.e_x = 1000;
          } else {
            this.e_x = this.e_x + 150;
          }
        }
        , 300
      );
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
      this.showGameResult();
    },
    enemyAutoAction() {
      this.enemyMove();
      setTimeout(() => {
          this.enemyAutoAction()
        }
        , this.enemyAbility.speed
      );
    },
    enemyMove() {
      //敵との距離制限
      if (this.e_x - this.p_x < 220) {
        this.e_x = this.e_x + 50
        return;
      }

      if (this.enemyStatus == 'damage' || this.enemyStatus == 'dead') {
        return;
      }
      //死亡アクション
      if (this.enemyAbility.life <= 0) {
        this.enemyDeadMove();
        return;
      }
      let x_num = this.getRandom(this.enemyAbility.motionRange);
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
        return;
      } else {
        this.e_x = this.e_x + x_num;
      }

      //移動制限(画面に合わせて)
      if (this.e_x < 0) {
        this.e_x = 10;
      }
      if (this.e_x > 1100) {
        this.e_x = 1050;
      }

    },
    getRandom(motionRange) {
      let n = motionRange / 2
      let num = 0;
      for (let i = 0; i < 5; i++) {
        num = Math.floor(Math.random() * (-motionRange + 1 - n)) + n;
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

      //物体同士の正徳を検知したらダメージを減らす
      if (this.isConflict()) {
        this.playerLifeDecrease();
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
    },
    showGameResult() {
      this.gameResult = true;
      if (this.playerAbility.life <= 0) {
        this.matchEndMessage = 'lose'
      }
      if (this.enemyAbility.life <= 0) {
        this.matchEndMessage = 'win'

        if (this.$route.params.enemyNum == 2) {
          this.matchEndMessage = 'clear'
        }
      }

    },
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
