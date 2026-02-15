# ライブラリ移行計画書

## 仮定条件

本計画書は以下の仮定に基づいて作成している。

1. **移行先フレームワーク**: Vue 3.5 系 (最新安定版) を対象とする。Vue 3.6 はベータ段階のため対象外とする。
2. **ビルドツール**: Webpack 3 から Vite 6 系 (安定版) へ移行する。Vite 7 は Node.js 20.19+ を要求し、Vite 8 はベータのため、安定性を重視して Vite 6 系を採用する。プロジェクトの Node.js バージョンも合わせて 18+ に引き上げる前提とする。
3. **状態管理**: Vuex 3 から Pinia 3 へ移行する。Pinia は Vue 公式推奨の状態管理ライブラリである。
4. **UIライブラリ**: Bootstrap (bootstrap, bootstrap-vue, bootstrap-icons) を完全に廃止する。現行デザインは自前の CSS で再現する。
5. **段階的移行**: 一括移行ではなく段階的に移行する方針とする。
6. **TypeScript**: Vue 3 移行と合わせて TypeScript を導入する。`<script setup lang="ts">` を段階的に適用する。
7. **テスト**: 既存のユニットテストは存在しない前提とする (package.json にテストフレームワーク未定義)。

---

## ライブラリ移行一覧

| カテゴリ | 現行 | 移行先 | 備考 |
|---|---|---|---|
| フレームワーク | vue ^2.5.2 | vue ^3.5.28 | メジャーバージョンアップ |
| ルーター | vue-router ^3.0.1 | vue-router ^4.5.0 | メジャーバージョンアップ |
| 状態管理 | vuex ^3.0.1 | pinia ^3.0.4 | ライブラリ変更 |
| UI コンポーネント | bootstrap-vue ^2.22.0 | 廃止 (自前 CSS に置換) | 削除 |
| CSS フレームワーク | bootstrap ^5.2.0 | 廃止 (ユーティリティクラスを自前 CSS に置換) | 削除 |
| アイコン | bootstrap-icons ^1.9.1 | 廃止 (Unicode テキスト or 自前 SVG に置換) | 削除 |
| 型システム | なし | typescript ^5.x | 新規導入 |
| ビルドツール | webpack ^3.6.0 | vite ^6.1.0 | ライブラリ変更 |
| Vue SFC コンパイラ | vue-template-compiler ^2.5.2 | @vue/compiler-sfc (vue に同梱) | vue 3 に統合 |
| Vue ローダー | vue-loader ^13.3.0 | @vitejs/plugin-vue ^5.2.3 | Vite 用プラグインに変更 |
| トランスパイラ | babel-core ^6.22.1 + 関連パッケージ | 不要 (Vite 内蔵の esbuild) | 削除 |
| dev サーバー | webpack-dev-server ^2.9.1 | 不要 (Vite 内蔵) | 削除 |

### 削除対象パッケージ

以下のパッケージは Vite 移行 + Bootstrap 廃止に伴い全て不要となる。

**dependencies (削除):**
- bootstrap, bootstrap-vue, bootstrap-icons

**devDependencies (削除):**
- webpack, webpack-dev-server, webpack-merge, webpack-bundle-analyzer
- babel-core, babel-loader, babel-helper-vue-jsx-merge-props, babel-plugin-syntax-jsx, babel-plugin-transform-runtime, babel-plugin-transform-vue-jsx, babel-preset-env, babel-preset-stage-2
- vue-loader, vue-style-loader, vue-template-compiler
- extract-text-webpack-plugin, html-webpack-plugin, copy-webpack-plugin
- optimize-css-assets-webpack-plugin, uglifyjs-webpack-plugin
- css-loader, file-loader, url-loader, postcss-loader, postcss-import, postcss-url
- autoprefixer, friendly-errors-webpack-plugin
- ora, chalk, rimraf, semver, shelljs, node-notifier, portfinder

### 新規追加パッケージ

- typescript ^5.x
- vue-tsc (Vue SFC の型チェック)

---

## 各ライブラリの Breaking Changes

### 1. Vue 2 → Vue 3

Vue 3 は Vue 2 から多数の破壊的変更がある。本プロジェクトに影響する主要な変更点を以下に示す。

