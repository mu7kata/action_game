<template>
  <div v-if="visible" class="touch-gamepad">
    <!-- 左側: D-pad (十字キー) -->
    <div class="dpad">
      <div class="dpad-grid">
        <div class="dpad-cell"></div>
        <div class="dpad-cell">
          <button
            class="dpad-btn dpad-up"
            @touchstart.prevent="onWakeup"
          >&#x25B2;</button>
        </div>
        <div class="dpad-cell"></div>
        <div class="dpad-cell">
          <button
            class="dpad-btn dpad-left"
            @touchstart.prevent="onMoveLeftStart"
            @touchend.prevent="onMoveLeftEnd"
            @touchcancel.prevent="onMoveLeftEnd"
          >&#x25C0;</button>
        </div>
        <div class="dpad-cell"></div>
        <div class="dpad-cell">
          <button
            class="dpad-btn dpad-right"
            @touchstart.prevent="onMoveRightStart"
            @touchend.prevent="onMoveRightEnd"
            @touchcancel.prevent="onMoveRightEnd"
          >&#x25B6;</button>
        </div>
        <div class="dpad-cell"></div>
        <div class="dpad-cell">
          <button
            class="dpad-btn dpad-down"
            @touchstart.prevent="onGuardStart"
            @touchend.prevent="onGuardEnd"
            @touchcancel.prevent="onGuardEnd"
          >&#x25BC;</button>
        </div>
        <div class="dpad-cell"></div>
      </div>
    </div>

    <!-- 右側: 攻撃ボタン -->
    <div class="attack-buttons">
      <button
        class="attack-btn weak-attack-btn"
        @touchend.prevent="onWeakAttack"
        @touchstart.prevent
        @touchcancel.prevent
      >弱</button>
      <button
        class="attack-btn strong-attack-btn"
        @touchend.prevent="onStrongAttack"
        @touchstart.prevent
        @touchcancel.prevent
      >強</button>
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
      moveLeftInterval: null as ReturnType<typeof setInterval> | null,
      moveRightInterval: null as ReturnType<typeof setInterval> | null
    }
  },

  beforeUnmount() {
    this.clearAllIntervals()
  },

  methods: {
    clearMoveInterval(key: 'moveLeftInterval' | 'moveRightInterval') {
      if (this[key] !== null) {
        clearInterval(this[key])
        this[key] = null
      }
    },

    clearAllIntervals() {
      this.clearMoveInterval('moveLeftInterval')
      this.clearMoveInterval('moveRightInterval')
    },

    startMoveRepeat(event: 'move-left' | 'move-right', key: 'moveLeftInterval' | 'moveRightInterval') {
      this.clearMoveInterval(key)
      this.$emit(event)
      this[key] = setInterval(() => {
        this.$emit(event)
      }, 80)
    },

    onMoveLeftStart() {
      this.startMoveRepeat('move-left', 'moveLeftInterval')
    },

    onMoveLeftEnd() {
      this.clearMoveInterval('moveLeftInterval')
    },

    onMoveRightStart() {
      this.startMoveRepeat('move-right', 'moveRightInterval')
    },

    onMoveRightEnd() {
      this.clearMoveInterval('moveRightInterval')
    },

    onGuardStart() {
      this.$emit('guard-start')
    },

    onGuardEnd() {
      this.$emit('guard-end')
    },

    onWakeup() {
      this.$emit('wakeup')
    },

    onWeakAttack() {
      this.$emit('weak-attack')
    },

    onStrongAttack() {
      this.$emit('strong-attack')
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
  height: 140px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  z-index: 1000;
}

/* D-pad */
.dpad {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
  gap: 2px;
}

.dpad-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dpad-btn {
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 18px;
  font-family: 'dotFont', sans-serif;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  touch-action: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dpad-btn:active {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

/* 攻撃ボタン */
.attack-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.attack-btn {
  width: 60px;
  height: 56px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-family: 'dotFont', sans-serif;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  touch-action: none;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attack-btn:active {
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.weak-attack-btn {
  background: rgba(100, 180, 255, 0.5);
}

.weak-attack-btn:active {
  background: rgba(100, 180, 255, 0.75);
}

.strong-attack-btn {
  background: rgba(255, 100, 100, 0.5);
}

.strong-attack-btn:active {
  background: rgba(255, 100, 100, 0.75);
}
</style>
