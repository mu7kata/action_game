import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    status: {
      attack: 15,
      w_attack: 20,
      life: 20,
      speed: 300, //値が小さければ小さいほどいい。行動の間隔
      motionRange: 50,
      attackType: 'shortDistance'
    }
  }),
  actions: {
    changeLife(value) {
      this.status.life = this.status.life - value
    },
    selectPlayer(value) {
      const selectPlayer = {
        'kaki': {   //HACK:数字で管理しない方がいいかも
          attack: 25,
          life: 300,
          speed: 100,
          motionRange: 20,
          attackType: 'shortDistance'
        },
        'eda': {
          attack: 10,
          w_attack: 17.5,
          life: 250,
          speed: 200,
          motionRange: 150,
          attackType: 'shortDistance'
        },
        'haru': {
          attack: 15,
          life: 200,
          speed: 200,
          motionRange: 100,
          attackType: 'shortDistance'
        },
        'kuni': {
          attack: 7.5,
          life: 120,
          speed: 200,
          motionRange: 100,
          attackType: 'longDistance'
        }
      }
      this.status.attack = selectPlayer[value].attack
      this.status.w_attack = selectPlayer[value].w_attack
      this.status.life = selectPlayer[value].life
      this.status.speed = selectPlayer[value].speed
      this.status.motionRange = selectPlayer[value].motionRange
      this.status.attackType = selectPlayer[value].attackType
    }
  }
})