#### アプリケーション初期化

```javascript
// Vue 2 (現行)
import Vue from 'vue'
new Vue({ router, store, render: h => h(App) }).$mount('#app')

// Vue 3 (移行後)
import { createApp } from 'vue'
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
```

#### グローバル API の変更

| Vue 2 | Vue 3 | 影響 |
|---|---|---|
| `Vue.component()` | `app.component()` | グローバルコンポーネント登録 |
| `Vue.directive()` | `app.directive()` | グローバルディレクティブ登録 |
| `Vue.mixin()` | `app.mixin()` | グローバル mixin 登録 |
| `Vue.use()` | `app.use()` | プラグイン登録 |
| `Vue.prototype.$xxx` | `app.config.globalProperties.$xxx` | グローバルプロパティ |
| `Vue.set()` / `Vue.delete()` | 削除 (不要) | リアクティビティシステム変更により不要 |
| `new Vue()` | `createApp()` | インスタンス生成方法 |

#### テンプレートの変更

- **v-model**: `v-model` のデフォルト prop が `value` → `modelValue` に変更。イベントも `input` → `update:modelValue` に変更。
- **v-if / v-for 優先度**: 同一要素上の `v-if` と `v-for` の優先度が逆転 (`v-if` が優先に)。
- **v-bind.sync**: 廃止。`v-model:propName` で代替。
- **$listeners**: 廃止。`$attrs` に統合。
- **$scopedSlots**: 廃止。全て `$slots` に統合。

#### ライフサイクルの変更

| Vue 2 | Vue 3 (Options API) | 備考 |
|---|---|---|
| `beforeCreate` | `beforeCreate` | 変更なし |
| `created` | `created` | 変更なし |
| `beforeMount` | `beforeMount` | 変更なし |
| `mounted` | `mounted` | 変更なし |
| `beforeUpdate` | `beforeUpdate` | 変更なし |
| `updated` | `updated` | 変更なし |
| `beforeDestroy` | `beforeUnmount` | 名称変更 |
| `destroyed` | `unmounted` | 名称変更 |

#### フィルターの廃止

Vue 3 ではフィルター (`{{ value | filterName }}`) が廃止された。computed プロパティまたはメソッド呼び出しで代替する。

#### イベントバス (`$on`, `$off`, `$once`) の廃止

Vue 3 ではインスタンスメソッド `$on`, `$off`, `$once` が削除された。外部ライブラリ (mitt 等) で代替する。

---

### 2. Vue Router 3 → Vue Router 4

#### ルーター生成方法の変更

```javascript
// Vue Router 3 (現行)
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [...]
})

// Vue Router 4 (移行後)
import { createRouter, createWebHistory } from 'vue-router'
export default createRouter({
  history: createWebHistory(),
  routes: [...]
})
```

#### 主要な Breaking Changes

| 項目 | Vue Router 3 | Vue Router 4 |
|---|---|---|
| ルーター生成 | `new Router()` | `createRouter()` |
| history モード | `mode: 'history'` | `history: createWebHistory()` |
| hash モード | `mode: 'hash'` | `history: createWebHashHistory()` |
| `router.onReady()` | コールバック形式 | `router.isReady()` (Promise) |
| スクロール位置 | `{ x, y }` | `{ left, top }` |
| `<router-view>` | 直接描画 | `v-slot` API 利用可能 |
| catch-all ルート | `path: '*'` | `path: '/:pathMatch(.*)*'` |
| ナビゲーション | 同期的 | 常に非同期 |

---

### 3. Vuex 3 → Pinia 3

Vuex から Pinia への移行は API が大きく異なるため、実質的に書き換えとなる。

#### ストア定義の変更

```javascript
// Vuex 3 (現行) - store/player.js
export default {
  namespaced: true,
  state: { ... },
  getters: { ... },
  mutations: { ... },
  actions: { ... }
}

// Pinia 3 (移行後) - stores/player.js
import { defineStore } from 'pinia'
export const usePlayerStore = defineStore('player', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... }  // mutations は actions に統合
})
```

#### 主要な Breaking Changes

