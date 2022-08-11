<template>
  <div id="app">
    <div class="floar">
      <div class="player">
        <img class="object" ref="player" :src="playerImage" :style="{ transform: `translate(${p_x}px, ${p_y}px)` }">
        {{ p_life }}
      </div>
      <div class="enemy">
        <img class="object" ref="enemy" :src="enemyImage" :style="{ transform: `translate(${e_x}px, ${e_y}px)` }">
        {{ e_life }}
      </div>
      <div class="action">
        <button @click="leftMove">左</button>
        <button @click="rightMove">右</button>
        <button @click="attackMove">攻撃</button>
      </div>
      <div class="lifeGage">
        プレイヤー：{{ p_life }} 　　　相手：{{ e_life }}
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
      playerImage:require('@/assets/img/kaki_stand.gif'),
      enemyImage:require('@/assets/img/sample_stand.gif'),
      p_life: 10,
      e_life: 10
    }
  }, mounted() {
    this.enemyAutoAction();
  },
  methods: {
    rightMove() {
      this.p_x = this.p_x + 50
    },
    leftMove() {
      this.p_x = this.p_x - 50
    },
    attackMove() {
      this.playerImage =require('@/assets/img/kaki_attack.gif');

      setTimeout(() => {
          this.playerImage =require('@/assets/img/kaki_stand.gif');
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
      if (this.e_x > 1000) {
        this.e_x = 900;
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
      this.enemyImage = require('@/assets/img/sample_attack.gif');



      setTimeout(() => {
          this.enemyImage = require('@/assets/img/sample_stand.gif');
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

.object {
  width: 300px;
  height: 200px;
}

.enemy {
  display: inline;
  width: 10px;
  right: 200px;
}

.floar {
  width: 1000px;
  margin: auto 0;
}
</style>
