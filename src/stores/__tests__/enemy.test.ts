import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEnemyStore } from '../enemy'

describe('enemy store', () => {
  let store: ReturnType<typeof useEnemyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useEnemyStore()
  })

  describe('selectEnemy action', () => {
    it('敵1のステータスが正しく設定される', () => {
      store.selectEnemy(1)
      expect(store.status.attack).toBe(5)
      expect(store.status.life).toBe(50)
      expect(store.status.speed).toBe(150)
      expect(store.status.motionRange).toBe(100)
    })

    it('敵2のステータスが正しく設定される', () => {
      store.selectEnemy(2)
      expect(store.status.attack).toBe(20)
      expect(store.status.life).toBe(100)
      expect(store.status.speed).toBe(180)
      expect(store.status.motionRange).toBe(120)
    })

    it('敵3のステータスが正しく設定される', () => {
      store.selectEnemy(3)
      expect(store.status.attack).toBe(50)
      expect(store.status.life).toBe(170)
      expect(store.status.speed).toBe(100)
      expect(store.status.motionRange).toBe(200)
    })
  })

  describe('changeLife action', () => {
    it('ライフが正しく減少する', () => {
      store.selectEnemy(1)
      const initialLife = store.status.life
      store.changeLife(10)
      expect(store.status.life).toBe(initialLife - 10)
    })
  })
})
