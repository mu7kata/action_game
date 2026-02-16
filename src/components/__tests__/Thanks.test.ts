import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Thanks from '../Thanks.vue'

vi.mock('@/utils/imageLoader', () => ({
  getImageUrl: (filename: string) => `/mock/${filename}`
}))

const createTestRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/thanks/:gameResult', component: Thanks },
    { path: '/', component: { template: '<div />' } },
  ]
})

describe('Thanks.vue', () => {
  it('クリア時にお祝いメッセージが表示される', async () => {
    const router = createTestRouter()
    router.push('/thanks/clear')
    await router.isReady()

    const wrapper = mount(Thanks, {
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('おめでとう！ゲームクリアです！')
    expect(wrapper.text()).toContain('遊んでいただきありがとうございました')
  })

  it('敗北時にゲームオーバーメッセージが表示される', async () => {
    const router = createTestRouter()
    router.push('/thanks/lose')
    await router.isReady()

    const wrapper = mount(Thanks, {
      global: { plugins: [router] }
    })

    expect(wrapper.text()).toContain('残念・・、ゲームオーバーです')
    expect(wrapper.text()).toContain('再チャレンジお待ちしています')
  })

  it('敵キャラクターの画像が3枚表示される', async () => {
    const router = createTestRouter()
    router.push('/thanks/clear')
    await router.isReady()

    const wrapper = mount(Thanks, {
      global: { plugins: [router] }
    })

    const images = wrapper.findAll('img.object')
    expect(images).toHaveLength(3)
  })

  it('ホームへ戻るリンクがある', async () => {
    const router = createTestRouter()
    router.push('/thanks/clear')
    await router.isReady()

    const wrapper = mount(Thanks, {
      global: { plugins: [router] }
    })

    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toContain('ホームへ戻る')
  })
})
