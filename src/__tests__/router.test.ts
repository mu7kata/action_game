import { describe, it, expect } from 'vitest'
import router from '../router'

describe('router', () => {
  it('5つのルートが定義されている', () => {
    const routes = router.getRoutes()
    expect(routes).toHaveLength(5)
  })

  it('各ルートのパスが正しい', () => {
    const routes = router.getRoutes()
    const paths = routes.map(r => r.path)
    expect(paths).toContain('/')
    expect(paths).toContain('/select')
    expect(paths).toContain('/free_select')
    expect(paths).toContain('/battle/:selectPlayerImgName/:enemyNum')
    expect(paths).toContain('/thanks/:gameResult')
  })
})