| 項目 | Vuex 3 | Pinia 3 |
|---|---|---|
| ストア生成 | `new Vuex.Store()` | `createPinia()` |
| モジュール | `modules: {}` でネスト | 独立した `defineStore()` |
| mutations | 必須 | 廃止 (actions に統合) |
| state アクセス | `this.$store.state.player.xxx` | `const player = usePlayerStore(); player.xxx` |
| getter アクセス | `this.$store.getters['player/xxx']` | `player.xxx` |
| action 呼び出し | `this.$store.dispatch('player/xxx')` | `player.xxx()` |
| mapHelpers | `mapState`, `mapGetters`, `mapMutations`, `mapActions` | `mapState`, `mapActions` (Pinia版) |
| 名前空間 | `namespaced: true` | store ID で自動的に分離 |
| devtools | Vuex タブ | Pinia タブ |

#### 本プロジェクト固有の影響

- `src/store/player.js` と `src/store/enemy.js` の 2 モジュールを個別の Pinia ストアに変換する必要がある。
- `src/store.js` (ルートストア) は `createPinia()` に置き換え。
- コンポーネントからの `$store` アクセスを全て `useXxxStore()` に変更。

---

### 4. Bootstrap 完全廃止 → 自前 CSS

Bootstrap (bootstrap, bootstrap-vue, bootstrap-icons) を完全に廃止し、デザインを自前 CSS で維持する。

#### 廃止理由

- bootstrap-vue-next は alpha 版で安定性に不安がある
- 本プロジェクトでは `<b-*>` コンポーネントを直接使用しておらず、主に CSS ユーティリティクラスとアイコンのみ使用
- 依存を減らしバンドルサイズを削減できる

#### 必要な対応

**A. Bootstrap ユーティリティクラスの置換**

使用しているユーティリティクラスを `src/assets/css/common.css` に自前定義する。

| Bootstrap クラス | 用途 | CSS 定義 |
|---|---|---|
| `row` | Flex コンテナ | `display: flex; flex-wrap: wrap;` |
| `col-sm-3`, `col-sm-4`, `col-sm-6` | グリッド列 | `flex: 0 0 25%/33.3%/50%; max-width: 25%/33.3%/50%;` |
| `m-auto` | margin 自動 | `margin: auto;` |
| `mt-3`, `mt-5`, `mb-0`, `mb-2`, `mb-4` | margin | `margin-top/bottom: 1rem/3rem/0/0.5rem/1.5rem;` |
| `ms-2`, `ms-5`, `me-2` | margin 左右 | `margin-left/right: 0.5rem/3rem;` |
| `p-2`, `p-3`, `pt-2`, `pt-4`, `pt-5` | padding | 対応する値を定義 |
| `w-25`, `w-50`, `w-75`, `w-100` | 幅 | `width: 25%/50%/75%/100%;` |
| `fs-3`, `fs-4` | フォントサイズ | `font-size: 1.75rem/1.25rem;` |
| `text-start`, `text-center` | テキスト配置 | `text-align: left/center;` |
| `text-secondary` | テキスト色 | `color: #6c757d;` |
| `bg-light` | 背景色 | `background-color: #f8f9fa;` |
| `border-light` | ボーダー色 | `border-color: #f8f9fa;` |

**B. Bootstrap Icons の置換**

使用しているアイコン一覧と置換方法:

| アイコンクラス | 使用箇所 | 置換案 |
|---|---|---|
| `bi-arrow-right` | Select, GameResult, FreeSelect | `→` (Unicode) or inline SVG |
| `bi-arrow-clockwise` | Select, FreeSelect | `↻` (Unicode) or inline SVG |
| `bi-house-door-fill` | Battle, Thanks | `🏠` or inline SVG |
| `bi-cursor-fill` | Home | `▶` (Unicode) or inline SVG |
| `bi-person-check-fill` | Select, FreeSelect | `👤` or inline SVG |
| `bi-caret-right-fill` | Select (accordion) | `▶` / `▼` (Unicode) |
| `bi-caret-down-fill` | Select (accordion) | `▼` (Unicode) |

> ドットフォントのゲームの世界観に合わせ、Unicode テキスト文字での置換を推奨する。

---

### 5. Webpack 3 + Babel 6 → Vite 6

#### ビルド設定の変更

