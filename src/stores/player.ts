import { defineStore } from 'pinia'

type AttackType = 'shortDistance' | 'longDistance'

export type PlayerName = 'kaki' | 'eda' | 'haru' | 'kuni'

interface PlayerStatus {
  attack: number
  w_attack?: number
  life: number
  speed: number
  motionRange: number
  attackType: AttackType
}

const playerPresets: Record<PlayerName, PlayerStatus> = {
  kaki: {
    attack: 25,
    life: 300,
    speed: 100,
    motionRange: 20,
    attackType: 'shortDistance'
  },
  eda: {
    attack: 10,
    w_attack: 17.5,
    life: 250,
    speed: 200,
    motionRange: 150,
    attackType: 'shortDistance'
  },
  haru: {
    attack: 15,
    life: 200,
    speed: 200,
    motionRange: 100,
    attackType: 'shortDistance'
  },
  kuni: {
    attack: 7.5,
    life: 120,
    speed: 200,
    motionRange: 100,
    attackType: 'longDistance'
  }
}

export const usePlayerStore = defineStore('player', {
  state: (): { status: PlayerStatus } => ({
    status: {
      attack: 15,
      w_attack: 20,
      life: 20,
      speed: 300,
      motionRange: 50,
      attackType: 'shortDistance'
    }
  }),
  actions: {
    changeLife(value: number) {
      this.status.life = this.status.life - value
    },
    selectPlayer(value: PlayerName) {
      const preset = playerPresets[value]
      this.status.attack = preset.attack
      this.status.w_attack = preset.w_attack
      this.status.life = preset.life
      this.status.speed = preset.speed
      this.status.motionRange = preset.motionRange
      this.status.attackType = preset.attackType
    }
  }
})
