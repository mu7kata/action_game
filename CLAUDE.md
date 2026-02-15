# CLAUDE.md - Project Instructions for Claude Code

## Project Overview
格闘アクションゲーム (Fighting Action Game) - ブラウザベースの2D格闘ゲーム

## Tech Stack
- **Framework**: Vue.js 2.5.2
- **State Management**: Vuex 3.0.1
- **Router**: Vue Router 3.0.1
- **UI**: Bootstrap 5.2.0, Bootstrap Vue 2.22.0
- **Build**: Webpack 3.6.0, Babel 6
- **Node**: >= 6.0.0

## Project Structure
```
src/
├── components/     # Vue components
│   ├── Home.vue        # トップページ
│   ├── Select.vue      # ストーリーモード キャラ選択
│   ├── FreeSelect.vue   # フリーモード キャラ選択 (未完成)
│   ├── Battle.vue       # メインバトル画面 (コアロジック)
│   ├── GameResult.vue   # 勝敗結果オーバーレイ
│   └── Thanks.vue       # エンディング画面
├── store/          # Vuex modules
│   ├── player.js       # プレイヤーキャラ定義 (Haru, Eda, Kaki, Kuni)
│   └── enemy.js        # 敵キャラ定義 (3段階)
├── assets/         # 静的リソース (画像, フォント, CSS)
├── js/mixin/       # ミックスイン
├── App.vue         # ルートコンポーネント
├── main.js         # エントリーポイント
├── router.js       # ルーティング定義
└── store.js        # Vuex ストア
```

## Commands
- `npm run dev` - 開発サーバー起動 (localhost:8080)
- `npm start` - dev のエイリアス
- `npm run build` - 本番ビルド (dist/ に出力)

## Game Routes
- `/` - ホーム
- `/select` - キャラ選択 (ストーリーモード)
- `/free_select` - キャラ選択 (フリーモード)
- `/battle/:selectPlayerImgName/:enemyNum` - バトル画面
- `/thanks/:gameResult` - 結果画面

## Coding Conventions
- 日本語コメント可
- コンポーネントはPascalCase
- 画像ファイルはスネークケース (例: `haru_stand.gif`)
- Vuex は名前空間付きモジュール (`player/`, `enemy/`)

## Implementation Rules (Claude Code 向け)

### タスク管理（セッション間の情報共有）
- **セッション開始時**: まず `docs/tasks.md` を読み、現在の進捗状況と未完了タスクを把握する
- **作業中**: タスクの状態が変わったら `docs/tasks.md` を都度更新する（着手中 / 完了 / ブロック中 等）
- **セッション終了時**: 現在の進捗、次にやるべきこと、注意事項を `docs/tasks.md` に記録してからセッションを終える
- フォーマット: チェックボックス形式（`- [ ]` 未完了 / `- [x]` 完了）で管理し、フェーズごとにグループ化する

### テスト
- **Vitest でテストを書くこと**: コード変更時は必ず Vitest でユニットテストを作成する
  - ストアのロジック、ユーティリティ関数、コンポーネントのレンダリングをテスト対象とする
  - テストが通ることを確認してからコミットする

### 動作確認
- **Chrome DevTools MCP で動作確認**: 実装完了時に `npm run dev` でサーバーを起動し、Chrome DevTools MCP を使って画面のスナップショット/スクリーンショットを撮影し、表示が正しいことを確認する
- デザイン変更を伴う場合は、変更前後のスクリーンショットを比較してレイアウト崩れがないことを確認する

### Vue 3 移行計画
- 移行計画書は `docs/` 配下を参照: [docs/00-vue3-migration-plan.md](docs/00-vue3-migration-plan.md)

## Deployment
- S3 静的ホスティング (ap-northeast-1)
- GitHub Actions で PR 自動化ワークフローあり
