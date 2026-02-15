# Vue 3 移行 全体計画書

> **作成日**: 2026-02-15
> **対象プロジェクト**: 格闘アクションゲーム（action-geme）
> **関連文書**: [01-library-migration.md](./01-library-migration.md) | [02-component-migration.md](./02-component-migration.md) | [03-build-cicd-migration.md](./03-build-cicd-migration.md)

---

## 仮定条件一覧

以下の仮定に基づいて本計画を策定している。実施前に各項目の妥当性を確認すること。

| # | 仮定 | 影響範囲 |
|---|------|---------|
| 1 | Vue 3.5 系（最新安定版）を移行先とする | 全体 |
| 2 | ビルドツールは Webpack 3 → Vite 6 へ移行する | ビルド・CI/CD |
| 3 | 状態管理は Vuex 3 → Pinia 3 へ移行する（Vue 公式推奨） | ストア・コンポーネント |
| 4 | **Bootstrap を完全廃止する**（bootstrap, bootstrap-vue, bootstrap-icons を全て削除）。デザインは自前 CSS で現行どおりに維持する | UI |
| 5 | **TypeScript を導入する**。Vue 3 移行と合わせて段階的に TypeScript 化する | 全体 |
| 6 | 既存のユニットテスト・E2Eテストは存在しない。移行時に Vitest を導入する | テスト |
| 7 | Options API を基本方針として維持する（Composition API への全面書き換えは行わない） | コンポーネント |
| 8 | Node.js は 20 LTS に引き上げる（Vite 6 は Node.js 18+ を要求） | ビルド・CI/CD |
| 9 | パッケージマネージャーは npm を引き続き使用する | ビルド |
| 10 | S3 静的ホスティング（ap-northeast-1）は変更しない | デプロイ |
| 11 | ブラウザサポートはモダンブラウザのみ（IE サポート不要） | ビルド |
| 12 | GitHub Actions のビルド・テスト・デプロイは現状未実装（push.yml は echo のみ） | CI/CD |
| 13 | FreeSelect.vue は未完成のため、移行対象外とする（移行後に完成させるか削除するか別途判断） | コンポーネント |

---

## 移行の全体方針

### 方針サマリ

```
Webpack 3 + Babel 6  →  Vite 6 (esbuild)
Vue 2.5              →  Vue 3.5
Vue Router 3         →  Vue Router 4
Vuex 3               →  Pinia 3
Bootstrap 5 + BV 2   →  廃止 (自前 CSS でデザイン維持)
Bootstrap Icons      →  廃止 (Unicode テキスト文字に置換)
JavaScript           →  TypeScript (段階的導入)
vue-template-compiler →  @vue/compiler-sfc (Vue 3 同梱)
vue-loader 13        →  @vitejs/plugin-vue 5
テスト無し            →  Vitest + @vue/test-utils
```

### 移行の原則

1. **段階的移行**: 一括移行ではなく、フェーズごとに動作確認しながら進める
2. **Options API 維持**: 既存コンポーネントは Options API のまま移行し、コスト最小化を図る
3. **ビルドツールを先に移行**: Vite への移行を最初に行い、開発体験を改善してからコード修正に着手
4. **共通ユーティリティの活用**: `require()` → `import` 変換はヘルパー関数（`getImageUrl()`）で統一対応
5. **デザイン維持**: Bootstrap 廃止時は移行前のスクリーンショットと比較し、見た目を完全に保つ
6. **テスト駆動**: 各フェーズで Vitest によるユニットテストを書き、Chrome DevTools MCP で動作確認する

### 実装時のルール (Claude Code 向け)

1. **テストを書く**: 各フェーズの変更に対して Vitest でテストを作成する。ストアのロジック、ユーティリティ関数、コンポーネントのレンダリングをテストする
2. **Chrome DevTools MCP で動作確認**: 各フェーズ完了時に `npm run dev` でサーバーを起動し、Chrome DevTools MCP を使って各画面のスナップショット/スクリーンショットを撮影し、表示が正しいことを確認する
3. **フェーズ単位でコミット**: 各フェーズが完了してテスト・動作確認が通った時点でコミットする
4. **デザイン比較**: Bootstrap 廃止フェーズでは、変更前後のスクリーンショットを比較し、レイアウト崩れがないことを確認する

