// Vite の import.meta.glob で全画像を事前にロード
const images: Record<string, string> = import.meta.glob('@/assets/img/*', { eager: true, import: 'default' })

/**
 * 画像ファイル名からURLを取得する
 * @param filename - 画像ファイル名 (例: 'haru_stand.gif')
 * @returns 画像のURL
 */
export function getImageUrl(filename: string): string {
  const path = `/src/assets/img/${filename}`
  if (images[path]) {
    return images[path]
  }
  console.warn(`Image not found: ${filename}`)
  return ''
}
