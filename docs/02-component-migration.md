# コンポーネント移行計画書 (Vue 2 → Vue 3)

## 仮定条件

本計画書は以下の前提に基づいて作成しています。

1. **Vue 3 の Compatibility Build は使用しない** — 完全な Vue 3 ネイティブコードへ移行する
2. **Vue Router 4 / Vuex 4 (または Pinia) への移行は別計画で実施済み** — 本計画書ではコンポーネント内のコード変更に焦点を当てる。ただし、コンポーネント内で使用している Router/Vuex API の変更点は記載する
3. **Options API を基本方針として維持する** — コードベースの規模と複雑度を考慮し、Composition API への全面書き換えは行わない。ただし新規コードや大幅リファクタリング時は Composition API の採用を推奨する
4. **Bootstrap Vue は vue-router 等とは別途対応が必要** — Bootstrap Vue は Vue 3 未対応のため、bootstrap-vue-next への移行または Bootstrap 5 素の HTML/CSS への置き換えが必要（本プロジェクトでは bootstrap-vue のコンポーネントを直接使っている箇所は少なく、主に CSS のみ利用しているため影響は小さい）
5. **Webpack 3 → Vite への移行は別計画で対応** — `require()` による動的画像インポートは Vite 移行時に解決するが、本計画書でも変更箇所を記載する
6. **テスト環境は現在存在しない** — 手動テスト（ブラウザでの動作確認）で検証する

---

## 各コンポーネントの Vue 3 非互換ポイント一覧

### 1. src/main.js（エントリーポイント）

| # | 非互換ポイント | Vue 2 コード | Vue 3 コード |
|---|---------------|-------------|-------------|
| 1 | `new Vue()` の廃止 | `new Vue({ el: '#app', router, store, components: { App }, template: '<App/>' })` | `createApp(App).use(router).use(store).mount('#app')` |
| 2 | `Vue.config.productionTip` の廃止 | `Vue.config.productionTip = false` | 削除（Vue 3 では不要） |

**変更箇所**: ファイル全体の書き換えが必要

```js
// Vue 3
import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/common.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
```

---

### 2. src/router.js（ルーター設定）

| # | 非互換ポイント | Vue 2 コード | Vue 3 コード |
|---|---------------|-------------|-------------|
| 1 | `Vue.use(Router)` の廃止 | `Vue.use(Router)` | `app.use(router)` （main.js に移動） |
| 2 | `new Router()` → `createRouter()` | `new Router({ routes })` | `createRouter({ history: createWebHashHistory(), routes })` |
| 3 | history モード明示が必須 | 暗黙的にハッシュモード | `createWebHashHistory()` または `createWebHistory()` を明示指定 |

**変更箇所**: ファイル全体の書き換え

```js
// Vue 3 (Vue Router 4)
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Battle from '@/components/Battle.vue'
import Select from '@/components/Select.vue'
import Thanks from './components/Thanks.vue'
import FreeSelect from './components/FreeSelect.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/select', name: 'Select', component: Select },
    { path: '/free_select', name: 'FreeSelect', component: FreeSelect },
    { path: '/battle/:selectPlayerImgName/:enemyNum', name: 'Battle', component: Battle },
    { path: '/thanks/:gameResult', name: 'Thanks', component: Thanks }
  ]
})

export default router
```

---

### 3. src/store.js（Vuex ストア）

| # | 非互換ポイント | Vue 2 コード | Vue 3 コード |
|---|---------------|-------------|-------------|
| 1 | `Vue.use(Vuex)` の廃止 | `Vue.use(Vuex)` | `app.use(store)` （main.js に移動） |
| 2 | `new Vuex.Store()` → `createStore()` | `new Vuex.Store({ modules })` | `createStore({ modules })` |

**変更箇所**: ファイル全体の書き換え

```js
// Vue 3 (Vuex 4)
import { createStore } from 'vuex'
import enemy from './store/enemy.js'
import player from './store/player.js'

export default createStore({
  modules: {
    enemy,
    player
  }
})
```

---

### 4. src/App.vue（ルートコンポーネント）

**非互換ポイント: なし**

このコンポーネントは `<router-view />` のみを含むシンプルな構成で、Vue 3 でそのまま動作する。変更不要。

---

### 5. src/components/Home.vue（トップページ）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| 1 | `require()` による画像読み込み | `:src="require('@/assets/img/haru_stand.gif')"` — Vite では `require()` は使用不可。静的インポートまたは `new URL()` パターンに変更が必要 |
| 2 | 重複する `ref="player"` | 同一テンプレート内に `ref="player"` が4つ存在する。Vue 3 では `$refs` は最後の要素のみを参照する（Vue 2 と同じ動作だが、配列 refs は明示的な `:ref` バインディングが必要）。ただし現在 `$refs.player` は script 内で使用されていないため実害なし |

