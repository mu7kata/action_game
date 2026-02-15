# ビルド・CI/CD移行計画書 (Webpack 3 → Vite / CI/CD 更新)

## 仮定条件

本計画書は以下の前提条件に基づいて作成されています。

1. **Vue 3 移行が先行完了していること** - コンポーネント移行計画書 (02) およびライブラリ移行計画書 (01) の作業が完了し、Vue 3 + Vuex 4 (または Pinia) + Vue Router 4 でアプリケーションが動作する状態であること
2. **Node.js バージョン** - 移行先として Node.js 20 LTS (現行サポート) を使用する。Vite 6 は Node.js 18 以上を要求する
3. **パッケージマネージャー** - npm を引き続き使用する (yarn/pnpm への変更は本計画のスコープ外)
4. **デプロイ先** - S3 静的ホスティング (ap-northeast-1) は変更しない
5. **ブラウザサポート** - モダンブラウザのみ (ES2015+ 対応ブラウザ)。IE サポートは不要
6. **既存の GitHub Actions ワークフローのうち、自動デプロイ (S3 へのビルド＆アップロード) は現時点で未実装** - 現在の push.yml は echo のみ。今回の移行でビルド＆デプロイパイプラインを新設する
7. **テストフレームワークは未導入** - 現在テストコードは存在しない。移行時に Vitest を新規導入する
8. **静的ファイル (static/) は空** - .gitkeep のみ存在。実質的な移行対象はなし

---

## 1. 現状分析

### 1.1 ビルドシステム構成

| 項目 | 現行 |
|------|------|
| バンドラー | Webpack 3.6.0 |
| トランスパイラー | Babel 6 (babel-preset-env, stage-2) |
| Vue ローダー | vue-loader 13.3.0 |
| CSS 処理 | css-loader, postcss-loader, ExtractTextPlugin |
| 圧縮 | UglifyJsPlugin |
| 開発サーバー | webpack-dev-server 2.9.1 |
| エントリーポイント | src/main.js |
| 出力先 | dist/ |
| 静的アセット | static/ → dist/static/ (CopyWebpackPlugin) |

### 1.2 Webpack 設定ファイル一覧

| ファイル | 役割 |
|---------|------|
| `build/webpack.base.conf.js` | 共通設定 (エントリー、resolve alias、ローダー) |
| `build/webpack.dev.conf.js` | 開発サーバー設定 (HMR、ポート自動検出) |
| `build/webpack.prod.conf.js` | 本番ビルド (UglifyJS、CSS抽出、CommonsChunk) |
| `build/build.js` | 本番ビルドスクリプト (spinner、成果物削除) |
| `build/utils.js` | ユーティリティ (cssLoaders、assetsPath) |
| `build/vue-loader.conf.js` | vue-loader 設定 (transformToRequire) |
| `build/check-versions.js` | Node/npm バージョンチェック |
| `config/index.js` | パス・ポート・ソースマップ等の設定値 |
| `config/dev.env.js` | 開発環境の環境変数 |
| `config/prod.env.js` | 本番環境の環境変数 |
| `.babelrc` | Babel 設定 |
| `.postcssrc.js` | PostCSS 設定 |

### 1.3 Webpack 固有機能の使用状況

- **resolve alias**: `@` → `src/`, `vue$` → `vue/dist/vue.esm.js`
- **url-loader**: 画像・フォント・メディアファイルの 10KB 未満はインライン化
- **CommonsChunkPlugin**: vendor チャンク分離、manifest 分離
- **CopyWebpackPlugin**: `static/` → `dist/static/`
- **DefinePlugin**: `process.env.NODE_ENV`

### 1.4 require() 使用箇所の分析

プロジェクト内の `require()` は以下の2パターンに分類される。

#### パターン A: 静的 require (固定パス)

```vue
<!-- Home.vue, Thanks.vue -->
<img :src="require('@/assets/img/haru_stand.gif')">
```

計 7 箇所 (Home.vue: 4, Thanks.vue: 3)

#### パターン B: 動的 require (テンプレートリテラル)

```javascript
// Battle.vue (約 30 箇所)
this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);
this.enemyImage = require(`@/assets/img/enamy_${this.$route.params.enemyNum}_stand.gif`);

// Select.vue, FreeSelect.vue (約 4 箇所)
<img :src="require(`@/assets/img/${player.imgName}_face.gif`)">
```

