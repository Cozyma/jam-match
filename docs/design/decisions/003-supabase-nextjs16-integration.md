---
title: "ADR-003: Supabase + Next.js 16 App Router 統合方針"
description: "@supabase/ssr を使用したクライアント構成とNext.js 16 proxy対応"
tags: [adr, supabase, nextjs, 認証]
date: 2026-04-06
status: accepted
---

# ADR-003: Supabase + Next.js 16 App Router 統合方針

## 背景

jam-matchのバックエンドにSupabase（PostgreSQL + Auth + Realtime）を採用した。Next.js 16 App Routerとの統合にあたり、Supabaseクライアントの構成、認証フロー、セッション管理の方針を決定する必要があった。

Supabase公式は`@supabase/auth-helpers-nextjs`を非推奨とし、後継の`@supabase/ssr`パッケージへの移行を推奨している。また、Next.js 16では従来の`middleware.ts`が非推奨となり、`proxy.ts`（`export function proxy`）への移行が必要となった。

## 決定内容

- **@supabase/ssr を使用する**（`@supabase/auth-helpers`は非推奨のため不採用）
- **クライアントを3種類に分離して管理する**:
  - ブラウザ用: `createBrowserClient` — クライアントコンポーネントから使用
  - サーバー用: `createServerClient` — Server Components / Route Handlers / Server Actions から使用
  - プロキシ用: `createServerClient` — proxy.ts 内でセッションのリフレッシュとCookie更新を行う
- **Next.js 16では`middleware.ts`が非推奨のため、`proxy.ts`（`export function proxy`）に移行する** — リクエストごとにセッションを更新し、認証状態を全ルートで利用可能にする
- **型安全**: `supabase gen types typescript --local` でDB型を自動生成し、全クライアントに`Database`型パラメータとして適用する
- **認証**: Google OAuth を使用し、Auth Callbackルート（`/auth/callback`）でコード交換を行う

## 代替案

| 案 | 却下理由 |
|---|---------|
| @supabase/supabase-js のみ | SSR非対応。Cookie管理が完全に手動となり、Server ComponentsやProxy内でのセッション維持が煩雑 |
| @supabase/auth-helpers-nextjs | Supabase公式が非推奨としメンテナンス終了。今後のNext.jsバージョンアップに追従できないリスク |
| 自前APIルート経由でSupabase接続 | 全DB操作をAPI Routeでラップする不要な複雑さが生じる。RLSの恩恵も薄れる |

## 結果

- @supabase/ssr でブラウザ / サーバー / プロキシの3層クライアントが統一的なAPIで管理できる
- proxy.ts でリクエストごとにセッションをリフレッシュし、認証状態を全ルートで透過的に利用可能
- Next.js 16の新規約（proxy）に対応済みのため、今後のフレームワークアップデートにも追従しやすい
- `supabase gen types typescript` による型生成で、テーブル操作時の型安全性を確保できる
- トレードオフ: クライアント生成ファイルが3つに分かれるため、初期の理解コストがやや高い