```javascript
// Vite 設定 (vite.config.js) - 新規作成
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

#### 主要な Breaking Changes

| 項目 | Webpack 3 + Babel 6 | Vite 6 |
|---|---|---|
| 設定ファイル | `build/webpack.*.conf.js` (複数) | `vite.config.js` (単一) |
| エントリーポイント | `src/main.js` (webpack設定で指定) | `index.html` 内の `<script type="module">` |
| 環境変数 | `process.env.XXX` | `import.meta.env.XXX` |
| 静的アセット | `require()` / `url-loader` / `file-loader` | ESM import (自動処理) |
| CSS 処理 | css-loader + postcss-loader | 組み込み PostCSS サポート |
| トランスパイル | Babel 6 (手動設定) | esbuild (組み込み、設定不要) |
| dev サーバー | webpack-dev-server | Vite 内蔵 dev サーバー |
| HMR | webpack HMR | Vite HMR (高速) |
| 本番ビルド | UglifyJS + ExtractTextPlugin | Rollup (組み込み) |
| `index.html` の場所 | `index.html` (プロジェクトルート) | `index.html` (プロジェクトルート) |

#### `require()` の廃止

Vite は ESM ベースのため、`require()` による動的インポートは使用できない。全て `import` 文または `import()` に変換する必要がある。本プロジェクトでは画像の動的読み込みに `require()` を使用している可能性が高く、特に注意が必要。

```javascript
// Webpack (現行)
const img = require('@/assets/images/' + name + '.gif')

// Vite (移行後)
const img = new URL(`../assets/images/${name}.gif`, import.meta.url).href
// または import.meta.glob を使用
const images = import.meta.glob('@/assets/images/*.gif', { eager: true })
```

---

### 6. TypeScript 導入

Vue 3 は TypeScript を第一級でサポートしている。本移行に合わせて TypeScript を導入する。

#### 導入パッケージ

```bash
npm install -D typescript vue-tsc
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 段階的導入方針

1. **Phase 1**: `tsconfig.json` と `vite.config.ts` を設定。`env.d.ts` で `.vue` モジュール宣言を追加
2. **Phase 2**: ストア (`stores/player.ts`, `stores/enemy.ts`) を TypeScript 化。型定義でキャラクターデータの型安全性を確保
3. **Phase 3**: ユーティリティ (`utils/imageLoader.ts`) を TypeScript 化
4. **Phase 4**: 各コンポーネントを `<script setup lang="ts">` に段階的に変換。最初はシンプルなコンポーネント (Home, Thanks) から着手

---

## 移行手順概要

### フェーズ 1: ビルド環境の移行 (Webpack 3 → Vite 6)

1. `vite.config.js` を新規作成。
2. `index.html` をプロジェクトルートに移動し、`<script type="module" src="/src/main.js"></script>` を追加。
3. `build/` ディレクトリ (Webpack 設定) を削除。
4. Babel 関連パッケージを全て削除。
5. Webpack 関連パッケージを全て削除。
6. `package.json` の scripts を更新 (`vite`, `vite build`, `vite preview`)。
7. `require()` を ESM import に変換。
8. 環境変数を `import.meta.env` に変更。
9. Node.js バージョンを 18+ に引き上げ。

### フェーズ 2: Vue コアの移行 (Vue 2 → Vue 3)

1. `vue`, `vue-router`, `vuex` を削除し、`vue` (3.x), `vue-router` (4.x), `pinia` をインストール。
2. `vue-template-compiler` を削除 (`@vue/compiler-sfc` は vue 3 に同梱)。
3. `src/main.js` を `createApp()` ベースに書き換え。
4. `src/router.js` を `createRouter()` + `createWebHistory()`/`createWebHashHistory()` に書き換え。
5. ライフサイクルフック名を変更 (`beforeDestroy` → `beforeUnmount`, `destroyed` → `unmounted`)。
6. テンプレート構文の修正 (v-model、フィルター等)。

### フェーズ 3: 状態管理の移行 (Vuex 3 → Pinia 3)

1. `pinia` をインストール (フェーズ 2 で実施済み)。
2. `src/store/player.js` を Pinia ストア (`src/stores/player.js`) に変換。
3. `src/store/enemy.js` を Pinia ストア (`src/stores/enemy.js`) に変換。
4. `src/store.js` を `createPinia()` に書き換え。
5. コンポーネントからの `$store` アクセスを `usePlayerStore()` / `useEnemyStore()` に変更。