---

## フェーズ別作業一覧

### フェーズ 1: 準備（1日）

| # | 作業 | 成果物 | 依存 |
|---|------|--------|------|
| 1-1 | 移行用ブランチ作成 | `feature/vue3-migration` | - |
| 1-2 | Node.js 20 LTS への更新 | ローカル環境 | - |
| 1-3 | 現行アプリの動作記録（スクリーンショット） | 検証用資料 | - |

### フェーズ 2: ビルドシステム移行 — Webpack 3 → Vite 6（1-2日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 2-1 | Webpack/Babel 関連パッケージ削除 | 30+ パッケージを uninstall | 1-1 |
| 2-2 | Vite + plugin-vue インストール | `npm install -D vite @vitejs/plugin-vue` | 2-1 |
| 2-3 | `vite.config.ts` 作成 | エイリアス(`@`→`src/`)、ポート(8080)、出力先(dist/) | 2-2 |
| 2-4 | `index.html` 更新 | `<script type="module" src="/src/main.js">` 追加 | 2-3 |
| 2-5 | `package.json` scripts 更新 | `dev`→`vite`, `build`→`vite build` | 2-3 |
| 2-6 | 不要ファイル削除 | `build/`, `config/`, `.babelrc`, `.postcssrc.js`, `static/` | 2-3 |
| 2-7 | 開発サーバー起動確認 | `npm run dev` + Chrome DevTools MCP で確認 | 2-6 |

> **詳細**: [03-build-cicd-migration.md §2](./03-build-cicd-migration.md)

### フェーズ 3: Vue コア移行 — Vue 2 → Vue 3（1-2日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 3-1 | Vue 3 + Vue Router 4 インストール | `vue@3`, `vue-router@4` | 2-7 |
| 3-2 | `src/main.js` 書き換え | `new Vue()` → `createApp()` | 3-1 |
| 3-3 | `src/router.js` 書き換え | `new Router()` → `createRouter()` + `createWebHashHistory()` | 3-1 |
| 3-4 | `Vue.config.productionTip` 削除 | main.js から削除 | 3-2 |
| 3-5 | ライフサイクルフック変更 | `beforeDestroy` → `beforeUnmount`（Battle.vue） | 3-2 |
| 3-6 | テンプレート内 `this` 削除 | GameResult.vue（1箇所）, Thanks.vue（2箇所） | 3-2 |
| 3-7 | `v-for` に `:key` 追加 | Select.vue, FreeSelect.vue | 3-2 |
| 3-8 | `beforeRouteUpdate` 更新 | Battle.vue: `next()` 不要化 | 3-3 |
| 3-9 | `$router.go()` API 修正 | GameResult.vue: オブジェクト引数 → `this.$router.go(0)` | 3-3 |
| 3-10 | 基本動作確認 + テスト | 全ルートのアクセス確認。Vitest でルーター設定テスト | 3-9 |

> **詳細**: [01-library-migration.md §Vue 2→3](./01-library-migration.md) | [02-component-migration.md](./02-component-migration.md)

### フェーズ 4: 状態管理移行 — Vuex 3 → Pinia 3（1日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 4-1 | Pinia インストール | `npm install pinia` | 3-10 |
| 4-2 | `src/stores/player.ts` 作成 | `defineStore('player', { ... })` + 型定義 | 4-1 |
| 4-3 | `src/stores/enemy.ts` 作成 | `defineStore('enemy', { ... })` + 型定義 | 4-1 |
| 4-4 | `src/store.js` 書き換え | `createPinia()` に変更 | 4-1 |
| 4-5 | `main.js` 更新 | `app.use(pinia)` | 4-4 |
| 4-6 | Battle.vue のストアアクセス変更 | `this.$store.getters['enemy/status']` → `useEnemyStore()` 等 | 4-3 |
| 4-7 | Vuex 削除 | `npm uninstall vuex`、旧 `src/store/` 削除 | 4-6 |
| 4-8 | ストアテスト作成 + 動作確認 | Vitest で player/enemy ストアのユニットテスト。Chrome DevTools MCP で動作確認 | 4-7 |

