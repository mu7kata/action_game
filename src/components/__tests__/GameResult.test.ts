import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import GameResult from '../GameResult.vue'

const createTestRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/battle/:selectPlayerImgName/:enemyNum', component: { template: '<div />' } },
    { path: '/thanks/:gameResult', component: { template: '<div />' } },
  ]
})

describe('GameResult.vue', () => {
  it('win 時に「かち！！！」と次の対戦リンクが表示される', async () => {
    const router = createTestRouter()
    router.push('/battle/haru/1')
    await router.isReady()

    const wrapper = mount(GameResult, {
      props: { matchEndMessage: 'win' },
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('かち！！！')
    expect(wrapper.text()).toContain('次の対戦へすすむ')
  })

  it('clear 時に「かち！！！」とクリア画面リンクが表示される', async () => {
    const router = createTestRouter()
    router.push('/battle/haru/3')
    await router.isReady()

    const wrapper = mount(GameResult, {
      props: { matchEndMessage: 'clear' },
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('かち！！！')
    expect(wrapper.text()).toContain('次へ')
  })

  it('lose 時に「まけ・・・」とゲームオーバーリンクが表示される', async () => {
    const router = createTestRouter()
    router.push('/battle/haru/1')
    await router.isReady()

    const wrapper = mount(GameResult, {
      props: { matchEndMessage: 'lose' },
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('まけ・・・')
    expect(wrapper.text()).toContain('次へ')
  })

  it('getNextEnemyPath で次の敵番号を計算できる', async () => {
    const router = createTestRouter()
    router.push('/battle/haru/1')
    await router.isReady()

    const wrapper = mount(GameResult, {
      props: { matchEndMessage: 'win' },
      global: { plugins: [router] }
    })

    const link = wrapper.find('a[href="/battle/haru/2"]')
    expect(link.exists()).toBe(true)
  })
})
