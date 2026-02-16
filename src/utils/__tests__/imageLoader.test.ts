import { describe, it, expect } from 'vitest'
import { getImageUrl } from '../imageLoader'

describe('imageLoader', () => {
  it('存在する画像ファイルのURLを返す', () => {
    const url = getImageUrl('haru_stand.gif')
    expect(url).toBeTruthy()
    expect(url).toContain('haru_stand')
  })

  it('存在しない画像ファイルは空文字を返す', () => {
    const url = getImageUrl('nonexistent.gif')
    expect(url).toBe('')
  })

  it('全キャラクターのstand画像が取得できる', () => {
    const characters = ['haru', 'eda', 'kaki', 'kuni']
    for (const char of characters) {
      const url = getImageUrl(`${char}_stand.gif`)
      expect(url, `${char}_stand.gif が見つからない`).toBeTruthy()
    }
  })

  it('全敵キャラクターのstand画像が取得できる', () => {
    const enemies = ['enamy_1', 'enamy_2']
    for (const enemy of enemies) {
      const url = getImageUrl(`${enemy}_stand.gif`)
      expect(url, `${enemy}_stand.gif が見つからない`).toBeTruthy()
    }
  })
})