**変更箇所**:
- `require()` → Vite 対応の画像インポートに変更（ビルドツール移行と連動）

```vue
<!-- Vue 2 -->
<img :src="require('@/assets/img/haru_stand.gif')">

<!-- Vue 3 + Vite -->
<script>
import haruStand from '@/assets/img/haru_stand.gif'
// または動的に: new URL(`@/assets/img/${name}_stand.gif`, import.meta.url).href
</script>
<img :src="haruStand">
```

---

### 6. src/components/Select.vue（ストーリーモード キャラ選択）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| 1 | `require()` による動的画像読み込み | `` require(`@/assets/img/${selectPlayerImgName}_stand.gif`) `` — Vite では使用不可 |
| 2 | `v-for` に `:key` がない | `v-for="player in playerList"` に `:key` が指定されていない。Vue 3 では `:key` が必須 |

**変更箇所**:
- `require()` を Vite 対応に変更
- `v-for` に `:key` を追加

```vue
<!-- Vue 2 -->
<div class="bl_media_itemWrapper" v-for="player in playerList">

<!-- Vue 3 -->
<div class="bl_media_itemWrapper" v-for="player in playerList" :key="player.imgName">
```

---

### 7. src/components/FreeSelect.vue（フリーモード キャラ選択 - 未完成）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| 1 | `require()` による動的画像読み込み | Select.vue と同様 |
| 2 | `v-for` に `:key` がない | Select.vue と同様 |
| 3 | テンプレート構文エラー | L41: バッククォートと引用符の混在によるテンプレート構文エラーがある（未完成のため） |

**変更箇所**: 未完成コンポーネントのため、Vue 3 移行時に完成させるか削除するかを判断する必要がある。移行対象とする場合は Select.vue と同様の修正を適用する。

---

### 8. src/components/Battle.vue（メインバトル画面 - 最重要・最複雑）

| # | 非互換ポイント | 詳細 | 影響度 |
|---|---------------|------|--------|
| 1 | `this.$store.getters` を `data()` 内で使用 | L74-75: `enemyAbility: this.$store.getters['enemy/status']` — `data()` 内での `this.$store` アクセスは Vue 3 でも動作するが、Vuex 4 では `useStore()` が推奨される | 中 |
| 2 | `this.$route.params` の使用 | L83-85, L337, L341, L405, L408, L419, L519 等: 多数の箇所で `this.$route.params` を使用。Vue Router 4 でも Options API では引き続き動作するが、params の型が string に統一された | 低 |
| 3 | `this.$refs` の使用 | L326-329: `this.$refs.enemy`, `this.$refs.player` で DOM 要素を直接取得。Vue 3 でも Options API では同様に動作 | 低 |
| 4 | `this.$store.commit()` の使用 | L90-91, L304: `this.$store.commit("enemy/selectEnemy", ...)` 等。Vuex 4 でも動作 | 低 |
| 5 | `beforeDestroy` ライフサイクルフック | L95-98: `beforeDestroy` → Vue 3 では `beforeUnmount` に名称変更 | **高** |
| 6 | `require()` による動的画像読み込み（大量） | L84-85, L130, L133, L164, L191, L215, L218, L225, L234, L242, L250, L253, L262, L268, L337, L341, L405, L408, L419, L431, L446, L508 — **22箇所以上**で `require()` を使用 | **高** |
| 7 | `beforeRouteUpdate` ナビゲーションガード | L99-104: コンポーネント内ナビゲーションガード。Vue Router 4 でも Options API では動作するが、`next()` コールバックの代わりに戻り値方式が推奨される | 中 |
| 8 | `document.getElementsByClassName` による直接 DOM 操作 | L282, L305: ライフバー操作に `getElementsByClassName` を使用。Vue のリアクティブシステムを使うべき箇所 | 中 |
| 9 | `this.$router.go()` (GameResult 経由) | L103: `this.$refs.gameResult.reload()` で GameResult の `$router.go()` を呼び出し | 低 |

**変更箇所 (詳細)**:

**(a) `beforeDestroy` → `beforeUnmount`**
```js
// Vue 2
beforeDestroy() {
  document.removeEventListener('keyup', this.onKeyUp)
  document.removeEventListener('keydown', this.onKeyDown)
}

// Vue 3
beforeUnmount() {
  document.removeEventListener('keyup', this.onKeyUp)
  document.removeEventListener('keydown', this.onKeyDown)
}
```

**(b) `require()` → 動的画像インポートヘルパー**

Battle.vue では22箇所以上で `require()` を使用しており、一つずつ書き換えるのは非効率。ヘルパー関数を作成して一括対応する。

