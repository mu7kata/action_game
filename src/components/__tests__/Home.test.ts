import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Home from '../Home.vue'

vi.mock('@/utils/imageLoader', () => ({
  getImageUrl: (filename: string) => `/mock/${filename}`
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/select', component: { template: '<div />' } },
  ]
})

describe('Home.vue', () => {
  it('タイトルが表示される', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(Home, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('格闘アクションゲーム（仮）')
  })

  it('4キャラクターの画像が表示される', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(Home, {
      global: { plugins: [router] }
    })
    const images = wrapper.findAll('img.object')
    expect(images).toHaveLength(4)
  })

  it('チャレンジモードのリンクがある', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(Home, {
      global: { plugins: [router] }
    })
    const link = wrapper.find('a.button[href="/select"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('チャレンジモードではじめる')
  })

  it('フリーたいせんモードは無効化されている', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(Home, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('近日公開')
  })
})