**動的 require は移行時の最大の課題**。Vite では `import.meta.glob` または `new URL()` で代替する。

### 1.5 CI/CD 現状

| ワークフロー | トリガー | 内容 |
|-------------|---------|------|
| `push.yml` | master への push / 手動 | `echo "Hello World!"` のみ (テンプレート状態) |
| `open_pull_reqest.yml` | PR オープン時 | PR に作成者を自動アサイン |
| `approved_pull_reqest.yml` | PR レビュー承認時 | マージ手順のコメントを投稿 |
| `merge_comment.yml` | PR マージ時 | テストコメントを投稿 |

**ビルド・テスト・デプロイの自動化は未実装**。

---

## 2. ビルドシステム移行 (Webpack 3 → Vite)

### 2.1 Vite を選択する理由

| 観点 | Webpack 3 | Vite 6 |
|------|----------|--------|
| 開発サーバー起動 | 数秒〜数十秒 (バンドル後起動) | ほぼ瞬時 (ESM ネイティブ) |
| HMR 速度 | 遅い (再バンドル) | 高速 (モジュール単位更新) |
| 設定量 | 7ファイル + config/ | 1ファイル (vite.config.js) |
| Vue 3 対応 | vue-loader の手動設定が必要 | @vitejs/plugin-vue で即対応 |
| TypeScript | 追加設定必要 | ゼロコンフィグ対応 |
| エコシステム | 枯れているが古い | Vue 公式推奨、活発に更新 |

### 2.2 移行手順

#### Step 1: 依存パッケージの入れ替え

```bash
# Webpack 関連パッケージの削除
npm uninstall \
  webpack webpack-dev-server webpack-merge webpack-bundle-analyzer \
  babel-core babel-loader babel-helper-vue-jsx-merge-props \
  babel-plugin-syntax-jsx babel-plugin-transform-runtime \
  babel-plugin-transform-vue-jsx babel-preset-env babel-preset-stage-2 \
  vue-loader vue-style-loader vue-template-compiler \
  css-loader postcss-loader postcss-import postcss-url \
  url-loader file-loader \
  extract-text-webpack-plugin optimize-css-assets-webpack-plugin \
  uglifyjs-webpack-plugin \
  copy-webpack-plugin html-webpack-plugin \
  friendly-errors-webpack-plugin \
  autoprefixer chalk ora rimraf semver shelljs node-notifier portfinder

# Vite 関連パッケージのインストール
npm install -D vite @vitejs/plugin-vue
```

#### Step 2: vite.config.js の作成

```javascript
// vite.config.js (プロジェクトルート)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    open: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: true
  }
})
```

**設定の対応関係:**

| Webpack 設定 | Vite 設定 |
|-------------|----------|
| `resolve.alias['@']` → `src/` | `resolve.alias['@']` (同等) |
| `resolve.alias['vue$']` | 不要 (Vite が自動解決) |
| `config.dev.port: 8080` | `server.port: 8080` |
| `config.build.assetsRoot: 'dist'` | `build.outDir: 'dist'` |
| `config.build.assetsSubDirectory: 'static'` | `build.assetsDir: 'static'` |
| `config.build.productionSourceMap: true` | `build.sourcemap: true` |
| url-loader (10KB limit) | Vite 組み込み (4KB デフォルト、`build.assetsInlineLimit` で変更可) |
| CommonsChunkPlugin | Vite (Rollup) の自動チャンク分割 |
| DefinePlugin | Vite 組み込み (`import.meta.env`) |

#### Step 3: index.html の移動と更新

Vite では `index.html` がプロジェクトルートのエントリーポイントとなる。

```html
<!-- index.html (プロジェクトルート、既存を更新) -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>action-geme</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- Vite ではスクリプトを明示的に指定する -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

変更点:
- `<script type="module" src="/src/main.js"></script>` を追加 (Webpack では HtmlWebpackPlugin が自動注入していた)

#### Step 4: package.json の scripts 更新

```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">= 20.0.0"
  }
}
```

#### Step 5: 不要ファイル・ディレクトリの削除

```
削除対象:
  build/                    # 全ファイル (7ファイル + logo.png)
  config/                   # 全ファイル (3ファイル)
  .babelrc                  # Babel 設定 (不要)
  .postcssrc.js             # PostCSS 設定 (Vite が内蔵)
  static/                   # 空ディレクトリ (Vite では public/ を使用)
