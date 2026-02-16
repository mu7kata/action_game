<template>
  <div id="app">
    <div class="centeringParent">
      <div class="floar">
        <div style="display: flex;justify-content: space-between;">
          <div class="life-frame">
            <div class="player-life-bar" :style="{ width: playerLifePercent + '%' }"></div>
            <div class="life-mark"></div>
          </div>
          <div class="life-frame">
            <div class="enemy-life-bar" :style="{ width: enemyLifePercent + '%' }"></div>
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
    <div class="mt-5 fs-4 m-auto" style="width:45%">
      <div class="m-auto w-100">
        <h3 class="text-start">操作方法(コマンド)</h3>
        <ul class="text-start">
          <li>弱こうげき ： スペースキー ※ れんぞくでこうげきしすぎるとうごけなくなります</li>
          <li>強こうげき ： エンターキー</li>
          <li>ガード ： ↓ キー</li>
          <li>いどう ： ← → キー</li>
          <li v-if="player === 'eda'">覚醒モード ： ↑ キー (5秒間 のうりょく値がすごくあがります) ※ 一度のみ使用可能</li>
          <li>● そのた</li>
          <li>・えんきょりタイプときんきょりタイプがいます</li>
          <li>・れんぞくしてこうげきするとつかれます</li>
        </ul>
      </div>
    </div>
    <div>
      <a class="button p-2" href="/">
        ホームへ戻る <span>⌂</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameResult from "./GameResult.vue";
import { getImageUrl } from '@/utils/imageLoader';
import { usePlayerStore } from '@/stores/player'
import { useEnemyStore } from '@/stores/enemy'
import type { EnemyLevel } from '@/stores/enemy'
import type { PlayerName } from '@/stores/player'

