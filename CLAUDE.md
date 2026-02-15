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

## Deployment
- S3 静的ホスティング (ap-northeast-1)
- GitHub Actions で PR 自動化ワークフローあり