```

必要に応じて `public/` ディレクトリを作成 (現在 static/ は空なので不要)。

### 2.3 静的アセットの取り扱い

#### 画像ファイル (src/assets/img/)

- GIF ファイル 55 枚 (キャラクターアニメーション)
- PNG ファイル 1 枚 (clear.png)
- `src/assets/` 配下のファイルは引き続き同じパスで参照可能
- Vite は画像を自動的にアセットとして処理する (ハッシュ付きファイル名で出力)

#### フォントファイル (src/assets/font/)

- TTF ファイル 2 枚 (DragonQuestFC.ttf, k8x12.ttf)
- CSS の `@font-face` で参照されている場合、パス変更は不要

#### CSS ファイル (src/assets/css/)

- common.css は main.js で import 済み → 変更不要

#### url-loader → Vite 組み込み

| Webpack (url-loader) | Vite |
|---------------------|------|
| 10KB 未満をインライン化 | 4KB 未満をインライン化 (デフォルト) |
| `name: 'static/img/[name].[hash:7].[ext]'` | `build.assetsDir` + 自動ハッシュ |

10KB の閾値を維持したい場合は vite.config.js に以下を追加:

```javascript
build: {
  assetsInlineLimit: 10240  // 10KB
}
```

### 2.4 require() → import 対応

これがビルド移行における最大の作業項目。

#### 2.4.1 静的 require の変換 (パターン A)

**変換前 (Webpack):**
```vue
<img :src="require('@/assets/img/haru_stand.gif')">
```

**変換後 (Vite):**
```vue
<script setup>
import haruStand from '@/assets/img/haru_stand.gif'
</script>

<template>
  <img :src="haruStand">
</template>
```

対象ファイル: Home.vue (4箇所), Thanks.vue (3箇所)

#### 2.4.2 動的 require の変換 (パターン B) - Battle.vue

Battle.vue には約 30 箇所の動的 require がある。Vite では `import.meta.glob` を使用して変換する。

**変換方針: 画像マップを事前に構築する**

```javascript
// src/utils/imageLoader.js (新規作成)

// Vite の import.meta.glob で全画像を事前にインポート
// eager: true で同期的にロード (ゲームで遅延ロードは不適切)
const imageModules = import.meta.glob('@/assets/img/*.gif', { eager: true })

/**
 * 画像パスからURLを取得する
 * @param {string} name - 画像名 (例: 'haru_stand')
 * @returns {string} 画像URL
 */
export function getImageUrl(name) {
  const path = `/src/assets/img/${name}.gif`
  const mod = imageModules[path]
  if (!mod) {
    console.warn(`Image not found: ${name}`)
    return ''
  }
  return mod.default
}
```

**Battle.vue での使用:**

```javascript
// 変換前
this.playerImage = require(`@/assets/img/${this.player}_stand.gif`);

// 変換後
import { getImageUrl } from '@/utils/imageLoader'
// ...
this.playerImage = getImageUrl(`${this.player}_stand`)
```

**テンプレート内の動的 require (Select.vue, FreeSelect.vue):**

```vue
<!-- 変換前 -->
<img :src="require(`@/assets/img/${player.imgName}_face.gif`)">

<!-- 変換後 -->
<script>
import { getImageUrl } from '@/utils/imageLoader'
export default {
  methods: {
    getImageUrl
  }
}
</script>
<template>
  <img :src="getImageUrl(`${player.imgName}_face`)">