export default defineComponent({
  name: 'Battle',
  components: {
    GameResult
  },
  data() {
    return {
      player: '',
      p_x: 0,
      p_y: 0,
      e_x: 200,//敵キャラの位置（横）
      e_y: 0,//敵キャラの位置（縦）
      playerImage: '',
      enemyImage: '',
      pressedKey: '' as string,
      playerStatus: '',
      wakeUpFlg: 'unused' as 'unused' | 'active' | 'used',
      enemyStatus: '',
      matchEndMessage: '',
      gameResult: false,
      maxEnemyLife: 0,
      maxPlayerLife: 0,
      enterKeyEnabled: true,
      attackCount: 0,
      playerLifePercent: 100,
      enemyLifePercent: 100,
      timers: [] as ReturnType<typeof setTimeout>[],
      gardTimerId: null as ReturnType<typeof setTimeout> | null
    }
  },
  computed: {
    enemyAbility() { return useEnemyStore().status },
    playerAbility() { return usePlayerStore().status },
  },
  mounted() {
    this.player = this.$route.params.selectPlayerImgName as string;
    this.playerImage = getImageUrl(`${this.player}_stand.gif`);
    this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_stand.gif`);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('keydown', this.onKeyDown);
    this.e_x = 850;
    useEnemyStore().selectEnemy(Number(this.$route.params.enemyNum) as EnemyLevel);
    usePlayerStore().selectPlayer(this.$route.params.selectPlayerImgName as PlayerName);
    this.maxEnemyLife = this.enemyAbility.life;
    this.maxPlayerLife = this.playerAbility.life;
    this.enemyAutoAction();
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.onKeyUp)
    document.removeEventListener('keydown', this.onKeyDown)
    this.timers.forEach(t => clearTimeout(t))
  },
  methods: {
    rightMove() {
      //移動制限
      if (this.p_x === 1150) {
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
      this.attackCount = 0;
      //移動制限
      if (this.p_x < -100) {
        return;
      }
      this.p_x = this.p_x - this.playerAbility.motionRange;
    },
    attackMove() {
      if (this.playerStatus === 'damage' || this.playerStatus === 'dead') {
        return;
      }
      this.playerImage = getImageUrl(`${this.player}_attack.gif`);
      this.playerStatus = 'attack';
      this.timers.push(setTimeout(() => {
          this.playerImage = getImageUrl(`${this.player}_stand.gif`);
          this.playerStatus = '';
        }
        , 450
      ));


      // 遠距離タイプだった場合の処理
      if (this.playerAbility.attackType === 'longDistance') {
        this.timers.push(setTimeout(() => {
            this.enemyLifeDecrease(this.playerAbility.attack);
            // this.e_x = +550;
          }
          , 400
        ));
        return;
      }

      //物体同士の衝突を検知したらダメージを減らす
      if (this.isConflict()) {
        let damage: number = this.playerAbility.attack
        if (this.wakeUpFlg === 'active') {
          damage = this.playerAbility.w_attack ?? this.playerAbility.attack;
        }
        this.enemyLifeDecrease(damage);
      }
    },
    strongAttackMove() {
      if (this.playerStatus === 'damage' || this.playerStatus === 'dead') {
        return;
      }
      this.attackCount = 0;
      this.playerImage = getImageUrl(`${this.player}_s_attack.gif`);
      this.playerStatus = 'attack';

      // 遠距離タイプだった場合の処理
      if (this.playerAbility.attackType === 'longDistance') {
        this.timers.push(setTimeout(() => {
            this.playerImage = getImageUrl(`${this.player}_stand.gif`);
            this.playerStatus = '';
          }
          , 1500
        ));

        let beforePlayerLife = this.playerAbility.life;
        this.timers.push(setTimeout(() => {
            //敵から攻撃を受けたら攻撃を中止する
            if (beforePlayerLife !== this.playerAbility.life) {
              if (this.wakeUpFlg !== 'active') {
                return
              }
            }
            this.enemyLifeDecrease(this.playerAbility.attack * 1.5);//強攻撃は弱攻撃の1.5倍に。
          }
          , 1500
        ));
        return;
      }
      this.timers.push(setTimeout(() => {
          this.playerImage = getImageUrl(`${this.player}_stand.gif`);
          this.playerStatus = '';
        }
        , 700
      ));

      //物体同士の衝突を検知したらダメージを減らす
      if (this.isConflict()) {
        this.timers.push(setTimeout(() => {
            let damage: number = this.playerAbility.attack
            if (this.wakeUpFlg === 'active') {
              damage = this.playerAbility.w_attack ?? this.playerAbility.attack;
            }
            this.enemyLifeDecrease(damage * 1.5);
          }
          , 600
        ))
      }

    },
    wakeUpMove() {

      if (this.wakeUpFlg === 'unused' && this.player === 'eda') { //TODO：一旦枝まつのみ
        this.wakeUpFlg = 'active';
        this.playerImage = getImageUrl(`${this.player}_awake.gif`);
        this.timers.push(setTimeout(() => {
            this.player = this.player + '_w';
            this.playerImage = getImageUrl(`${this.player}_stand.gif`);
          }
          , 1000
        ));
        this.timers.push(setTimeout(() => {

            this.player = this.player.replace("_w", "");
            this.playerImage = getImageUrl(`${this.player}_stand.gif`);
            this.wakeUpFlg = 'used';
          }
          , 7000
        ));
      }
    },
    damageMove() {
      this.attackCount = 0;
      this.playerImage = getImageUrl(`${this.player}_damage.gif`);
      this.playerStatus = 'damage';
      if (this.playerAbility.life <= 0) {
        this.deadMove();
        return;
      }

      this.timers.push(setTimeout(() => {
          this.playerImage = getImageUrl(`${this.player}_stand.gif`);
          this.playerStatus = '';
        }
        , 500
      ));

    },
    gardMove() {
      this.playerImage = getImageUrl(`${this.player}_gard.gif`);
      this.attackCount = 0;

      const onKeyUpHandler = () => {
        if (this.gardTimerId !== null) {
          clearTimeout(this.gardTimerId);
          this.gardTimerId = null;
        }
        this.playerImage = getImageUrl(`${this.player}_stand.gif`);
        this.playerStatus = '';
      };

      this.gardTimerId = setTimeout(() => {
          this.playerImage = getImageUrl(`${this.player}_stand.gif`);
          this.playerStatus = '';
          document.removeEventListener('keyup', onKeyUpHandler);
          this.gardTimerId = null;
        }
        , 4000
      );
      this.timers.push(this.gardTimerId);
      document.addEventListener('keyup', onKeyUpHandler, { once: true });
      this.playerStatus = 'gard';
    },
    deadMove() {
      this.playerImage = getImageUrl(`${this.player}_dead.gif`);
      this.playerStatus = 'dead';
      this.showGameResult();
    },
    playerLifeDecrease() {
      if (this.playerStatus === 'gard' || this.wakeUpFlg === 'active') {
        this.playerImage = getImageUrl(`${this.player}_garding.gif`);
        this.timers.push(setTimeout(() => {
            this.p_x = this.p_x - 150;
          }
          , 300
        ));
        return;
      }

      if (this.playerStatus === 'damage' || this.playerStatus === 'dead') {
        return;
      }
      //体力ゲージ消費処理
      usePlayerStore().changeLife(this.enemyAbility.attack);
      let lessLife = this.playerAbility.life / this.maxPlayerLife * 100
      if (lessLife < 0) {
        // HACK:マイナスの値はなぜか反応しないため
        lessLife = 0;
      }
      this.playerLifePercent = lessLife;
      this.damageMove();
      this.timers.push(setTimeout(() => {
          if (this.p_x < -250) {
            return;
          }
          this.p_x = this.p_x - 200;
        }
        , 300
      ));
    },
    enemyLifeDecrease(damage: number) {
      if (this.enemyStatus === 'damage' || this.enemyStatus === 'dead') {
        return;
      }
      //体力ゲージ消費処理
      useEnemyStore().changeLife(damage)
      let lessLife = Math.floor(this.enemyAbility.life / this.maxEnemyLife * 100)
      if (lessLife < 0) {
        // HACK:マイナスの値はなぜか反応しないため
        lessLife = 0;
      }
      this.enemyLifePercent = lessLife;

      this.enemyDamageMove();

      this.timers.push(setTimeout(() => {
          if (this.e_x > 1100) {
            this.e_x = 1000;
          } else {
            this.e_x = this.e_x + 150;
          }
        }
        , 300
      ));
    },
    isConflict() {
      const enemyDom = this.$refs.enemy as HTMLElement;
      const enemyRect = enemyDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得
      const playerDom = this.$refs.player as HTMLElement;
      const playerRect = playerDom.getBoundingClientRect(); // 要素の座標と幅と高さを取得

      const diff = enemyRect.right - playerRect.right;
      return diff >= 0 && diff < 300;
    },
    enemyDeadMove() {
      this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_dead.gif`);

      this.timers.push(setTimeout(() => {

          this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_deading.gif`);
        }
        , 250
      ));
      this.enemyStatus = 'dead';
      this.showGameResult();
    },
    enemyAutoAction() {
      if (this.gameResult) {
        return;
      }
      this.enemyMove();
      this.timers.push(setTimeout(() => {
          this.enemyAutoAction()
        }
        , this.enemyAbility.speed
      ));
    },
    enemyMove() {
      if (this.enemyStatus === 'damage' || this.enemyStatus === 'dead') {
        return;
      }
      //死亡アクション
      if (this.enemyAbility.life <= 0) {
        this.enemyDeadMove();
        return;
      }

      //敵との距離制限
      if (this.e_x - this.p_x < 220) {
        this.e_x = this.e_x + 50
        return;
      }
      let x_num = this.getRandom(this.enemyAbility.motionRange);
      if (this.isConflict()) {
        //攻撃をランダムに実行
        if ((this.e_x % 3) === 0 && this.e_x !== 0) {
          this.enemyAttackMove();
        }
        this.timers.push(setTimeout(() => {
            this.e_x = this.e_x + x_num;
          }
          , 400
        ));
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
    getRandom(motionRange: number) {
      const n = motionRange / 2
      const num = Math.floor(Math.random() * (-motionRange + 1 - n)) + n;
      return num;
    },
    enemyAttackMove() {
      this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_attack.gif`);

      this.timers.push(setTimeout(() => {
          this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_stand.gif`);
        }
        , 880
      ));

      //物体同士の正徳を検知したらダメージを減らす
      if (this.isConflict()) {
        this.playerLifeDecrease();
      }
    },
    enemyDamageMove() {
      this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_damege.gif`);
      this.enemyStatus = 'damage';
      this.timers.push(setTimeout(() => {
          this.enemyImage = getImageUrl(`enamy_${this.$route.params.enemyNum}_stand.gif`);
          this.enemyStatus = '';
        }
        , 800
      ));
    },
    onKeyUp(event: KeyboardEvent) {
      if (this.playerStatus === 'dead') {
        this.playerImage = getImageUrl(`${this.player}_dead.gif`);
        return;
      }
      if (this.playerStatus === 'damage') {
        return;
      }

      this.pressedKey = event.key
      switch (this.pressedKey) {
        case 'Enter':
        case ' ':
        case 'ArrowUp':
          event.preventDefault();
      }

      if (this.pressedKey === ' ') {
        this.attackCount = this.attackCount + 1;
        if (this.attackCount > 7) {
          this.playerImage = getImageUrl(`${this.player}_dead.gif`);
          this.playerStatus = 'damage';
          this.timers.push(setTimeout(() => {
              this.resetStatus()
              this.attackCount = 0;
            }
            , 2000
          ));
          return;
        }
        this.attackMove();
      }

      if (this.pressedKey === 'Enter' && this.enterKeyEnabled) {
        this.enterKeyEnabled = false;
        this.strongAttackMove();
        this.timers.push(setTimeout(() => {
            this.enterKeyEnabled = true;
          }
          , 1300
        ));
      }
    },
    onKeyDown(event: KeyboardEvent) {
      if (this.playerStatus === 'dead') {
        this.playerImage = getImageUrl(`${this.player}_dead.gif`);
        return;
      }
      if (this.playerStatus === 'damage') {
        return;
      }
      this.pressedKey = event.key

      switch (this.pressedKey) {
        case 'Enter':
        case ' ':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
      }

      if (this.pressedKey === 'ArrowRight') {
        this.rightMove();
      }
      if (this.pressedKey === 'ArrowLeft') {
        this.leftMove();
      }

      if (this.pressedKey === 'ArrowUp') {
        this.wakeUpMove();
      }

      //ガードのみキーを下げたときに機能させたい
      if (this.pressedKey === 'ArrowDown' && this.playerStatus !== 'gard') {
        this.gardMove();
      }
    },
    resetStatus() {
      this.playerImage = getImageUrl(`${this.player}_stand.gif`);
      this.playerStatus = '';
    },
    showGameResult() {
      this.gameResult = true;
      if (this.playerAbility.life <= 0) {
        this.matchEndMessage = 'lose'
      }
      if (this.enemyAbility.life <= 0) {
        this.matchEndMessage = 'win'

        if (Number(this.$route.params.enemyNum) === 3) {
          this.matchEndMessage = 'clear'
        }
      }

    },
  }
})
</script>
<style>
.action {
  margin-top: 25px;
}

.player {
  display: inline;
  width: 10px;
}

.player > .object, .enemy > .object {
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