```js
// src/utils/imageHelper.js
const imageModules = import.meta.glob('@/assets/img/*.gif', { eager: true })

export function getImage(filename) {
  const path = `/src/assets/img/${filename}`
  return imageModules[path]?.default || ''
}
```

```js
// Battle.vue 内での使用例
// Vue 2
this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);

// Vue 3 + Vite
import { getImage } from '@/utils/imageHelper'
// ...
this.playerImage = getImage(`${this.player}_stand.gif`);
```

**(c) `beforeRouteUpdate` の更新（推奨）**
```js
// Vue 2
beforeRouteUpdate(to, from, next) {
  next();
  this.$refs.gameResult.reload();
}

// Vue 3 (Vue Router 4) - next() 不要、戻り値方式
beforeRouteUpdate(to, from) {
  this.$refs.gameResult.reload();
}
```

---

### 9. src/components/GameResult.vue（勝敗結果オーバーレイ）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| 1 | テンプレート内での `this` 使用 | L7: `:to="\`/battle/${this.$route.params.selectPlayerImgName}/${getNextEnemyPath()}\`"` — テンプレート内の `this` は Vue 3 では不要（Vue 2 でも不要だが動作した）。Vue 3 では**テンプレート内の `this` は動作しない** |
| 2 | `this.$router.go()` の使用 | L36: `this.$router.go({path: ...})` — `$router.go()` は Vue Router 4 では数値引数のみ受け付ける。オブジェクト引数は非対応 |
| 3 | `this.$router.currentRoute` | L36: `this.$router.currentRoute.path` — Vue Router 4 では `this.$route.path` または `router.currentRoute.value.path` に変更 |
| 4 | props 宣言が配列形式 | L30: `props: ["matchEndMessage"]` — 動作はするが、Vue 3 ではオブジェクト形式での型宣言が推奨される |

**変更箇所**:

**(a) テンプレート内の `this` を削除**
```vue
<!-- Vue 2 (動作するが非推奨) -->
<router-link :to="`/battle/${this.$route.params.selectPlayerImgName}/${getNextEnemyPath()}`">

<!-- Vue 3 -->
<router-link :to="`/battle/${$route.params.selectPlayerImgName}/${getNextEnemyPath()}`">
```

**(b) `$router.go()` の修正**
```js
// Vue 2
reload() {
  this.$router.go({path: this.$router.currentRoute.path, force: true});
}

// Vue 3 - ページリロード相当の処理
reload() {
  this.$router.go(0);
  // または this.$router.replace(this.$route.fullPath)
}
```

---

### 10. src/components/Thanks.vue（エンディング画面）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| 1 | テンプレート内での `this` 使用 | L4, L8: `this.$route.params.gameResult` — Vue 3 ではテンプレート内の `this` は動作しない |
| 2 | `require()` による画像読み込み | L17, L20, L23: 3箇所 |
| 3 | 重複する `ref="player"` | 3つの `<img>` に同じ `ref="player"` が指定されている（script 内で使用されていないため実害なし） |

**変更箇所**:

```vue
<!-- Vue 2 -->
<div v-if="this.$route.params.gameResult == 'clear'">

<!-- Vue 3 -->
<div v-if="$route.params.gameResult == 'clear'">
```

---

### 11. src/store/player.js / src/store/enemy.js（Vuex モジュール）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| - | なし | namespaced モジュールの構造は Vuex 4 でも互換性あり。変更不要 |

---

### 12. src/js/mixin/utils.js（Vue Mixin）

| # | 非互換ポイント | 詳細 |
|---|---------------|------|
| 1 | グローバル Mixin の非推奨化 | Vue 3 では Mixin は非推奨。Composable (Composition API) への移行が推奨される |

**現状**: このファイルは空の実装（`console.log` のみ）で、どのコンポーネントからもインポートされていない。**削除が最善策**。

---

## Options API 維持 vs Composition API 化の方針

### 基本方針: Options API を維持

**理由**:
1. 全コンポーネントが Options API で書かれており、Composition API への書き換えは移行コスト増大につながる
2. Vue 3 は Options API を正式にサポートし続ける（非推奨ではない）
3. プロジェクト規模が小さく、Composition API のメリット（ロジックの再利用性、型推論）が顕著でない

### 例外: Composition API を採用するケース
- **新規コンポーネント作成時** — 新たに作るコンポーネントは Composition API (`<script setup>`) で書く
- **Battle.vue の大幅リファクタリング時** — Battle.vue は複雑なゲームロジックを持つため、将来的に Composable に切り出すことでテスタビリティ向上が見込める。ただし Vue 3 移行フェーズではスコープ外とする

---

## 優先度・難易度マトリクス

