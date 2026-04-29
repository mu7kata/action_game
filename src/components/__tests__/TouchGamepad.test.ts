import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TouchGamepad from '../TouchGamepad.vue'

describe('TouchGamepad.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('visible=true で D-pad と攻撃ボタンが表示される', () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    expect(wrapper.find('.touch-gamepad').exists()).toBe(true)
    expect(wrapper.find('.dpad').exists()).toBe(true)
    expect(wrapper.find('.attack-buttons').exists()).toBe(true)
    expect(wrapper.find('.weak-attack-btn').exists()).toBe(true)
    expect(wrapper.find('.strong-attack-btn').exists()).toBe(true)
    expect(wrapper.find('.dpad-up').exists()).toBe(true)
    expect(wrapper.find('.dpad-down').exists()).toBe(true)
    expect(wrapper.find('.dpad-left').exists()).toBe(true)
    expect(wrapper.find('.dpad-right').exists()).toBe(true)

    wrapper.unmount()
  })

  it('visible=false で何も表示されない', () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: false }
    })

    expect(wrapper.find('.touch-gamepad').exists()).toBe(false)

    wrapper.unmount()
  })

  it('弱攻撃ボタンの touchend で weak-attack イベントが emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.weak-attack-btn').trigger('touchend')
    expect(wrapper.emitted('weak-attack')).toHaveLength(1)

    wrapper.unmount()
  })

  it('強攻撃ボタンの touchend で strong-attack イベントが emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.strong-attack-btn').trigger('touchend')
    expect(wrapper.emitted('strong-attack')).toHaveLength(1)

    wrapper.unmount()
  })

  it('下ボタンの touchstart で guard-start が emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.dpad-down').trigger('touchstart')
    expect(wrapper.emitted('guard-start')).toHaveLength(1)

    wrapper.unmount()
  })

  it('下ボタンの touchend で guard-end が emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.dpad-down').trigger('touchend')
    expect(wrapper.emitted('guard-end')).toHaveLength(1)

    wrapper.unmount()
  })

  it('上ボタンの touchstart で wakeup が emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.dpad-up').trigger('touchstart')
    expect(wrapper.emitted('wakeup')).toHaveLength(1)

    wrapper.unmount()
  })

  it('左ボタンの touchstart で move-left が連続 emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.dpad-left').trigger('touchstart')

    // 初回は即座に emit
    expect(wrapper.emitted('move-left')).toHaveLength(1)

    // 80ms 後にもう一回
    vi.advanceTimersByTime(80)
    expect(wrapper.emitted('move-left')).toHaveLength(2)

    // さらに 80ms 後
    vi.advanceTimersByTime(80)
    expect(wrapper.emitted('move-left')).toHaveLength(3)

    // touchend で停止
    await wrapper.find('.dpad-left').trigger('touchend')
    vi.advanceTimersByTime(160)
    expect(wrapper.emitted('move-left')).toHaveLength(3)

    wrapper.unmount()
  })

  it('右ボタンの touchstart で move-right が連続 emit される', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    await wrapper.find('.dpad-right').trigger('touchstart')

    // 初回は即座に emit
    expect(wrapper.emitted('move-right')).toHaveLength(1)

    // 80ms 後にもう一回
    vi.advanceTimersByTime(80)
    expect(wrapper.emitted('move-right')).toHaveLength(2)

    // touchend で停止
    await wrapper.find('.dpad-right').trigger('touchend')
    vi.advanceTimersByTime(160)
    expect(wrapper.emitted('move-right')).toHaveLength(2)

    wrapper.unmount()
  })

  it('beforeUnmount で interval がクリアされる', async () => {
    const wrapper = mount(TouchGamepad, {
      props: { visible: true }
    })

    // 左右の移動を開始
    await wrapper.find('.dpad-left').trigger('touchstart')
    await wrapper.find('.dpad-right').trigger('touchstart')

    // unmount でクリーンアップ
    wrapper.unmount()

    // タイマーを進めてもエラーが起きない
    vi.advanceTimersByTime(500)
  })
})