</template>
```

#### 2.4.3 変換対象の全リスト

| ファイル | 箇所数 | パターン | 変換方法 |
|---------|--------|---------|---------|
| Battle.vue | 約 30 | 動的 (player名/enemy番号) | getImageUrl() |
| Select.vue | 2 | 動的 (player名) | getImageUrl() |
| FreeSelect.vue | 3 | 動的 (player名/enemy名) | getImageUrl() |
| Home.vue | 4 | 静的 | import 文 |
| Thanks.vue | 3 | 静的 | import 文 |

---

## 3. CI/CD 移行

### 3.1 現行ワークフローの分析と更新方針

| ワークフロー | 更新方針 |
|-------------|---------|
| `push.yml` | ビルド＆S3デプロイに置き換え |
| `open_pull_reqest.yml` | 維持 + ビルド・テスト追加 |
| `approved_pull_reqest.yml` | 維持 (コメント内容は適宜更新) |
| `merge_comment.yml` | 維持 (変更不要) |

### 3.2 Node.js バージョン更新

全ワークフローで Node.js 20 LTS を使用する。

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### 3.3 ビルド＆デプロイワークフロー (push.yml の更新)

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - master
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1

      - name: Deploy to S3
        run: aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete

      # オプション: CloudFront キャッシュ無効化
      # - name: Invalidate CloudFront
      #   run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

**必要な GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- (任意) `CLOUDFRONT_DISTRIBUTION_ID`

### 3.4 PR 検証ワークフロー (open_pull_reqest.yml の更新)

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
name: Pull Request

jobs:
  assignAuthor:
    name: Assign author to PR
    runs-on: ubuntu-latest
    steps:
      - name: Assign author to PR
        uses: technote-space/assign-author@v1

  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test
```

### 3.5 その他ワークフローの更新

`approved_pull_reqest.yml` と `merge_comment.yml` はビルドに関係しないため、最小限の更新のみ行う。

- `peter-evans/find-comment@v1` → `@v3` へ更新
- `peter-evans/create-or-update-comment@v1` → `@v4` へ更新
- `technote-space/assign-author@v1` → `@v2` へ更新

### 3.6 S3 デプロイ設定

#### ビルド出力の変更点

| 項目 | Webpack 3 | Vite |
|------|----------|------|
| 出力ディレクトリ | `dist/` | `dist/` (同じ) |
| JS ファイル | `dist/static/js/[name].[hash].js` | `dist/static/[name]-[hash].js` |
| CSS ファイル | `dist/static/css/[name].[hash].css` | `dist/static/[name]-[hash].css` |
| 画像 | `dist/static/img/[name].[hash].[ext]` | `dist/static/[name]-[hash].[ext]` |
| index.html | `dist/index.html` | `dist/index.html` (同じ) |

出力先が `dist/` で統一されているため、S3 へのデプロイコマンド (`aws s3 sync dist/ s3://...`) は変更不要。

#### SPA ルーティング対応

Vue Router を使用しているため、S3 の静的ホスティングでエラードキュメント設定が必要:
- エラードキュメント: `index.html` (既存設定がある前提)

---

## 4. テスト戦略

### 4.1 テストフレームワークの導入

現在テストは未導入。Vite と親和性の高い **Vitest** を採用する。

```bash
npm install -D vitest @vue/test-utils happy-dom
```