| コンポーネント | 難易度 | 優先度 | 変更規模 | 備考 |
|---------------|--------|--------|---------|------|
| main.js | 低 | **最高** | 小 | 移行の起点。最初に変更必須 |
| router.js | 低 | **最高** | 小 | main.js と同時に変更 |
| store.js | 低 | **最高** | 小 | main.js と同時に変更 |
| App.vue | なし | - | なし | 変更不要 |
| Home.vue | 低 | 中 | 小 | require() のみ |
| Select.vue | 低 | 中 | 小 | require() + v-for key |
| FreeSelect.vue | - | **最低** | - | 未完成。移行対象外を推奨 |
| Thanks.vue | 低 | 中 | 小 | this 削除 + require() |
| GameResult.vue | **中** | **高** | 中 | this 削除 + router API 変更 |
| Battle.vue | **高** | **高** | **大** | 22箇所の require() + lifecycle + DOM操作 |
| player.js / enemy.js | なし | - | なし | 変更不要 |
| utils.js (mixin) | 低 | 低 | 小 | 未使用のため削除推奨 |

---

## 推奨移行順序

### Phase 1: 基盤ファイル（前提条件）
> 他の全てのコンポーネント移行の前提となるため最初に実施

1. **main.js** — `new Vue()` → `createApp()` に書き換え
2. **store.js** — `new Vuex.Store()` → `createStore()` に書き換え
3. **router.js** — `new Router()` → `createRouter()` に書き換え

これら3ファイルは一括で変更する（部分的な変更では動作しない）。

### Phase 2: シンプルなコンポーネント（動作確認用）
> 変更量が少なく、移行の検証に適している

4. **App.vue** — 変更不要だが動作確認
5. **Home.vue** — `require()` の変更のみ
6. **Thanks.vue** — テンプレート内 `this` 削除 + `require()` 変更
7. **Select.vue** — `require()` 変更 + `v-for` に `:key` 追加

### Phase 3: 依存関係のあるコンポーネント
> GameResult は Battle の子コンポーネントのため、Battle より先に移行

8. **GameResult.vue** — テンプレート内 `this` 削除 + `$router.go()` 修正 + `$router.currentRoute` 修正

### Phase 4: 最も複雑なコンポーネント
> 全ての基盤と依存コンポーネントの移行完了後に着手

9. **Battle.vue** — `beforeDestroy` → `beforeUnmount`、`require()` 22箇所の変更、`beforeRouteUpdate` の更新、DOM操作の見直し

### Phase 5: クリーンアップ
10. **utils.js** — 未使用のため削除
11. **FreeSelect.vue** — 未完成。完成させるか削除するかプロジェクトオーナーが判断

---

## 全体の変更箇所サマリ

| 変更カテゴリ | 該当ファイル | 件数 |
|-------------|-------------|------|
| `new Vue()` → `createApp()` | main.js | 1 |
| `Vue.use()` → `app.use()` | main.js, router.js, store.js | 2 |
| `new Router()` → `createRouter()` | router.js | 1 |
| `new Vuex.Store()` → `createStore()` | store.js | 1 |
| `Vue.config.productionTip` 削除 | main.js | 1 |
| `beforeDestroy` → `beforeUnmount` | Battle.vue | 1 |
| テンプレート内 `this` 削除 | GameResult.vue, Thanks.vue | 4 |
| `require()` → Vite 対応 | Home.vue, Select.vue, FreeSelect.vue, Battle.vue, Thanks.vue | **30+** |
| `v-for` に `:key` 追加 | Select.vue, FreeSelect.vue | 2 |
| `$router.go()` API 変更 | GameResult.vue | 1 |
| `$router.currentRoute` 変更 | GameResult.vue | 1 |
| `beforeRouteUpdate` の `next()` 削除 | Battle.vue | 1 |
| Mixin 削除 | utils.js | 1 |

**合計: 約47件の変更ポイント**（うち30件以上が `require()` → Vite 対応）

---

## リスクと注意点

1. **`require()` の変更が最大のボリューム** — Battle.vue だけで22箇所以上。画像ヘルパー関数を用意することで変更のパターンを統一し、ミスを減らす
2. **Battle.vue の setTimeout チェーン** — ゲームロジックが多数の `setTimeout` に依存しており、ライフサイクル変更（`beforeDestroy` → `beforeUnmount`）時にタイマーのクリーンアップ漏れが発生する可能性がある。現状でも `setTimeout` のクリーンアップが不完全なため、移行時に合わせて改善を検討する
3. **テンプレート内 `this`** — Vue 3 ではテンプレート内の `this` が動作しないため、GameResult.vue と Thanks.vue で確実に削除する必要がある。見落とすとランタイムエラーになる
4. **FreeSelect.vue のテンプレート構文エラー** — 現状で壊れているため、移行前に修正するか移行対象外とするか決定が必要
