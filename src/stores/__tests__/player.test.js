import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlayerStore } from '../player.js'

describe('player store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePlayerStore()
  })

  describe('selectPlayer action', () => {
    it('kaki のステータスが正しく設定される', () => {
      store.selectPlayer('kaki')
      expect(store.status.attack).toBe(25)
      expect(store.status.life).toBe(300)
      expect(store.status.speed).toBe(100)
      expect(store.status.motionRange).toBe(20)
      expect(store.status.attackType).toBe('shortDistance')
    })

    it('eda のステータスが正しく設定される', () => {
      store.selectPlayer('eda')
      expect(store.status.attack).toBe(10)
      expect(store.status.w_attack).toBe(17.5)
      expect(store.status.life).toBe(250)
      expect(store.status.speed).toBe(200)
      expect(store.status.motionRange).toBe(150)
      expect(store.status.attackType).toBe('shortDistance')
    })

    it('haru のステータスが正しく設定される', () => {
      store.selectPlayer('haru')
      expect(store.status.attack).toBe(15)
      expect(store.status.life).toBe(200)
      expect(store.status.speed).toBe(200)
      expect(store.status.motionRange).toBe(100)
      expect(store.status.attackType).toBe('shortDistance')
    })

    it('kuni のステータスが正しく設定される', () => {
      store.selectPlayer('kuni')
      expect(store.status.attack).toBe(7.5)
      expect(store.status.life).toBe(120)
      expect(store.status.speed).toBe(200)
      expect(store.status.motionRange).toBe(100)
      expect(store.status.attackType).toBe('longDistance')
    })
  })

  describe('changeLife action', () => {
    it('ライフが正しく減少する', () => {
      store.selectPlayer('haru')
      const initialLife = store.status.life
      store.changeLife(30)
      expect(store.status.life).toBe(initialLife - 30)
    })
  })
})