vite.config.js にテスト設定を追加:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: true
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
})
```

package.json に追加:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

### 4.2 移行時に確認すべきテスト項目

ビルド移行後に手動またはスモークテストで確認すべき事項:

#### ビルド検証
- [ ] `npm run build` がエラーなく完了する
- [ ] `dist/index.html` が生成される
- [ ] JS/CSS/画像アセットが `dist/static/` に出力される
- [ ] ソースマップが生成される

#### 開発サーバー検証
- [ ] `npm run dev` でサーバーが起動する
- [ ] HMR が動作する (コンポーネント変更時に自動反映)

#### アセット検証
- [ ] 全キャラクター画像 (GIF) が正しく表示される
- [ ] フォントファイルが正しく読み込まれる
- [ ] common.css が適用される

#### 動的画像ロード検証
- [ ] Battle.vue: 各プレイヤーの全アクション画像が表示される (stand, attack, s_attack, damage, dead, gard, garding, awake)
- [ ] Battle.vue: 各敵の全アクション画像が表示される (stand, attack, damege, dead, deading)
- [ ] Select.vue: キャラ選択時にプレビュー画像が切り替わる
- [ ] FreeSelect.vue: プレイヤー・敵それぞれの選択画像が表示される

#### ルーティング検証
- [ ] 全ルート (`/`, `/select`, `/free_select`, `/battle/:p/:e`, `/thanks/:r`) がアクセス可能
- [ ] ブラウザリロード時に 404 にならない (SPA フォールバック)

#### 本番ビルド検証
- [ ] `npm run preview` でビルド成果物が正しく動作する
- [ ] S3 にデプロイして正常動作する

### 4.3 将来的なテスト拡充 (移行後のロードマップ)

移行完了後に段階的にテストを追加する:

1. **ユニットテスト** - Vuex ストア (player/enemy) のロジック検証
2. **コンポーネントテスト** - 各コンポーネントのレンダリング検証
3. **E2E テスト** - ゲームフロー全体の動作検証 (Playwright 推奨)

---

## 5. 移行スケジュール

### フェーズ 1: 準備 (1日)

| # | 作業 | 詳細 |
|---|-----|------|
| 1-1 | 移行用ブランチ作成 | `feature/vite-migration` |
| 1-2 | Node.js 20 の動作確認 | ローカル環境で Node.js 20 に更新 |
| 1-3 | 現行ビルドの動作記録 | 移行前のスクリーンショット・動作確認を記録 |

### フェーズ 2: Vite 導入 (1-2日)

| # | 作業 | 詳細 |
|---|-----|------|
| 2-1 | パッケージ入れ替え | Webpack 関連削除、Vite インストール |
| 2-2 | vite.config.js 作成 | エイリアス、サーバー設定、ビルド設定 |
| 2-3 | index.html 更新 | `<script type="module">` 追加 |
| 2-4 | package.json scripts 更新 | dev/build/preview コマンド |
| 2-5 | 不要ファイル削除 | build/, config/, .babelrc, .postcssrc.js |
| 2-6 | 開発サーバー起動確認 | `npm run dev` で基本動作確認 |

### フェーズ 3: require() → import 変換 (1-2日)

| # | 作業 | 詳細 |
|---|-----|------|
| 3-1 | imageLoader ユーティリティ作成 | `src/utils/imageLoader.js` |
| 3-2 | Battle.vue の require 変換 | 約 30 箇所を getImageUrl() に置換 |
| 3-3 | Select.vue の require 変換 | 2 箇所 |
| 3-4 | FreeSelect.vue の require 変換 | 3 箇所 |
| 3-5 | Home.vue の require 変換 | 4 箇所を static import に |
| 3-6 | Thanks.vue の require 変換 | 3 箇所を static import に |
| 3-7 | 全画像表示の動作確認 | 全キャラ・全アクションの画像確認 |

### フェーズ 4: CI/CD 更新 (1日)

| # | 作業 | 詳細 |
|---|-----|------|
| 4-1 | push.yml 更新 | ビルド＆S3デプロイ構成 |
| 4-2 | open_pull_reqest.yml 更新 | ビルド・テストジョブ追加 |
| 4-3 | Actions バージョン更新 | peter-evans/*, technote-space/* |
| 4-4 | GitHub Secrets 設定 | AWS 認証情報の設定 |
| 4-5 | Vitest 導入 | テストフレームワーク設定 |

### フェーズ 5: 検証・リリース (1日)

| # | 作業 | 詳細 |
|---|-----|------|
| 5-1 | ローカル全機能テスト | セクション 4.2 の全項目を検証 |
| 5-2 | 本番ビルド確認 | `npm run build && npm run preview` |
| 5-3 | CI/CD パイプライン確認 | PR 作成→ビルドジョブ確認 |
| 5-4 | ステージング環境デプロイ | S3 へのデプロイ確認 |
| 5-5 | 本番リリース | master マージ→自動デプロイ |

### 全体所要期間: 約 5-7 日

**クリティカルパス**: フェーズ 3 (require 変換) が最も工数がかかる。特に Battle.vue の 30 箇所の動的 require は慎重に変換し、全画像の表示確認が必要。

---

## 付録 A: 移行前後のファイル構成比較

```
移行前:                          移行後:
├── build/                       (削除)
│   ├── build.js
│   ├── check-versions.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config/                      (削除)
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── .babelrc                     (削除)
├── .postcssrc.js                (削除)
├── static/                      (削除、必要なら public/ に)
├── index.html                   ├── index.html (script追加)
├── package.json                 ├── package.json (scripts更新)
                                 ├── vite.config.js (新規)
├── src/                         ├── src/
│   ├── main.js                  │   ├── main.js (変更なし)
│   └── ...                      │   ├── utils/
                                 │   │   └── imageLoader.js (新規)
                                 │   └── ...
```

## 付録 B: 環境変数の移行

| Webpack | Vite | 備考 |
|---------|------|------|
| `process.env.NODE_ENV` | `import.meta.env.MODE` | Vite が自動設定 |
| `DefinePlugin` で注入 | `.env` ファイル or `define` オプション | |

現時点では `NODE_ENV` 以外の環境変数は使用していないため、特別な対応は不要。