> **詳細**: [01-library-migration.md §Vuex→Pinia](./01-library-migration.md)

### フェーズ 5: require() → import 変換（1-2日）

| # | 作業 | 箇所数 | 依存 |
|---|------|--------|------|
| 5-1 | `src/utils/imageLoader.ts` 作成 | 新規 + テスト | 4-8 |
| 5-2 | Battle.vue の require 変換 | ~30箇所 | 5-1 |
| 5-3 | Select.vue の require 変換 | 2箇所 | 5-1 |
| 5-4 | Home.vue の require 変換 | 4箇所（静的 import） | 5-1 |
| 5-5 | Thanks.vue の require 変換 | 3箇所（静的 import） | 5-1 |
| 5-6 | 全画像表示の動作確認 | Chrome DevTools MCP で全キャラ×全アクション確認 | 5-5 |

> **詳細**: [03-build-cicd-migration.md §2.4](./03-build-cicd-migration.md)

### フェーズ 6: Bootstrap 廃止 + 自前 CSS 化（1日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 6-1 | 変更前のスクリーンショット撮影 | Chrome DevTools MCP で全画面キャプチャ | 5-6 |
| 6-2 | Bootstrap ユーティリティクラスを自前 CSS に定義 | `row`, `col-sm-*`, `m-*`, `p-*`, `w-*`, `fs-*`, `text-*`, `bg-*` 等を `common.css` に追加 | 6-1 |
| 6-3 | Bootstrap Icons を Unicode テキスト文字に置換 | `bi-arrow-right` → `→`, `bi-house-door-fill` → `🏠` 等 | 6-1 |
| 6-4 | `bootstrap`, `bootstrap-vue`, `bootstrap-icons` 削除 | `npm uninstall` + `main.js` の import 削除 | 6-2, 6-3 |
| 6-5 | デザイン比較確認 | Chrome DevTools MCP で変更後のスクリーンショットを撮影し、6-1 と比較 | 6-4 |

> **注**: ゲームのドットフォント世界観に合わせ、Bootstrap Icons は Unicode テキスト文字（`→`, `▶`, `↻` 等）に置換する。

### フェーズ 7: TypeScript 導入（1-2日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 7-1 | TypeScript + vue-tsc インストール | `npm install -D typescript vue-tsc` | 6-5 |
| 7-2 | `tsconfig.json`, `tsconfig.node.json`, `env.d.ts` 作成 | TypeScript 設定 | 7-1 |
| 7-3 | `vite.config.js` → `vite.config.ts` | Vite 設定を TypeScript 化 | 7-2 |
| 7-4 | ストアを TypeScript 化 | `stores/player.ts`, `stores/enemy.ts` に型定義追加 | 7-2 |
| 7-5 | ユーティリティを TypeScript 化 | `utils/imageLoader.ts` | 7-2 |
| 7-6 | コンポーネントの段階的 TypeScript 化 | シンプルなもの (Home, Thanks) から着手 | 7-2 |
| 7-7 | 型チェック確認 | `vue-tsc --noEmit` が通ることを確認 | 7-6 |

> **詳細**: [01-library-migration.md §TypeScript 導入](./01-library-migration.md)

