import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { isTouchDevice } from '../touchDetection'

describe('isTouchDevice', () => {
  afterEach(() => {
    // ontouchstart プロパティを削除して元に戻す
    if ('ontouchstart' in window) {
      delete (window as any).ontouchstart
    }
    // maxTouchPoints を 0 にリセット
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
      writable: true
    })
  })

  it('ontouchstart が存在する場合に true を返す', () => {
    ;(window as any).ontouchstart = null
    expect(isTouchDevice()).toBe(true)
  })

  it('maxTouchPoints > 0 の場合に true を返す', () => {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 1,
      configurable: true,
      writable: true
    })
    expect(isTouchDevice()).toBe(true)
  })

  it('ontouchstart も maxTouchPoints もない場合に false を返す', () => {
    // ontouchstart が存在しないことを確認
    if ('ontouchstart' in window) {
      delete (window as any).ontouchstart
    }
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
      writable: true
    })
    expect(isTouchDevice()).toBe(false)
  })
})
