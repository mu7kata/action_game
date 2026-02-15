import { defineStore } from 'pinia'

export type EnemyLevel = 1 | 2 | 3

interface EnemyStatus {
  attack: number
  life: number
  speed: number
  motionRange: number
}

const enemyPresets: Record<EnemyLevel, EnemyStatus> = {
  1: {
    attack: 5,
    life: 50,
    speed: 150,
    motionRange: 100
  },
  2: {
    attack: 20,
    life: 100,
    speed: 180,
    motionRange: 120
  },
  3: {
    attack: 50,
    life: 170,
    speed: 100,
    motionRange: 200
  }
}

export const useEnemyStore = defineStore('enemy', {
  state: (): { status: EnemyStatus } => ({
    status: {
      attack: 2,
      life: 10,
      speed: 300,
      motionRange: 100,
    }
  }),
  actions: {
    changeLife(value: number) {
      this.status.life = this.status.life - value
    },
    selectEnemy(value: EnemyLevel) {
      const preset = enemyPresets[value]
      this.status.attack = preset.attack
      this.status.life = preset.life
      this.status.speed = preset.speed
      this.status.motionRange = preset.motionRange
    }
  }
})
