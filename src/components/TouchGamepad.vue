<template>
  <div v-show="visible" class="touch-gamepad">
    <div class="gamepad-inner">
      <!-- 左側: D-pad (十字キー) -->
      <div class="dpad">
        <button
          class="dpad-btn dpad-up"
          @touchstart.prevent="onWakeup"
        >
          ↑
        </button>
        <button
          class="dpad-btn dpad-left"
          @touchstart.prevent="startMoveLeft"
          @touchend.prevent="stopMoveLeft"
          @touchcancel.prevent="stopMoveLeft"
        >
          ←
        </button>
        <button
          class="dpad-btn dpad-right"
          @touchstart.prevent="startMoveRight"
          @touchend.prevent="stopMoveRight"
          @touchcancel.prevent="stopMoveRight"
        >
          →
        </button>
        <button
          class="dpad-btn dpad-down"
          @touchstart.prevent="onGuardStart"
          @touchend.prevent="onGuardEnd"
          @touchcancel.prevent="onGuardEnd"
        >
          ↓
        </button>
      </div>

      <!-- 右側: 攻撃ボタン -->
      <div class="attack-buttons">
        <button
          class="attack-btn weak-btn"
          @touchend.prevent="$emit('weak-attack')"
        >
          弱
        </button>
        <button
          class="attack-btn strong-btn"
          @touchend.prevent="$emit('strong-attack')"
        >
          強
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TouchGamepad',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    'move-left',
    'move-right',
    'weak-attack',
    'strong-attack',
    'guard-start',
    'guard-end',
    'wakeup'
  ],
  data() {
    return {
      moveLeftTimerId: null as ReturnType<typeof setInterval> | null,
      moveRightTimerId: null as ReturnType<typeof setInterval> | null
    }
  },
  beforeUnmount() {
    this.stopMoveLeft()
    this.stopMoveRight()
  },
  methods: {
    startMoveLeft() {
      this.$emit('move-left')
      this.moveLeftTimerId = setInterval(() => {
        this.$emit('move-left')
      }, 80)
    },
    stopMoveLeft() {
      if (this.moveLeftTimerId !== null) {
        clearInterval(this.moveLeftTimerId)
        this.moveLeftTimerId = null
      }
    },
    startMoveRight() {
      this.$emit('move-right')
      this.moveRightTimerId = setInterval(() => {
        this.$emit('move-right')
      }, 80)
    },
    stopMoveRight() {
      if (this.moveRightTimerId !== null) {
        clearInterval(this.moveRightTimerId)
        this.moveRightTimerId = null
      }
    },
    onGuardStart() {
      this.$emit('guard-start')
    },
    onGuardEnd() {
      this.$emit('guard-end')
    },
    onWakeup() {
      this.$emit('wakeup')
    }
  }
})
</script>

<style scoped>
.touch-gamepad {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 130px;
  background-color: rgba(0, 0, 0, 0.4);
  font-family: 'dotFont', sans-serif;
}

.gamepad-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 10px 20px;
  max-width: 600px;
  margin: 0 auto;
}

/* D-pad: CSS Grid 十字配置 */
.dpad {
  display: grid;
  grid-template-areas:
    ".    up   ."
    "left .    right"
    ".    down .";
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 40px 40px 40px;
  gap: 2px;
}

.dpad-up    { grid-area: up; }
.dpad-left  { grid-area: left; }
.dpad-right { grid-area: right; }
.dpad-down  { grid-area: down; }

.dpad-btn {
  min-width: 50px;
  min-height: 40px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  color: #222;
  font-size: 1.2rem;
  font-family: 'dotFont', sans-serif;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  box-shadow:
    3px 0 black,
    -3px 0 black,
    0 3px black,
    0 -3px black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dpad-btn:active {
  background-color: rgba(200, 200, 200, 0.9);
  box-shadow:
    2px 0 black,
    -2px 0 black,
    0 2px black,
    0 -2px black;
}

/* 攻撃ボタン */
.attack-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.attack-btn {
  min-width: 60px;
  min-height: 60px;
  border: none;
  border-radius: 50%;
  font-size: 1.1rem;
  font-family: 'dotFont', sans-serif;
  font-weight: bold;
  color: #fff;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  box-shadow:
    3px 0 black,
    -3px 0 black,
    0 3px black,
    0 -3px black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weak-btn {
  background-color: rgba(0, 180, 255, 0.8);
}

.strong-btn {
  background-color: rgba(255, 80, 80, 0.8);
}

.attack-btn:active {
  box-shadow:
    2px 0 black,
    -2px 0 black,
    0 2px black,
    0 -2px black;
}

.weak-btn:active {
  background-color: rgba(0, 140, 220, 0.95);
}

.strong-btn:active {
  background-color: rgba(220, 50, 50, 0.95);
}
</style>
