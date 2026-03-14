# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

日本プロレス興行スケジューラー。新日本プロレスの2026年興行データを検索・絞り込みできる静的Webサイト。

## Repository structure

```
pro-wrestling-schedule/       # プロジェクトルート（= Astroアプリ本体）
├── data/events/              # 興行データ（YAML）
│   └── njpw_2026.yaml        # 新日本プロレス2026年スケジュール（40件）
├── src/
│   ├── components/EventFilter.tsx  # Preact island（絞り込みUI + テーブル）
│   ├── layouts/Base.astro
│   ├── lib/events.ts               # YAMLローダー（ビルド時のみ実行）
│   ├── pages/index.astro
│   ├── styles/global.css
│   └── types/event.ts              # Event型・PROMOTIONS定数
├── public/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Tech stack

- **Astro** (static output) + **Preact** islands
- **Tailwind CSS v4** (@tailwindcss/vite)
- **js-yaml** でビルド時にYAMLを読み込みJSON化 → クライアントに渡す
- ホスティング: Cloudflare Pages（無料）

## Commands (run from project root)

```bash
npm run dev      # 開発サーバー起動 (http://localhost:4321)
npm run build    # 静的ビルド → dist/
npm run preview  # ビルド結果をローカルプレビュー
```

## Data schema (YAML)

```yaml
- id: njpw-2026-0101        # {promotion}-{year}-{MMDD}（同日複数はa/b末尾）
  promotion: njpw            # njpw | ajpw | noah | ddt
  date: "2026-01-01"         # YYYY-MM-DD
  name: "大会名"              # null = 未定
  venue: 日本武道館
  prefecture: 東京            # null = 海外
  startTime: "18:30"         # HH:MM、null = 未定
  url: https://...
```

新しい団体を追加する場合は `data/events/{promotion}_2026.yaml` を作成し、`src/lib/events.ts` の `files` 配列に追加する。

## Filter logic

クライアントサイドのみ。`EventFilter.tsx` が全イベントをpropsで受け取り、useState でフィルタ状態を管理。団体チェックボックス・月ボタン・都道府県セレクタの3軸で絞り込む。
