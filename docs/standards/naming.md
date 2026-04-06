---
title: 命名規則
description: jam-match プロジェクトにおけるコード・データベース・ファイルの命名規則
tags: [規約, 命名規則, SSOT]
---

# 命名規則 (Naming Convention)

本ドキュメントは jam-match プロジェクトの命名規則の**唯一の情報源 (SSOT)** です。

## 基本原則

> **「コンポーネント = PascalCase、ファイル = kebab-case、データ = snake_case」**

## コード命名規則

| 種別 | 命名形式 | 備考 |
| :--- | :--- | :--- |
| コンポーネント名 | `PascalCase` | 例: `RoomCard`, `RepertoireList` |
| 型定義 / interface | `PascalCase` | 例: `UserProfile`, `RoomStatus` |
| 関数名 | `camelCase` | 例: `fetchRooms`, `calculateScore` |
| 変数名 | `camelCase` | 例: `userId`, `roomCount` |
| 定数 | `UPPER_SNAKE_CASE` | 例: `MAX_ROOM_SIZE`, `DEFAULT_TIMEOUT` |
| カスタムフック | `camelCase` (`use` プレフィックス) | 例: `useRoom`, `useRepertoire` |
| Server Action | `camelCase` | 例: `createRoom`, `joinRoom` |

## ファイル / ディレクトリ命名規則

### Next.js App Router

| 種別 | 命名形式 | 備考 |
| :--- | :--- | :--- |
| ルートセグメント | `kebab-case` | 例: `app/room-list/page.tsx` |
| ページファイル | `page.tsx` | App Router 規約 |
| レイアウトファイル | `layout.tsx` | App Router 規約 |
| ローディングUI | `loading.tsx` | App Router 規約 |
| エラーUI | `error.tsx` | App Router 規約 |
| 動的ルート | `[paramName]` | 例: `app/rooms/[roomId]/page.tsx` |

### コンポーネントファイル

| 種別 | 命名形式 | 備考 |
| :--- | :--- | :--- |
| コンポーネントファイル | `kebab-case.tsx` | 例: `room-card.tsx`, `user-avatar.tsx` |
| テストファイル | `kebab-case.test.tsx` | 例: `room-card.test.tsx` |
| Storybook | `kebab-case.stories.tsx` | 例: `room-card.stories.tsx` |
| ユーティリティ | `kebab-case.ts` | 例: `format-date.ts`, `supabase-client.ts` |

### その他

| 種別 | 命名形式 | 備考 |
| :--- | :--- | :--- |
| 型定義ファイル | `kebab-case.ts` | 例: `database.types.ts` |
| フックファイル | `use-xxx.ts` | 例: `use-room.ts`, `use-auth.ts` |
| Server Action ファイル | `kebab-case.ts` | 例: `room-actions.ts` |

## データ命名規則（Supabase）

| 種別 | 命名形式 | 備考 |
| :--- | :--- | :--- |
| テーブル名 | `snake_case`（複数形） | 例: `users`, `rooms`, `repertoires` |
| カラム名 | `snake_case` | 例: `display_name`, `created_at` |
| RLS ポリシー名 | `snake_case` | 例: `users_select_own`, `rooms_insert_authenticated` |
| Enum 型名 | `snake_case` | 例: `room_status`, `instrument_type` |
| 関数名（DB関数） | `snake_case` | 例: `get_user_rooms`, `join_room` |

### API レスポンス

- Supabase のレスポンスは `snake_case`（DB カラム名そのまま）
- フロントエンドで `camelCase` に変換が必要な場合は、変換レイヤーを明示的に設ける

## ドキュメント命名規則

> AI エージェントの探索パフォーマンスとトークン効率を最大化するための規則

| 種別 | 命名形式 | 備考 |
| :--- | :--- | :--- |
| ディレクトリ名 | 英語 kebab-case | 例: `docs/design/`, `docs/standards/` |
| ファイル名 | 英語 kebab-case | 例: `coding.md`, `setup-guide.md` |
| ファイル内コンテンツ | 日本語 | パス名は英語だが、本文は日本語で記述 |

### ドキュメント種別サフィックス（推奨）

設計ドキュメントは「対象」+「種別」+（任意で）「版」をファイル名に含め、粒度（文書の役割）を揃えること。

- `*-spec-*.md` / `*-spec.md` : 仕様（機能設計・基本仕様）
- `*-implementation-plan-*.md` / `*-implementation-plan.md` : 実装計画
- `*-guide.md` : 手順・ガイド（運用/外部呼び出し等）
- `*-proposal.md` : 提案資料（合意前の案）
- `*-reference.md` : 参照（一覧、用語、定数表など）

版を含める場合は `-v{major}-{minor}` を使用する（例: `room-matching-spec-v1-0.md`）。

### 悪い例

```
docs/仕様書/認証.md          # 日本語パス
docs/Manual/SetupGuide.md   # PascalCase
```

### 良い例

```
docs/design/functional-specs/room-matching-spec.md
docs/operations-guide/setup-guide.md
```