### フェーズ 4: Bootstrap 廃止 + 自前 CSS 化

1. Bootstrap ユーティリティクラスの CSS 定義を `src/assets/css/common.css` に追加。
2. Bootstrap Icons を Unicode テキスト文字に置換。
3. `bootstrap`, `bootstrap-vue`, `bootstrap-icons` パッケージを削除。
4. `main.js` から Bootstrap 関連の import を削除。
5. デザインの見た目が変わっていないことを全画面で確認。

### フェーズ 5: TypeScript 導入

1. `typescript`, `vue-tsc` をインストール。
2. `tsconfig.json`, `tsconfig.node.json`, `env.d.ts` を作成。
3. `vite.config.js` → `vite.config.ts` に変更。
4. ストア、ユーティリティ、コンポーネントを段階的に `.ts` / `<script setup lang="ts">` に変換。

### フェーズ 5: 動作確認・修正

1. 全画面の動作確認 (Home → Select → Battle → GameResult → Thanks)。
2. ゲームロジック (バトル画面) の動作確認。
3. アニメーション・画像表示の確認。
4. ルーティング遷移の確認。
5. S3 デプロイの確認。

---

## リスクと注意点

### 高リスク

1. **Bootstrap 廃止時のデザイン崩れ**
   - Bootstrap ユーティリティクラス (row, col-sm-*, m-*, p-*, w-*, fs-*, text-* 等) を自前 CSS に置換する際、見た目が変わる可能性がある。
   - **対策**: 移行前のスクリーンショットを保存し、各画面で比較確認する。Chrome DevTools MCP で自動確認も行う。

2. **動的アセット読み込み (`require()`) の移行**
   - バトル画面で使用されるキャラクター画像の動的読み込みが `require()` で実装されている場合、Vite では動作しない。
   - **対策**: `import.meta.glob` や `new URL()` パターンで書き換える。全ての画像パスを洗い出し、漏れなく変換する。

### 中リスク

3. **Vuex → Pinia の書き換え規模**
   - mutations の削除、アクセスパターンの変更により、ストアとそれを利用する全コンポーネントの修正が必要。
   - **対策**: Vuex と Pinia は一時的に共存可能なため、段階的に移行する。

4. **Vue 3 テンプレート構文の非互換**
   - `v-model` の仕様変更、`$listeners` の廃止、`$scopedSlots` の廃止など、テンプレートの修正箇所が多い。
   - **対策**: Vue 3 公式移行ガイド (https://v3-migration.vuejs.org/) のチェックリストに従い、漏れなく修正する。

5. **Vue Router の非同期ナビゲーション**
   - Vue Router 4 では全てのナビゲーションが非同期になる。`created` フックで `$route.params` にアクセスしている箇所は注意が必要。
   - **対策**: Battle.vue などパラメータ依存のコンポーネントで `onBeforeRouteUpdate` や `watch` を使用する。

### 低リスク

6. **TypeScript 導入の学習コスト**
   - 既存コードは全て JavaScript であり、TypeScript 化には型定義の追加が必要。
   - **対策**: 段階的に導入し、最初は strict モードでも型エラーが少ないストア・ユーティリティから着手する。

7. **Node.js バージョンアップ**
   - 現行の `>= 6.0.0` から `>= 18` への引き上げが必要。
   - **対策**: CI/CD 環境の Node.js バージョンも合わせて更新する。

8. **ビルド成果物の差異**
   - Webpack から Vite への変更により、ビルド出力のファイル名やチャンク構成が変わる。
   - **対策**: S3 デプロイ設定 (GitHub Actions) を確認・更新する。

---

## 参考リンク

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Breaking Changes 一覧](https://v3-migration.vuejs.org/breaking-changes/)
- [Vue Router 4 Migration Guide](https://router.vuejs.org/guide/migration/)
- [Pinia - Migrating from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)
- [BootstrapVueNext Migration Guide](https://bootstrap-vue-next.github.io/bootstrap-vue-next/docs/migration-guide)
- [Vite Getting Started](https://vite.dev/guide/)
