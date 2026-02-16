import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import Select from '../Select.vue'

vi.mock('@/utils/imageLoader', () => ({
  getImageUrl: (filename: string) => `/mock/${filename}`
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/select', component: Select },
    { path: '/battle/:selectPlayerImgName/:enemyNum', component: { template: '<div />' } },
  ]
})

describe('Select.vue', () => {
  const mountSelect = async () => {
    router.push('/select')
    await router.isReady()
    return mount(Select, {
      global: { plugins: [router] }
    })
  }

  it('キャラクター選択画面のタイトルが表示される', async () => {
    const wrapper = await mountSelect()
    expect(wrapper.text()).toContain('キャラクター選択画面')
  })

  it('初期選択キャラクターは「はるか」', async () => {
    const wrapper = await mountSelect()
    expect(wrapper.text()).toContain('選択中：はるか')
  })

  it('4人のキャラクターカードが表示される', async () => {
    const wrapper = await mountSelect()
    const cards = wrapper.findAll('.bl_media_itemWrapper')
    expect(cards).toHaveLength(4)
  })

  it('「このキャラクターですすむ」ボタンで確認状態に切り替わる', async () => {
    const wrapper = await mountSelect()
    expect(wrapper.text()).toContain('このキャラクターですすむ')

    await wrapper.find('button.button').trigger('click')

    expect(wrapper.text()).toContain('バトルスタート')
    expect(wrapper.text()).toContain('キャラクターを選択しなおす')
  })

  it('操作方法のアコーディオンが開閉できる', async () => {
    const wrapper = await mountSelect()
    const summary = wrapper.find('summary')
    expect(summary.text()).toContain('▶')
    expect(summary.text()).toContain('操作方法(コマンド)')

    await summary.trigger('click')
    expect(wrapper.text()).toContain('▼')
  })
})
