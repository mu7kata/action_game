# Vue 3 移行 タスク一覧

> **最終更新**: 2026-02-15
> **現在のフェーズ**: フェーズ 2+3+4+5+6 完了（ビルド移行 + Vue コア移行 + Pinia移行 + require変換 + Bootstrap廃止）
> **次にやること**: フェーズ 7（TypeScript 導入）

---

## フェーズ 1: 準備
- [x] 1-1. 移行用ブランチ作成 (`feature/vue3-migration-phase2-3`)
- [x] 1-2. Node.js 20 LTS の確認 → v24.13.1 で確認済み
- [ ] 1-3. 現行アプリの動作記録（スクリーンショット撮影）→ 旧Webpackが Node 24 で動作しないためスキップ

## フェーズ 2: ビルドシステム移行 (Webpack 3 → Vite 6)
- [x] 2-1. Webpack/Babel 関連パッケージ削除（30+パッケージ）
- [x] 2-2. Vite + @vitejs/plugin-vue インストール
- [x] 2-3. vite.config.js 作成（エイリアス @→src/, ポート8080, test設定）
- [x] 2-4. index.html 更新 (`<script type="module">`)
- [x] 2-5. package.json scripts 更新（dev/build/preview/test）
- [x] 2-6. 不要ファイル削除 (build/, config/, .babelrc, .postcssrc.js, static/)
- [x] 2-7. 開発サーバー起動確認

## フェーズ 3: Vue コア移行 (Vue 2 → Vue 3)
- [x] 3-1. Vue 3 + Vue Router 4 + Vuex 4 インストール
- [x] 3-2. src/main.js 書き換え (createApp)
- [x] 3-3. src/router.js 書き換え (createRouter + createWebHashHistory)
- [x] 3-4. src/store.js 書き換え (createStore)
- [x] 3-5. Vue.config.productionTip 削除
- [x] 3-6. beforeDestroy → beforeUnmount (Battle.vue)
- [x] 3-7. テンプレート内 this 削除 (GameResult.vue, Thanks.vue)
- [x] 3-8. v-for に :key 追加 (Select.vue, FreeSelect.vue)
- [x] 3-9. beforeRouteUpdate 更新 - next() 削除 (Battle.vue)
- [x] 3-10. $router.go() API 修正 (GameResult.vue)
- [x] 3-11. FreeSelect.vue テンプレート構文エラー修正
- [x] 3-12. 基本動作確認 + テスト（11テスト全パス）

## フェーズ 4: 状態管理移行 (Vuex 4 → Pinia 3)
- [x] 4-1. Pinia インストール
- [x] 4-2. src/stores/player.js 作成（defineStore + actions）
- [x] 4-3. src/stores/enemy.js 作成（defineStore + actions）
- [x] 4-4. src/store.js 削除 → main.js で createPinia() に変更
- [x] 4-5. main.js 更新 (app.use(pinia))
- [x] 4-6. Battle.vue のストアアクセス変更（$store.commit → useXxxStore()）
- [x] 4-7. Vuex 削除（vuex パッケージ + 旧 src/store/ ディレクトリ）
- [x] 4-8. ストアテスト作成 + 動作確認（11テスト全パス + Chrome DevTools MCP 確認）

## フェーズ 5: require() → import 変換
- [x] 5-1. src/utils/imageLoader.js 作成（import.meta.glob ベース）
- [x] 5-2. Battle.vue の require 変換 (~30箇所)
- [x] 5-3. Select.vue の require 変換 (2箇所)
- [x] 5-4. Home.vue の require 変換 (4箇所)
- [x] 5-5. Thanks.vue の require 変換 (3箇所)
- [x] 5-6. FreeSelect.vue の require 変換 (3箇所)
- [x] 5-7. 全画像表示の動作確認（Chrome DevTools MCP で全画面確認済み）

## フェーズ 6: Bootstrap 廃止 + 自前 CSS 化
- [x] 6-1. 変更前のスクリーンショット撮影（docs/screenshots/phase6-before/）
- [x] 6-2. Bootstrap ユーティリティクラスを common.css に自前定義（row, col-sm-*, m-*, p-*, w-*, text-*, bg-*, fs-* 等 30+クラス）
- [x] 6-3. Bootstrap Icons を Unicode テキスト文字に置換（▶, ■, →, ↻, ⌂, ▼）
- [x] 6-4. bootstrap, bootstrap-icons 削除（bootstrap-vue は既に未使用）
- [x] 6-5. デザイン比較確認（docs/screenshots/phase6-after/ で比較、全画面レイアウト崩れなし）

## フェーズ 7: TypeScript 導入
- [ ] 7-1. typescript + vue-tsc インストール
- [ ] 7-2. tsconfig.json, tsconfig.node.json, env.d.ts 作成
- [ ] 7-3. vite.config.js → vite.config.ts
- [ ] 7-4. ストアを TypeScript 化
- [ ] 7-5. ユーティリティを TypeScript 化
- [ ] 7-6. コンポーネントの段階的 TypeScript 化
- [ ] 7-7. vue-tsc --noEmit 確認

## フェーズ 8: CI/CD + テスト整備
- [x] 8-1. Vitest 導入（Phase 2+3 で前倒し実施）
- [ ] 8-2. テスト作成 (ストア, ユーティリティ, コンポーネント)
- [ ] 8-3. push.yml 更新 (ビルド & S3 デプロイ)
- [ ] 8-4. open_pull_reqest.yml 更新 (ビルド・テスト追加)
- [ ] 8-5. Actions バージョン更新
- [ ] 8-6. GitHub Secrets 設定

## フェーズ 9: クリーンアップ & 最終検証
- [ ] 9-1. src/js/mixin/utils.js 削除
- [ ] 9-2. FreeSelect.vue の判断（完成 or 削除）
- [ ] 9-3. package.json engines 更新
- [ ] 9-4. CLAUDE.md 更新
- [ ] 9-5. 全テスト実行
- [ ] 9-6. 全機能テスト (Chrome DevTools MCP)
- [ ] 9-7. 本番ビルド & プレビュー確認
- [ ] 9-8. S3 デプロイ確認
- [ ] 9-9. master マージ & リリース

---

## メモ・注意事項
- Battle.vue が最も複雑（require ~30箇所、setTimeout多数、DOM直接操作あり）→ require変換完了
- GameResult.vue, Thanks.vue のテンプレート内 `this` は Vue 3 で動作しない → 削除済み
- FreeSelect.vue は未完成（テンプレート構文エラーあり）→ 構文エラーは修正済み。移行対象外の方針は維持
- Bootstrap Icons はドットフォントの世界観に合わせ Unicode 文字に置換済み（▶, ■, →, ↻, ⌂, ▼）
- Bootstrap 完全廃止済み（bootstrap, bootstrap-icons パッケージ削除、自前 CSS に移行）
- Vitest + @vue/test-utils + happy-dom をフェーズ 2+3 で前倒し導入済み
- imageLoader.js は import.meta.glob で全画像を事前ロードする方式を採用