### フェーズ 8: CI/CD + テスト整備（1日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 8-1 | Vitest 導入 | `npm install -D vitest @vue/test-utils happy-dom` | 7-7 |
| 8-2 | テスト作成 | ストア、ユーティリティ、コンポーネントのテスト | 8-1 |
| 8-3 | `push.yml` 更新 | ビルド & S3 デプロイ構成 | 7-7 |
| 8-4 | `open_pull_reqest.yml` 更新 | ビルド・テストジョブ追加 | 7-7 |
| 8-5 | Actions バージョン更新 | `peter-evans/*`, `technote-space/*` | 7-7 |
| 8-6 | GitHub Secrets 設定 | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` | 8-3 |

> **詳細**: [03-build-cicd-migration.md §3](./03-build-cicd-migration.md)

### フェーズ 9: クリーンアップ & 最終検証（1日）

| # | 作業 | 詳細 | 依存 |
|---|------|------|------|
| 9-1 | `src/js/mixin/utils.js` 削除 | 未使用 mixin の除去 | 8-6 |
| 9-2 | FreeSelect.vue の判断 | 完成させるか削除するか決定 | 8-6 |
| 9-3 | `package.json` の engines 更新 | `"node": ">= 20.0.0"` | 8-6 |
| 9-4 | CLAUDE.md 更新 | Tech Stack、Commands セクションの更新 | 8-6 |
| 9-5 | 全テスト実行 | `npm test` (Vitest) + `vue-tsc --noEmit` (型チェック) | 9-4 |
| 9-6 | 全機能テスト | 下記テストチェックリスト参照 + Chrome DevTools MCP | 9-5 |
| 9-7 | 本番ビルド & プレビュー確認 | `npm run build && npm run preview` | 9-6 |
| 9-8 | S3 デプロイ確認 | ステージング→本番 | 9-7 |
| 9-9 | master マージ & リリース | PR レビュー → マージ → 自動デプロイ | 9-8 |

---

## 最終テストチェックリスト

### ビルド & 型チェック
- [ ] `npm run dev` でエラーなく起動する
- [ ] `npm run build` でエラーなく完了する
- [ ] `npm run preview` でビルド成果物が動作する
- [ ] `vue-tsc --noEmit` で型エラーがない
- [ ] `npm test` で全テストが通る

### 画面遷移
- [ ] `/` — ホーム画面が正しく表示される
- [ ] `/select` — キャラ選択画面が正しく動作する
- [ ] `/battle/:player/:enemy` — バトル画面が正しく動作する
- [ ] `/thanks/clear` — クリア画面が表示される
- [ ] `/thanks/lose` — ゲームオーバー画面が表示される

### デザイン維持確認
- [ ] 全画面で Bootstrap 廃止前と同等のレイアウトが維持されている
- [ ] グリッドレイアウト（row/col-sm-*）が正しく表示される
- [ ] マージン・パディング・フォントサイズが維持されている
- [ ] アイコンが Unicode テキスト文字で正しく表示される

### バトル画面（重点テスト）
- [ ] 全4キャラ（haru, eda, kaki, kuni）の画像が正しく表示される
- [ ] 全3敵キャラの画像が正しく表示される
- [ ] 弱攻撃（スペース）が動作する
- [ ] 強攻撃（エンター）が動作する
- [ ] ガード（↓）が動作する
- [ ] 移動（←→）が動作する
- [ ] 覚醒モード（↑、eda のみ）が動作する
- [ ] 連続攻撃制限（7回）が機能する
- [ ] 体力ゲージが正しく減少する
- [ ] 敵AIが自動で行動する
- [ ] 勝利時に GameResult が表示され、次のバトルに遷移できる
- [ ] 敗北時に Thanks 画面に遷移する
- [ ] 3戦目クリア時にクリア画面が表示される

### デプロイ
- [ ] GitHub Actions でビルドが成功する
- [ ] S3 へのデプロイが成功する
- [ ] デプロイ後のサイトが正常動作する

---

## リスクと対策

| # | リスク | 影響度 | 発生確率 | 対策 |
|---|--------|--------|---------|------|
| 1 | **require() 変換漏れ** — Battle.vue の ~30箇所の動的 require 変換で抜け漏れが発生 | 高 | 中 | `getImageUrl()` ヘルパーで統一。変換後に Chrome DevTools MCP で全キャラ×全アクションの画像表示を網羅的に確認 |
| 2 | **Bootstrap 廃止時のデザイン崩れ** — ユーティリティクラスの自前 CSS 置換時にレイアウトが崩れる | 高 | 中 | 変更前後のスクリーンショットを Chrome DevTools MCP で撮影・比較。全画面で目視確認 |
| 3 | **setTimeout のクリーンアップ漏れ** — Battle.vue の多数の setTimeout がライフサイクル変更時に適切にクリアされない | 中 | 高 | `beforeUnmount` で全 timer をクリアするよう改善（現状でも不完全なため） |
| 4 | **Vue Router の非同期ナビゲーション** — Vue Router 4 で全ナビゲーションが非同期に変更 | 低 | 低 | `$route.params` へのアクセスは Options API では引き続き動作。`beforeRouteUpdate` の `next()` 削除のみ対応 |
| 5 | **テンプレート内 `this` の見落とし** — GameResult.vue, Thanks.vue で `this` を削除しないとランタイムエラー | 高 | 低 | grep で `this\.\$route` / `this\.\$router` を検索し、テンプレート内の使用を全て特定 |
| 6 | **TypeScript 導入の型エラー** — 既存の暗黙的な型使用が strict モードで大量のエラーを生む | 中 | 中 | 段階的に導入。最初はストアとユーティリティから着手し、コンポーネントは後回し |

---

## 変更量サマリ

| カテゴリ | 件数 | 主要ファイル |
|---------|------|-------------|
| require() → import 変換 | ~40箇所 | Battle.vue (30+), Home.vue (4), Thanks.vue (3), Select.vue (2) |
| Vue 3 API 変更 | ~10箇所 | main.js, router.js, store.js, Battle.vue |
| Pinia 移行 | ~8箇所 | store.js, stores/player.ts, stores/enemy.ts, Battle.vue |
| テンプレート修正 | ~7箇所 | GameResult.vue, Thanks.vue, Select.vue |
| Bootstrap → 自前 CSS | ~50箇所 | common.css (新規定義), 全コンポーネントのアイコン置換 |
| TypeScript 化 | ~10ファイル | tsconfig.json, vite.config.ts, stores/*, utils/* |
| ビルド設定 | 新規1 + 削除12 | vite.config.ts (新規), build/* (削除), config/* (削除) |
| CI/CD 更新 | 2-4ファイル | push.yml, open_pull_reqest.yml |
| テスト追加 | 新規 | stores/*.test.ts, utils/*.test.ts |
| **合計** | **約130件の変更ポイント** | |

---

## 全体所要期間

| フェーズ | 期間 | 内容 |
|---------|------|------|
| 1. 準備 | 1日 | ブランチ作成、Node.js 更新、現状記録 |
| 2. ビルド移行 | 1-2日 | Webpack → Vite |
| 3. Vue コア移行 | 1-2日 | Vue 2 → Vue 3 + Router 4 |
| 4. 状態管理移行 | 1日 | Vuex → Pinia |
| 5. require 変換 | 1-2日 | 動的画像ロード対応 |
| 6. Bootstrap 廃止 | 1日 | 自前 CSS + アイコン置換 |
| 7. TypeScript 導入 | 1-2日 | 型定義、段階的 TS 化 |
| 8. CI/CD + テスト | 1日 | ワークフロー更新、Vitest |
| 9. 最終検証 | 1日 | テスト、デプロイ、リリース |
| **合計** | **約 9-13日** | |

> **クリティカルパス**: フェーズ 5（require 変換、~30箇所）とフェーズ 6（Bootstrap 廃止、~50箇所のCSS置換）が最大工数。

---

## 参考リンク

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Breaking Changes](https://v3-migration.vuejs.org/breaking-changes/)
- [Vue Router 4 Migration Guide](https://router.vuejs.org/guide/migration/)
- [Pinia - Migrating from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)
- [Vite Getting Started](https://vite.dev/guide/)
- [Vitest](https://vitest.dev/)
- [TypeScript + Vue 3](https://vuejs.org/guide/typescript/overview.html)
