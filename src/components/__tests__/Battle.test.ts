import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import Battle from '../Battle.vue'
import { usePlayerStore } from '@/stores/player'
import { useEnemyStore } from '@/stores/enemy'

vi.mock('@/utils/imageLoader', () => ({
  getImageUrl: (filename: string) => `/mock/${filename}`
}))

const createTestRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/battle/:selectPlayerImgName/:enemyNum', component: Battle },
    { path: '/thanks/:gameResult', component: { template: '<div />' } },
  ]
})

const mountBattle = async (player = 'haru', enemyNum = '1') => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createTestRouter()
  router.push(`/battle/${player}/${enemyNum}`)
  await router.isReady()

  const wrapper = mount(Battle, {
    global: { plugins: [router, pinia] }
  })
  return wrapper
}

describe('Battle.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Bug 1: attackMove() - longDistance キャラの二重ダメージ防止', () => {
    it('longDistance キャラの attackMove() は isConflict() を呼ばず return する', async () => {
      const wrapper = await mountBattle('kuni', '1')
      const vm = wrapper.vm as any

      // kuni は longDistance タイプ
      expect(vm.playerAbility.attackType).toBe('longDistance')

      const isConflictSpy = vi.spyOn(vm, 'isConflict')
      // enemyLifeDecrease は DOM操作があるのでスタブ化
      const enemyLifeDecreaseSpy = vi.spyOn(vm, 'enemyLifeDecrease').mockImplementation(() => {})

      vm.attackMove()

      // isConflict は呼ばれない（return で抜けるため）
      expect(isConflictSpy).not.toHaveBeenCalled()

      // setTimeout 経過後に enemyLifeDecrease が1回だけ呼ばれる
      vi.advanceTimersByTime(400)
      expect(enemyLifeDecreaseSpy).toHaveBeenCalledTimes(1)

      wrapper.unmount()
    })

    it('shortDistance キャラの attackMove() は isConflict() を呼ぶ', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      expect(vm.playerAbility.attackType).toBe('shortDistance')

      const isConflictSpy = vi.spyOn(vm, 'isConflict')
      // enemyLifeDecrease は DOM操作があるのでスタブ化
      vi.spyOn(vm, 'enemyLifeDecrease').mockImplementation(() => {})

      vm.attackMove()

      expect(isConflictSpy).toHaveBeenCalledTimes(1)

      wrapper.unmount()
    })
  })

  describe('Bug 2: onKeyUp/onKeyDown - damage 状態で dead.gif を表示しない', () => {
    it('onKeyUp: dead 状態では dead.gif を表示する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      vm.playerStatus = 'dead'
      vm.onKeyUp(new KeyboardEvent('keyup', { key: ' ' }))

      expect(vm.playerImage).toBe('/mock/haru_dead.gif')

      wrapper.unmount()
    })

    it('onKeyUp: damage 状態では画像を変更せず return する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      vm.playerStatus = 'damage'
      const imageBefore = vm.playerImage
      vm.onKeyUp(new KeyboardEvent('keyup', { key: ' ' }))

      // 画像が変わらない（dead.gif にならない）
      expect(vm.playerImage).toBe(imageBefore)
      expect(vm.playerImage).not.toContain('dead')

      wrapper.unmount()
    })

    it('onKeyDown: dead 状態では dead.gif を表示する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      vm.playerStatus = 'dead'
      vm.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

      expect(vm.playerImage).toBe('/mock/haru_dead.gif')

      wrapper.unmount()
    })

    it('onKeyDown: damage 状態では画像を変更せず return する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      vm.playerStatus = 'damage'
      const imageBefore = vm.playerImage
      vm.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

      expect(vm.playerImage).toBe(imageBefore)
      expect(vm.playerImage).not.toContain('dead')

      wrapper.unmount()
    })
  })

  describe('Bug 3: enemyMove() - 死亡/ダメージチェックが距離チェックより先', () => {
    it('enemyStatus が damage のとき、距離チェックに関係なく return する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      // 敵をプレイヤーの近くに配置（距離制限に引っかかる位置）
      vm.e_x = 100
      vm.p_x = 0
      vm.enemyStatus = 'damage'

      const beforeX = vm.e_x
      vm.enemyMove()

      // damage 状態なので位置は変わらない（距離チェックで +50 されない）
      expect(vm.e_x).toBe(beforeX)

      wrapper.unmount()
    })

    it('enemyStatus が dead のとき、距離チェックに関係なく return する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      vm.e_x = 100
      vm.p_x = 0
      vm.enemyStatus = 'dead'

      const beforeX = vm.e_x
      vm.enemyMove()

      expect(vm.e_x).toBe(beforeX)

      wrapper.unmount()
    })

    it('敵の life が 0 以下のとき enemyDeadMove が呼ばれる', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      const enemyStore = useEnemyStore()
      enemyStore.status.life = 0
      vm.enemyStatus = ''

      const enemyDeadMoveSpy = vi.spyOn(vm, 'enemyDeadMove').mockImplementation(() => {})
      vm.enemyMove()

      expect(enemyDeadMoveSpy).toHaveBeenCalledTimes(1)

      wrapper.unmount()
    })
  })

  describe('Bug 5: getRandom() - ループなしで1回だけ計算', () => {
    it('motionRange の範囲内の値を返す', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      const motionRange = 100
      const n = motionRange / 2
      for (let i = 0; i < 50; i++) {
        const result = vm.getRandom(motionRange)
        // Math.floor(Math.random() * (-motionRange + 1 - n)) + n
        // random range: [0, 1) * (-149) => (-149, 0]
        // + 50 => (-99, 50]
        // Math.floor => [-99, 49]
        expect(result).toBeGreaterThanOrEqual(-motionRange + 1)
        expect(result).toBeLessThanOrEqual(n)
      }

      wrapper.unmount()
    })

    it('整数値を返す', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      for (let i = 0; i < 20; i++) {
        const result = vm.getRandom(100)
        expect(Number.isInteger(result)).toBe(true)
      }

      wrapper.unmount()
    })
  })

  describe('Bug 6: enemyAutoAction() - gameResult が true で停止', () => {
    it('gameResult が true のとき enemyMove() を呼ばない', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      vm.gameResult = true
      const enemyMoveSpy = vi.spyOn(vm, 'enemyMove')

      vm.enemyAutoAction()

      expect(enemyMoveSpy).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('gameResult が true のとき setTimeout で再帰しない', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      // mounted で既に動いているタイマーをクリア
      vi.clearAllTimers()

      vm.gameResult = true
      const enemyMoveSpy = vi.spyOn(vm, 'enemyMove')

      vm.enemyAutoAction()

      // enemyMove は呼ばれない
      expect(enemyMoveSpy).not.toHaveBeenCalled()

      // タイマーを進めても再帰呼び出しはされない
      vi.advanceTimersByTime(10000)
      expect(enemyMoveSpy).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('gameResult が false のとき enemyMove() を呼び、true にすると停止する', async () => {
      const wrapper = await mountBattle('haru', '1')
      const vm = wrapper.vm as any

      // mounted で既に enemyAutoAction が走っているのでリセット
      vi.clearAllTimers()
      vm.gameResult = false

      const enemyMoveSpy = vi.spyOn(vm, 'enemyMove').mockImplementation(() => {})
      vm.enemyAutoAction()

      expect(enemyMoveSpy).toHaveBeenCalledTimes(1)

      // タイマーを進めると再帰する
      vi.advanceTimersByTime(vm.enemyAbility.speed)
      expect(enemyMoveSpy).toHaveBeenCalledTimes(2)

      // ゲーム終了させて停止
      vm.gameResult = true
      vi.advanceTimersByTime(vm.enemyAbility.speed)
      // gameResult が true になったので、これ以上増えない
      expect(enemyMoveSpy).toHaveBeenCalledTimes(2)

      wrapper.unmount()
    })
  })
})
