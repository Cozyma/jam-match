---
title: コーディング規約
description: jam-match プロジェクトにおける Next.js / TypeScript / Supabase のコーディング規約
tags: [規約, コーディング, TypeScript, SSOT]
---

# コーディング規約 (Coding Standards)

本ドキュメントは jam-match プロジェクトのコーディング規約の**唯一の情報源 (SSOT)** です。

## 技術スタック

| カテゴリ | 技術 |
| :--- | :--- |
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript (strict mode) |
| スタイリング | Tailwind CSS |
| UIコンポーネント | shadcn/ui |
| 状態管理 | Zustand |
| BaaS | Supabase (Auth / Database / Storage) |
| リンター / フォーマッター | ESLint / Prettier |

## TypeScript 規約

### strict mode 必須

`tsconfig.json` で `"strict": true` を維持する。`any` 型の使用は原則禁止。やむを得ない場合はコメントで理由を明記する。

### 型定義

- 型定義は `PascalCase` で命名する（例: `UserProfile`, `RoomStatus`）
- `interface` と `type` の使い分け:
  - オブジェクトの形状定義 → `interface`（拡張性がある場合）
  - ユニオン型・交差型・ユーティリティ型 → `type`
- Supabase が生成する型は `database.types.ts` に集約し、アプリケーション層では必要に応じてラップして使用する

### 例

```typescript
// 良い例: Supabase の型をラップ
import type { Database } from "@/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}
```

## コンポーネント規約

### 命名

- コンポーネント: `PascalCase`（例: `RoomCard`, `RepertoireList`）
- コンポーネントファイル: `kebab-case.tsx`（例: `room-card.tsx`, `repertoire-list.tsx`）

### 構成

- Server Components をデフォルトとし、クライアント操作が必要な場合のみ `"use client"` を付与する
- `"use client"` コンポーネントは最小スコープに留める
- Props の型は同ファイル内で定義し、`export` が必要な場合のみ公開する

### shadcn/ui 利用方針

- shadcn/ui コンポーネントは `components/ui/` 配下に配置する（CLI で追加されるデフォルト配置）
- プロジェクト固有のカスタマイズは直接 `components/ui/` 内のファイルを編集する
- shadcn/ui のコンポーネントをラップする場合は `components/` 直下に配置する

## Supabase クエリパターン

### クライアントの使い分け

| 用途 | クライアント | 備考 |
| :--- | :--- | :--- |
| Server Component | `createServerClient` | Cookie 経由で認証 |
| Client Component | `createBrowserClient` | ブラウザセッション |
| Server Action / Route Handler | `createServerClient` | Cookie 経由 |

### クエリの書き方

```typescript
// 良い例: エラーハンドリングを必ず行う
const { data, error } = await supabase
  .from("rooms")
  .select("id, name, created_at")
  .eq("status", "active")
  .order("created_at", { ascending: false });

if (error) {
  // エラーを適切に処理
  throw new Error(`Failed to fetch rooms: ${error.message}`);
}
```

### RLS（Row Level Security）

- 全テーブルで RLS を有効化する
- アプリケーションコードで認可チェックを重複実装しない（RLS に委ねる）
- RLS ポリシーの変更は必ずマイグレーションファイルで管理する

## 環境変数管理

### 命名規則

- `NEXT_PUBLIC_` プレフィックス: クライアントに公開する変数のみ
- それ以外: サーバーサイドのみで使用

### 必須事項

- `.env.local` はリポジトリに含めない（`.gitignore` で除外済み）
- `.env.example` に全変数のキーとコメントを記載する
- 環境変数の追加・変更時は `.env.example` を必ず更新する

## ESLint / Prettier

- `eslint-config-next` をベースとし、プロジェクト固有のルールを追加する
- Prettier はデフォルト設定を基本とする
- コミット前に `npm run lint` が通ることを確認する

## パフォーマンス注意事項

### データフェッチ

- Server Component でのデータ取得を優先する（クライアントサイドフェッチは最小限に）
- 必要なカラムのみ `select` する（`select("*")` は原則禁止）
- ページネーションを適切に実装する

### 画像

- `next/image` を使用する
- 外部画像は `next.config.ts` の `images.remotePatterns` に登録する

## テスト規約

テストに関する規約は `docs/standards/testing.md` を参照。
