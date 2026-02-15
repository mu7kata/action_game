import { defineStore } from 'pinia'

export const useEnemyStore = defineStore('enemy', {
  state: () => ({
    status: {
      attack: 2,
      life: 10,
      speed: 300, //値が小さければ小さいほどいい。行動の間隔
      motionRange: 100,
    }
  }),
  actions: {
    changeLife(value) {
      this.status.life = this.status.life - value
    },
    selectEnemy(value) {
      const selectEnemy = {
        1: {   //HACK:数字で管理しない方がいいかも
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
      this.status.attack = selectEnemy[value].attack
      this.status.life = selectEnemy[value].life
      this.status.speed = selectEnemy[value].speed
      this.status.motionRange = selectEnemy[value].motionRange
    }
  }
})
