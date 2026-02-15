import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import playerModule from '../player.js'

function createPlayerStore() {
  return createStore({
    modules: {
      player: { ...playerModule, state: () => ({ ...playerModule.state }) }
    }
  })
}

describe('player store', () => {
  let store

  beforeEach(() => {
    store = createPlayerStore()
  })

  describe('selectPlayer mutation', () => {
    it('kaki のステータスが正しく設定される', () => {
      store.commit('player/selectPlayer', 'kaki')
      const status = store.state.player.status
      expect(status.attack).toBe(25)
      expect(status.life).toBe(300)
      expect(status.speed).toBe(100)
      expect(status.motionRange).toBe(20)
      expect(status.attackType).toBe('shortDistance')
    })

    it('eda のステータスが正しく設定される', () => {
      store.commit('player/selectPlayer', 'eda')
      const status = store.state.player.status
      expect(status.attack).toBe(10)
      expect(status.w_attack).toBe(17.5)
      expect(status.life).toBe(250)
      expect(status.speed).toBe(200)
      expect(status.motionRange).toBe(150)
      expect(status.attackType).toBe('shortDistance')
    })

    it('haru のステータスが正しく設定される', () => {
      store.commit('player/selectPlayer', 'haru')
      const status = store.state.player.status
      expect(status.attack).toBe(15)
      expect(status.life).toBe(200)
      expect(status.speed).toBe(200)
      expect(status.motionRange).toBe(100)
      expect(status.attackType).toBe('shortDistance')
    })

    it('kuni のステータスが正しく設定される', () => {
      store.commit('player/selectPlayer', 'kuni')
      const status = store.state.player.status
      expect(status.attack).toBe(7.5)
      expect(status.life).toBe(120)
      expect(status.speed).toBe(200)
      expect(status.motionRange).toBe(100)
      expect(status.attackType).toBe('longDistance')
    })
  })

  describe('changeLife mutation', () => {
    it('ライフが正しく減少する', () => {
      store.commit('player/selectPlayer', 'haru')
      const initialLife = store.state.player.status.life
      store.commit('player/changeLife', 30)
      expect(store.state.player.status.life).toBe(initialLife - 30)
    })
  })
})
