import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import enemyModule from '../enemy.js'

function createEnemyStore() {
  return createStore({
    modules: {
      enemy: { ...enemyModule, state: () => ({ ...enemyModule.state }) }
    }
  })
}

describe('enemy store', () => {
  let store

  beforeEach(() => {
    store = createEnemyStore()
  })

  describe('selectEnemy mutation', () => {
    it('敵1のステータスが正しく設定される', () => {
      store.commit('enemy/selectEnemy', 1)
      const status = store.state.enemy.status
      expect(status.attack).toBe(5)
      expect(status.life).toBe(50)
      expect(status.speed).toBe(150)
      expect(status.motionRange).toBe(100)
    })

    it('敵2のステータスが正しく設定される', () => {
      store.commit('enemy/selectEnemy', 2)
      const status = store.state.enemy.status
      expect(status.attack).toBe(20)
      expect(status.life).toBe(100)
      expect(status.speed).toBe(180)
      expect(status.motionRange).toBe(120)
    })

    it('敵3のステータスが正しく設定される', () => {
      store.commit('enemy/selectEnemy', 3)
      const status = store.state.enemy.status
      expect(status.attack).toBe(50)
      expect(status.life).toBe(170)
      expect(status.speed).toBe(100)
      expect(status.motionRange).toBe(200)
    })
  })

  describe('changeLife mutation', () => {
    it('ライフが正しく減少する', () => {
      store.commit('enemy/selectEnemy', 1)
      const initialLife = store.state.enemy.status.life
      store.commit('enemy/changeLife', 10)
      expect(store.state.enemy.status.life).toBe(initialLife - 10)
    })
  })
})
